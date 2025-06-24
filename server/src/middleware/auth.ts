import { Context, Next } from 'hono'
import { verify } from 'jsonwebtoken'

export async function extractUserId(c: Context, next: Next) {
  const authorization = c.req.header('Authorization')
  
  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.substring(7)
    
    try {
      // In production, verify JWT properly
      if (token === (process.env.API_TOKEN || 'dev-token')) {
        // For dev, just set a default user
        c.set('userId', 'user1')
      } else {
        // In production, decode JWT to get user ID
        // const decoded = verify(token, process.env.JWT_SECRET!)
        // c.set('userId', decoded.sub)
        c.set('userId', 'user1')
      }
    } catch (err) {
      // Invalid token, but continue without userId
    }
  }
  
  await next()
}

export function requireAuth(c: Context, next: Next) {
  const userId = c.get('userId')
  
  if (!userId) {
    return c.json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required'
      },
      timestamp: new Date().toISOString()
    }, 401)
  }
  
  return next()
}