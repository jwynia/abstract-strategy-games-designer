import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { z } from '@hono/zod-openapi'
import { PlayerProfileSchema, PlayerGamesListSchema } from '../schemas/player'
import { ErrorSchema, PaginationQuerySchema } from '../schemas/common'

const app = new OpenAPIHono()

// Mock player data
const players = new Map([
  ['player1', {
    id: 'player1',
    name: 'Alice',
    rating: { chess: 1650, go: 1200 },
    stats: { gamesPlayed: 150, winRate: 0.62 }
  }],
  ['player2', {
    id: 'player2',
    name: 'Bob',
    rating: { chess: 1500, go: 1400 },
    stats: { gamesPlayed: 89, winRate: 0.48 }
  }]
])

// Get player profile
const getPlayerRoute = createRoute({
  method: 'get',
  path: '/players/{playerId}',
  tags: ['Players'],
  summary: 'Get player profile',
  description: 'Get information about a player',
  request: {
    params: z.object({
      playerId: z.string()
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: PlayerProfileSchema
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
      description: 'Player not found'
    }
  }
})

app.openapi(getPlayerRoute, async (c) => {
  const { playerId } = c.req.valid('param')
  const player = players.get(playerId)
  
  if (!player) {
    return c.json({
      error: {
        code: 'PLAYER_NOT_FOUND',
        message: `Player ${playerId} not found`
      },
      timestamp: new Date().toISOString()
    }, 404)
  }
  
  return c.json(player)
})

// Get player games
const getPlayerGamesRoute = createRoute({
  method: 'get',
  path: '/players/{playerId}/games',
  tags: ['Players'],
  summary: "Get player's games",
  description: 'Get a list of games for a specific player',
  request: {
    params: z.object({
      playerId: z.string()
    }),
    query: PaginationQuerySchema.extend({
      status: z.enum(['active', 'completed', 'all']).optional().default('all'),
      gameId: z.string().optional()
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: PlayerGamesListSchema
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
      description: 'Player not found'
    }
  }
})

app.openapi(getPlayerGamesRoute, async (c) => {
  const { playerId } = c.req.valid('param')
  const { page, pageSize, status, gameId } = c.req.valid('query')
  
  const player = players.get(playerId)
  if (!player) {
    return c.json({
      error: {
        code: 'PLAYER_NOT_FOUND',
        message: `Player ${playerId} not found`
      },
      timestamp: new Date().toISOString()
    }, 404)
  }
  
  // Mock game instances for this player
  const mockGames = [
    {
      instanceId: '550e8400-e29b-41d4-a716-446655440001',
      gameId: 'chess',
      state: 'active' as const,
      currentPlayer: 1,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      joinUrl: 'https://play.example.com/g/550e8400-e29b-41d4-a716-446655440001'
    },
    {
      instanceId: '550e8400-e29b-41d4-a716-446655440002',
      gameId: 'go',
      state: 'completed' as const,
      currentPlayer: 2,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      joinUrl: 'https://play.example.com/g/550e8400-e29b-41d4-a716-446655440002'
    },
    {
      instanceId: '550e8400-e29b-41d4-a716-446655440003',
      gameId: 'chess',
      state: 'active' as const,
      currentPlayer: 2,
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      joinUrl: 'https://play.example.com/g/550e8400-e29b-41d4-a716-446655440003'
    }
  ]
  
  // Filter games
  let filteredGames = mockGames
  if (status !== 'all') {
    filteredGames = filteredGames.filter(g => g.state === status)
  }
  if (gameId) {
    filteredGames = filteredGames.filter(g => g.gameId === gameId)
  }
  
  // Paginate
  const startIndex = (page - 1) * pageSize
  const paginatedGames = filteredGames.slice(startIndex, startIndex + pageSize)
  
  return c.json({
    games: paginatedGames,
    total: filteredGames.length,
    page
  })
})

export default app