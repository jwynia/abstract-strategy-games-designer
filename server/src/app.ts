import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { bearerAuth } from 'hono/bearer-auth'
import { prettyJSON } from 'hono/pretty-json'
import { rateLimit } from './middleware/rate-limit'
import { extractUserId } from './middleware/auth'
import { injectServices } from './middleware/services'
import { initializeServices } from './services'

// Import routes
import gamesRoutes from './routes/games'
import gameInstancesRoutes from './routes/game-instances'
import playersRoutes from './routes/players'
import federationRoutes from './routes/federation'
import webhooksRoutes from './routes/webhooks'
import legacyRoutes from './routes/legacy'
import queryRoutes from './routes/query'
import authQueryRoutes from './routes/auth-query'
import challengesRoutes from './routes/challenges'
import tournamentsRoutes from './routes/tournaments'
import explorationsRoutes from './routes/explorations'
import pushNotificationsRoutes from './routes/push-notifications'
import eventsRoutes from './routes/events'
import botRoutes from './routes/bot'

// Initialize services
initializeServices(true) // Use mock services

// Create main app
const app = new OpenAPIHono()

// Global middleware
app.use('*', logger())
app.use('*', cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}))
app.use('*', prettyJSON())
app.use('*', extractUserId)
app.use('*', injectServices)

// Rate limiting
app.use('/v1/*', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}))

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

// Create a sub-app for protected routes
const protectedApp = new OpenAPIHono()
protectedApp.use('*', bearerAuth({ 
  token: process.env.API_TOKEN || 'dev-token',
  realm: 'Abstract Strategy Games API',
  hashFunction: (token: string) => {
    // In production, validate JWT or check against database
    return token === (process.env.API_TOKEN || 'dev-token')
  }
}))

// Mount public routes
app.route('/v1', gamesRoutes)
app.route('/v1', playersRoutes)
app.route('/v1', federationRoutes)
app.route('/v1', legacyRoutes)
app.route('/v1', queryRoutes)
app.route('/v1', challengesRoutes)
app.route('/v1', tournamentsRoutes)
app.route('/v1', explorationsRoutes)
app.route('/v1', pushNotificationsRoutes)
app.route('/v1', eventsRoutes)
app.route('/v1', botRoutes)

// Mount protected routes
protectedApp.route('/', gameInstancesRoutes)
protectedApp.route('/', webhooksRoutes)
protectedApp.route('/', authQueryRoutes)

// Mount protected app under /v1
app.route('/v1', protectedApp)

// Add OpenAPI documentation
app.doc('/openapi.json', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Abstract Strategy Games API',
    description: 'RESTful API for abstract strategy game platforms with support for plugins, federation, and AbstractPlay compatibility',
    contact: {
      name: 'API Support',
      url: 'https://github.com/abstract-strategy-games'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: process.env.API_BASE_URL || 'http://localhost:3020/v1',
      description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your API token'
      }
    }
  },
  tags: [
    {
      name: 'Games',
      description: 'Game catalog operations'
    },
    {
      name: 'Game Instances',
      description: 'Active game management'
    },
    {
      name: 'Players',
      description: 'Player profiles and statistics'
    },
    {
      name: 'Challenges',
      description: 'Challenge creation and management'
    },
    {
      name: 'Tournaments',
      description: 'Tournament system'
    },
    {
      name: 'Explorations',
      description: 'Game analysis and playground'
    },
    {
      name: 'Push Notifications',
      description: 'Web push notification management'
    },
    {
      name: 'Events',
      description: 'Organized event management'
    },
    {
      name: 'Bot',
      description: 'AI bot integration'
    },
    {
      name: 'Query',
      description: 'Public query endpoints'
    },
    {
      name: 'Auth Query',
      description: 'Authenticated query endpoints'
    },
    {
      name: 'Federation',
      description: 'Cross-server game operations'
    },
    {
      name: 'Webhooks',
      description: 'Event subscriptions'
    },
    {
      name: 'Legacy',
      description: 'AbstractPlay compatibility'
    }
  ]
})

// Add Swagger UI
app.get('/docs', swaggerUI({ 
  url: '/openapi.json',
  persistAuthorization: true
}))

// Root redirect
app.get('/', (c) => {
  return c.redirect('/docs')
})

// Error handler
app.onError((err, c) => {
  console.error(err)
  const status = 'status' in err ? (err as any).status : 500
  
  return c.json({
    error: {
      code: status === 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR',
      message: err.message || 'An error occurred'
    },
    timestamp: new Date().toISOString(),
    requestId: c.req.header('x-request-id') || crypto.randomUUID()
  }, status)
})

// 404 handler
app.notFound((c) => {
  return c.json({
    error: {
      code: 'NOT_FOUND',
      message: 'Resource not found',
      details: {
        path: c.req.path
      }
    },
    timestamp: new Date().toISOString()
  }, 404)
})

// Add request ID middleware
app.use('*', async (c, next) => {
  const requestId = c.req.header('x-request-id') || crypto.randomUUID()
  c.header('x-request-id', requestId)
  await next()
})

export default app