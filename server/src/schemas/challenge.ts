import { z } from '@hono/zod-openapi'
import { UserSchema } from './user'

export const ChallengeSchema = z.object({
  metaGame: z.string(),
  standing: z.boolean().optional(),
  challenger: UserSchema,
  players: z.array(UserSchema),
  challengees: z.array(UserSchema).optional()
}).openapi('Challenge')

export const FullChallengeSchema = z.object({
  pk: z.string().optional(),
  sk: z.string().optional(),
  metaGame: z.string(),
  numPlayers: z.number().int(),
  standing: z.boolean().optional(),
  duration: z.number().optional(),
  seating: z.string(),
  variants: z.array(z.string()),
  challenger: UserSchema,
  challengees: z.array(UserSchema).optional(),
  players: z.array(UserSchema).optional(),
  clockStart: z.number(),
  clockInc: z.number(),
  clockMax: z.number(),
  clockHard: z.boolean(),
  rated: z.boolean(),
  noExplore: z.boolean().optional(),
  comment: z.string().optional(),
  dateIssued: z.number().optional()
}).openapi('FullChallenge')

// Standing challenge for SDG-style challenges
export const StandingChallengeSchema = z.object({
  id: z.string(),
  metaGame: z.string(),
  numPlayers: z.number().int(),
  variants: z.array(z.string()).optional(),
  clockStart: z.number(),
  clockInc: z.number(),
  clockMax: z.number(),
  clockHard: z.boolean(),
  rated: z.boolean(),
  noExplore: z.boolean().optional(),
  limit: z.number(),
  sensitivity: z.enum(['meta', 'variants']),
  suspended: z.boolean()
}).openapi('StandingChallenge')

export const StandingChallengeRecSchema = z.object({
  pk: z.literal('REALSTANDING'),
  sk: z.string(),
  standing: z.array(StandingChallengeSchema)
}).openapi('StandingChallengeRec')

// Challenge requests
export const NewChallengeRequestSchema = z.object({
  metaGame: z.string(),
  numPlayers: z.number().int().min(2),
  challengees: z.array(z.string()),
  variants: z.array(z.string()).default([]),
  clockStart: z.number().default(172800), // 2 days default
  clockInc: z.number().default(0),
  clockMax: z.number().default(604800), // 7 days default
  clockHard: z.boolean().default(false),
  rated: z.boolean().default(true),
  noExplore: z.boolean().default(false),
  seating: z.enum(['random', 'as-entered']).default('random'),
  comment: z.string().optional()
}).openapi('NewChallengeRequest')

export const ChallengeResponseSchema = z.object({
  challengeId: z.string(),
  accept: z.boolean()
}).openapi('ChallengeResponse')