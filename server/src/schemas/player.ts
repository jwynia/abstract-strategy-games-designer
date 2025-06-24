import { z } from '@hono/zod-openapi'
import { GameInstanceSchema } from './game'

export const PlayerStatsSchema = z.object({
  gamesPlayed: z.number().int(),
  winRate: z.number().min(0).max(1)
}).openapi('PlayerStats')

export const PlayerProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  rating: z.record(z.string(), z.number().int()).optional(),
  stats: PlayerStatsSchema.optional()
}).openapi('PlayerProfile')

export const PlayerGamesListSchema = z.object({
  games: z.array(GameInstanceSchema),
  total: z.number().int(),
  page: z.number().int()
}).openapi('PlayerGamesList')