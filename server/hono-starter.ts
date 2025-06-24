import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { bearerAuth } from 'hono/bearer-auth'

// Schema definitions matching our OpenAPI spec
const GameSummarySchema = z.object({
  id: z.string().openapi({ example: 'chess' }),
  name: z.string().openapi({ example: 'Chess' }),
  version: z.string().openapi({ example: '1.0.0' }),
  minPlayers: z.number().int().min(2),
  maxPlayers: z.number().int().min(2),
  variants: z.array(z.string()).optional(),
  pluginUrl: z.string().url().optional()
}).openapi('GameSummary')

const GameListSchema = z.object({
  games: z.array(GameSummarySchema),
  total: z.number().int(),
  page: z.number().int(),
  pageSize: z.number().int()
}).openapi('GameList')

const ErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional()
  }),
  timestamp: z.string().datetime(),
  requestId: z.string().optional()
}).openapi('Error')

// Create app with OpenAPI support
const app = new OpenAPIHono()

// Global middleware
app.use('*', logger())
app.use('*', cors())

// Auth middleware for protected routes
const protectedApp = new OpenAPIHono()
protectedApp.use('*', bearerAuth({ token: process.env.API_TOKEN || 'dev-token' }))

// Define routes
const listGamesRoute = createRoute({
  method: 'get',
  path: '/games',
  tags: ['Games'],
  summary: 'List available games',
  description: 'Get a paginated list of all available games on the platform',
  request: {
    query: z.object({
      page: z.string().regex(/^\d+$/).optional().default('1').transform(Number),
      pageSize: z.string().regex(/^\d+$/).optional().default('20').transform(Number),
      tag: z.string().optional()
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GameListSchema
        }
      },
      description: 'Successful response'
    },
    401: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Unauthorized'
    }
  }
})

// Implement route handler
app.openapi(listGamesRoute, async (c) => {
  const { page, pageSize, tag } = c.req.valid('query')
  
  // Mock implementation - replace with actual service
  const mockGames = [
    {
      id: 'chess',
      name: 'Chess',
      version: '1.0.0',
      minPlayers: 2,
      maxPlayers: 2,
      variants: ['standard', 'chess960']
    },
    {
      id: 'go',
      name: 'Go',
      version: '1.0.0',
      minPlayers: 2,
      maxPlayers: 2,
      variants: ['9x9', '13x13', '19x19']
    }
  ]
  
  const filteredGames = tag 
    ? mockGames.filter(g => g.variants?.includes(tag))
    : mockGames
  
  const startIndex = (page - 1) * pageSize
  const paginatedGames = filteredGames.slice(startIndex, startIndex + pageSize)
  
  return c.json({
    games: paginatedGames,
    total: filteredGames.length,
    page,
    pageSize
  })
})

// Example of a protected route
const createGameRoute = createRoute({
  method: 'post',
  path: '/game-instances',
  tags: ['Game Instances'],
  summary: 'Create new game instance',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            gameId: z.string(),
            variant: z.string().optional(),
            players: z.array(z.object({
              id: z.string(),
              name: z.string()
            })).min(2),
            timeControl: z.object({
              type: z.enum(['none', 'absolute', 'increment', 'byoyomi']),
              initial: z.number().optional(),
              increment: z.number().optional()
            }).optional(),
            metadata: z.record(z.any()).optional()
          })
        }
      }
    }
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: z.object({
            instanceId: z.string().uuid(),
            gameId: z.string(),
            state: z.enum(['active', 'completed', 'abandoned']),
            currentPlayer: z.number().int().min(1),
            createdAt: z.string().datetime(),
            joinUrl: z.string().url().optional()
          })
        }
      },
      description: 'Game created successfully'
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Bad request'
    },
    401: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Unauthorized'
    }
  }
})

protectedApp.openapi(createGameRoute, async (c) => {
  const body = c.req.valid('json')
  
  // Mock implementation
  const instanceId = crypto.randomUUID()
  
  return c.json({
    instanceId,
    gameId: body.gameId,
    state: 'active' as const,
    currentPlayer: 1,
    createdAt: new Date().toISOString(),
    joinUrl: `https://play.example.com/g/${instanceId}`
  }, 201)
})

// Mount routes
app.route('/v1', app)
app.route('/v1', protectedApp)

// Add OpenAPI documentation
app.doc('/openapi.json', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Abstract Strategy Games API',
    description: 'RESTful API for abstract strategy game platforms'
  },
  servers: [
    {
      url: 'http://localhost:3000/v1',
      description: 'Development server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
})

// Add Swagger UI
app.get('/docs', swaggerUI({ url: '/openapi.json' }))

// Error handler
app.onError((err, c) => {
  console.error(err)
  return c.json({
    error: {
      code: 'INTERNAL_ERROR',
      message: err.message || 'Internal server error'
    },
    timestamp: new Date().toISOString(),
    requestId: c.req.header('x-request-id') || crypto.randomUUID()
  }, 500)
})

// 404 handler
app.notFound((c) => {
  return c.json({
    error: {
      code: 'NOT_FOUND',
      message: 'Resource not found'
    },
    timestamp: new Date().toISOString()
  }, 404)
})

// Export for different runtimes
export default app

// For Node.js
if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3000
  console.log(`Server running on http://localhost:${port}`)
  console.log(`API docs available at http://localhost:${port}/docs`)
}