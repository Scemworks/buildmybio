const rateLimitMap = new Map<string, { count: number, resetTime: number }>();

// Simple in-memory rate limiter for serverless (persists per instance/process)
// Note: In a multi-region distributed edge deployment, consider using Redis (e.g., Upstash)
export function checkRateLimit(
  ip: string, 
  limit: number = 30, 
  windowMs: number = 60000
): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return { success: true, limit, remaining: limit - 1, reset: now + windowMs };
  }

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    return { success: true, limit, remaining: limit - 1, reset: record.resetTime };
  }

  if (record.count >= limit) {
    return { success: false, limit, remaining: 0, reset: record.resetTime };
  }

  record.count += 1;
  return { success: true, limit, remaining: limit - record.count, reset: record.resetTime };
}
