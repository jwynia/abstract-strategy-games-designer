import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { z } from '@hono/zod-openapi'
import { 
  TournamentSchema, 
  NewTournamentRequestSchema, 
  JoinTournamentRequestSchema,
  TournamentPlayerSchema,
  TournamentGameSchema 
} from '../schemas/tournament'
import { ErrorSchema, PaginationQuerySchema } from '../schemas/common'

const app = new OpenAPIHono()

// Create tournament
const createTournamentRoute = createRoute({
  method: 'post',
  path: '/tournaments',
  tags: ['Tournaments'],
  summary: 'Create a new tournament',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: NewTournamentRequestSchema
        }
      }
    }
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: z.object({
            tournamentId: z.string(),
            tournament: TournamentSchema
          })
        }
      },
      description: 'Tournament created'
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

app.openapi(createTournamentRoute, async (c) => {
  const { tournament } = c.get('services')
  const userId = c.get('userId') || 'user1'
  const tournamentData = c.req.valid('json')
  
  try {
    const tournamentId = await tournament.createTournament(userId, tournamentData)
    const createdTournament = await tournament.getTournament(tournamentId)
    
    return c.json({
      tournamentId,
      tournament: createdTournament!
    }, 201)
  } catch (error) {
    return c.json({
      error: {
        code: 'CREATE_TOURNAMENT_ERROR',
        message: error instanceof Error ? error.message : 'Failed to create tournament'
      },
      timestamp: new Date().toISOString()
    }, 400)
  }
})

// Get tournament
const getTournamentRoute = createRoute({
  method: 'get',
  path: '/tournaments/{tournamentId}',
  tags: ['Tournaments'],
  summary: 'Get tournament details',
  request: {
    params: z.object({
      tournamentId: z.string()
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: TournamentSchema
        }
      },
      description: 'Tournament details'
    },
    404: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Tournament not found'
    }
  }
})

app.openapi(getTournamentRoute, async (c) => {
  const { tournament } = c.get('services')
  const { tournamentId } = c.req.valid('param')
  
  const tournamentData = await tournament.getTournament(tournamentId)
  
  if (!tournamentData) {
    return c.json({
      error: {
        code: 'NOT_FOUND',
        message: 'Tournament not found'
      },
      timestamp: new Date().toISOString()
    }, 404)
  }
  
  return c.json(tournamentData)
})

// List tournaments
const listTournamentsRoute = createRoute({
  method: 'get',
  path: '/tournaments',
  tags: ['Tournaments'],
  summary: 'List tournaments',
  request: {
    query: PaginationQuerySchema.extend({
      status: z.enum(['waiting', 'active', 'completed', 'all']).optional().default('active'),
      metaGame: z.string().optional()
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            tournaments: z.array(TournamentSchema),
            total: z.number(),
            page: z.number(),
            pageSize: z.number()
          })
        }
      },
      description: 'List of tournaments'
    }
  }
})

app.openapi(listTournamentsRoute, async (c) => {
  const { tournament } = c.get('services')
  const { page, pageSize, status, metaGame } = c.req.valid('query')
  
  const tournaments = await tournament.listTournaments({ status, metaGame })
  
  const startIndex = (page - 1) * pageSize
  const paginated = tournaments.slice(startIndex, startIndex + pageSize)
  
  return c.json({
    tournaments: paginated,
    total: tournaments.length,
    page,
    pageSize
  })
})

// Join tournament
const joinTournamentRoute = createRoute({
  method: 'post',
  path: '/tournaments/{tournamentId}/join',
  tags: ['Tournaments'],
  summary: 'Join a tournament',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      tournamentId: z.string()
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            once: z.boolean().optional().default(false)
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
            success: z.boolean(),
            division: z.number().optional()
          })
        }
      },
      description: 'Joined tournament'
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Cannot join'
    },
    404: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Tournament not found'
    }
  }
})

