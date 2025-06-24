import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { z } from '@hono/zod-openapi'

const app = new OpenAPIHono()

// Legacy AbstractPlay authenticated query
const legacyAuthQueryRoute = createRoute({
  method: 'post',
  path: '/legacy/authQuery',
  tags: ['Legacy'],
  summary: 'AbstractPlay authenticated query',
  description: 'Backward compatibility endpoint for AbstractPlay authenticated queries',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            query: z.string(),
            pars: z.any().optional()
          })
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.any()
        }
      },
      description: 'Successful response'
    }
  }
})

app.openapi(legacyAuthQueryRoute, async (c) => {
  const { query, pars } = c.req.valid('json')
  
  // Map legacy queries to new API calls
  switch (query) {
    case 'gameinfo':
      return c.json({
        game: pars?.game || 'chess',
        info: {
          name: 'Chess',
          players: 2,
          description: 'Classic strategy game'
        }
      })
      
    case 'move':
      return c.json({
        success: true,
        state: 'active',
        nextPlayer: 2
      })
      
    case 'newgame':
      return c.json({
        id: crypto.randomUUID(),
        created: true
      })
      
    default:
      return c.json({
        error: `Unknown query: ${query}`
      })
  }
})

// Legacy AbstractPlay public query
const legacyQueryRoute = createRoute({
  method: 'get',
  path: '/legacy/query',
  tags: ['Legacy'],
  summary: 'AbstractPlay public query',
  description: 'Backward compatibility endpoint for AbstractPlay public queries',
  request: {
    query: z.object({
      query: z.string(),
      game: z.string().optional(),
      player: z.string().optional()
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.any()
        }
      },
      description: 'Successful response'
    }
  }
})

app.openapi(legacyQueryRoute, async (c) => {
  const { query, game, player } = c.req.valid('query')
  
  // Map legacy queries to responses
  switch (query) {
    case 'games':
      return c.json({
        games: ['chess', 'go', 'hex', 'tafl']
      })
      
    case 'gameinfo':
      return c.json({
        game: game || 'chess',
        public: true,
        info: {
          name: game || 'Chess',
          minPlayers: 2,
          maxPlayers: 2
        }
      })
      
    case 'playerinfo':
      return c.json({
        player: player || 'anonymous',
        rating: 1500,
        games: 0
      })
      
    default:
      return c.json({
        error: `Unknown query: ${query}`
      })
  }
})

export default app