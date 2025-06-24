import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { z } from '@hono/zod-openapi'
import { PushSubscriptionSchema } from '../schemas/user'
import { ErrorSchema } from '../schemas/common'

const app = new OpenAPIHono()

// In-memory storage for push subscriptions
const pushSubscriptions = new Map<string, any>()

// Save push subscription
const savePushSubscriptionRoute = createRoute({
  method: 'post',
  path: '/push/subscribe',
  tags: ['Push Notifications'],
  summary: 'Save push notification subscription',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: PushSubscriptionSchema
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
      description: 'Subscription saved'
    }
  }
})

app.openapi(savePushSubscriptionRoute, async (c) => {
  const userId = c.get('userId') || 'user1'
  const subscription = c.req.valid('json')
  
  pushSubscriptions.set(userId, subscription)
  
  return c.json({ success: true })
})

// Remove push subscription
const removePushSubscriptionRoute = createRoute({
  method: 'delete',
  path: '/push/subscribe',
  tags: ['Push Notifications'],
  summary: 'Remove push notification subscription',
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
      description: 'Subscription removed'
    }
  }
})

app.openapi(removePushSubscriptionRoute, async (c) => {
  const userId = c.get('userId') || 'user1'
  
  pushSubscriptions.delete(userId)
  
  return c.json({ success: true })
})

// Test push notification
const testPushRoute = createRoute({
  method: 'post',
  path: '/push/test',
  tags: ['Push Notifications'],
  summary: 'Send test push notification',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            title: z.string().optional().default('Test Notification'),
            body: z.string().optional().default('This is a test push notification'),
            data: z.any().optional()
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
            sent: z.number()
          })
        }
      },
      description: 'Test notification sent'
    }
  }
})

app.openapi(testPushRoute, async (c) => {
  const userId = c.get('userId') || 'user1'
  const { title, body, data } = c.req.valid('json')
  
  const subscription = pushSubscriptions.get(userId)
  if (!subscription) {
    return c.json({ success: false, sent: 0 })
  }
  
  // In production, would use web-push library to send notification
  console.log('Would send push notification:', { title, body, data, subscription })
  
  return c.json({ success: true, sent: 1 })
})

// Push notification settings
const updatePushSettingsRoute = createRoute({
  method: 'put',
  path: '/push/settings',
  tags: ['Push Notifications'],
  summary: 'Update push notification settings',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            gameStart: z.boolean().optional(),
            gameEnd: z.boolean().optional(),
            yourTurn: z.boolean().optional(),
            challenges: z.boolean().optional(),
            tournamentStart: z.boolean().optional(),
            tournamentEnd: z.boolean().optional()
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
      description: 'Settings updated'
    }
  }
})

app.openapi(updatePushSettingsRoute, async (c) => {
  const userId = c.get('userId') || 'user1'
  const settings = c.req.valid('json')
  
  // Would update user settings in database
  console.log('Updating push settings for user:', userId, settings)
  
  return c.json({ success: true })
})

// Helper function to send push notifications (called from other parts of the app)
export async function sendPushNotification(
  userId: string, 
  notification: {
    title: string
    body: string
    icon?: string
    badge?: string
    data?: any
  }
) {
  const subscription = pushSubscriptions.get(userId)
  if (!subscription) {
    return false
  }
  
  try {
    // In production, use web-push library
    // await webpush.sendNotification(subscription, JSON.stringify(notification))
    console.log('Sending push notification to', userId, notification)
    return true
  } catch (error) {
    console.error('Failed to send push notification:', error)
    return false
  }
}

// Batch send notifications
export async function sendPushNotifications(
  userIds: string[],
  notification: {
    title: string
    body: string
    icon?: string
    badge?: string
    data?: any
  }
) {
  const promises = userIds.map(userId => sendPushNotification(userId, notification))
  const results = await Promise.allSettled(promises)
  
  return {
    sent: results.filter(r => r.status === 'fulfilled' && r.value).length,
    failed: results.filter(r => r.status === 'rejected' || !r.value).length
  }
}

export default app