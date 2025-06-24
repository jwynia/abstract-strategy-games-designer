import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { z } from '@hono/zod-openapi'
import { 
  OrgEventSchema, 
  OrgEventGameSchema, 
  OrgEventPlayerSchema,
  CreateEventRequestSchema,
  EventRegisterRequestSchema,
  EventCreateGamesRequestSchema
} from '../schemas/event'
import { ErrorSchema, PaginationQuerySchema } from '../schemas/common'

const app = new OpenAPIHono()

// In-memory storage
const events = new Map<string, any>()
const eventPlayers = new Map<string, any[]>()
const eventGames = new Map<string, any[]>()

// Create event
const createEventRoute = createRoute({
  method: 'post',
  path: '/events',
  tags: ['Events'],
  summary: 'Create an organized event',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateEventRequestSchema
        }
      }
    }
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: z.object({
            eventId: z.string(),
            event: OrgEventSchema
          })
        }
      },
      description: 'Event created'
    }
  }
})

app.openapi(createEventRoute, async (c) => {
  const userId = c.get('userId') || 'user1'
  const eventData = c.req.valid('json')
  
  const eventId = crypto.randomUUID()
  const event = {
    pk: 'ORGEVENT',
    sk: eventId,
    ...eventData,
    organizer: userId,
    visible: false // Start as draft
  }
  
  events.set(eventId, event)
  eventPlayers.set(eventId, [])
  eventGames.set(eventId, [])
  
  return c.json({
    eventId,
    event
  }, 201)
})

// Get event
const getEventRoute = createRoute({
  method: 'get',
  path: '/events/{eventId}',
  tags: ['Events'],
  summary: 'Get event details',
  request: {
    params: z.object({
      eventId: z.string()
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: OrgEventSchema
        }
      },
      description: 'Event details'
    },
    404: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Event not found'
    }
  }
})

app.openapi(getEventRoute, async (c) => {
  const { eventId } = c.req.valid('param')
  const event = events.get(eventId)
  
  if (!event) {
    return c.json({
      error: {
        code: 'NOT_FOUND',
        message: 'Event not found'
      },
      timestamp: new Date().toISOString()
    }, 404)
  }
  
  return c.json(event)
})

// List events
const listEventsRoute = createRoute({
  method: 'get',
  path: '/events',
  tags: ['Events'],
  summary: 'List events',
  request: {
    query: PaginationQuerySchema.extend({
      status: z.enum(['upcoming', 'ongoing', 'completed', 'all']).optional().default('upcoming'),
      organizerId: z.string().optional()
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            events: z.array(OrgEventSchema),
            total: z.number(),
            page: z.number(),
            pageSize: z.number()
          })
        }
      },
      description: 'List of events'
    }
  }
})

app.openapi(listEventsRoute, async (c) => {
  const { page, pageSize, status, organizerId } = c.req.valid('query')
  
  let filtered = Array.from(events.values()).filter(e => e.visible)
  
  if (organizerId) {
    filtered = filtered.filter(e => e.organizer === organizerId)
  }
  
  const now = Date.now()
  if (status !== 'all') {
    switch (status) {
      case 'upcoming':
        filtered = filtered.filter(e => e.dateStart > now)
        break
      case 'ongoing':
        filtered = filtered.filter(e => e.dateStart <= now && (!e.dateEnd || e.dateEnd > now))
        break
      case 'completed':
        filtered = filtered.filter(e => e.dateEnd && e.dateEnd <= now)
        break
    }
  }
  
  const startIndex = (page - 1) * pageSize
  const paginated = filtered.slice(startIndex, startIndex + pageSize)
  
  return c.json({
    events: paginated,
    total: filtered.length,
    page,
    pageSize
  })
})

// Publish event
const publishEventRoute = createRoute({
  method: 'post',
  path: '/events/{eventId}/publish',
  tags: ['Events'],
  summary: 'Publish an event',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      eventId: z.string()
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
      description: 'Event published'
    },
    403: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Not authorized'
    }
  }
})

