import { IGameService } from '../interfaces/IGameService'
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

export class MockGameService implements IGameService {
  private games: Map<string, GameDetails> = new Map()
  private gameInstances: Map<string, GameState> = new Map()
  private fullGames: Map<string, FullGame> = new Map()

  constructor() {
    this.initializeMockData()
  }

  private initializeMockData() {
    // Initialize with some mock games
    const mockGames = [
      {
        id: 'tic-tac-toe',
        name: 'Tic-Tac-Toe',
        summary: 'Classic 3x3 grid game',
        designer: 'Traditional',
        publisher: 'Public Domain',
        playTime: '5 minutes',
        complexity: 1,
        minPlayers: 2,
        maxPlayers: 2,
        tags: ['Classic', 'Quick', 'Abstract'],
        description: 'The classic game of Xs and Os',
        rules: 'Players take turns marking spaces in a 3×3 grid...',
        variants: [],
        resources: []
      },
      {
        id: 'chess',
        name: 'Chess',
        summary: 'The classic strategy game',
        designer: 'Traditional',
        publisher: 'Public Domain',
        playTime: '30-60 minutes',
        complexity: 4,
        minPlayers: 2,
        maxPlayers: 2,
        tags: ['Classic', 'Strategic', 'Abstract'],
        description: 'The ultimate strategy game',
        rules: 'Each player begins with 16 pieces...',
        variants: [],
        resources: []
      }
    ]

    mockGames.forEach(game => {
      this.games.set(game.id, game as GameDetails)
    })
  }

  async listGames(options?: { tag?: string }): Promise<GameSummary[]> {
    const games = Array.from(this.games.values())
    
    if (options?.tag) {
      return games
        .filter(game => game.tags.includes(options.tag))
        .map(game => ({
          id: game.id,
          name: game.name,
          summary: game.summary,
          designer: game.designer,
          publisher: game.publisher,
          playTime: game.playTime,
          complexity: game.complexity,
          minPlayers: game.minPlayers,
          maxPlayers: game.maxPlayers,
          tags: game.tags
        }))
    }

    return games.map(game => ({
      id: game.id,
      name: game.name,
      summary: game.summary,
      designer: game.designer,
      publisher: game.publisher,
      playTime: game.playTime,
      complexity: game.complexity,
      minPlayers: game.minPlayers,
      maxPlayers: game.maxPlayers,
      tags: game.tags
    }))
  }

  async getGameDetails(gameId: string): Promise<GameDetails | null> {
    return this.games.get(gameId) || null
  }

  async getGameMetaInfo(gameId: string): Promise<GameMetaInfo | null> {
    const game = this.games.get(gameId)
    if (!game) return null

    return {
      id: game.id,
      name: game.name,
      uid: game.id.toUpperCase(),
      group: 'classic',
      family: 'Traditional Games',
      description: game.description,
      urls: [],
      people: [{ name: game.designer, role: 'designer' }],
      flags: ['ai'],
      categories: game.tags,
      mechanics: [],
      versions: []
    }
  }

