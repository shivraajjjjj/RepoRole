// src/orchestrators/analyze.orchestrator.js
import redis from "../cache/redis.js";
import { analyzeRepository } from "../services/analyze.service.js";

// Tracks ongoing requests to prevent duplicate work
const inFlight = new Map();

export async function analyzeRepo(repoUrl) {
  if (!repoUrl) {
    throw new Error("repoUrl is required");
  }

  const key = `analysis:${repoUrl}`;

  try {
    // 1. Check Redis Cache
    const cached = await redis.get(key);
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
      await redis.setEx(key, 3600, JSON.stringify(result));

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