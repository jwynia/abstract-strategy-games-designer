import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { WebhookRegistrationSchema, WebhookResponseSchema } from '../schemas/webhook'
import { ErrorSchema } from '../schemas/common'

const app = new OpenAPIHono()

// In-memory webhook storage
const webhooks = new Map<string, any>()

// Register webhook
const registerWebhookRoute = createRoute({
  method: 'post',
  path: '/webhooks',
  tags: ['Webhooks'],
  summary: 'Register webhook',
  description: 'Register a webhook for game events',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: WebhookRegistrationSchema
        }
      }
    }
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: WebhookResponseSchema
        }
      },
      description: 'Webhook registered'
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

app.openapi(registerWebhookRoute, async (c) => {
  const { url, events, secret } = c.req.valid('json')
  
  // Validate URL format
  try {
    new URL(url)
  } catch {
    return c.json({
      error: {
        code: 'INVALID_URL',
        message: 'Invalid webhook URL format'
      },
      timestamp: new Date().toISOString()
    }, 400)
  }
  
  // Create webhook
  const webhookId = crypto.randomUUID()
  const webhook = {
    id: webhookId,
    url,
    events,
    secret: secret || crypto.randomUUID(),
    createdAt: new Date().toISOString()
  }
  
  webhooks.set(webhookId, webhook)
  
  return c.json({
    id: webhookId,
    url,
    events,
    createdAt: webhook.createdAt
  }, 201)
})

// Helper function to trigger webhooks (would be called from game events)
export async function triggerWebhook(event: string, data: any) {
  const promises = []
  
  for (const [id, webhook] of webhooks) {
    if (webhook.events.includes(event)) {
      // In production, this would make actual HTTP requests
      promises.push(
        fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Event': event,
            'X-Webhook-Signature': `sha256=${createSignature(webhook.secret, data)}`
          },
          body: JSON.stringify({
            event,
            timestamp: new Date().toISOString(),
            data
          })
        }).catch(err => {
          console.error(`Webhook ${id} failed:`, err)
        })
      )
    }
  }
  
  await Promise.allSettled(promises)
}

function createSignature(secret: string, data: any): string {
  // In production, use proper HMAC SHA256
  return Buffer.from(`${secret}:${JSON.stringify(data)}`).toString('base64')
}

export default app