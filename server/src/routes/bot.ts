import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { z } from '@hono/zod-openapi'
import { BotMoveRequestSchema } from '../schemas/game'
import { ErrorSchema } from '../schemas/common'

const app = new OpenAPIHono()

// Bot configuration
const BOT_USER_ID = process.env.BOT_USER_ID || 'bot'
const BOT_LEVELS = 10 // 0-9 difficulty levels

// Get bot move
const getBotMoveRoute = createRoute({
  method: 'post',
  path: '/bot/move',
  tags: ['Bot'],
  summary: 'Get bot move suggestion',
  request: {
    body: {
      content: {
        'application/json': {
          schema: BotMoveRequestSchema
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            move: z.string(),
            evaluation: z.number().optional(),
            confidence: z.number().min(0).max(1).optional(),
            alternatives: z.array(z.object({
              move: z.string(),
              evaluation: z.number()
            })).optional()
          })
        }
      },
      description: 'Bot move suggestion'
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Invalid game state'
    },
    501: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Game not supported by bot'
    }
  }
})

app.openapi(getBotMoveRoute, async (c) => {
  const { game, state, level } = c.req.valid('json')
  
  // Check if game is supported
  const supportedGames = ['chess', 'checkers', 'go', 'hex']
  if (!supportedGames.includes(game)) {
    return c.json({
      error: {
        code: 'GAME_NOT_SUPPORTED',
        message: `Bot does not support ${game}`
      },
      timestamp: new Date().toISOString()
    }, 501)
  }
  
  // Mock bot move calculation
  // In production, would call actual AI engine
  const move = calculateBotMove(game, state, level)
  
  if (!move) {
    return c.json({
      error: {
        code: 'INVALID_STATE',
        message: 'Could not calculate move for given state'
      },
      timestamp: new Date().toISOString()
    }, 400)
  }
  
  return c.json({
    move: move.notation,
    evaluation: move.evaluation,
    confidence: move.confidence,
    alternatives: move.alternatives
  })
})

// Get bot info
const getBotInfoRoute = createRoute({
  method: 'get',
  path: '/bot/info',
  tags: ['Bot'],
  summary: 'Get bot information',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            id: z.string(),
            name: z.string(),
            supportedGames: z.array(z.object({
              game: z.string(),
              levels: z.number(),
              features: z.array(z.string())
            })),
            description: z.string()
          })
        }
      },
      description: 'Bot information'
    }
  }
})

app.openapi(getBotInfoRoute, async (c) => {
  return c.json({
    id: BOT_USER_ID,
    name: 'Abstract AI',
    supportedGames: [
      {
        game: 'chess',
        levels: BOT_LEVELS,
        features: ['opening-book', 'endgame-tables', 'position-analysis']
      },
      {
        game: 'checkers',
        levels: BOT_LEVELS,
        features: ['perfect-play', 'position-analysis']
      },
      {
        game: 'go',
        levels: BOT_LEVELS,
        features: ['neural-network', 'pattern-matching']
      },
      {
        game: 'hex',
        levels: BOT_LEVELS,
        features: ['monte-carlo', 'virtual-connections']
      }
    ],
    description: 'AI bot for various abstract strategy games with adjustable difficulty levels'
  })
})

// Analyze position
const analyzePositionRoute = createRoute({
  method: 'post',
  path: '/bot/analyze',
  tags: ['Bot'],
  summary: 'Analyze game position',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            game: z.string(),
            state: z.any(),
            depth: z.number().int().min(1).max(20).optional().default(10)
          })
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            evaluation: z.number(),
            bestMove: z.string(),
            principalVariation: z.array(z.string()),
            analysis: z.object({
              material: z.number().optional(),
              position: z.number().optional(),
              mobility: z.number().optional(),
              safety: z.number().optional()
            }).optional(),
            winProbability: z.number().min(0).max(1).optional()
          })
        }
      },
      description: 'Position analysis'
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Invalid position'
    }
  }
})

app.openapi(analyzePositionRoute, async (c) => {
  const { game, state, depth } = c.req.valid('json')
  
  // Mock position analysis
  const analysis = analyzePosition(game, state, depth)
  
  if (!analysis) {
    return c.json({
      error: {
        code: 'INVALID_POSITION',
        message: 'Could not analyze position'
      },
      timestamp: new Date().toISOString()
    }, 400)
  }
  
  return c.json(analysis)
})

