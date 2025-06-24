import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { z } from '@hono/zod-openapi'
import { UserSchema, UserSettingsSchema, PushSubscriptionSchema, MetaGameCountsSchema } from '../schemas/user'
import { NewChallengeRequestSchema, ChallengeResponseSchema, StandingChallengeSchema } from '../schemas/challenge'
import { SubmitMoveRequestSchema, FullGameSchema } from '../schemas/game'
import { NewTournamentRequestSchema, JoinTournamentRequestSchema } from '../schemas/tournament'
import { SaveExplorationRequestSchema, ExplorationSchema, PlaygroundSchema } from '../schemas/exploration'
import { CreateEventRequestSchema, EventRegisterRequestSchema, EventCreateGamesRequestSchema } from '../schemas/event'
import { ErrorSchema } from '../schemas/common'

const app = new OpenAPIHono()

// Mock data stores
const userSettings = new Map<string, any>()
const userProfiles = new Map<string, any>()
const challenges = new Map<string, any>()
const explorations = new Map<string, any>()
const playgrounds = new Map<string, any>()
const pushSubscriptions = new Map<string, any>()

// Me endpoint - get current user info
const meRoute = createRoute({
  method: 'post',
  path: '/authQuery',
  tags: ['Auth Query'],
  summary: 'Get current user info',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            query: z.literal('me'),
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
          schema: UserSchema
        }
      },
      description: 'Current user info'
    }
  }
})

app.openapi(meRoute, async (c) => {
  const userId = c.get('userId') // Assume middleware sets this
  
  // Mock user data
  return c.json({
    id: userId || 'user1',
    name: 'Alice',
    email: 'alice@example.com',
    country: 'US',
    lastSeen: Date.now(),
    stars: 5,
    settings: userSettings.get(userId) || {}
  })
})

// Next game endpoint
const nextGameRoute = createRoute({
  method: 'post',
  path: '/authQuery',
  tags: ['Auth Query'],
  summary: 'Get next game where it\'s your turn',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            query: z.literal('next_game'),
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
          schema: z.object({
            gameId: z.string().optional(),
            metaGame: z.string().optional()
          })
        }
      },
      description: 'Next game info'
    }
  }
})

app.openapi(nextGameRoute, async (c) => {
  // Mock implementation - would find next game where it's user's turn
  return c.json({
    gameId: 'game123',
    metaGame: 'chess'
  })
})

// My settings endpoint
const mySettingsRoute = createRoute({
  method: 'post',
  path: '/authQuery',
  tags: ['Auth Query'],
  summary: 'Get user settings',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            query: z.literal('my_settings'),
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
          schema: UserSettingsSchema
        }
      },
      description: 'User settings'
    }
  }
})

app.openapi(mySettingsRoute, async (c) => {
  const userId = c.get('userId')
  
  return c.json(userSettings.get(userId) || {
    all: {
      color: '#007bff',
      annotate: true,
      notifications: {
        gameStart: true,
        gameEnd: true,
        challenges: true,
        yourturn: true,
        tournamentStart: true,
        tournamentEnd: true
      }
    }
  })
})

// New setting endpoint
const newSettingRoute = createRoute({
  method: 'post',
  path: '/authQuery',
  tags: ['Auth Query'],
  summary: 'Update user setting',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            query: z.literal('new_setting'),
            pars: z.object({
              metaGame: z.string().optional(),
              setting: z.string(),
              value: z.any()
            })
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
      description: 'Setting updated'
    }
  }
})

app.openapi(newSettingRoute, async (c) => {
  const userId = c.get('userId')
  const { metaGame, setting, value } = c.req.valid('json').pars
  
  const settings = userSettings.get(userId) || {}
  if (metaGame) {
    settings[metaGame] = settings[metaGame] || {}
    settings[metaGame][setting] = value
  } else {
    settings.all = settings.all || {}
    settings.all[setting] = value
  }
  userSettings.set(userId, settings)
  
  return c.json({ success: true })
})