app.openapi(joinTournamentRoute, async (c) => {
  const { tournament } = c.get('services')
  const userId = c.get('userId') || 'user1'
  const { tournamentId } = c.req.valid('param')
  const { once } = c.req.valid('json')
  
  try {
    const result = await tournament.joinTournament(tournamentId, userId, once)
    return c.json({
      success: true,
      ...result
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to join tournament'
    const code = message.includes('not found') ? 'NOT_FOUND' :
                 message.includes('started') ? 'TOURNAMENT_STARTED' :
                 message.includes('Already joined') ? 'ALREADY_JOINED' : 'JOIN_ERROR'
    const status = code === 'NOT_FOUND' ? 404 : 400
    
    return c.json({
      error: {
        code,
        message
      },
      timestamp: new Date().toISOString()
    }, status)
  }
})

// Withdraw from tournament
const withdrawTournamentRoute = createRoute({
  method: 'post',
  path: '/tournaments/{tournamentId}/withdraw',
  tags: ['Tournaments'],
  summary: 'Withdraw from a tournament',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      tournamentId: z.string()
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean()
          })
        }
      },
      description: 'Withdrawn from tournament'
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Cannot withdraw'
    },
    404: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Tournament not found'
    }
  }
})

app.openapi(withdrawTournamentRoute, async (c) => {
  const { tournament } = c.get('services')
  const userId = c.get('userId') || 'user1'
  const { tournamentId } = c.req.valid('param')
  
  try {
    await tournament.withdrawFromTournament(tournamentId, userId)
    return c.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to withdraw'
    const code = message.includes('not found') ? 'NOT_FOUND' :
                 message.includes('started') ? 'TOURNAMENT_STARTED' : 'WITHDRAW_ERROR'
    const status = code === 'NOT_FOUND' ? 404 : 400
    
    return c.json({
      error: {
        code,
        message
      },
      timestamp: new Date().toISOString()
    }, status)
  }
})

// Get tournament games
const getTournamentGamesRoute = createRoute({
  method: 'get',
  path: '/tournaments/{tournamentId}/games',
  tags: ['Tournaments'],
  summary: 'Get tournament games',
  request: {
    params: z.object({
      tournamentId: z.string()
    }),
    query: z.object({
      round: z.string().regex(/^\d+$/).optional().transform(Number),
      playerId: z.string().optional()
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            games: z.array(TournamentGameSchema),
            total: z.number()
          })
        }
      },
      description: 'Tournament games'
    },
    404: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Tournament not found'
    }
  }
})

app.openapi(getTournamentGamesRoute, async (c) => {
  const { tournament } = c.get('services')
  const { tournamentId } = c.req.valid('param')
  const { round, playerId } = c.req.valid('query')
  
  try {
    const games = await tournament.getTournamentGames(tournamentId, round, playerId)
    return c.json({
      games,
      total: games.length
    })
  } catch (error) {
    return c.json({
      error: {
        code: 'NOT_FOUND',
        message: 'Tournament not found'
      },
      timestamp: new Date().toISOString()
    }, 404)
  }
})

// Get tournament standings
const getTournamentStandingsRoute = createRoute({
  method: 'get',
  path: '/tournaments/{tournamentId}/standings',
  tags: ['Tournaments'],
  summary: 'Get tournament standings',
  request: {
    params: z.object({
      tournamentId: z.string()
    }),
    query: z.object({
      division: z.string().regex(/^\d+$/).optional().transform(Number)
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            standings: z.array(z.object({
              rank: z.number(),
              player: TournamentPlayerSchema,
              wins: z.number(),
              losses: z.number(),
              draws: z.number()
            }))
          })
        }
      },
      description: 'Tournament standings'
    },
    404: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Tournament not found'
    }
  }
})

app.openapi(getTournamentStandingsRoute, async (c) => {
  const { tournament } = c.get('services')
  const { tournamentId } = c.req.valid('param')
  const { division } = c.req.valid('query')
  
  try {
    const standings = await tournament.getTournamentStandings(tournamentId, division)
    return c.json({ standings })
  } catch (error) {
    return c.json({
      error: {
        code: 'NOT_FOUND',
        message: 'Tournament not found'
      },
      timestamp: new Date().toISOString()
    }, 404)
  }
})

export default app