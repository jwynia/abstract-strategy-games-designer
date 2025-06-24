import { z } from '@hono/zod-openapi'

export const OrgEventSchema = z.object({
  pk: z.literal('ORGEVENT'),
  sk: z.string(),
  name: z.string(),
  description: z.string(),
  organizer: z.string(),
  dateStart: z.number(),
  dateEnd: z.number().optional(),
  winner: z.array(z.string()).optional(),
  visible: z.boolean()
}).openapi('OrgEvent')

export const OrgEventGameSchema = z.object({
  pk: z.literal('ORGEVENTGAME'),
  sk: z.string(),
  metaGame: z.string(),
  variants: z.array(z.string()).optional(),
  round: z.number(),
  gameid: z.string(),
  player1: z.string(),
  player2: z.string(),
  winner: z.array(z.string()).optional(),
  arbitrated: z.boolean().optional()
}).openapi('OrgEventGame')

export const OrgEventPlayerSchema = z.object({
  pk: z.literal('ORGEVENTPLAYER'),
  sk: z.string(),
  playerid: z.string(),
  division: z.number().optional(),
  seed: z.number().optional()
}).openapi('OrgEventPlayer')

export const CreateEventRequestSchema = z.object({
  name: z.string(),
  description: z.string(),
  dateStart: z.number()
}).openapi('CreateEventRequest')

export const EventRegisterRequestSchema = z.object({
  eventId: z.string()
}).openapi('EventRegisterRequest')

export const EventCreateGamesRequestSchema = z.object({
  eventId: z.string(),
  round: z.number(),
  pairings: z.array(z.object({
    player1: z.string(),
    player2: z.string(),
    metaGame: z.string(),
    variants: z.array(z.string()).optional()
  }))
}).openapi('EventCreateGamesRequest')