app.openapi(publishEventRoute, async (c) => {
  const userId = c.get('userId')
  const { eventId } = c.req.valid('param')
  
  const event = events.get(eventId)
  if (!event) {
    return c.json({
      error: {
        code: 'NOT_FOUND',
        message: 'Event not found'
      },
      timestamp: new Date().toISOString()
    }, 404)
  }
  
  if (event.organizer !== userId) {
    return c.json({
      error: {
        code: 'FORBIDDEN',
        message: 'Only organizer can publish'
      },
      timestamp: new Date().toISOString()
    }, 403)
  }
  
  event.visible = true
  return c.json({ success: true })
})

// Register for event
const registerEventRoute = createRoute({
  method: 'post',
  path: '/events/{eventId}/register',
  tags: ['Events'],
  summary: 'Register for an event',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      eventId: z.string()
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            division: z.number().optional(),
            seed: z.number().optional()
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
            success: z.boolean()
          })
        }
      },
      description: 'Registered for event'
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Cannot register'
    }
  }
})

app.openapi(registerEventRoute, async (c) => {
  const userId = c.get('userId') || 'user1'
  const { eventId } = c.req.valid('param')
  const { division, seed } = c.req.valid('json')
  
  const event = events.get(eventId)
  if (!event || !event.visible) {
    return c.json({
      error: {
        code: 'NOT_FOUND',
        message: 'Event not found'
      },
      timestamp: new Date().toISOString()
    }, 404)
  }
  
  const players = eventPlayers.get(eventId) || []
  
  // Check if already registered
  if (players.some(p => p.playerid === userId)) {
    return c.json({
      error: {
        code: 'ALREADY_REGISTERED',
        message: 'Already registered for this event'
      },
      timestamp: new Date().toISOString()
    }, 400)
  }
  
  // Add player
  players.push({
    pk: 'ORGEVENTPLAYER',
    sk: `${eventId}#${userId}`,
    playerid: userId,
    division,
    seed
  })
  eventPlayers.set(eventId, players)
  
  return c.json({ success: true })
})

// Withdraw from event
const withdrawEventRoute = createRoute({
  method: 'post',
  path: '/events/{eventId}/withdraw',
  tags: ['Events'],
  summary: 'Withdraw from an event',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      eventId: z.string()
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
      description: 'Withdrawn from event'
    }
  }
})

app.openapi(withdrawEventRoute, async (c) => {
  const userId = c.get('userId') || 'user1'
  const { eventId } = c.req.valid('param')
  
  const players = eventPlayers.get(eventId) || []
  const filtered = players.filter(p => p.playerid !== userId)
  eventPlayers.set(eventId, filtered)
  
  return c.json({ success: true })
})

// Create event games
const createEventGamesRoute = createRoute({
  method: 'post',
  path: '/events/{eventId}/games',
  tags: ['Events'],
  summary: 'Create games for event round',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      eventId: z.string()
    }),
    body: {
      content: {
        'application/json': {
          schema: EventCreateGamesRequestSchema.omit({ eventId: true })
        }
      }
    }
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: z.object({
            games: z.array(z.object({
              gameId: z.string(),
              player1: z.string(),
              player2: z.string()
            }))
          })
        }
      },
      description: 'Games created'
    },
    403: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Not authorized'
    }
  }
})

app.openapi(createEventGamesRoute, async (c) => {
  const userId = c.get('userId')
  const { eventId } = c.req.valid('param')
  const { round, pairings } = c.req.valid('json')
  
  const event = events.get(eventId)
  if (!event) {
    return c.json({
      error: {
        code: 'NOT_FOUND',
        message: 'Event not found'
      },
      timestamp: new Date().toISOString()
    }, 404)
  }
  
  if (event.organizer !== userId) {
    return c.json({
      error: {
        code: 'FORBIDDEN',
        message: 'Only organizer can create games'
      },
      timestamp: new Date().toISOString()
    }, 403)
  }
  
  const games = eventGames.get(eventId) || []
  const createdGames = []
  
  for (const pairing of pairings) {
    const gameId = crypto.randomUUID()
    const game = {
      pk: 'ORGEVENTGAME',
      sk: `${eventId}#${gameId}`,
      ...pairing,
      round,
      gameid: gameId
    }
    games.push(game)
    createdGames.push({
      gameId,
      player1: pairing.player1,
      player2: pairing.player2
    })
  }
  
  eventGames.set(eventId, games)
  
  return c.json({ games: createdGames }, 201)
})

