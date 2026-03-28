// Simple cache wrapper — uses Upstash Redis if configured, in-memory Map otherwise.

type CacheEntry<T> = { value: T; expiresAt: number };
const memCache = new Map<string, CacheEntry<unknown>>();

export async function cached<T>(
  key: string,
  ttlSeconds: number,
  fn: () => Promise<T>
): Promise<T> {
  // In-memory check first (works for both paths)
  const mem = memCache.get(key);
  if (mem && Date.now() < mem.expiresAt) return mem.value as T;

  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const { Redis } = await import("@upstash/redis");
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
      const hit = await redis.get<T>(key);
      if (hit !== null && hit !== undefined) {
        memCache.set(key, { value: hit, expiresAt: Date.now() + ttlSeconds * 1000 });
        return hit;
      }
      const value = await fn();
      await redis.set(key, value, { ex: ttlSeconds });
      memCache.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
      return value;
    } catch {
      // Fall through to direct call on Redis error
    }
  }

  const value = await fn();
  memCache.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
  return value;
}
