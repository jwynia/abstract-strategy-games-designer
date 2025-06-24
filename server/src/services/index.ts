import { ServiceContainer } from './ServiceContainer'
import { MockFederationService } from './mock/MockFederationService'
import { MockUserService } from './mock/MockUserService'
import { MockChallengeService } from './mock/MockChallengeService'
import { MockGameService } from './mock/MockGameService'
import { MockTournamentService } from './mock/MockTournamentService'
import { MockExplorationService } from './mock/MockExplorationService'

export function initializeServices(useMocks: boolean = true) {
  const container = ServiceContainer.getInstance()
  
  if (useMocks) {
    // Register mock implementations
    container.register('federation', new MockFederationService())
    container.register('user', new MockUserService())
    container.register('challenge', new MockChallengeService())
    container.register('game', new MockGameService())
    container.register('tournament', new MockTournamentService())
    container.register('exploration', new MockExplorationService())
  } else {
    // Register real implementations
    // container.register('federation', new RealFederationService())
    // etc.
  }
  
  return container
}