import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { z } from '@hono/zod-openapi'
import { 
  ExplorationSchema, 
  SaveExplorationRequestSchema,
  PlaygroundSchema,
  CommentSchema,
  GameNoteSchema
} from '../schemas/exploration'
import { ErrorSchema, PaginationQuerySchema } from '../schemas/common'

const app = new OpenAPIHono()

// In-memory storage
const explorations = new Map<string, any>()
const playgrounds = new Map<string, any>()
const gameNotes = new Map<string, Map<string, any>>() // gameId -> userId -> note
const gameComments = new Map<string, any[]>() // gameId -> comments

// Save exploration
const saveExplorationRoute = createRoute({
  method: 'post',
  path: '/explorations',
  tags: ['Explorations'],
  summary: 'Save game exploration',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: SaveExplorationRequestSchema
        }
      }
    }
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: z.object({
            explorationId: z.string(),
            exploration: ExplorationSchema
          })
        }
      },
      description: 'Exploration saved'
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

app.openapi(saveExplorationRoute, async (c) => {
  const userId = c.get('userId') || 'user1'
  const explorationData = c.req.valid('json')
  
  const explorationId = explorationData.id || crypto.randomUUID()
  const exploration = {
    ...explorationData,
    id: explorationId,
    userId,
    userName: 'User',
    dateCreated: explorations.get(explorationId)?.dateCreated || Date.now(),
    dateModified: Date.now()
  }
  
  explorations.set(explorationId, exploration)
  
  return c.json({
    explorationId,
    exploration
  }, 201)
})

// Get exploration
const getExplorationRoute = createRoute({
  method: 'get',
  path: '/explorations/{explorationId}',
  tags: ['Explorations'],
  summary: 'Get exploration',
  request: {
    params: z.object({
      explorationId: z.string()
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ExplorationSchema
        }
      },
      description: 'Exploration details'
    },
    403: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Access denied'
    },
    404: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Exploration not found'
    }
  }
})

app.openapi(getExplorationRoute, async (c) => {
  const userId = c.get('userId')
  const { explorationId } = c.req.valid('param')
  
  const exploration = explorations.get(explorationId)
  if (!exploration) {
    return c.json({
      error: {
        code: 'NOT_FOUND',
        message: 'Exploration not found'
      },
      timestamp: new Date().toISOString()
    }, 404)
  }
  
  // Check access
  if (!exploration.isPublic && exploration.userId !== userId) {
    return c.json({
      error: {
        code: 'ACCESS_DENIED',
        message: 'This exploration is private'
      },
      timestamp: new Date().toISOString()
    }, 403)
  }
  
  return c.json(exploration)
})

// List explorations
const listExplorationsRoute = createRoute({
  method: 'get',
  path: '/explorations',
  tags: ['Explorations'],
  summary: 'List explorations',
  request: {
    query: PaginationQuerySchema.extend({
      metaGame: z.string().optional(),
      userId: z.string().optional(),
      publicOnly: z.string().optional().default('false').transform(v => v === 'true')
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            explorations: z.array(ExplorationSchema),
            total: z.number(),
            page: z.number(),
            pageSize: z.number()
          })
        }
      },
      description: 'List of explorations'
    }
  }
})

app.openapi(listExplorationsRoute, async (c) => {
  const currentUserId = c.get('userId')
  const { page, pageSize, metaGame, userId, publicOnly } = c.req.valid('query')
  
  let filtered = Array.from(explorations.values())
  
  if (metaGame) {
    filtered = filtered.filter(e => e.metaGame === metaGame)
  }
  
  if (userId) {
    filtered = filtered.filter(e => e.userId === userId)
  }
  
  if (publicOnly || !currentUserId) {
    filtered = filtered.filter(e => e.isPublic)
  } else {
    // Show public and own private explorations
    filtered = filtered.filter(e => e.isPublic || e.userId === currentUserId)
  }
  
  const startIndex = (page - 1) * pageSize
  const paginated = filtered.slice(startIndex, startIndex + pageSize)
  
  return c.json({
    explorations: paginated,
    total: filtered.length,
    page,
    pageSize
  })
})

// Delete exploration
const deleteExplorationRoute = createRoute({
  method: 'delete',
  path: '/explorations/{explorationId}',
  tags: ['Explorations'],
  summary: 'Delete exploration',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      explorationId: z.string()
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
      description: 'Exploration deleted'
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
      description: 'Exploration not found'
    }
  }
})

app.openapi(deleteExplorationRoute, async (c) => {
  const userId = c.get('userId')
  const { explorationId } = c.req.valid('param')
  
  const exploration = explorations.get(explorationId)
  if (!exploration) {
    return c.json({
      error: {
        code: 'NOT_FOUND',
        message: 'Exploration not found'
      },
      timestamp: new Date().toISOString()
    }, 404)
  }
  
  if (exploration.userId !== userId) {
    return c.json({
      error: {
        code: 'FORBIDDEN',
        message: 'Only the owner can delete'
      },
      timestamp: new Date().toISOString()
    }, 403)
  }
  
  explorations.delete(explorationId)
  return c.json({ success: true })
})

