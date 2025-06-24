import { z } from '@hono/zod-openapi'

export const GameSummarySchema = z.object({
  id: z.string().openapi({ example: 'chess' }),
  name: z.string().openapi({ example: 'Chess' }),
  version: z.string().openapi({ example: '1.0.0' }),
  minPlayers: z.number().int().min(2),
  maxPlayers: z.number().int().min(2),
  variants: z.array(z.string()).optional(),
  pluginUrl: z.string().url().optional()
}).openapi('GameSummary')

export const GameDetailsSchema = GameSummarySchema.extend({
  description: z.string().optional(),
  rules: z.string().url().optional(),
  protocol: z.string().optional(),
  capabilities: z.object({
    ai: z.boolean().optional(),
    variants: z.boolean().optional(),
    analysis: z.boolean().optional(),
    timeControl: z.boolean().optional()
  }).optional()
}).openapi('GameDetails')

export const GameListSchema = z.object({
  games: z.array(GameSummarySchema),
  total: z.number().int(),
  page: z.number().int(),
  pageSize: z.number().int()
}).openapi('GameList')

export const TimeControlSchema = z.object({
  type: z.enum(['none', 'absolute', 'increment', 'byoyomi']),
  initial: z.number().optional(),
  increment: z.number().optional()
}).openapi('TimeControl')

export const PlayerInfoSchema = z.object({
  id: z.string(),
  name: z.string()
}).openapi('PlayerInfo')

export const CreateGameRequestSchema = z.object({
  gameId: z.string(),
  variant: z.string().optional(),
  players: z.array(PlayerInfoSchema).min(2),
  timeControl: TimeControlSchema.optional(),
  metadata: z.record(z.any()).optional()
}).openapi('CreateGameRequest')

export const GameInstanceSchema = z.object({
  instanceId: z.string().uuid(),
  gameId: z.string(),
  state: z.enum(['active', 'completed', 'abandoned']),
  currentPlayer: z.number().int().min(1),
  createdAt: z.string().datetime(),
  joinUrl: z.string().url().optional()
}).openapi('GameInstance')

export const MoveHistorySchema = z.object({
  player: z.number().int(),
  move: z.string(),
  timestamp: z.string().datetime()
}).openapi('MoveHistory')

export const GameStateSchema = GameInstanceSchema.extend({
  moveCount: z.number().int(),
  lastMove: z.string().optional(),
  gameState: z.any(),
  history: z.array(MoveHistorySchema),
  comments: z.array(z.object({
    user: z.string(),
    comment: z.string(),
    timestamp: z.number()
  })).optional(),
  pie: z.boolean().optional(),
  noExplore: z.boolean().optional(),
  tournament: z.string().optional(),
  event: z.string().optional()
}).openapi('GameState')

export const MoveRequestSchema = z.object({
  playerId: z.string(),
  notation: z.string(),
  timestamp: z.string().datetime().optional()
}).openapi('MoveRequest')

export const MoveResponseSchema = z.object({
  success: z.boolean(),
  gameState: z.any(),
  gameOver: z.boolean(),
  winners: z.array(z.number().int()).optional(),
  legalMoves: z.array(z.string()).optional()
}).openapi('MoveResponse')

export const MoveDetailSchema = z.object({
  notation: z.string(),
  from: z.string().optional(),
  to: z.string().optional(),
  piece: z.string().optional()
}).openapi('MoveDetail')

export const LegalMovesSchema = z.object({
  moves: z.array(MoveDetailSchema),
  count: z.number().int()
}).openapi('LegalMoves')

export const RenderResponseSchema = z.object({
  format: z.string(),
  data: z.string(),
  metadata: z.object({
    width: z.number().int().optional(),
    height: z.number().int().optional(),
    lastMove: z.object({
      from: z.string(),
      to: z.string()
    }).optional()
  }).optional()
}).openapi('RenderResponse')

// Extended game features
export const FullGameSchema = z.object({
  id: z.string(),
  pk: z.string().optional(),
  sk: z.string().optional(),
  metaGame: z.string(),
  players: z.array(z.object({
    id: z.string(),
    name: z.string(),
    time: z.number().optional()
  })),
  state: z.any(),
  toMove: z.array(z.string()),
  gameStarted: z.number(),
  gameEnded: z.number().optional(),
  variants: z.array(z.string()).optional(),
  clockHard: z.boolean(),
  clockStart: z.number(),
  clockInc: z.number(),
  clockMax: z.number().optional(),
  noExplore: z.boolean().optional(),
  rated: z.boolean(),
  pie: z.boolean().optional(),
  tournament: z.string().optional(),
  event: z.string().optional(),
  numMoves: z.number().optional()
}).openapi('FullGame')

export const GameMetaInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  urls: z.array(z.string()).optional(),
  people: z.array(z.object({
    type: z.string(),
    name: z.string()
  })).optional(),
  flags: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  mechanics: z.array(z.string()).optional(),
  displays: z.array(z.any()).optional(),
  variants: z.array(z.object({
    name: z.string(),
    description: z.string().optional()
  })).optional()
}).openapi('GameMetaInfo')

export const SubmitMoveRequestSchema = z.object({
  move: z.string(),
  gameId: z.string(),
  auth: z.string().optional()
}).openapi('SubmitMoveRequest')

export const BotMoveRequestSchema = z.object({
  game: z.string(),
  state: z.any(),
  level: z.number().int().min(0).max(10).default(5)
}).openapi('BotMoveRequest')