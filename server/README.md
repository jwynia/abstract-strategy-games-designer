# Abstract Strategy Games Server

A Hono-based TypeScript server implementing the Abstract Strategy Games API.

## Features

- ✅ Full OpenAPI 3.0 specification implementation
- ✅ Type-safe routes with Zod validation
- ✅ Auto-generated Swagger UI documentation
- ✅ Bearer token authentication
- ✅ CORS support
- ✅ Rate limiting
- ✅ Request logging
- ✅ Error handling
- ✅ Legacy AbstractPlay compatibility

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run in development mode
npm run dev

# The server will start on http://localhost:3020
# API documentation at http://localhost:3020/docs
```

## Environment Variables

See `.env.example` for available configuration:

- `PORT` - Server port (default: 3020)
- `NODE_ENV` - Environment (development/production)
- `API_TOKEN` - Bearer token for authenticated endpoints
- `CORS_ORIGIN` - CORS allowed origins
- `API_BASE_URL` - Base URL for OpenAPI spec

## API Endpoints

### Public Endpoints

- `GET /v1/games` - List available games
- `GET /v1/games/{gameId}` - Get game details
- `GET /v1/players/{playerId}` - Get player profile
- `GET /v1/players/{playerId}/games` - Get player's games
- `GET /v1/federation/servers` - List federated servers
- `GET /v1/legacy/query` - AbstractPlay compatibility

### Protected Endpoints (require Bearer token)

- `POST /v1/game-instances` - Create new game
- `GET /v1/game-instances/{instanceId}` - Get game state
- `POST /v1/game-instances/{instanceId}/moves` - Make a move
- `GET /v1/game-instances/{instanceId}/legal-moves` - Get legal moves
- `GET /v1/game-instances/{instanceId}/render` - Render game
- `POST /v1/federation/games` - Create federated game
- `POST /v1/webhooks` - Register webhook
- `POST /v1/legacy/authQuery` - AbstractPlay authenticated queries

## Project Structure

```
src/
├── app.ts              # Main application setup
├── server.ts           # Server entry point
├── routes/            # Route handlers
│   ├── games.ts       # Game catalog endpoints
│   ├── game-instances.ts # Game instance management
│   ├── players.ts     # Player endpoints
│   ├── federation.ts  # Federation endpoints
│   ├── webhooks.ts    # Webhook registration
│   └── legacy.ts      # AbstractPlay compatibility
├── schemas/           # Zod validation schemas
│   ├── common.ts      # Shared schemas
│   ├── game.ts        # Game-related schemas
│   ├── player.ts      # Player schemas
│   ├── federation.ts  # Federation schemas
│   └── webhook.ts     # Webhook schemas
├── middleware/        # Custom middleware
│   └── rate-limit.ts  # Rate limiting
└── types/            # TypeScript type definitions
```

## Development

```bash
# Run with auto-reload
npm run dev

# Type checking
npm run typecheck

# Build for production
npm run build

# Run production build
npm start

# Generate types from OpenAPI
npm run generate-types
```

## Testing the API

### Using curl

```bash
# List games
curl http://localhost:3020/v1/games

# Create a game (requires auth)
curl -X POST http://localhost:3020/v1/game-instances \
  -H "Authorization: Bearer dev-token" \
  -H "Content-Type: application/json" \
  -d '{
    "gameId": "chess",
    "players": [
      {"id": "player1", "name": "Alice"},
      {"id": "player2", "name": "Bob"}
    ]
  }'
```

### Using the generated TypeScript client

```typescript
import { GameApi } from './generated/client'

const api = new GameApi({
  basePath: 'http://localhost:3020/v1',
  accessToken: 'dev-token'
})

const games = await api.listGames()
```

## Module System

This project uses CommonJS to avoid ESM/CommonJS compatibility issues. See [MODULE-SYSTEM.md](./MODULE-SYSTEM.md) for details.

## Adding New Endpoints

1. Define schemas in `src/schemas/`
2. Create route in `src/routes/`
3. Import and mount in `src/app.ts`
4. Test with Swagger UI

## Production Deployment

1. Set environment variables
2. Build the project: `npm run build`
3. Run with process manager: `pm2 start dist/server.js`

## License

MIT