// New profile endpoint
const newProfileRoute = createRoute({
  method: 'post',
  path: '/authQuery',
  tags: ['Auth Query'],
  summary: 'Update user profile',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            query: z.literal('new_profile'),
            pars: z.object({
              name: z.string().optional(),
              country: z.string().optional(),
              about: z.string().optional(),
              bggid: z.string().optional()
            })
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
      description: 'Profile updated'
    }
  }
})

app.openapi(newProfileRoute, async (c) => {
  const userId = c.get('userId')
  const updates = c.req.valid('json').pars
  
  const profile = userProfiles.get(userId) || {}
  Object.assign(profile, updates)
  userProfiles.set(userId, profile)
  
  return c.json({ success: true })
})

// Save push subscription
const savePushRoute = createRoute({
  method: 'post',
  path: '/authQuery',
  tags: ['Auth Query'],
  summary: 'Save push notification subscription',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            query: z.literal('save_push'),
            pars: PushSubscriptionSchema
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
      description: 'Push subscription saved'
    }
  }
})

app.openapi(savePushRoute, async (c) => {
  const userId = c.get('userId')
  const subscription = c.req.valid('json').pars
  
  pushSubscriptions.set(userId, subscription)
  
  return c.json({ success: true })
})

// New challenge endpoint
const newChallengeRoute = createRoute({
  method: 'post',
  path: '/authQuery',
  tags: ['Auth Query'],
  summary: 'Create new challenge',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            query: z.literal('new_challenge'),
            pars: NewChallengeRequestSchema
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
            challengeId: z.string()
          })
        }
      },
      description: 'Challenge created'
    }
  }
})

app.openapi(newChallengeRoute, async (c) => {
  const userId = c.get('userId')
  const challenge = c.req.valid('json').pars
  
  const challengeId = crypto.randomUUID()
  challenges.set(challengeId, {
    ...challenge,
    pk: 'CHALLENGE',
    sk: challengeId,
    challenger: { id: userId, name: 'Challenger' },
    dateIssued: Date.now()
  })
  
  return c.json({ challengeId })
})

// Challenge response endpoint
const challengeResponseRoute = createRoute({
  method: 'post',
  path: '/authQuery',
  tags: ['Auth Query'],
  summary: 'Respond to challenge',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            query: z.literal('challenge_response'),
            pars: ChallengeResponseSchema
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
            gameId: z.string().optional()
          })
        }
      },
      description: 'Challenge response processed'
    }
  }
})

app.openapi(challengeResponseRoute, async (c) => {
  const userId = c.get('userId')
  const { challengeId, accept } = c.req.valid('json').pars
  
  const challenge = challenges.get(challengeId)
  if (!challenge) {
    return c.json({
      error: {
        code: 'NOT_FOUND',
        message: 'Challenge not found'
      },
      timestamp: new Date().toISOString()
    }, 404)
  }
  
  if (accept) {
    // Create game from challenge
    const gameId = crypto.randomUUID()
    return c.json({ success: true, gameId })
  } else {
    // Mark challenge as declined
    challenges.delete(challengeId)
    return c.json({ success: true })
  }
})

// Submit move endpoint
const submitMoveRoute = createRoute({
  method: 'post',
  path: '/authQuery',
  tags: ['Auth Query'],
  summary: 'Submit a move',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            query: z.literal('submit_move'),
            pars: SubmitMoveRequestSchema
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
            gameOver: z.boolean().optional(),
            winner: z.array(z.string()).optional()
          })
        }
      },
      description: 'Move submitted'
    }
  }
})

app.openapi(submitMoveRoute, async (c) => {
  const userId = c.get('userId')
  const { move, gameId } = c.req.valid('json').pars
  
  // Mock implementation - would validate and apply move
  return c.json({
    success: true,
    gameOver: false
  })
})

// Save exploration endpoint
const saveExplorationRoute = createRoute({
  method: 'post',
  path: '/authQuery',
  tags: ['Auth Query'],
  summary: 'Save game exploration',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            query: z.literal('save_exploration'),
            pars: SaveExplorationRequestSchema
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
            explorationId: z.string()
          })
        }
      },
      description: 'Exploration saved'
    }
  }
})

