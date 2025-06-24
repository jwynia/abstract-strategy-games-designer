import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { z } from '@hono/zod-openapi'
import {
  CreateGameRequestSchema,
  GameInstanceSchema,
  GameStateSchema,
  MoveRequestSchema,
  MoveResponseSchema,
  LegalMovesSchema,
  RenderResponseSchema
} from '../schemas/game'
import { ErrorSchema } from '../schemas/common'

const app = new OpenAPIHono()

// Create game instance
const createGameRoute = createRoute({
  method: 'post',
  path: '/game-instances',
  tags: ['Game Instances'],
  summary: 'Create new game instance',
  description: 'Create a new game instance with specified players and settings',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateGameRequestSchema
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

app.openapi(createGameRoute, async (c) => {
  const { game } = c.get('services')
  const body = c.req.valid('json')
  
  try {
    const gameInstance = await game.createGameInstance(body)
    return c.json(gameInstance, 201)
  } catch (error) {
    return c.json({
      error: {
        code: 'CREATE_GAME_ERROR',
        message: error instanceof Error ? error.message : 'Failed to create game'
      },
      timestamp: new Date().toISOString()
    }, 400)
  }
})

// Get game state
const getGameStateRoute = createRoute({
  method: 'get',
  path: '/game-instances/{instanceId}',
  tags: ['Game Instances'],
  summary: 'Get game state',
  description: 'Get the current state of a game instance',
  request: {
    params: z.object({
      instanceId: z.string().uuid()
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GameStateSchema
        }
      },
      description: 'Successful response'
    },
    404: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Game instance not found'
    }
  }
})

app.openapi(getGameStateRoute, async (c) => {
  const { game } = c.get('services')
  const { instanceId } = c.req.valid('param')
  
  const gameState = await game.getGameInstance(instanceId)
  
  if (!gameState) {
    return c.json({
      error: {
        code: 'GAME_NOT_FOUND',
        message: `Game instance ${instanceId} not found`
      },
      timestamp: new Date().toISOString()
    }, 404)
  }
  
  return c.json(gameState)
})

// Make move
const makeMoveRoute = createRoute({
  method: 'post',
  path: '/game-instances/{instanceId}/moves',
  tags: ['Game Instances'],
  summary: 'Make a move',
  description: 'Submit a move in the game',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      instanceId: z.string().uuid()
    }),
    body: {
      content: {
        'application/json': {
          schema: MoveRequestSchema
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: MoveResponseSchema
        }
      },
      description: 'Move accepted'
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Invalid move'
    },
    403: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Not your turn'
    },
    404: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Game not found'
    }
  }
})

app.openapi(makeMoveRoute, async (c) => {
  const { game } = c.get('services')
  const { instanceId } = c.req.valid('param')
  const moveRequest = c.req.valid('json')
  const userId = c.get('userId') || moveRequest.playerId
  
  try {
    const response = await game.makeMove(instanceId, moveRequest, userId)
    return c.json(response)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid move'
    const code = message.includes('not found') ? 'GAME_NOT_FOUND' : 
                 message.includes('turn') ? 'NOT_YOUR_TURN' : 'INVALID_MOVE'
    const status = code === 'GAME_NOT_FOUND' ? 404 : 
                   code === 'NOT_YOUR_TURN' ? 403 : 400
    
    return c.json({
      error: {
        code,
        message
      },
      timestamp: new Date().toISOString()
    }, status)
  }
})

// Get legal moves
const getLegalMovesRoute = createRoute({
  method: 'get',
  path: '/game-instances/{instanceId}/legal-moves',
  tags: ['Game Instances'],
  summary: 'Get legal moves',
  description: 'Get all legal moves in the current position',
  request: {
    params: z.object({
      instanceId: z.string().uuid()
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: LegalMovesSchema
        }
      },
      description: 'Successful response'
    },
    404: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Game not found'
    }
  }
})

app.openapi(getLegalMovesRoute, async (c) => {
  const { game } = c.get('services')
  const { instanceId } = c.req.valid('param')
  
  try {
    const legalMoves = await game.getLegalMoves(instanceId)
    return c.json(legalMoves)
  } catch (error) {
    return c.json({
      error: {
        code: 'GAME_NOT_FOUND',
        message: `Game instance ${instanceId} not found`
      },
      timestamp: new Date().toISOString()
    }, 404)
  }
})

// Render game
const renderGameRoute = createRoute({
  method: 'get',
  path: '/game-instances/{instanceId}/render',
  tags: ['Game Instances'],
  summary: 'Render game state',
  description: 'Get a visual rendering of the current game state',
  request: {
    params: z.object({
      instanceId: z.string().uuid()
    }),
    query: z.object({
      format: z.enum(['svg', 'png', 'ascii']).optional().default('svg'),
      size: z.string().regex(/^\d+$/).optional().default('800').transform(Number),
      style: z.string().optional()
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: RenderResponseSchema
        }
      },
      description: 'Successful response'
    },
    404: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Game not found'
    }
  }
})

app.openapi(renderGameRoute, async (c) => {
  const { game } = c.get('services')
  const { instanceId } = c.req.valid('param')
  const { format, size, style } = c.req.valid('query')
  
  try {
    const renderResponse = await game.renderGame(instanceId, format, size)
    return c.json(renderResponse)
  } catch (error) {
    return c.json({
      error: {
        code: 'GAME_NOT_FOUND',
        message: `Game instance ${instanceId} not found`
      },
      timestamp: new Date().toISOString()
    }, 404)
  }
})

export default app