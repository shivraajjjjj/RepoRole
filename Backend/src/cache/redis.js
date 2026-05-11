import { createClient } from 'redis';

const _raw = process.env.REDIS_URL ?? '';
const REDIS_URL = _raw.trim().replace(/^\"|\"$/g, '');

let client = null;
let ready = false;

if (REDIS_URL) {
    client = createClient({ url: REDIS_URL });

    client.on('error', (err) => {
        console.error('Redis Client Error', err);
        ready = false;
    });

    // connect async but don't crash the app if redis is unavailable
    (async () => {
        try {
            await client.connect();
            ready = true;
            console.log('Connected to Redis');
        } catch (err) {
            ready = false;
            console.warn('Redis unavailable, caching disabled:', err.message);
        }
    })();
} else {
    console.warn('REDIS_URL not configured - caching disabled');
}

const wrapper = {
    async get(key) {
        if (!ready || !client) return null;
        return client.get(key);
    },
    async setEx(key, ttl, value) {
        if (!ready || !client) return;
        return client.setEx(key, ttl, value);
    },
    isReady() {
        return ready;
    },
    raw() {
        return client;
    }
};

export default wrapper;
