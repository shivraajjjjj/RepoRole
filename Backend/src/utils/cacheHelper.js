import redis from '../cache/redis.js';

export async function cachedFetch(key, fetchFn, ttl = 3600) {
  const cached = await safeRedisGet(key);

  if (cached) {
    console.log('CACHE HIT');
    try {
      return JSON.parse(cached);
    } catch {
      return cached;
    }
  }

  const response = await fetchFn();
  const data = response?.data ?? response; // Support both axios and generic functions

  await safeRedisSetEx(key, ttl, JSON.stringify(data));

  return data;
}

async function safeRedisGet(key) {
  try {
    if (!redis || (typeof redis.isReady === 'function' && !redis.isReady())) return null;
    return await redis.get(key);
  } catch (err) {
    console.warn(`Redis get failed for ${key}:`, err?.message ?? err);
    return null;
  }
}

async function safeRedisSetEx(key, ttl, value) {
  try {
    if (!redis || (typeof redis.isReady === 'function' && !redis.isReady())) return;
    await redis.setEx(key, ttl, value);
  } catch (err) {
    console.warn(`Redis set failed for ${key}:`, err?.message ?? err);
  }
}