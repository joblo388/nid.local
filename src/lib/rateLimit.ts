// Rate limiting — uses Upstash Redis if UPSTASH_REDIS_REST_URL is set,
// falls back to in-memory store otherwise (resets on server restart, not safe for multi-instance).
// To enable: npm install @upstash/ratelimit @upstash/redis,
//            set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env

type Entry = { count: number; resetAt: number };
const store = new Map<string, Entry>();

function inMemoryRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = store.get(key);
  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

export async function rateLimitAsync(key: string, limit: number, windowMs: number): Promise<boolean> {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const { Ratelimit } = await import("@upstash/ratelimit");
    const { Redis } = await import("@upstash/redis");
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${windowMs}ms`),
    });
    const { success } = await ratelimit.limit(key);
    return success;
  }
  return inMemoryRateLimit(key, limit, windowMs);
}

// Sync fallback for backward compat — uses in-memory only
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  return inMemoryRateLimit(key, limit, windowMs);
}

export function getIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}