app.openapi(saveExplorationRoute, async (c) => {
  const userId = c.get('userId')
  const exploration = c.req.valid('json').pars
  
  const explorationId = exploration.id || crypto.randomUUID()
  explorations.set(explorationId, {
    ...exploration,
    id: explorationId,
    userId,
    dateCreated: Date.now(),
    dateModified: Date.now()
  })
  
  return c.json({ explorationId })
})

// Get playground endpoint
const getPlaygroundRoute = createRoute({
  method: 'post',
  path: '/authQuery',
  tags: ['Auth Query'],
  summary: 'Get user playground',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            query: z.literal('get_playground'),
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
          schema: PlaygroundSchema
        }
      },
      description: 'Playground data'
    }
  }
})

app.openapi(getPlaygroundRoute, async (c) => {
  const userId = c.get('userId')
  
  return c.json(playgrounds.get(userId) || {
    pk: 'PLAYGROUND',
    sk: userId,
    games: {}
  })
})

// New tournament endpoint
const newTournamentRoute = createRoute({
  method: 'post',
  path: '/authQuery',
  tags: ['Auth Query'],
  summary: 'Create new tournament',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            query: z.literal('new_tournament'),
            pars: NewTournamentRequestSchema
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
            tournamentId: z.string()
          })
        }
      },
      description: 'Tournament created'
    }
  }
})

app.openapi(newTournamentRoute, async (c) => {
  const userId = c.get('userId')
  const tournament = c.req.valid('json').pars
  
  const tournamentId = crypto.randomUUID()
  // Mock tournament creation
  
  return c.json({ tournamentId })
})

// Join tournament endpoint
const joinTournamentRoute = createRoute({
  method: 'post',
  path: '/authQuery',
  tags: ['Auth Query'],
  summary: 'Join tournament',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            query: z.literal('join_tournament'),
            pars: JoinTournamentRequestSchema
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
      description: 'Joined tournament'
    }
  }
})

app.openapi(joinTournamentRoute, async (c) => {
  const userId = c.get('userId')
  const { tournamentId } = c.req.valid('json').pars
  
  // Mock joining tournament
  return c.json({ success: true })
})

// Event create endpoint
const eventCreateRoute = createRoute({
  method: 'post',
  path: '/authQuery',
  tags: ['Auth Query'],
  summary: 'Create event',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            query: z.literal('event_create'),
            pars: CreateEventRequestSchema
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
            eventId: z.string()
          })
        }
      },
      description: 'Event created'
    }
  }
})

app.openapi(eventCreateRoute, async (c) => {
  const userId = c.get('userId')
  const event = c.req.valid('json').pars
  
  const eventId = crypto.randomUUID()
  // Mock event creation
  
  return c.json({ eventId })
})

// Toggle star endpoint
const toggleStarRoute = createRoute({
  method: 'post',
  path: '/authQuery',
  tags: ['Auth Query'],
  summary: 'Toggle game star',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            query: z.literal('toggle_star'),
            pars: z.object({
              metaGame: z.string()
            })
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
            starred: z.boolean()
          })
        }
      },
      description: 'Star toggled'
    }
  }
})

app.openapi(toggleStarRoute, async (c) => {
  const userId = c.get('userId')
  const { metaGame } = c.req.valid('json').pars
  
  // Mock star toggle
  return c.json({ starred: true })
})

// Update standing challenges
const updateStandingRoute = createRoute({
  method: 'post',
  path: '/authQuery',
  tags: ['Auth Query'],
  summary: 'Update standing challenges',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            query: z.literal('update_standing'),
            pars: z.object({
              standing: z.array(StandingChallengeSchema)
            })
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
      description: 'Standing challenges updated'
    }
  }
})

app.openapi(updateStandingRoute, async (c) => {
  const userId = c.get('userId')
  const { standing } = c.req.valid('json').pars
  
  // Store standing challenges
  return c.json({ success: true })
})

export default app