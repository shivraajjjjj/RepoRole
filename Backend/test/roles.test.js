import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import * as jwt from 'jsonwebtoken';
import prisma from '../src/config/prisma.js';
import * as orchestrators from '../src/orchestrators/analyze.orchestrators.js';
import redis from '../src/cache/redis.js';

describe('/analyze/roles', () => {
  let restore = [];

  beforeEach(() => {
    // stub analyzeRepo to avoid network
    restore.push(vi.spyOn(orchestrators, 'analyzeRepo').mockResolvedValue({ success: true, roles: [] }));
    // make redis appear ready to use analyzeRepo path
    restore.push(vi.spyOn(redis, 'isReady').mockReturnValue(true));
  });

  afterEach(() => {
    for (const r of restore) r.mockRestore();
    restore = [];
  });

  it('allows an authenticated seeker (GitHub OAuth) for their own repo', async () => {
    // Create a real JWT with a test secret so jwt.verify runs normally
    process.env.JWT_SECRET = 'test-secret';
    const tokenStr = jwt.sign ? jwt.sign({ userId: 1 }, process.env.JWT_SECRET) : 'dummy';

    // stub prisma user lookup by overriding the method
    const originalFind = prisma.user?.findUnique;
    prisma.user = prisma.user || {};
    prisma.user.findUnique = async () => ({ id: 1, role: 'SEEKER', provider: 'GITHUB', githubLogin: 'alice' });
    restore.push({ mockRestore() { prisma.user.findUnique = originalFind; } });

    const res = await request(app)
      .post('/analyze/roles')
      .set('Authorization', `Bearer ${tokenStr}`)
      .send({ repo: 'https://github.com/alice/repo' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });

  it('allows an authenticated recruiter via email auth', async () => {
    process.env.JWT_SECRET = 'test-secret';
    const tokenStr = jwt.sign ? jwt.sign({ userId: 2 }, process.env.JWT_SECRET) : 'dummy';

    const originalFind = prisma.user?.findUnique;
    prisma.user = prisma.user || {};
    prisma.user.findUnique = async () => ({ id: 2, role: 'RECRUITER', provider: 'EMAIL' });
    restore.push({ mockRestore() { prisma.user.findUnique = originalFind; } });

    const res = await request(app)
      .post('/analyze/roles')
      .set('Authorization', `Bearer ${tokenStr}`)
      .send({ repo: 'https://github.com/anyone/repo' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });

  it('applies rate limiting for unauthenticated requests', async () => {
    // Ensure no auth token present
    // First two requests should succeed (return 200 with our stubbed analyzeRepo)
    const r1 = await request(app).post('/analyze/roles').send({ repo: 'https://github.com/anon/repo' });
    expect(r1.status).toBe(200);

    const r2 = await request(app).post('/analyze/roles').send({ repo: 'https://github.com/anon/repo' });
    expect(r2.status).toBe(200);

    // Third request should be rate-limited
    const r3 = await request(app).post('/analyze/roles').send({ repo: 'https://github.com/anon/repo' });
    expect(r3.status).toBe(429);
    expect(r3.body).toHaveProperty('message');
  });
});
