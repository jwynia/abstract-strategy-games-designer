import { Context, Next } from 'hono'
import { ServiceContainer, Services } from '../services/ServiceContainer'

// Extend Hono context type to include services
declare module 'hono' {
  interface ContextVariableMap {
    services: Services
  }
}

export async function injectServices(c: Context, next: Next) {
  const container = ServiceContainer.getInstance()
  c.set('services', container.getAll())
  await next()
}