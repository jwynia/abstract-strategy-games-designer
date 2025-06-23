# API Protocol Specification

## Overview

RESTful API specification for abstract strategy game platforms, enabling interoperability between different implementations while maintaining compatibility with existing systems.

## Classification
- **Domain:** Technical Specification
- **Stability:** Evolving
- **Abstraction:** Protocol
- **Confidence:** High

## Protocol Version

Current: 1.0.0-draft

## Base URL Structure

```
https://api.{domain}/v1
```

## Authentication

### Methods Supported

1. **Bearer Token** (recommended)
```http
Authorization: Bearer <token>
```

2. **API Key** (simple integrations)
```http
X-API-Key: <api-key>
```

3. **OAuth 2.0** (federation)
- Authorization endpoint: `/oauth/authorize`
- Token endpoint: `/oauth/token`

## Core Endpoints

### Game Management

#### List Available Games
```http
GET /games
```

Response:
```json
{
  "games": [
    {
      "id": "chess",
      "name": "Chess",
      "version": "1.0.0",
      "minPlayers": 2,
      "maxPlayers": 2,
      "variants": ["standard", "chess960"],
      "pluginUrl": "https://plugins.example.com/chess"
    }
  ],
  "total": 42,
  "page": 1,
  "pageSize": 20
}
```

#### Get Game Details
```http
GET /games/{gameId}
```

Response:
```json
{
  "id": "chess",
  "name": "Chess",
  "description": "Classic strategy game",
  "rules": "https://example.com/chess/rules",
  "version": "1.0.0",
  "protocol": "1.0.0",
  "capabilities": {
    "ai": true,
    "variants": true,
    "analysis": true,
    "timeControl": true
  }
}
```

### Game Instance Management

#### Create New Game
```http
POST /game-instances
```

Request:
```json
{
  "gameId": "chess",
  "variant": "standard",
  "players": [
    {"id": "player1", "name": "Alice"},
    {"id": "player2", "name": "Bob"}
  ],
  "timeControl": {
    "type": "increment",
    "initial": 600,
    "increment": 5
  },
  "metadata": {
    "tournament": "weekly-blitz"
  }
}
```

Response:
```json
{
  "instanceId": "550e8400-e29b-41d4-a716-446655440000",
  "gameId": "chess",
  "state": "active",
  "currentPlayer": 1,
  "createdAt": "2024-01-01T00:00:00Z",
  "joinUrl": "https://play.example.com/g/550e8400"
}
```

#### Get Game State
```http
GET /game-instances/{instanceId}
```

Response:
```json
{
  "instanceId": "550e8400-e29b-41d4-a716-446655440000",
  "gameId": "chess",
  "state": "active",
  "currentPlayer": 1,
  "moveCount": 10,
  "lastMove": "e2-e4",
  "gameState": {
    "board": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR",
    "currentPlayer": 2,
    "castling": "KQkq",
    "enPassant": "e3"
  },
  "history": [
    {"player": 1, "move": "e2-e4", "timestamp": "2024-01-01T00:00:00Z"}
  ]
}
```

#### Make Move
```http
POST /game-instances/{instanceId}/moves
```

Request:
```json
{
  "playerId": "player1",
  "notation": "e7-e5",
  "timestamp": "2024-01-01T00:00:05Z"
}
```

Response:
```json
{
  "success": true,
  "gameState": {
    "board": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR",
    "currentPlayer": 1,
    "moveCount": 11
  },
  "gameOver": false,
  "legalMoves": ["Nf3", "Nc3", "Bc4", "..."]
}
```

#### Get Legal Moves
```http
GET /game-instances/{instanceId}/legal-moves
```

Response:
```json
{
  "moves": [
    {
      "notation": "Nf3",
      "from": "g1",
      "to": "f3",
      "piece": "knight"
    }
  ],
  "count": 20
}
```

### Rendering

#### Get Game Rendering
```http
GET /game-instances/{instanceId}/render
```

Query Parameters:
- `format`: `svg` | `png` | `ascii` (default: `svg`)
- `size`: rendering size (default: `800`)
- `style`: rendering style preset

