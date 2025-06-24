# Service Refactoring Task - Route Analysis

## Task: Identify Routes Needing Service Interfaces

### Start Time: 2025-06-24

## Current Status

### Routes Analyzed
1. **games.ts** - Uses inline mock data
2. **game-instances.ts** - Uses in-memory Map storage
3. **tournaments.ts** - Uses in-memory Map storage  
4. **explorations.ts** - Uses in-memory Map storage
5. **push-notifications.ts** - Uses in-memory Map storage
6. **events.ts** - Uses in-memory Map storage
7. **bot.ts** - Uses inline mock functions

### Existing Service Interfaces
- IUserService ✓ (with MockUserService)
- IChallengeService ✓ (with MockChallengeService)
- IFederationService ✓ (with MockFederationService)
- IGameService ✓ (interface exists, no mock implementation)
- ITournamentService ✓ (interface exists, no mock implementation)

## Services Needed

### 1. MockGameService
**Status**: Interface exists, implementation missing
**Route**: games.ts, game-instances.ts
**Responsibilities**:
- Game catalog management
- Game instance lifecycle
- Move validation and execution
- Game state management
- Rendering

### 2. MockTournamentService  
**Status**: Interface exists, implementation missing
**Route**: tournaments.ts
**Responsibilities**:
- Tournament creation and management
- Player registration
- Game scheduling
- Standings calculation

### 3. IExplorationService + MockExplorationService
**Status**: Not created
**Route**: explorations.ts
**Responsibilities**:
- Save/load explorations
- Playground state management
- Game notes management
- Comments system

### 4. IPushNotificationService + MockPushNotificationService
**Status**: Not created
**Route**: push-notifications.ts
**Responsibilities**:
- Subscription management
- Notification sending
- Settings management

### 5. IEventService + MockEventService
**Status**: Not created
**Route**: events.ts
**Responsibilities**:
- Event creation and publishing
- Player registration
- Game creation and results
- Event lifecycle

### 6. IBotService + MockBotService
**Status**: Not created
**Route**: bot.ts
**Responsibilities**:
- Move calculation
- Position analysis
- Bot game creation
- Statistics tracking

## Implementation Priority

1. **MockGameService** - Core functionality, interface already exists
2. **MockTournamentService** - Core functionality, interface already exists
3. **IExplorationService + Mock** - Important for player experience
4. **IEventService + Mock** - Organized play features
5. **IBotService + Mock** - AI opponent features
6. **IPushNotificationService + Mock** - Supporting feature

## Next Steps

1. Implement MockGameService using existing IGameService interface
2. Implement MockTournamentService using existing ITournamentService interface
3. Create remaining service interfaces
4. Implement mock services for remaining interfaces
5. Update routes to use services via ServiceContainer
6. Remove inline mock data and in-memory storage from routes

## Implementation Pattern

Each service should follow the pattern established by existing services:
- Interface in `services/interfaces/IServiceName.ts`
- Mock implementation in `services/mock/MockServiceName.ts`
- Registration in ServiceContainer
- Type exports in `services/index.ts`