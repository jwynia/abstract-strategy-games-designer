import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { z } from '@hono/zod-openapi'
import { UsersDataSchema, MetaGameCountsSchema } from '../schemas/user'
import { FullChallengeSchema, StandingChallengeSchema } from '../schemas/challenge'
import { FullGameSchema, GameMetaInfoSchema, BotMoveRequestSchema } from '../schemas/game'
import { TournamentSchema } from '../schemas/tournament'
import { ExplorationSchema } from '../schemas/exploration'
import { OrgEventSchema } from '../schemas/event'
import { ErrorSchema } from '../schemas/common'

const app = new OpenAPIHono()

// Mock data stores
const users = new Map([
  ['user1', { id: 'user1', name: 'Alice', country: 'US', stars: 5, lastSeen: Date.now() }],
  ['user2', { id: 'user2', name: 'Bob', country: 'UK', stars: 3, lastSeen: Date.now() - 86400000 }],
  ['bot', { id: 'bot', name: 'AI Bot', lastSeen: Date.now() }]
])

const standingChallenges = new Map<string, any[]>()
const tournaments = new Map<string, any>()
const events = new Map<string, any>()

// User names endpoint
const userNamesRoute = createRoute({
  method: 'get',
  path: '/query',
  tags: ['Query'],
  summary: 'Get user names',
  request: {
    query: z.object({
      query: z.literal('user_names')
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(UsersDataSchema)
        }
      },
      description: 'List of all users'
    }
  }
})

app.openapi(userNamesRoute, async (c) => {
  return c.json(Array.from(users.values()))
})

// Challenge details endpoint
const challengeDetailsRoute = createRoute({
  method: 'get',
  path: '/query',
  tags: ['Query'],
  summary: 'Get challenge details',
  request: {
    query: z.object({
      query: z.literal('challenge_details'),
      id: z.string()
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: FullChallengeSchema
        }
      },
      description: 'Challenge details'
    }
  }
})

app.openapi(challengeDetailsRoute, async (c) => {
  const { id } = c.req.valid('query')
  // Mock implementation
  return c.json({
    pk: 'CHALLENGE',
    sk: id,
    metaGame: 'chess',
    numPlayers: 2,
    seating: 'random',
    variants: [],
    challenger: users.get('user1')!,
    challengees: [users.get('user2')!],
    clockStart: 172800,
    clockInc: 0,
    clockMax: 604800,
    clockHard: false,
    rated: true,
    dateIssued: Date.now()
  })
})

// Standing challenges endpoint
const standingChallengesRoute = createRoute({
  method: 'get',
  path: '/query',
  tags: ['Query'],
  summary: 'Get standing challenges',
  request: {
    query: z.object({
      query: z.literal('standing_challenges'),
      metaGame: z.string().optional()
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(StandingChallengeSchema)
        }
      },
      description: 'List of standing challenges'
    }
  }
})

app.openapi(standingChallengesRoute, async (c) => {
  const { metaGame } = c.req.valid('query')
  const allChallenges: any[] = []
  
  for (const [userId, challenges] of standingChallenges) {
    const filtered = metaGame 
      ? challenges.filter(ch => ch.metaGame === metaGame)
      : challenges
    allChallenges.push(...filtered)
  }
  
  return c.json(allChallenges)
})

// Games endpoint (current and completed)
const gamesRoute = createRoute({
  method: 'get',
  path: '/query',
  tags: ['Query'],
  summary: 'Get games',
  request: {
    query: z.object({
      query: z.literal('games'),
      metaGame: z.string(),
      type: z.enum(['current', 'completed'])
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(FullGameSchema)
        }
      },
      description: 'List of games'
    }
  }
})

