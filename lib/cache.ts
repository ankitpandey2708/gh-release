import { Redis } from '@upstash/redis';
import { env } from './env';

export const redis = new Redis({
  url: env.redisUrl,
  token: env.redisToken,
});

export async function getCached<T>(key: string): Promise<T | null> {
  try {
    return await redis.get(key);
  } catch (error) {
    console.error('Redis error:', error);
    return null;
  }
}

export async function setCached<T>(key: string, value: T, ttl = 86400) {
  try {
    await redis.set(key, JSON.stringify(value), { ex: ttl });
  } catch (error) {
    console.error('Redis error:', error);
  }
}
