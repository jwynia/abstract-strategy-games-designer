# Game Interface Protocol

## Overview

Formal specification for abstract strategy game implementations, defining the contract between games and platforms. Based on AbstractPlay's proven patterns but extended for greater flexibility.

## Classification
- **Domain:** Technical Specification
- **Stability:** Evolving
- **Abstraction:** Protocol
- **Confidence:** High

## Protocol Version

Current: 1.0.0-draft

## Core Interface

### Required Methods

```typescript
interface IGameProtocol {
  // Execute a move and return new game state
  move(notation: string, options?: IMoveOptions): IGameProtocol;
  
  // Generate rendering data for current state
  render(options?: IRenderOptions): IRenderData;
  
  // Serialize current game state
  state(): IGameState;
  
  // Load a specific state from history
  load(index: number): IGameProtocol;
  
  // Create deep copy of game instance
  clone(): IGameProtocol;
}
```

### Required Properties

```typescript
interface IGameProperties {
  // Unique game identifier
  readonly id: string;
  
  // Human-readable game name
  readonly name: string;
  
  // Protocol version implemented
  readonly protocolVersion: string;
  
  // Number of players (2-n)
  readonly numPlayers: number;
  
  // Current player (1-indexed)
  currentPlayer: number;
  
  // Game completion status
  gameOver: boolean;
  
  // Winners (empty if ongoing)
  winners: number[];
  
  // State history stack
  stack: IGameState[];
  
  // Supported variants
  variants?: IVariant[];
}
```

### Optional Extensions

```typescript
interface IGameExtensions {
  // AI move generation
  aiMove?(level: number): string;
  
  // Move validation without execution
  validateMove?(notation: string): boolean;
  
  // Get all legal moves
  legalMoves?(): string[];
  
  // Undo last move
  undo?(): IGameProtocol;
  
  // Game-specific metadata
  metadata?(): IGameMetadata;
}
```

## State Management

### State Structure

```typescript
interface IGameState {
  // Serialized board state
  board: string;
  
  // Current player
  currentPlayer: number;
  
  // Move history
  moves: string[];
  
  // Timestamps
  lastMoveTime?: number;
  
  // Custom game data
  gameData?: any;
}
```

### State Stack Rules

1. New states pushed after each move
2. Stack maintains complete game history
3. States must be independently loadable
4. Maximum stack size: implementation-defined

## Move Notation

### Standard Notation

Games SHOULD support algebraic notation where applicable:
- Square references: "a1", "e4"
- Piece moves: "e2-e4", "Nb1-c3"
- Captures: "e4xd5" or "e4:d5"
- Special moves: defined per game

### Custom Notation

Games MAY define custom notation with:
- Clear documentation
- Unambiguous parsing
- Human-readable format

## Rendering Protocol

### Render Data Structure

```typescript
interface IRenderData {
  // Rendering engine version
  version: string;
  
  // Board representation
  board: IBoardRender;
  
  // Piece placements
  pieces: IPieceRender[];
  
  // Annotations (optional)
  annotations?: IAnnotation[];
  
  // Player-specific styling
  playerStyles?: IPlayerStyle[];
}
```

### Board Types

- `grid`: Rectangular grid (chess, checkers)
- `hex`: Hexagonal grid
- `graph`: Node-and-edge graph
- `custom`: Game-specific layout

## Plugin Compatibility

### Discovery

Games must export discovery metadata:

```typescript
export const gameInfo: IGameInfo = {
  id: "chess",
  name: "Chess",
  protocolVersion: "1.0.0",
  minPlayers: 2,
  maxPlayers: 2,
  variants: ["standard", "chess960"],
  tags: ["classic", "perfect-information"],
  factory: () => new ChessGame()
};
```

### Registration

Platforms discover games through:
1. Static imports (compile-time)
2. Dynamic loading (runtime)
3. Remote endpoints (federation)

## Error Handling

### Standard Errors

```typescript
enum GameError {
  INVALID_MOVE = "INVALID_MOVE",
  GAME_OVER = "GAME_OVER",
  INVALID_PLAYER = "INVALID_PLAYER",
  INVALID_STATE = "INVALID_STATE",
  NOT_IMPLEMENTED = "NOT_IMPLEMENTED"
}
```

### Error Response

```typescript
interface IGameError {
  code: GameError;
  message: string;
  details?: any;
}
```

## Backward Compatibility

### AbstractPlay Compatibility

To maintain compatibility with AbstractPlay:

1. Implement `GameBase` wrapper:
```typescript
class AbstractPlayAdapter extends GameBase {
  private game: IGameProtocol;
  // Adapter implementation
}
```

2. Map method signatures
3. Preserve state format
4. Maintain move notation

## Versioning

### Protocol Versions

- Format: `major.minor.patch`
- Breaking changes increment major
- New features increment minor
- Fixes increment patch

### Version Negotiation

```typescript
interface IVersionNegotiation {
  // Client supported versions
  clientVersions: string[];
  
  // Server supported versions
  serverVersions: string[];
  
  // Negotiated version
  agreedVersion: string;
}
```

## Implementation Guidelines

### Required Capabilities

1. **Deterministic**: Same moves produce same states
2. **Stateless**: No hidden state outside stack
3. **Serializable**: All state can be JSON-encoded
4. **Performant**: Moves execute in <100ms

### Best Practices

1. Validate moves before state changes
2. Use immutable state updates
3. Document notation clearly
4. Provide helpful error messages
5. Include comprehensive tests

## Extension Points

### Future Considerations

1. **Time Controls**: Move time limits
2. **Observers**: Read-only game access
3. **Variations**: Branching game trees
4. **Analysis**: Position evaluation
5. **Replay**: Move-by-move playback

## Relationships
- **Parent Node:** [[index.md]]
- **Related Nodes:**
  - [[api-protocol-specification.md]] - API integration
  - [[plugin-architecture.md]] - Plugin system
  - [[abstractplay-compatibility-guide.md]] - Migration guide

## References
- AbstractPlay GameBase implementation
- Common game programming patterns
- Board game notation standards

## Metadata
- **Created:** 2025-06-23
- **Last Updated:** 2025-06-23
- **Status:** Draft