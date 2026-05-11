// src/orchestrators/analyze.orchestrator.js
import redis from "../cache/redis.js";
import { analyzeRepository } from "../services/analyze.service.js";

// Tracks ongoing requests to prevent duplicate work
const inFlight = new Map();

/**
 * Normalize a repo URL for consistent caching:
 * - Strip .git suffix
 * - Lowercase owner and repo
 * - Remove trailing slashes
 * Examples:
 *   https://github.com/0xArchit/MyRepo.git → analysis:0xarchit/myrepo
 *   0xarchit/myrepo → analysis:0xarchit/myrepo
 */
function normalizeRepoUrl(repoUrl) {
  if (!repoUrl) return repoUrl;
  
  let normalized = repoUrl
    .trim()
    .toLowerCase()
    .replace(/\.git\/?$/, '')           // strip .git and optional trailing slash
    .replace(/\/$/, '');                // strip any trailing slash
  
  // Extract owner/repo from full URL (e.g., https://github.com/owner/repo)
  const match = normalized.match(/github\.com[:/](.+?)\/(.+?)$/);
  if (match) {
    return `${match[1]}/${match[2]}`;
  }
  
  return normalized;
}

export async function analyzeRepo(repoUrl) {
  if (!repoUrl) {
    throw new Error("repoUrl is required");
  }

  const normalizedUrl = normalizeRepoUrl(repoUrl);
  const key = `analysis:${normalizedUrl}`;

  try {
    // 1. Check Redis Cache
    const cached = await safeRedisGet(key);
    if (cached) {
      console.log("CACHE HIT");
      return JSON.parse(cached);
    }

    // 2. Check if same request already running
    if (inFlight.has(key)) {
      console.log("WAITING FOR EXISTING REQUEST");
      return await inFlight.get(key);
    }

    //3. Create new processing promise
    const promise = (async () => {
      console.log("CACHE MISS , Running analysis");

      const result = await analyzeRepository(repoUrl);

      //4. Store in Redis (1 hour TTL)
      await safeRedisSetEx(key, 3600, JSON.stringify(result));

      return result;
    })();

    // Store promise to deduplicate
    inFlight.set(key, promise);

    // Wait for result
    const result = await promise;

    return result;

  } catch (error) {
    console.error("Error in analyzeRepo:", error.message);
    throw error;

  } finally {
    //Cleanup to prevent memory leak
    inFlight.delete(key);
  }
}

async function safeRedisGet(key) {
  try {
    return await redis.get(key);
  } catch (err) {
    console.warn(`Redis get failed for ${key}:`, err.message);
    return null;
  }
}

async function safeRedisSetEx(key, ttl, value) {
  try {
    await redis.setEx(key, ttl, value);
  } catch (err) {
    console.warn(`Redis set failed for ${key}:`, err.message);
  }
}