# Service Layer Architecture Discovery

## Classification
- **Domain:** Implementation
- **Stability:** Semi-stable
- **Abstraction:** Structural
- **Confidence:** Established

## Overview
The Abstract Strategy Games API server implements a clean service layer architecture with dependency injection, separating business logic from HTTP handling and enabling easy testing and maintenance.

## Key Components

### ServiceContainer Pattern
**Found**: `server/src/services/ServiceContainer.ts:17-57`
**Summary**: Singleton container managing all service instances with type-safe registration and retrieval
**Significance**: Central point for dependency management, enables easy swapping of implementations

### Service Initialization
**Found**: `server/src/services/index.ts:9-27`
**Summary**: Centralized service registration with mock/real implementation switching
**Significance**: Single place to configure all services, supports different environments

### Middleware Integration
**Found**: `server/src/middleware/services.ts:11-15`
**Summary**: Injects services into Hono context for route access
**Significance**: Makes services available to all routes without manual passing

## Service Interfaces

### Core Service Contracts
**Location**: `server/src/services/interfaces/`
- `IUserService.ts` - User management operations
- `IChallengeService.ts` - Challenge system operations
- `IFederationService.ts` - Federation communication
- `IGameService.ts` - Game catalog and instance management
- `ITournamentService.ts` - Tournament management
- `IExplorationService.ts` - Game exploration features

### Mock Implementations
**Location**: `server/src/services/mock/`
- Each interface has a corresponding Mock implementation
- All mocks use in-memory storage
- Provides realistic behavior for development/testing

## Architectural Patterns

### Dependency Injection Flow
1. **App Start**: `app.ts:29` - `initializeServices(true)`
2. **Service Registration**: Services registered in container
3. **Middleware Setup**: `app.ts:42` - Services injected into context
4. **Route Access**: Routes get services via `c.get('services')`

### Type Safety
**Found**: `server/src/middleware/services.ts:5-9`
**Summary**: Hono context extended with typed services
**Significance**: Full IntelliSense support in routes

### Service Access Pattern
```typescript
// In any route handler
const services = c.get('services')
const game = await services.game.getGame(gameId)
```

## Benefits Achieved

### Separation of Concerns
- Routes handle HTTP concerns only
- Services contain business logic
- Clear boundaries between layers

### Testability
- Mock services enable unit testing
- Easy to test routes in isolation
- Service container reset for test cleanup

### Maintainability
- Consistent patterns across codebase
- Easy to add new services
- Simple to swap implementations

### Extensibility
- New services follow established pattern
- Interface-first development
- Support for plugins via service injection

## Related Concepts
- [[../protocols/api-protocol-specification.md]] - API design this implements
- [[./abstractplay-architecture-discovery.md]] - Integration requirements
- [[../../planning/service-refactoring-task.md]] - Implementation task tracking

## See Also
- Server implementation: `server/src/`
- Service tests: `server/src/__tests__/services/`
- Route implementations: `server/src/routes/`

## Metadata
- **Created:** 2025-06-24
- **Updated By:** Assistant