app.openapi(gamesRoute, async (c) => {
  const { metaGame, type } = c.req.valid('query')
  
  // Mock implementation
  if (type === 'current') {
    return c.json([{
      id: 'game1',
      metaGame,
      players: [
        { id: 'user1', name: 'Alice' },
        { id: 'user2', name: 'Bob' }
      ],
      state: {},
      toMove: ['user1'],
      gameStarted: Date.now() - 3600000,
      clockHard: false,
      clockStart: 172800,
      clockInc: 0,
      rated: true
    }])
  } else {
    return c.json([{
      id: 'game2',
      metaGame,
      players: [
        { id: 'user1', name: 'Alice' },
        { id: 'user2', name: 'Bob' }
      ],
      state: {},
      toMove: [],
      gameStarted: Date.now() - 86400000,
      gameEnded: Date.now() - 3600000,
      clockHard: false,
      clockStart: 172800,
      clockInc: 0,
      rated: true
    }])
  }
})

// Ratings endpoint
const ratingsRoute = createRoute({
  method: 'get',
  path: '/query',
  tags: ['Query'],
  summary: 'Get ratings',
  request: {
    query: z.object({
      query: z.literal('ratings'),
      metaGame: z.string()
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(z.object({
            userid: z.string(),
            rating: z.number(),
            games: z.number()
          }))
        }
      },
      description: 'Player ratings for a game'
    }
  }
})

app.openapi(ratingsRoute, async (c) => {
  const { metaGame } = c.req.valid('query')
  
  // Mock ratings
  return c.json([
    { userid: 'user1', rating: 1650, games: 150 },
    { userid: 'user2', rating: 1500, games: 89 }
  ])
})

// Meta games details endpoint
const metaGamesRoute = createRoute({
  method: 'get',
  path: '/query',
  tags: ['Query'],
  summary: 'Get meta games details',
  request: {
    query: z.object({
      query: z.literal('meta_games')
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.record(z.string(), GameMetaInfoSchema)
        }
      },
      description: 'Detailed information about all games'
    }
  }
})

app.openapi(metaGamesRoute, async (c) => {
  // Mock game metadata
  return c.json({
    chess: {
      id: 'chess',
      name: 'Chess',
      description: 'Classic strategy game',
      urls: ['https://en.wikipedia.org/wiki/Chess'],
      people: [{ type: 'designer', name: 'Traditional' }],
      flags: ['check', 'custom-buttons'],
      categories: ['classic', 'perfect-information'],
      mechanics: ['capture', 'different-pieces'],
      variants: [
        { name: 'standard', description: 'Standard chess' },
        { name: 'chess960', description: 'Fischer Random Chess' }
      ]
    },
    go: {
      id: 'go',
      name: 'Go',
      description: 'Ancient territorial game',
      urls: ['https://en.wikipedia.org/wiki/Go_(game)'],
      people: [{ type: 'designer', name: 'Traditional' }],
      flags: ['scores', 'custom-buttons'],
      categories: ['classic', 'perfect-information'],
      mechanics: ['surround', 'pattern-building']
    }
  })
})

// Get specific game endpoint
const getGameRoute = createRoute({
  method: 'get',
  path: '/query',
  tags: ['Query'],
  summary: 'Get specific game',
  request: {
    query: z.object({
      query: z.literal('get_game'),
      id: z.string()
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: FullGameSchema
        }
      },
      description: 'Game details'
    }
  }
})

app.openapi(getGameRoute, async (c) => {
  const { id } = c.req.valid('query')
  
  // Mock game data
  return c.json({
    id,
    metaGame: 'chess',
    players: [
      { id: 'user1', name: 'Alice', time: 86400 },
      { id: 'user2', name: 'Bob', time: 85000 }
    ],
    state: {},
    toMove: ['user1'],
    gameStarted: Date.now() - 3600000,
    clockHard: false,
    clockStart: 172800,
    clockInc: 0,
    rated: true
  })
})

// Get public exploration endpoint
const getPublicExplorationRoute = createRoute({
  method: 'get',
  path: '/query',
  tags: ['Query'],
  summary: 'Get public exploration',
  request: {
    query: z.object({
      query: z.literal('get_public_exploration'),
      id: z.string()
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ExplorationSchema
        }
      },
      description: 'Public exploration data'
    }
  }
})

