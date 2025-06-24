import { Context, Next } from 'hono'

interface RateLimitOptions {
  windowMs: number
  max: number
}

const requests = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(options: RateLimitOptions) {
  return async (c: Context, next: Next) => {
    const key = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'anonymous'
    const now = Date.now()
    
    const record = requests.get(key)
    
    if (!record || now > record.resetTime) {
      requests.set(key, {
        count: 1,
        resetTime: now + options.windowMs
      })
    } else {
      record.count++
      
      if (record.count > options.max) {
        const retryAfter = Math.ceil((record.resetTime - now) / 1000)
        
        c.header('X-RateLimit-Limit', options.max.toString())
        c.header('X-RateLimit-Remaining', '0')
        c.header('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000).toString())
        c.header('Retry-After', retryAfter.toString())
        
        return c.json({
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests, please try again later'
          },
          timestamp: new Date().toISOString()
        }, 429)
      }
    }
    
    const remaining = options.max - (requests.get(key)?.count || 0)
    c.header('X-RateLimit-Limit', options.max.toString())
    c.header('X-RateLimit-Remaining', remaining.toString())
    c.header('X-RateLimit-Reset', Math.ceil((requests.get(key)?.resetTime || 0) / 1000).toString())
    
    await next()
  }
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of requests) {
    if (now > record.resetTime) {
      requests.delete(key)
    }
  }
}, 60000) // Clean every minute