import { z } from '@hono/zod-openapi'

export const DivisionSchema = z.object({
  minRating: z.number().int(),
  maxPlayers: z.number().int(),
  started: z.boolean().optional()
}).openapi('Division')

export const TournamentSchema = z.object({
  pk: z.literal('TOURNAMENT'),
  sk: z.string(),
  id: z.string(),
  metaGame: z.string(),
  tname: z.string(),
  variants: z.array(z.string()).optional(),
  clockStart: z.number(),
  clockInc: z.number(),
  clockMax: z.number(),
  clockHard: z.boolean(),
  noExplore: z.boolean().optional(),
  dateCreated: z.number(),
  dateStarted: z.number().optional(),
  nextRound: z.number().optional(),
  divisions: z.record(z.number(), DivisionSchema).optional(),
  players: z.array(z.object({
    pk: z.string(),
    sk: z.string(),
    playerid: z.string(),
    playername: z.string(),
    once: z.boolean().optional(),
    division: z.number().optional(),
    score: z.number().optional(),
    tiebreak: z.number().optional(),
    rating: z.number().optional(),
    timeout: z.boolean().optional()
  })).optional(),
  waiting: z.boolean().optional()
}).openapi('Tournament')

export const TournamentPlayerSchema = z.object({
  pk: z.string(),
  sk: z.string(),
  playerid: z.string(),
  playername: z.string(),
  once: z.boolean().optional(),
  division: z.number().optional(),
  score: z.number().optional(),
  tiebreak: z.number().optional(),
  rating: z.number().optional(),
  timeout: z.boolean().optional()
}).openapi('TournamentPlayer')

export const TournamentGameSchema = z.object({
  pk: z.string(),
  sk: z.string(),
  gameid: z.string(),
  player1: z.string(),
  player2: z.string(),
  winner: z.array(z.string()).optional()
}).openapi('TournamentGame')

export const NewTournamentRequestSchema = z.object({
  metaGame: z.string(),
  name: z.string(),
  variants: z.array(z.string()).default([]),
  clockStart: z.number().default(172800),
  clockInc: z.number().default(0),
  clockMax: z.number().default(604800),
  clockHard: z.boolean().default(false),
  noExplore: z.boolean().default(false),
  divisions: z.record(z.string(), z.object({
    minRating: z.number(),
    maxPlayers: z.number()
  })).optional()
}).openapi('NewTournamentRequest')

export const JoinTournamentRequestSchema = z.object({
  tournamentId: z.string(),
  once: z.boolean().default(false)
}).openapi('JoinTournamentRequest')