import { serve } from '@hono/node-server'
import app from './app'

const port = parseInt(process.env.PORT || '3020')

serve({
  fetch: app.fetch,
  port
})

console.log(`🚀 Server running on http://localhost:${port}`)
console.log(`📚 API docs available at http://localhost:${port}/docs`)
console.log(`🔧 OpenAPI spec at http://localhost:${port}/openapi.json`)