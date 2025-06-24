import { IFederationService } from './interfaces/IFederationService'
import { IGameService } from './interfaces/IGameService'
import { IUserService } from './interfaces/IUserService'
import { IChallengeService } from './interfaces/IChallengeService'
import { ITournamentService } from './interfaces/ITournamentService'
import { IExplorationService } from './interfaces/IExplorationService'

export interface Services {
  federation: IFederationService
  game: IGameService
  user: IUserService
  challenge: IChallengeService
  tournament: ITournamentService
  exploration: IExplorationService
}

export class ServiceContainer {
  private static instance: ServiceContainer
  private services: Partial<Services> = {}

  private constructor() {}

  static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer()
    }
    return ServiceContainer.instance
  }

  register<K extends keyof Services>(name: K, service: Services[K]): void {
    this.services[name] = service
  }

  get<K extends keyof Services>(name: K): Services[K] {
    const service = this.services[name]
    if (!service) {
      throw new Error(`Service ${name} not registered`)
    }
    return service as Services[K]
  }

  getAll(): Services {
    const requiredServices: (keyof Services)[] = ['federation', 'game', 'user', 'challenge', 'tournament', 'exploration']
    
    for (const name of requiredServices) {
      if (!this.services[name]) {
        throw new Error(`Required service ${name} not registered`)
      }
    }
    
    return this.services as Services
  }

  reset(): void {
    this.services = {}
  }
}