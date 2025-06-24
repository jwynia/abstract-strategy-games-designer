import { IFederationService } from '../interfaces/IFederationService'
import { FederatedServer, CreateFederatedGameRequest } from '../../schemas/federation'
import { GameInstance } from '../../schemas/game'

export class MockFederationService implements IFederationService {
  private servers: Map<string, FederatedServer> = new Map([
    ['abstractplay', {
      id: 'abstractplay',
      name: 'AbstractPlay',
      url: 'https://api.abstractplay.com',
      status: 'online',
      games: ['chess', 'go', 'hex', 'tafl']
    }],
    ['boardgamearena', {
      id: 'boardgamearena',
      name: 'Board Game Arena',
      url: 'https://api.boardgamearena.com',
      status: 'online',
      games: ['chess', 'checkers', 'reversi']
    }],
    ['playdiplomacy', {
      id: 'playdiplomacy',
      name: 'PlayDiplomacy',
      url: 'https://api.playdiplomacy.com',
      status: 'maintenance',
      games: ['diplomacy']
    }]
  ])

  async listServers(): Promise<FederatedServer[]> {
    return Array.from(this.servers.values())
  }

  async getServer(serverId: string): Promise<FederatedServer | null> {
    return this.servers.get(serverId) || null
  }

  async createFederatedGame(request: CreateFederatedGameRequest): Promise<GameInstance> {
    const server = await this.getServer(request.remoteServer)
    if (!server) {
      throw new Error(`Remote server ${request.remoteServer} not found`)
    }

    if (server.status !== 'online') {
      throw new Error(`Remote server ${request.remoteServer} is currently ${server.status}`)
    }

    const isSupported = await this.isGameSupported(request.remoteServer, request.gameId)
    if (!isSupported) {
      throw new Error(`Game ${request.gameId} is not supported on ${request.remoteServer}`)
    }

    // Mock federation handshake
    const instanceId = crypto.randomUUID()
    
    return {
      instanceId,
      gameId: request.gameId,
      state: 'active',
      currentPlayer: 1,
      createdAt: new Date().toISOString(),
      joinUrl: `https://play.example.com/federation/${instanceId}`
    }
  }

  async checkServerStatus(serverId: string): Promise<'online' | 'offline' | 'maintenance'> {
    const server = await this.getServer(serverId)
    return server?.status || 'offline'
  }

  async isGameSupported(serverId: string, gameId: string): Promise<boolean> {
    const server = await this.getServer(serverId)
    return server?.games?.includes(gameId) || false
  }
}