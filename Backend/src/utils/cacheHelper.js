import redis from '../cache/redis.js';

export async function cachedFetch(key,fetchFn,ttl=3600) {
  const cached = await redis.get(key);

    if (cached) {
        console.log("CACHE HIT");
        return JSON.parse(cached);
    }

    const response = await fetchFn();

    const data = response.data??response; // Support both axios and generic functions

    await redis.setEx(key,ttl,JSON.stringify(data));

    return data;
}