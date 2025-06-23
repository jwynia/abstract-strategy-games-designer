# AbstractPlay Compatibility Guide

## Overview

Comprehensive guide for maintaining compatibility with AbstractPlay while implementing extended features. This document provides migration paths, adapter patterns, and compatibility matrices.

## Classification
- **Domain:** Technical Guide
- **Stability:** Reference
- **Abstraction:** Implementation
- **Confidence:** High

## Compatibility Levels

### Level 1: Full Compatibility
Complete drop-in replacement for AbstractPlay games

- Implements exact `GameBase` interface
- Preserves all method signatures
- Maintains state format
- Uses same notation system

### Level 2: Protocol Compatibility
Interoperable through adapters

- Implements game protocol interface
- Provides AbstractPlay adapter
- May use different state format
- Notation translation available

### Level 3: Federation Compatible
Can interact through federation protocol

- Hosted on separate server
- Speaks federation protocol
- May have different architecture
- Cross-play enabled

## Migration Patterns

### Pattern 1: Direct Port

For games currently in AbstractPlay:

```typescript
// Original AbstractPlay game
export class ChessGame extends GameBase {
  public move(m: string): ChessGame {
    // Implementation
  }
}

// Direct port maintaining compatibility
export class ChessGamePort implements IGameProtocol {
  // Implement new interface
  move(notation: string, options?: IMoveOptions): IGameProtocol {
    // Same logic, new interface
  }
  
  // Adapter for backward compatibility
  static asGameBase(): GameBase {
    return new ChessGameAdapter(this);
  }
}
```

### Pattern 2: Wrapper Approach

For gradual migration:

```typescript
export class GameWrapper implements IGameProtocol {
  private game: GameBase;
  
  constructor(game: GameBase) {
    this.game = game;
  }
  
  move(notation: string): IGameProtocol {
    const newGame = this.game.move(notation);
    return new GameWrapper(newGame);
  }
  
  // Bridge methods for new functionality
  legalMoves(): string[] {
    // Add functionality not in GameBase
  }
}
```

### Pattern 3: Dual Implementation

Support both systems:

```typescript
export class DualGame extends GameBase implements IGameProtocol {
  // Satisfy both interfaces
  // GameBase methods for AbstractPlay
  // IGameProtocol methods for new system
  
  // Use composition to avoid duplication
  private protocol: IGameProtocol;
  
  move(m: string): DualGame {
    this.protocol.move(m);
    return this;
  }
}
```

## State Format Compatibility

### AbstractPlay State Format

```typescript
interface APGameState {
  game: string;
  numplayers: number;
  variants?: string[];
  board?: any;
  pieces?: any;
  scores?: number[];
  stack: any[];
  // ... other fields
}
```

### Conversion Functions

```typescript
export class StateConverter {
  static toAbstractPlay(state: IGameState): APGameState {
    return {
      game: state.gameId,
      numplayers: state.numPlayers,
      board: this.convertBoard(state.board),
      stack: state.history.map(h => this.convertHistoryItem(h))
    };
  }
  
  static fromAbstractPlay(apState: APGameState): IGameState {
    return {
      gameId: apState.game,
      numPlayers: apState.numplayers,
      board: this.parseBoard(apState.board),
      history: apState.stack.map(s => this.parseHistoryItem(s))
    };
  }
}
```

## Notation Compatibility

### Standard Notations

AbstractPlay uses various notations:

1. **Coordinate**: "a1", "e4"
2. **Move**: "e2-e4"
3. **Capture**: "e4xd5"
4. **Placement**: "b3"

### Notation Translation

```typescript
export class NotationTranslator {
  static translateMove(
    move: string, 
    fromFormat: NotationFormat,
    toFormat: NotationFormat
  ): string {
    // Parse move in source format
    const parsed = this.parse(move, fromFormat);
    
    // Generate in target format
    return this.generate(parsed, toFormat);
  }
}
```

## Rendering Compatibility

### AbstractPlay Rendering

