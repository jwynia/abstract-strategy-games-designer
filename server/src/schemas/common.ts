import { z } from '@hono/zod-openapi'

export const ErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional()
  }),
  timestamp: z.string().datetime(),
  requestId: z.string().optional()
}).openapi('Error')

export const PaginationQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).optional().default('1').transform(Number),
  pageSize: z.string().regex(/^\d+$/).optional().default('20').transform(Number)
})

export const UUIDParamSchema = z.object({
  id: z.string().uuid()
})