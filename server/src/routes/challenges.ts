import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { z } from '@hono/zod-openapi'
import { FullChallengeSchema, NewChallengeRequestSchema, ChallengeResponseSchema, StandingChallengeSchema } from '../schemas/challenge'
import { ErrorSchema } from '../schemas/common'

const app = new OpenAPIHono()

// Create challenge
const createChallengeRoute = createRoute({
  method: 'post',
  path: '/challenges',
  tags: ['Challenges'],
  summary: 'Create a new challenge',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: NewChallengeRequestSchema
        }
      }
    }
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: z.object({
            challengeId: z.string(),
            challenge: FullChallengeSchema
          })
        }
      },
      description: 'Challenge created'
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

app.openapi(createChallengeRoute, async (c) => {
  const userId = c.get('userId') || 'user1'
  const { challenge } = c.get('services')
  const challengeData = c.req.valid('json')
  
  try {
    const challengeId = await challenge.createChallenge(userId, challengeData)
    const createdChallenge = await challenge.getChallenge(challengeId)
    
    return c.json({
      challengeId,
      challenge: createdChallenge!
    }, 201)
  } catch (error) {
    return c.json({
      error: {
        code: 'CREATE_CHALLENGE_ERROR',
        message: error instanceof Error ? error.message : 'Failed to create challenge'
      },
      timestamp: new Date().toISOString()
    }, 400)
  }
})

// Get challenge
const getChallengeRoute = createRoute({
  method: 'get',
  path: '/challenges/{challengeId}',
  tags: ['Challenges'],
  summary: 'Get challenge details',
  request: {
    params: z.object({
      challengeId: z.string()
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
    },
    404: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Challenge not found'
    }
  }
})

app.openapi(getChallengeRoute, async (c) => {
  const { challengeId } = c.req.valid('param')
  const { challenge } = c.get('services')
  
  const challengeData = await challenge.getChallenge(challengeId)
  
  if (!challengeData) {
    return c.json({
      error: {
        code: 'NOT_FOUND',
        message: 'Challenge not found'
      },
      timestamp: new Date().toISOString()
    }, 404)
  }
  
  return c.json(challengeData)
})

// List challenges
const listChallengesRoute = createRoute({
  method: 'get',
  path: '/challenges',
  tags: ['Challenges'],
  summary: 'List challenges',
  request: {
    query: z.object({
      status: z.enum(['pending', 'accepted', 'declined', 'all']).optional().default('pending'),
      metaGame: z.string().optional()
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            challenges: z.array(FullChallengeSchema),
            total: z.number()
          })
        }
      },
      description: 'List of challenges'
    }
  }
})

app.openapi(listChallengesRoute, async (c) => {
  const { status, metaGame } = c.req.valid('query')
  const { challenge } = c.get('services')
  const userId = c.get('userId')
  
  const challenges = await challenge.listChallenges({
    status,
    metaGame,
    userId
  })
  
  return c.json({
    challenges,
    total: challenges.length
  })
})

// Respond to challenge
const respondChallengeRoute = createRoute({
  method: 'post',
  path: '/challenges/{challengeId}/respond',
  tags: ['Challenges'],
  summary: 'Accept or decline a challenge',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      challengeId: z.string()
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            accept: z.boolean()
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
      description: 'Response recorded'
    },
    404: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Challenge not found'
    }
  }
})

app.openapi(respondChallengeRoute, async (c) => {
  const userId = c.get('userId') || 'user2'
  const { challengeId } = c.req.valid('param')
  const { accept } = c.req.valid('json')
  const { challenge } = c.get('services')
  
  try {
    if (accept) {
      const result = await challenge.acceptChallenge(challengeId, userId)
      return c.json({
        success: true,
        ...result
      })
    } else {
      await challenge.declineChallenge(challengeId, userId)
      return c.json({ success: true })
    }
  } catch (error) {
    return c.json({
      error: {
        code: 'CHALLENGE_RESPONSE_ERROR',
        message: error instanceof Error ? error.message : 'Failed to respond to challenge'
      },
      timestamp: new Date().toISOString()
    }, 400)
  }
})

// Revoke challenge
const revokeChallengeRoute = createRoute({
  method: 'delete',
  path: '/challenges/{challengeId}',
  tags: ['Challenges'],
  summary: 'Revoke a challenge',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      challengeId: z.string()
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
      description: 'Challenge revoked'
    },
    403: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Not authorized'
    },
    404: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Challenge not found'
    }
  }
})

app.openapi(revokeChallengeRoute, async (c) => {
  const userId = c.get('userId') || 'user1'
  const { challengeId } = c.req.valid('param')
  const { challenge } = c.get('services')
  
  try {
    const canRevoke = await challenge.canUserRevokeChallenge(challengeId, userId)
    if (!canRevoke) {
      return c.json({
        error: {
          code: 'FORBIDDEN',
          message: 'Only the challenger can revoke'
        },
        timestamp: new Date().toISOString()
      }, 403)
    }
    
    await challenge.revokeChallenge(challengeId, userId)
    return c.json({ success: true })
  } catch (error) {
    return c.json({
      error: {
        code: 'REVOKE_ERROR',
        message: error instanceof Error ? error.message : 'Failed to revoke challenge'
      },
      timestamp: new Date().toISOString()
    }, 404)
  }
})

// Standing challenges endpoints
const getStandingChallengesRoute = createRoute({
  method: 'get',
  path: '/standing-challenges',
  tags: ['Challenges'],
  summary: 'Get standing challenges',
  request: {
    query: z.object({
      userId: z.string().optional(),
      metaGame: z.string().optional()
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            challenges: z.array(StandingChallengeSchema),
            total: z.number()
          })
        }
      },
      description: 'Standing challenges'
    }
  }
})

app.openapi(getStandingChallengesRoute, async (c) => {
  const { userId, metaGame } = c.req.valid('query')
  const { challenge } = c.get('services')
  
  const challenges = await challenge.getStandingChallenges(userId, metaGame)
  
  return c.json({
    challenges,
    total: challenges.length
  })
})

// Update standing challenges
const updateStandingChallengesRoute = createRoute({
  method: 'put',
  path: '/standing-challenges',
  tags: ['Challenges'],
  summary: 'Update standing challenges',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            challenges: z.array(StandingChallengeSchema)
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

app.openapi(updateStandingChallengesRoute, async (c) => {
  const userId = c.get('userId') || 'user1'
  const { challenges } = c.req.valid('json')
  const { challenge } = c.get('services')
  
  await challenge.updateStandingChallenges(userId, challenges)
  
  return c.json({ success: true })
})

export default app