  async createGameInstance(request: CreateGameRequest): Promise<GameInstance> {
    const instanceId = crypto.randomUUID()
    const gameState: GameState = {
      id: instanceId,
      gameId: request.gameId,
      state: {
        players: request.players,
        currentPlayer: 0,
        board: this.initializeBoard(request.gameId),
        winner: null,
        status: 'active'
      },
      currentPlayer: request.players[0].id,
      players: request.players,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    this.gameInstances.set(instanceId, gameState)

    return {
      id: instanceId,
      gameId: request.gameId,
      players: request.players,
      status: 'active',
      currentPlayer: request.players[0].id,
      createdAt: gameState.createdAt,
      updatedAt: gameState.updatedAt
    }
  }

  async getGameInstance(instanceId: string): Promise<GameState | null> {
    return this.gameInstances.get(instanceId) || null
  }

  async makeMove(instanceId: string, move: MoveRequest, playerId: string): Promise<MoveResponse> {
    const gameState = this.gameInstances.get(instanceId)
    if (!gameState) {
      throw new Error('Game instance not found')
    }

    if (gameState.currentPlayer !== playerId) {
      throw new Error('Not your turn')
    }

    // Mock move validation and application
    gameState.state.board = this.applyMove(gameState.state.board, move.move)
    gameState.updatedAt = new Date().toISOString()
    
    // Switch players
    const currentIndex = gameState.players.findIndex(p => p.id === playerId)
    const nextIndex = (currentIndex + 1) % gameState.players.length
    gameState.currentPlayer = gameState.players[nextIndex].id

    return {
      success: true,
      state: gameState.state,
      gameOver: false,
      winner: null
    }
  }

  async getLegalMoves(instanceId: string): Promise<LegalMoves> {
    const gameState = this.gameInstances.get(instanceId)
    if (!gameState) {
      throw new Error('Game instance not found')
    }

    // Mock legal moves
    return {
      moves: ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3']
    }
  }

  async getCurrentGames(metaGame: string): Promise<FullGame[]> {
    return Array.from(this.fullGames.values())
      .filter(game => game.metaGame === metaGame && game.state !== 'COMPLETED')
  }

  async getCompletedGames(metaGame: string): Promise<FullGame[]> {
    return Array.from(this.fullGames.values())
      .filter(game => game.metaGame === metaGame && game.state === 'COMPLETED')
  }

  async getGameById(gameId: string): Promise<FullGame | null> {
    return this.fullGames.get(gameId) || null
  }

  async renderGame(instanceId: string, format: 'svg' | 'png' | 'ascii', size: number): Promise<RenderResponse> {
    const gameState = this.gameInstances.get(instanceId)
    if (!gameState) {
      throw new Error('Game instance not found')
    }

    if (format === 'ascii') {
      return {
        format,
        content: this.renderAsciiBoard(gameState.state.board),
        mimeType: 'text/plain'
      }
    }

    // Mock SVG response
    return {
      format,
      content: '<svg>Mock game board</svg>',
      mimeType: format === 'svg' ? 'image/svg+xml' : 'image/png'
    }
  }

  async resignGame(instanceId: string, playerId: string): Promise<void> {
    const gameState = this.gameInstances.get(instanceId)
    if (!gameState) {
      throw new Error('Game instance not found')
    }

    gameState.status = 'completed'
    gameState.state.winner = gameState.players.find(p => p.id !== playerId)?.id || null
    gameState.updatedAt = new Date().toISOString()
  }

  async offerDraw(instanceId: string, playerId: string): Promise<void> {
    const gameState = this.gameInstances.get(instanceId)
    if (!gameState) {
      throw new Error('Game instance not found')
    }

    // Mock draw offer
    gameState.state.drawOffered = playerId
  }

  async acceptDraw(instanceId: string, playerId: string): Promise<void> {
    const gameState = this.gameInstances.get(instanceId)
    if (!gameState) {
      throw new Error('Game instance not found')
    }

    gameState.status = 'completed'
    gameState.state.isDraw = true
    gameState.updatedAt = new Date().toISOString()
  }

  async checkTimeout(instanceId: string): Promise<boolean> {
    // Mock timeout check
    return false
  }

  async checkAbandoned(instanceId: string): Promise<boolean> {
    // Mock abandonment check
    return false
  }

  private initializeBoard(gameId: string): any {
    if (gameId === 'tic-tac-toe') {
      return [
        [null, null, null],
        [null, null, null],
        [null, null, null]
      ]
    }
    return {}
  }

  private applyMove(board: any, move: string): any {
    // Mock move application
    return board
  }

  private renderAsciiBoard(board: any): string {
    if (Array.isArray(board)) {
      return board.map(row => 
        row.map((cell: any) => cell || '-').join(' ')
      ).join('\n')
    }
    return 'Mock ASCII board'
  }
}