```typescript
interface APRenderRep {
  board: any;
  pieces: any[];
  areas?: any[];
  annotations?: any[];
}
```

### Rendering Adapter

```typescript
export class RenderAdapter {
  static toAbstractPlay(render: IRenderData): APRenderRep {
    return {
      board: this.convertBoard(render.board),
      pieces: render.pieces.map(p => this.convertPiece(p)),
      annotations: render.annotations?.map(a => this.convertAnnotation(a))
    };
  }
}
```

## API Compatibility Layer

### Endpoint Mapping

```
AbstractPlay          →  Extended Protocol
/authQuery           →  /api/v1/auth/*
/query              →  /api/v1/public/*
                    +  /api/v1/games/*
                    +  /api/v1/federation/*
```

### Request Translation

```typescript
export class APIBridge {
  async handleLegacyRequest(
    endpoint: string,
    payload: any
  ): Promise<any> {
    switch(endpoint) {
      case '/authQuery':
        return this.routeAuthQuery(payload);
      case '/query':
        return this.routePublicQuery(payload);
    }
  }
  
  private async routeAuthQuery(payload: any) {
    // Map to new API structure
    const { query, pars } = payload;
    
    switch(query) {
      case 'gameinfo':
        return this.gameService.getInfo(pars.game);
      case 'move':
        return this.gameService.makeMove(pars);
    }
  }
}
```

## Testing Compatibility

### Compatibility Test Suite

```typescript
export class CompatibilityTests {
  static async testGame(gameId: string) {
    const tests = [
      this.testStateConversion,
      this.testMoveExecution,
      this.testRendering,
      this.testNotation,
      this.testSerialization
    ];
    
    for (const test of tests) {
      await test(gameId);
    }
  }
}
```

### Validation Checklist

- [ ] State round-trip conversion works
- [ ] All moves execute identically
- [ ] Rendering output matches
- [ ] Notation accepted/generated correctly
- [ ] Game termination logic preserved
- [ ] Variant support maintained

## Deployment Strategies

### Side-by-Side Deployment

Run both systems in parallel:

```
┌─────────────┐     ┌─────────────┐
│AbstractPlay │     │  Extended   │
│   Server    │────▶│   Server    │
└─────────────┘     └─────────────┘
       ↓                    ↓
   DynamoDB            Any Database
```

### Proxy Pattern

Route through compatibility layer:

```
Client → Proxy → AbstractPlay Backend
              ↘→ Extended Backend
```

### Gradual Migration

1. **Phase 1**: Wrap existing games
2. **Phase 2**: Add new features
3. **Phase 3**: Migrate frontend
4. **Phase 4**: Deprecate legacy

## Common Pitfalls

### State Management
- AbstractPlay uses 1-indexed players
- Stack includes full state copies
- Some games store derived state

### Move Validation
- AbstractPlay validates in `move()`
- Consider separate validation method
- Handle partial moves carefully

### Game Termination
- Check `gameover` flag
- Multiple winners possible
- Resignation handling varies

## Compatibility Matrix

| Feature | Direct | Adapter | Federation |
|---------|--------|---------|------------|
| Basic Moves | ✓ | ✓ | ✓ |
| State History | ✓ | ✓ | ✓ |
| Rendering | ✓ | ✓ | ◐ |
| Variants | ✓ | ◐ | ◐ |
| AI Players | ✗ | ✓ | ✓ |
| Tournaments | ✗ | ◐ | ✓ |
| Live Play | ✗ | ✗ | ✓ |

Legend: ✓ Full, ◐ Partial, ✗ None

## Relationships
- **Parent Node:** [[index.md]]
- **Related Nodes:**
  - [[game-interface-protocol.md]] - Protocol specification
  - [[extension-strategy.md]] - Extension approach
  - [[../implementation/abstractplay-architecture-discovery.md]] - Research findings

## References
- AbstractPlay source code
- GameBase implementation
- Migration best practices

## Metadata
- **Created:** 2025-06-23
- **Last Updated:** 2025-06-23
- **Status:** Complete