// Create bot game
const createBotGameRoute = createRoute({
  method: 'post',
  path: '/bot/games',
  tags: ['Bot'],
  summary: 'Create a game against the bot',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            gameId: z.string(),
            level: z.number().int().min(0).max(9).default(5),
            playerColor: z.enum(['first', 'second', 'random']).default('random'),
            timeControl: z.object({
              initial: z.number(),
              increment: z.number()
            }).optional(),
            variants: z.array(z.string()).optional()
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
            gameId: z.string(),
            instanceId: z.string(),
            playerColor: z.enum(['first', 'second'])
          })
        }
      },
      description: 'Bot game created'
    }
  }
})

app.openapi(createBotGameRoute, async (c) => {
  const userId = c.get('userId') || 'user1'
  const { gameId, level, playerColor, timeControl, variants } = c.req.valid('json')
  
  // Determine player colors
  let actualPlayerColor: 'first' | 'second'
  if (playerColor === 'random') {
    actualPlayerColor = Math.random() < 0.5 ? 'first' : 'second'
  } else {
    actualPlayerColor = playerColor
  }
  
  const instanceId = crypto.randomUUID()
  
  // Create game instance with bot as opponent
  // In production, would create actual game
  
  return c.json({
    gameId,
    instanceId,
    playerColor: actualPlayerColor
  }, 201)
})

// Bot statistics
const getBotStatsRoute = createRoute({
  method: 'get',
  path: '/bot/stats',
  tags: ['Bot'],
  summary: 'Get bot statistics',
  request: {
    query: z.object({
      game: z.string().optional(),
      level: z.string().regex(/^\d$/).optional().transform(Number),
      period: z.enum(['day', 'week', 'month', 'all']).optional().default('all')
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            totalGames: z.number(),
            wins: z.number(),
            losses: z.number(),
            draws: z.number(),
            winRate: z.number().min(0).max(1),
            averageGameLength: z.number(),
            levelDistribution: z.record(z.string(), z.number()),
            gameDistribution: z.record(z.string(), z.number())
          })
        }
      },
      description: 'Bot statistics'
    }
  }
})

app.openapi(getBotStatsRoute, async (c) => {
  const { game, level, period } = c.req.valid('query')
  
  // Mock statistics
  return c.json({
    totalGames: 1000,
    wins: 450,
    losses: 400,
    draws: 150,
    winRate: 0.45,
    averageGameLength: 42,
    levelDistribution: {
      '0': 50,
      '1': 100,
      '2': 150,
      '3': 200,
      '4': 200,
      '5': 150,
      '6': 100,
      '7': 30,
      '8': 15,
      '9': 5
    },
    gameDistribution: {
      'chess': 600,
      'checkers': 200,
      'go': 150,
      'hex': 50
    }
  })
})

// Helper functions

function calculateBotMove(game: string, state: any, level: number) {
  // Mock bot move calculation
  // In production, would use actual game engines
  
  const moves = ['e2-e4', 'd2-d4', 'Nf3', 'c2-c4']
  const selectedMove = moves[Math.floor(Math.random() * moves.length)]
  
  return {
    notation: selectedMove,
    evaluation: Math.random() * 2 - 1,
    confidence: 0.8 + Math.random() * 0.2,
    alternatives: moves.filter(m => m !== selectedMove).map(move => ({
      move,
      evaluation: Math.random() * 2 - 1
    }))
  }
}

function analyzePosition(game: string, state: any, depth: number) {
  // Mock position analysis
  
  return {
    evaluation: Math.random() * 2 - 1,
    bestMove: 'e2-e4',
    principalVariation: ['e2-e4', 'e7-e5', 'Nf3', 'Nc6'],
    analysis: {
      material: 0,
      position: 0.5,
      mobility: 0.3,
      safety: 0.2
    },
    winProbability: 0.5 + (Math.random() * 0.2 - 0.1)
  }
}

// Ping bot (keep alive)
const pingBotRoute = createRoute({
  method: 'post',
  path: '/bot/ping',
  tags: ['Bot'],
  summary: 'Ping bot to keep it active',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            status: z.literal('active'),
            timestamp: z.number()
          })
        }
      },
      description: 'Bot is active'
    }
  }
})

app.openapi(pingBotRoute, async (c) => {
  // In production, would wake up bot service if needed
  
  return c.json({
    status: 'active' as const,
    timestamp: Date.now()
  })
})

export default app