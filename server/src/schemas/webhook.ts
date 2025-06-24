import { z } from '@hono/zod-openapi'

export const WebhookEventSchema = z.enum([
  'move.made',
  'game.over',
  'player.joined',
  'player.left',
  'game.abandoned'
])

export const WebhookRegistrationSchema = z.object({
  url: z.string().url(),
  events: z.array(WebhookEventSchema),
  secret: z.string().optional()
}).openapi('WebhookRegistration')

export const WebhookResponseSchema = z.object({
  id: z.string(),
  url: z.string(),
  events: z.array(z.string()),
  createdAt: z.string().datetime()
}).openapi('WebhookResponse')