app.openapi(getPublicExplorationRoute, async (c) => {
  const { id } = c.req.valid('query')
  
  // Mock exploration
  return c.json({
    id,
    metaGame: 'chess',
    state: {},
    dateCreated: Date.now() - 86400000,
    dateModified: Date.now() - 3600000,
    userId: 'user1',
    userName: 'Alice',
    isPublic: true,
    title: 'Interesting endgame position',
    published: true
  })
})

// Bot move endpoint
const botMoveRoute = createRoute({
  method: 'get',
  path: '/query',
  tags: ['Query'],
  summary: 'Get bot move',
  request: {
    query: z.object({
      query: z.literal('bot_move'),
      game: z.string(),
      state: z.string(),
      level: z.string().regex(/^\d+$/).optional().default('5').transform(Number)
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            move: z.string()
          })
        }
      },
      description: 'Bot move suggestion'
    }
  }
})

app.openapi(botMoveRoute, async (c) => {
  const { game, state, level } = c.req.valid('query')
  
  // Mock bot move - in reality would call AI service
  return c.json({
    move: 'e2-e4'
  })
})

// Get tournaments endpoint
const getTournamentsRoute = createRoute({
  method: 'get',
  path: '/query',
  tags: ['Query'],
  summary: 'Get active tournaments',
  request: {
    query: z.object({
      query: z.literal('get_tournaments')
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(TournamentSchema)
        }
      },
      description: 'List of active tournaments'
    }
  }
})

app.openapi(getTournamentsRoute, async (c) => {
  return c.json(Array.from(tournaments.values()).filter(t => !t.dateEnded))
})

// Get specific tournament endpoint
const getTournamentRoute = createRoute({
  method: 'get',
  path: '/query',
  tags: ['Query'],
  summary: 'Get specific tournament',
  request: {
    query: z.object({
      query: z.literal('get_tournament'),
      id: z.string()
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
    }
  }
})

app.openapi(getTournamentRoute, async (c) => {
  const { id } = c.req.valid('query')
  const tournament = tournaments.get(id)
  
  if (!tournament) {
    return c.json({
      error: {
        code: 'NOT_FOUND',
        message: 'Tournament not found'
      },
      timestamp: new Date().toISOString()
    }, 404)
  }
  
  return c.json(tournament)
})

// Get events endpoint
const getEventsRoute = createRoute({
  method: 'get',
  path: '/query',
  tags: ['Query'],
  summary: 'Get events',
  request: {
    query: z.object({
      query: z.literal('get_events')
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(OrgEventSchema)
        }
      },
      description: 'List of events'
    }
  }
})

app.openapi(getEventsRoute, async (c) => {
  return c.json(Array.from(events.values()).filter(e => e.visible))
})

// Get specific event endpoint
const getEventRoute = createRoute({
  method: 'get',
  path: '/query',
  tags: ['Query'],
  summary: 'Get specific event',
  request: {
    query: z.object({
      query: z.literal('get_event'),
      id: z.string()
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
    }
  }
})

app.openapi(getEventRoute, async (c) => {
  const { id } = c.req.valid('query')
  const event = events.get(id)
  
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

// Report problem endpoint
const reportProblemRoute = createRoute({
  method: 'get',
  path: '/query',
  tags: ['Query'],
  summary: 'Report a problem',
  request: {
    query: z.object({
      query: z.literal('report_problem'),
      type: z.string(),
      message: z.string(),
      details: z.string().optional()
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            id: z.string()
          })
        }
      },
      description: 'Problem report submitted'
    }
  }
})

app.openapi(reportProblemRoute, async (c) => {
  const { type, message, details } = c.req.valid('query')
  
  // In reality, would save to database or send notification
  console.log('Problem report:', { type, message, details })
  
  return c.json({
    success: true,
    id: crypto.randomUUID()
  })
})

export default app