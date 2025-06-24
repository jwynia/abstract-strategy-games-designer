import { FederatedServer, CreateFederatedGameRequest } from '../../schemas/federation'
import { GameInstance } from '../../schemas/game'

export interface IFederationService {
  /**
   * Get list of all federated servers
   */
  listServers(): Promise<FederatedServer[]>
  
  /**
   * Get a specific federated server by ID
   */
  getServer(serverId: string): Promise<FederatedServer | null>
  
  /**
   * Create a game across federated servers
   */
  createFederatedGame(request: CreateFederatedGameRequest): Promise<GameInstance>
  
  /**
   * Check if a server is online
   */
  checkServerStatus(serverId: string): Promise<'online' | 'offline' | 'maintenance'>
  
  /**
   * Validate if a game is supported on a server
   */
  isGameSupported(serverId: string, gameId: string): Promise<boolean>
}