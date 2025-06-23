# AbstractPlay Architecture Discovery

## Overview

Research findings from analyzing the AbstractPlay platform (https://github.com/AbstractPlay) to understand their architecture, protocols, and implementation patterns for abstract strategy games.

## Classification
- **Domain:** External Research
- **Stability:** Static (snapshot of current architecture)
- **Abstraction:** Detailed
- **Confidence:** Established

## Architecture Overview

### System Components

AbstractPlay uses a modular architecture with these core repositories:

1. **gameslib** - TypeScript game implementations
   - **Found**: https://github.com/AbstractPlay/gameslib
   - **Summary**: Core library containing all game implementations
   - **Significance**: Central registry of games; all games must be included here

2. **front** - JavaScript frontend client
   - **Found**: https://github.com/AbstractPlay/front
   - **Summary**: Game client interface
   - **Significance**: User-facing application

3. **node-backend** - Serverless backend
   - **Found**: https://github.com/AbstractPlay/node-backend
   - **Summary**: AWS Lambda + DynamoDB backend
   - **Significance**: Handles authentication, game state, tournaments

4. **renderer** - Game state visualization
   - **Found**: https://github.com/AbstractPlay/renderer
   - **Summary**: Converts game states to SVG graphics
   - **Significance**: Decoupled rendering system

### Key Design Principles

- **Asynchronous Play**: "Submit your move and come back later"
- **Serverless Architecture**: AWS Lambda functions handle all backend operations
- **Single Table Design**: DynamoDB with flexible key structure
- **Modular Rendering**: Separate renderer module for graphics

## Game Implementation Protocol

### Base Game Interface

**Found**: `gameslib/src/games/_base.ts`
**Summary**: Abstract base class defining required game methods

#### Required Methods
```typescript
abstract move(move: string, opts?: IMoveOptions): GameBase
abstract render(opts: IRenderOpts): APRenderRep
abstract state(): IAPGameState
abstract load(idx: number): GameBase
abstract clone(): GameBase
```

#### Key Properties
- `stack`: Array of game states (history)
- `numplayers`: Total player count
- `gameover`: Boolean completion flag
- `winner`: Array of winning player numbers
- `currplayer`: Current player number
- `variants`: Supported game variants

### Game Registration

**Found**: `gameslib/src/games/index.ts`
**Summary**: Central registry and factory for all games

- Games imported individually from TypeScript files
- Exported in a comprehensive list
- `GameFactory` function instantiates by name
- Manual registration in a Map with UID checking

### State Management

Games maintain state through:
- Stack of individual game states
- Move validation
- Game termination handling (resign, timeout, draw)
- Game records and move histories
- State comparison and serialization

## Communication Protocols

### API Structure

**Found**: `node-backend/serverless.yml`
**Summary**: REST API with two main endpoints

1. `/authQuery` (POST) - Authenticated queries
   - Requires Cognito authorization
   - Handles user-specific operations

2. `/query` (GET) - Public queries
   - No authentication required
   - Public game information

### Data Flow

1. **Frontend** → API Gateway → Lambda → DynamoDB
2. **Authentication**: AWS Cognito with OAuth 2.0
3. **Scheduled Tasks**: 
   - Your turn notifications
   - Tournament management
   - Database exports
   - Challenge handling

## Rendering Protocol

### Data Format

**Found**: `renderer` repository documentation
**Summary**: Games provide render data, renderer outputs SVG

- Games implement `render()` returning rendering instructions
- Renderer module converts to SVG graphics
- Supports automatic scaling
- Player-specific coloring via `playerfill` element

### Rendering Stack
- SVG.js for graphics generation
- TypeScript implementation
- Browser and Node.js compatible

## Extensibility Analysis

### Current Limitations

1. **Monolithic Game Library**: All games must be in gameslib
   - No external game hosting
   - TypeScript requirement
   - Direct integration only

2. **AWS Coupling**: Backend tightly coupled to:
   - AWS Lambda
   - DynamoDB
   - Cognito authentication
   - S3 for exports

3. **Fixed API**: Two endpoint structure
   - Limited to current query patterns
   - Authentication tied to Cognito

### Extension Points

1. **Game Interface**: Well-defined abstract base class
   - Could implement alternative game hosts
   - Protocol is clear and documented

2. **Renderer Module**: Decoupled rendering
   - Could swap rendering implementations
   - Clear input/output contract

3. **Frontend**: Separate from backend
   - Could implement alternative clients
   - API is accessible

## Compatibility Considerations

### For Alternative Implementations

1. **Game Engine Compatibility**
   - Must implement GameBase interface
   - TypeScript or transpilation required
   - State stack management crucial

2. **API Compatibility**
   - Could implement same endpoints
   - Would need compatible auth system
   - Database schema flexibility needed

3. **Rendering Compatibility**
   - Must produce compatible render format
   - SVG output expected
   - Player coloring conventions

### Reusable Components

1. **Game Interface Pattern**: Well-designed abstraction
2. **Rendering Separation**: Good architectural pattern
3. **State Management**: Stack-based history useful
4. **Game Factory**: Dynamic instantiation pattern

## Architectural Insights

### Strengths
- Clear separation of concerns
- Well-defined game interface
- Modular rendering system
- Comprehensive game state management

### Weaknesses
- Monolithic game library
- AWS service coupling
- Limited extensibility hooks
- No plugin architecture

### Opportunities
- Game interface could be protocol-ized
- Rendering module shows good decoupling
- API structure simple enough to replicate
- State management patterns reusable

## Implementation Recommendations

### For Compatible System

1. **Adopt Game Interface**: Use similar abstract base class
2. **Implement State Stack**: History management crucial
3. **Separate Rendering**: Follow modular pattern
4. **Define Clear API**: Simple REST endpoints work

### For Extended System

1. **Plugin Architecture**: Allow external game hosting
2. **Protocol Definition**: Formalize game-platform protocol
3. **Backend Abstraction**: Decouple from specific services
4. **Federation Support**: Multiple game hosts

## Next Steps

1. Study specific game implementations for patterns
2. Analyze rendering data format in detail
3. Document database schema from usage
4. Create protocol specification proposal

## Relationships
- **Parent Node:** [[index.md]]
- **Related Nodes:**
  - [[digital-implementation/index.md]] - Platform considerations
  - [[../../connections/interfaces.md]] - Interface definitions
  - [[../../planning/implementation-feasibility-analysis.md]] - Feasibility context

## Sources
- AbstractPlay GitHub repositories
- Repository documentation and code analysis
- Serverless configuration examination

## Metadata
- **Created:** 2025-06-23
- **Last Updated:** 2025-06-23
- **Updated By:** Assistant