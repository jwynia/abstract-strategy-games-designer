import { 
  GameSummary, 
  GameDetails, 
  FullGame, 
  GameInstance,
  GameState,
  CreateGameRequest,
  MoveRequest,
  MoveResponse,
  LegalMoves,
  RenderResponse,
  GameMetaInfo
} from '../../schemas/game'

export interface IGameService {
  // Game catalog
  listGames(options?: { tag?: string }): Promise<GameSummary[]>
  getGameDetails(gameId: string): Promise<GameDetails | null>
  getGameMetaInfo(gameId: string): Promise<GameMetaInfo | null>
  
  // Game instances
  createGameInstance(request: CreateGameRequest): Promise<GameInstance>
  getGameInstance(instanceId: string): Promise<GameState | null>
  
  // Game play
  makeMove(instanceId: string, move: MoveRequest, playerId: string): Promise<MoveResponse>
  getLegalMoves(instanceId: string): Promise<LegalMoves>
  
  // Game queries
  getCurrentGames(metaGame: string): Promise<FullGame[]>
  getCompletedGames(metaGame: string): Promise<FullGame[]>
  getGameById(gameId: string): Promise<FullGame | null>
  
  // Rendering
  renderGame(instanceId: string, format: 'svg' | 'png' | 'ascii', size: number): Promise<RenderResponse>
  
  // Game management
  resignGame(instanceId: string, playerId: string): Promise<void>
  offerDraw(instanceId: string, playerId: string): Promise<void>
  acceptDraw(instanceId: string, playerId: string): Promise<void>
  
  // Time management
  checkTimeout(instanceId: string): Promise<boolean>
  checkAbandoned(instanceId: string): Promise<boolean>
}