import { z } from '@hono/zod-openapi'

export const ExplorationSchema = z.object({
  id: z.string(),
  metaGame: z.string(),
  state: z.any(),
  dateCreated: z.number(),
  dateModified: z.number(),
  userId: z.string(),
  userName: z.string().optional(),
  isPublic: z.boolean().default(false),
  title: z.string().optional(),
  description: z.string().optional(),
  published: z.boolean().optional()
}).openapi('Exploration')

export const SaveExplorationRequestSchema = z.object({
  id: z.string().optional(),
  metaGame: z.string(),
  state: z.any(),
  isPublic: z.boolean().default(false),
  title: z.string().optional(),
  description: z.string().optional()
}).openapi('SaveExplorationRequest')

export const PlaygroundSchema = z.object({
  pk: z.literal('PLAYGROUND'),
  sk: z.string(),
  games: z.record(z.string(), z.any())
}).openapi('Playground')

export const CommentSchema = z.object({
  user: z.string(),
  comment: z.string(),
  timestamp: z.number()
}).openapi('Comment')

export const GameNoteSchema = z.object({
  gameId: z.string(),
  userId: z.string(),
  note: z.string(),
  lastUpdated: z.number()
}).openapi('GameNote')