Response:
```json
{
  "format": "svg",
  "data": "<svg>...</svg>",
  "metadata": {
    "width": 800,
    "height": 800,
    "lastMove": {"from": "e2", "to": "e4"}
  }
}
```

### Player Management

#### Get Player Profile
```http
GET /players/{playerId}
```

Response:
```json
{
  "id": "player1",
  "name": "Alice",
  "rating": {
    "chess": 1650,
    "go": 1200
  },
  "stats": {
    "gamesPlayed": 150,
    "winRate": 0.62
  }
}
```

#### Get Player Games
```http
GET /players/{playerId}/games
```

Query Parameters:
- `status`: `active` | `completed` | `all`
- `gameId`: filter by game type
- `page`: pagination

### Federation Endpoints

#### List Federated Servers
```http
GET /federation/servers
```

Response:
```json
{
  "servers": [
    {
      "id": "abstractplay",
      "name": "AbstractPlay",
      "url": "https://api.abstractplay.com",
      "status": "online",
      "games": ["chess", "go", "hex"]
    }
  ]
}
```

#### Initiate Federated Game
```http
POST /federation/games
```

Request:
```json
{
  "gameId": "chess",
  "localPlayer": "player1",
  "remotePlayer": "player2@abstractplay.com",
  "remoteServer": "abstractplay"
}
```

## Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "INVALID_MOVE",
    "message": "The move e2-e5 is not legal in the current position",
    "details": {
      "position": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
      "attemptedMove": "e2-e5",
      "legalMoves": ["e2-e3", "e2-e4"]
    }
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "requestId": "req_123456"
}
```

### Standard Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_MOVE` | 400 | Move not legal |
| `GAME_NOT_FOUND` | 404 | Game instance not found |
| `NOT_YOUR_TURN` | 403 | Not player's turn |
| `GAME_OVER` | 400 | Game already finished |
| `INVALID_PLAYER` | 403 | Player not in game |
| `TIMEOUT` | 408 | Move timeout |
| `SERVER_ERROR` | 500 | Internal error |

## Webhooks

### Webhook Events

Configure webhooks for real-time updates:

```http
POST /webhooks
```

Request:
```json
{
  "url": "https://myapp.com/webhook",
  "events": ["move.made", "game.over", "player.joined"],
  "secret": "webhook_secret_key"
}
```

### Event Payload

```json
{
  "event": "move.made",
  "timestamp": "2024-01-01T00:00:00Z",
  "data": {
    "instanceId": "550e8400",
    "playerId": "player1",
    "move": "e2-e4",
    "gameState": {}
  },
  "signature": "sha256=..."
}
```

## Rate Limiting

Headers returned:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1609459200
```

## Versioning

### Version Negotiation
```http
Accept: application/vnd.gameapi.v1+json
```

### Backward Compatibility

AbstractPlay compatibility endpoints:
```http
POST /legacy/authQuery
GET /legacy/query
```

## WebSocket Support

### Connection
```
wss://api.{domain}/v1/ws
```

### Message Format
```json
{
  "type": "subscribe",
  "channel": "game:550e8400",
  "auth": "Bearer <token>"
}
```

### Events
- `move.made`
- `game.state.changed`
- `player.connected`
- `player.disconnected`
- `game.over`

## SDK Support

### Official SDKs
- JavaScript/TypeScript
- Python
- Go
- Rust

### SDK Example
```typescript
const client = new GameAPIClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.example.com/v1'
});

const game = await client.games.create({
  gameId: 'chess',
  players: ['player1', 'player2']
});

await game.makeMove('e2-e4');
```

## Relationships
- **Parent Node:** [[index.md]]
- **Related Nodes:**
  - [[game-interface-protocol.md]] - Game protocol
  - [[federation-protocol.md]] - Federation details
  - [[abstractplay-compatibility-guide.md]] - Legacy support

## References
- RESTful API design best practices
- OpenAPI 3.0 specification
- OAuth 2.0 RFC
- WebSocket protocol

## Metadata
- **Created:** 2025-06-23
- **Last Updated:** 2025-06-23
- **Status:** Draft