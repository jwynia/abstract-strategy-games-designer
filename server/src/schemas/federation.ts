import { z } from '@hono/zod-openapi'

export const FederatedServerSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string().url(),
  status: z.enum(['online', 'offline', 'maintenance']),
  games: z.array(z.string()).optional()
}).openapi('FederatedServer')

export const FederatedServerListSchema = z.object({
  servers: z.array(FederatedServerSchema)
}).openapi('FederatedServerList')

export const CreateFederatedGameRequestSchema = z.object({
  gameId: z.string(),
  localPlayer: z.string(),
  remotePlayer: z.string().describe('Format: player@server'),
  remoteServer: z.string()
}).openapi('CreateFederatedGameRequest')