import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { z } from '@hono/zod-openapi'
import { FederatedServerListSchema, CreateFederatedGameRequestSchema } from '../schemas/federation'
import { GameInstanceSchema } from '../schemas/game'
import { ErrorSchema } from '../schemas/common'

const app = new OpenAPIHono()

// List federated servers
const listFederatedServersRoute = createRoute({
  method: 'get',
  path: '/federation/servers',
  tags: ['Federation'],
  summary: 'List federated servers',
  description: 'Get a list of federated game servers',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: FederatedServerListSchema
        }
      },
      description: 'Successful response'
    }
  }
})

app.openapi(listFederatedServersRoute, async (c) => {
  const { federation } = c.get('services')
  const servers = await federation.listServers()
  
  return c.json({
    servers
  })
})

// Create federated game
const createFederatedGameRoute = createRoute({
  method: 'post',
  path: '/federation/games',
  tags: ['Federation'],
  summary: 'Create federated game',
  description: 'Initiate a game across federated servers',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateFederatedGameRequestSchema
        }
      }
    }
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: GameInstanceSchema
        }
      },
      description: 'Federated game created'
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Bad request'
    }
  }
})

app.openapi(createFederatedGameRoute, async (c) => {
  const { federation } = c.get('services')
  const request = c.req.valid('json')
  
  try {
    const gameInstance = await federation.createFederatedGame(request)
    return c.json(gameInstance, 201)
  } catch (error) {
    return c.json({
      error: {
        code: 'FEDERATION_ERROR',
        message: error instanceof Error ? error.message : 'Failed to create federated game'
      },
      timestamp: new Date().toISOString()
    }, 400)
  }
})

export default app