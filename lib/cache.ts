import { Redis } from '@upstash/redis';
import { env } from './env';

// Only initialize Redis if valid credentials are provided
const isRedisConfigured =
  env.redisUrl &&
  env.redisUrl.startsWith('https://') &&
  env.redisToken &&
  env.redisToken !== 'your_token';

const redis = isRedisConfigured ? new Redis({
  url: env.redisUrl,
  token: env.redisToken,
}) : null;

export async function getCached<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  try {
    return await redis.get(key);
  } catch (error) {
    console.error('Redis error:', error);
    return null;
  }
}

export async function setCached<T>(key: string, value: T, ttl = 86400) {
  if (!redis) return;
  try {
    await redis.set(key, JSON.stringify(value), { ex: ttl });
  } catch (error) {
    console.error('Redis error:', error);
  }
}
