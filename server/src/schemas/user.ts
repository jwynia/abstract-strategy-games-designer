import { z } from '@hono/zod-openapi'

// User settings structure
export const UserNotificationSettingsSchema = z.object({
  gameStart: z.boolean().default(true),
  gameEnd: z.boolean().default(true),
  challenges: z.boolean().default(true),
  yourturn: z.boolean().default(true),
  tournamentStart: z.boolean().default(true),
  tournamentEnd: z.boolean().default(true)
}).openapi('UserNotificationSettings')

export const UserAllSettingsSchema = z.object({
  color: z.string().optional(),
  annotate: z.boolean().optional(),
  notifications: UserNotificationSettingsSchema.optional()
}).openapi('UserAllSettings')

export const UserSettingsSchema = z.object({
  all: UserAllSettingsSchema.optional()
}).catchall(z.any()).openapi('UserSettings')

// User profile
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email().optional(),
  country: z.string().optional(),
  lastSeen: z.number().optional(),
  stars: z.number().int().optional(),
  bggid: z.string().optional(),
  about: z.string().optional(),
  anonymous: z.boolean().optional(),
  settings: UserSettingsSchema.optional(),
  palettes: z.array(z.object({
    name: z.string(),
    colours: z.array(z.string())
  })).optional(),
  tags: z.array(z.object({
    meta: z.string(),
    tags: z.array(z.string())
  })).optional()
}).openapi('User')

export const UsersDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  country: z.string().optional(),
  stars: z.number().int().optional(),
  lastSeen: z.number().optional(),
  bggid: z.string().optional(),
  about: z.string().optional()
}).openapi('UsersData')

// Push notification subscription
export const PushSubscriptionSchema = z.object({
  endpoint: z.string().url(),
  expirationTime: z.number().nullable(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string()
  })
}).openapi('PushSubscription')

// Meta game counts
export const MetaGameCountSchema = z.object({
  currentgames: z.number().int(),
  completedgames: z.number().int(),
  standingchallenges: z.number().int(),
  ratings: z.set(z.string()).optional(),
  stars: z.number().int().optional(),
  tags: z.array(z.string()).optional()
}).openapi('MetaGameCount')

export const MetaGameCountsSchema = z.record(z.string(), MetaGameCountSchema).openapi('MetaGameCounts')