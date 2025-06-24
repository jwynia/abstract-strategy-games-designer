import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { z } from '@hono/zod-openapi'
import { GameListSchema, GameDetailsSchema } from '../schemas/game'
import { ErrorSchema, PaginationQuerySchema } from '../schemas/common'

const app = new OpenAPIHono()

// List games route
const listGamesRoute = createRoute({
  method: 'get',
  path: '/games',
  tags: ['Games'],
  summary: 'List available games',
  description: 'Get a paginated list of all available games on the platform',
  request: {
    query: PaginationQuerySchema.extend({
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

app.openapi(listGamesRoute, async (c) => {
  const { page, pageSize, tag } = c.req.valid('query')
  const { game } = c.get('services')
  
  const games = await game.listGames({ tag })
  
  const startIndex = (page - 1) * pageSize
  const paginatedGames = games.slice(startIndex, startIndex + pageSize)
  
  return c.json({
    games: paginatedGames,
    total: games.length,
    page,
    pageSize
  })
})

// Get game details route
const getGameRoute = createRoute({
  method: 'get',
  path: '/games/{gameId}',
  tags: ['Games'],
  summary: 'Get game details',
  description: 'Get detailed information about a specific game',
  request: {
    params: z.object({
      gameId: z.string()
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GameDetailsSchema
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

app.openapi(getGameRoute, async (c) => {
  const { gameId } = c.req.valid('param')
  const { game } = c.get('services')
  
  const gameDetails = await game.getGameDetails(gameId)
  
  if (!gameDetails) {
    return c.json({
      error: {
        code: 'GAME_NOT_FOUND',
        message: `Game ${gameId} not found`
      },
      timestamp: new Date().toISOString()
    }, 404)
  }
  
  return c.json(gameDetails)
})

export default app