// Get event players
const getEventPlayersRoute = createRoute({
  method: 'get',
  path: '/events/{eventId}/players',
  tags: ['Events'],
  summary: 'Get event players',
  request: {
    params: z.object({
      eventId: z.string()
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            players: z.array(OrgEventPlayerSchema),
            total: z.number()
          })
        }
      },
      description: 'Event players'
    }
  }
})

app.openapi(getEventPlayersRoute, async (c) => {
  const { eventId } = c.req.valid('param')
  
  const players = eventPlayers.get(eventId) || []
  
  return c.json({
    players,
    total: players.length
  })
})

// Get event games
const getEventGamesRoute = createRoute({
  method: 'get',
  path: '/events/{eventId}/games',
  tags: ['Events'],
  summary: 'Get event games',
  request: {
    params: z.object({
      eventId: z.string()
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
            games: z.array(OrgEventGameSchema),
            total: z.number()
          })
        }
      },
      description: 'Event games'
    }
  }
})

app.openapi(getEventGamesRoute, async (c) => {
  const { eventId } = c.req.valid('param')
  const { round, playerId } = c.req.valid('query')
  
  let games = eventGames.get(eventId) || []
  
  if (round !== undefined) {
    games = games.filter(g => g.round === round)
  }
  
  if (playerId) {
    games = games.filter(g => g.player1 === playerId || g.player2 === playerId)
  }
  
  return c.json({
    games,
    total: games.length
  })
})

// Update event results
const updateEventResultsRoute = createRoute({
  method: 'put',
  path: '/events/{eventId}/results',
  tags: ['Events'],
  summary: 'Update event results',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      eventId: z.string()
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            gameId: z.string(),
            winner: z.array(z.string()),
            arbitrated: z.boolean().optional()
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
            success: z.boolean()
          })
        }
      },
      description: 'Results updated'
    },
    403: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Not authorized'
    }
  }
})

app.openapi(updateEventResultsRoute, async (c) => {
  const userId = c.get('userId')
  const { eventId } = c.req.valid('param')
  const { gameId, winner, arbitrated } = c.req.valid('json')
  
  const event = events.get(eventId)
  if (!event) {
    return c.json({
      error: {
        code: 'NOT_FOUND',
        message: 'Event not found'
      },
      timestamp: new Date().toISOString()
    }, 404)
  }
  
  if (event.organizer !== userId) {
    return c.json({
      error: {
        code: 'FORBIDDEN',
        message: 'Only organizer can update results'
      },
      timestamp: new Date().toISOString()
    }, 403)
  }
  
  const games = eventGames.get(eventId) || []
  const game = games.find(g => g.gameid === gameId)
  
  if (game) {
    game.winner = winner
    game.arbitrated = arbitrated
  }
  
  return c.json({ success: true })
})

// Close event
const closeEventRoute = createRoute({
  method: 'post',
  path: '/events/{eventId}/close',
  tags: ['Events'],
  summary: 'Close an event',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      eventId: z.string()
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            winner: z.array(z.string()).optional()
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
            success: z.boolean()
          })
        }
      },
      description: 'Event closed'
    },
    403: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Not authorized'
    }
  }
})

app.openapi(closeEventRoute, async (c) => {
  const userId = c.get('userId')
  const { eventId } = c.req.valid('param')
  const { winner } = c.req.valid('json')
  
  const event = events.get(eventId)
  if (!event) {
    return c.json({
      error: {
        code: 'NOT_FOUND',
        message: 'Event not found'
      },
      timestamp: new Date().toISOString()
    }, 404)
  }
  
  if (event.organizer !== userId) {
    return c.json({
      error: {
        code: 'FORBIDDEN',
        message: 'Only organizer can close event'
      },
      timestamp: new Date().toISOString()
    }, 403)
  }
  
  event.dateEnd = Date.now()
  event.winner = winner
  
  return c.json({ success: true })
})

export default app