// Playground endpoints
const getPlaygroundRoute = createRoute({
  method: 'get',
  path: '/playground',
  tags: ['Explorations'],
  summary: 'Get user playground',
  security: [{ bearerAuth: [] }],
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
  const userId = c.get('userId') || 'user1'
  
  const playground = playgrounds.get(userId) || {
    pk: 'PLAYGROUND',
    sk: userId,
    games: {}
  }
  
  return c.json(playground)
})

// Create/update playground game
const updatePlaygroundRoute = createRoute({
  method: 'put',
  path: '/playground/{metaGame}',
  tags: ['Explorations'],
  summary: 'Update playground game',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      metaGame: z.string()
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            state: z.any()
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
      description: 'Playground updated'
    }
  }
})

app.openapi(updatePlaygroundRoute, async (c) => {
  const userId = c.get('userId') || 'user1'
  const { metaGame } = c.req.valid('param')
  const { state } = c.req.valid('json')
  
  const playground = playgrounds.get(userId) || {
    pk: 'PLAYGROUND',
    sk: userId,
    games: {}
  }
  
  playground.games[metaGame] = state
  playgrounds.set(userId, playground)
  
  return c.json({ success: true })
})

// Reset playground
const resetPlaygroundRoute = createRoute({
  method: 'delete',
  path: '/playground',
  tags: ['Explorations'],
  summary: 'Reset playground',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean()
          })
        }
      },
      description: 'Playground reset'
    }
  }
})

app.openapi(resetPlaygroundRoute, async (c) => {
  const userId = c.get('userId') || 'user1'
  
  playgrounds.set(userId, {
    pk: 'PLAYGROUND',
    sk: userId,
    games: {}
  })
  
  return c.json({ success: true })
})

// Game notes endpoints
const updateGameNoteRoute = createRoute({
  method: 'put',
  path: '/games/{gameId}/notes',
  tags: ['Explorations'],
  summary: 'Update game note',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      gameId: z.string()
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            note: z.string()
          })
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GameNoteSchema
        }
      },
      description: 'Note updated'
    }
  }
})

app.openapi(updateGameNoteRoute, async (c) => {
  const userId = c.get('userId') || 'user1'
  const { gameId } = c.req.valid('param')
  const { note } = c.req.valid('json')
  
  if (!gameNotes.has(gameId)) {
    gameNotes.set(gameId, new Map())
  }
  
  const noteData = {
    gameId,
    userId,
    note,
    lastUpdated: Date.now()
  }
  
  gameNotes.get(gameId)!.set(userId, noteData)
  
  return c.json(noteData)
})

// Get game note
const getGameNoteRoute = createRoute({
  method: 'get',
  path: '/games/{gameId}/notes',
  tags: ['Explorations'],
  summary: 'Get game note',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      gameId: z.string()
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GameNoteSchema.nullable()
        }
      },
      description: 'Game note'
    }
  }
})

app.openapi(getGameNoteRoute, async (c) => {
  const userId = c.get('userId') || 'user1'
  const { gameId } = c.req.valid('param')
  
  const gameNotesMap = gameNotes.get(gameId)
  const note = gameNotesMap?.get(userId)
  
  return c.json(note || null)
})

// Game comments endpoints
const addGameCommentRoute = createRoute({
  method: 'post',
  path: '/games/{gameId}/comments',
  tags: ['Explorations'],
  summary: 'Add game comment',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      gameId: z.string()
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            comment: z.string()
          })
        }
      }
    }
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: CommentSchema
        }
      },
      description: 'Comment added'
    }
  }
})

app.openapi(addGameCommentRoute, async (c) => {
  const userId = c.get('userId') || 'user1'
  const { gameId } = c.req.valid('param')
  const { comment } = c.req.valid('json')
  
  const commentData = {
    user: userId,
    comment,
    timestamp: Date.now()
  }
  
  if (!gameComments.has(gameId)) {
    gameComments.set(gameId, [])
  }
  
  gameComments.get(gameId)!.push(commentData)
  
  return c.json(commentData, 201)
})

// Get game comments
const getGameCommentsRoute = createRoute({
  method: 'get',
  path: '/games/{gameId}/comments',
  tags: ['Explorations'],
  summary: 'Get game comments',
  request: {
    params: z.object({
      gameId: z.string()
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            comments: z.array(CommentSchema),
            total: z.number()
          })
        }
      },
      description: 'Game comments'
    }
  }
})

app.openapi(getGameCommentsRoute, async (c) => {
  const { gameId } = c.req.valid('param')
  
  const comments = gameComments.get(gameId) || []
  
  return c.json({
    comments,
    total: comments.length
  })
})

export default app