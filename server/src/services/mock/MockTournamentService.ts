import { ITournamentService } from '../interfaces/ITournamentService'
import { 
  Tournament, 
  TournamentPlayer, 
  TournamentGame,
  NewTournamentRequest,
  JoinTournamentRequest 
} from '../../schemas/tournament'

export class MockTournamentService implements ITournamentService {
  private tournaments: Map<string, Tournament> = new Map()
  private tournamentPlayers: Map<string, TournamentPlayer[]> = new Map()
  private tournamentGames: Map<string, TournamentGame[]> = new Map()

  constructor() {
    this.initializeMockData()
  }

  private initializeMockData() {
    // Create a sample tournament
    const tournamentId = 'mock-tournament-1'
    const tournament: Tournament = {
      pk: 'TOURNAMENT',
      sk: tournamentId,
      id: tournamentId,
      name: 'Weekly Chess Championship',
      metaGame: 'chess',
      dateCreated: Date.now() - 86400000, // 1 day ago
      dateStarted: Date.now() - 43200000, // 12 hours ago
      started: true,
      variants: ['standard'],
      players: ['user1', 'user2', 'user3', 'user4'],
      divisions: 1,
      full: false,
      active: 1,
      waiting: 0,
      divisions_waiting: { '1': 0 },
      divisions_active: { '1': 1 },
      divisions_full: {}
    }

    this.tournaments.set(tournamentId, tournament)

    // Add players
    const players: TournamentPlayer[] = [
      { id: 'user1', name: 'Alice', rating: 1500, gamesPlayed: 10, wins: 6, draws: 2 },
      { id: 'user2', name: 'Bob', rating: 1450, gamesPlayed: 8, wins: 4, draws: 1 },
      { id: 'user3', name: 'Charlie', rating: 1600, gamesPlayed: 12, wins: 8, draws: 1 },
      { id: 'user4', name: 'Diana', rating: 1550, gamesPlayed: 9, wins: 5, draws: 2 }
    ]
    this.tournamentPlayers.set(tournamentId, players)

    // Add some games
    const games: TournamentGame[] = [
      {
        id: 'game1',
        round: 1,
        players: [{ id: 'user1', name: 'Alice' }, { id: 'user2', name: 'Bob' }],
        state: 'COMPLETED',
        winner: 'user1',
        metaGame: 'chess'
      },
      {
        id: 'game2',
        round: 1,
        players: [{ id: 'user3', name: 'Charlie' }, { id: 'user4', name: 'Diana' }],
        state: 'STARTED',
        metaGame: 'chess'
      }
    ]
    this.tournamentGames.set(tournamentId, games)
  }

  async createTournament(userId: string, request: NewTournamentRequest): Promise<string> {
    const tournamentId = crypto.randomUUID()
    const tournament: Tournament = {
      pk: 'TOURNAMENT',
      sk: tournamentId,
      id: tournamentId,
      name: request.name,
      metaGame: request.metaGame,
      dateCreated: Date.now(),
      started: false,
      variants: request.variants || [],
      players: [],
      divisions: request.divisions || 1,
      full: false,
      active: 0,
      waiting: 0,
      divisions_waiting: {},
      divisions_active: {},
      divisions_full: {},
      ...request
    }

    this.tournaments.set(tournamentId, tournament)
    this.tournamentPlayers.set(tournamentId, [])
    this.tournamentGames.set(tournamentId, [])

    return tournamentId
  }

  async getTournament(tournamentId: string): Promise<Tournament | null> {
    return this.tournaments.get(tournamentId) || null
  }

  async listTournaments(options?: {
    status?: 'waiting' | 'active' | 'completed' | 'all'
    metaGame?: string
  }): Promise<Tournament[]> {
    let tournaments = Array.from(this.tournaments.values())

    if (options?.metaGame) {
      tournaments = tournaments.filter(t => t.metaGame === options.metaGame)
    }

    if (options?.status && options.status !== 'all') {
      tournaments = tournaments.filter(t => {
        switch (options.status) {
          case 'waiting':
            return !t.started
          case 'active':
            return t.started && t.active > 0
          case 'completed':
            return t.started && t.active === 0
          default:
            return true
        }
      })
    }

    return tournaments
  }

  async joinTournament(tournamentId: string, userId: string, once: boolean): Promise<{ division?: number }> {
    const tournament = this.tournaments.get(tournamentId)
    if (!tournament) {
      throw new Error('Tournament not found')
    }

    if (tournament.started) {
      throw new Error('Tournament already started')
    }

    const players = this.tournamentPlayers.get(tournamentId) || []
    
    // Check if already joined
    if (players.some(p => p.id === userId)) {
      throw new Error('Already joined this tournament')
    }

    // Add player
    const newPlayer: TournamentPlayer = {
      id: userId,
      name: `Player ${userId}`,
      rating: 1500,
      gamesPlayed: 0,
      wins: 0,
      draws: 0
    }
    
    players.push(newPlayer)
    this.tournamentPlayers.set(tournamentId, players)

    // Update tournament
    tournament.players.push(userId)
    tournament.waiting += 1
    const division = 1 // Mock division assignment
    tournament.divisions_waiting[division] = (tournament.divisions_waiting[division] || 0) + 1

    return { division }
  }

  async withdrawFromTournament(tournamentId: string, userId: string): Promise<void> {
    const tournament = this.tournaments.get(tournamentId)
    if (!tournament) {
      throw new Error('Tournament not found')
    }

    if (tournament.started) {
      throw new Error('Cannot withdraw from started tournament')
    }

    const players = this.tournamentPlayers.get(tournamentId) || []
    const updatedPlayers = players.filter(p => p.id !== userId)
    this.tournamentPlayers.set(tournamentId, updatedPlayers)

    tournament.players = tournament.players.filter(id => id !== userId)
    tournament.waiting = Math.max(0, tournament.waiting - 1)
  }

  async getTournamentPlayers(tournamentId: string): Promise<TournamentPlayer[]> {
    return this.tournamentPlayers.get(tournamentId) || []
  }

  async getTournamentGames(tournamentId: string, round?: number, playerId?: string): Promise<TournamentGame[]> {
    let games = this.tournamentGames.get(tournamentId) || []

    if (round !== undefined) {
      games = games.filter(g => g.round === round)
    }

    if (playerId) {
      games = games.filter(g => g.players.some(p => p.id === playerId))
    }

    return games
  }

  async createTournamentRound(tournamentId: string): Promise<void> {
    const tournament = this.tournaments.get(tournamentId)
    if (!tournament) {
      throw new Error('Tournament not found')
    }

    const players = this.tournamentPlayers.get(tournamentId) || []
    const games = this.tournamentGames.get(tournamentId) || []

    // Find current round
    const currentRound = Math.max(0, ...games.map(g => g.round || 0)) + 1

    // Create pairings (simple round-robin mock)
    for (let i = 0; i < players.length; i += 2) {
      if (i + 1 < players.length) {
        const game: TournamentGame = {
          id: crypto.randomUUID(),
          round: currentRound,
          players: [
            { id: players[i].id, name: players[i].name },
            { id: players[i + 1].id, name: players[i + 1].name }
          ],
          state: 'CREATED',
          metaGame: tournament.metaGame
        }
        games.push(game)
      }
    }

    this.tournamentGames.set(tournamentId, games)
  }

  async getTournamentStandings(tournamentId: string, division?: number): Promise<{
    rank: number
    player: TournamentPlayer
    wins: number
    losses: number
    draws: number
  }[]> {
    const players = this.tournamentPlayers.get(tournamentId) || []
    const games = this.tournamentGames.get(tournamentId) || []

    // Calculate standings
    const standings = players.map(player => {
      const playerGames = games.filter(g => 
        g.players.some(p => p.id === player.id) && g.state === 'COMPLETED'
      )

      const wins = playerGames.filter(g => g.winner === player.id).length
      const draws = playerGames.filter(g => g.isDraw).length
      const losses = playerGames.length - wins - draws

      return {
        player,
        wins,
        losses,
        draws,
        points: wins * 1 + draws * 0.5
      }
    })

    // Sort by points
    standings.sort((a, b) => b.points - a.points)

    // Assign ranks
    return standings.map((standing, index) => ({
      rank: index + 1,
      player: standing.player,
      wins: standing.wins,
      losses: standing.losses,
      draws: standing.draws
    }))
  }

  async startTournament(tournamentId: string): Promise<void> {
    const tournament = this.tournaments.get(tournamentId)
    if (!tournament) {
      throw new Error('Tournament not found')
    }

    if (tournament.started) {
      throw new Error('Tournament already started')
    }

    tournament.started = true
    tournament.dateStarted = Date.now()
    tournament.active = tournament.waiting
    tournament.waiting = 0

    // Move waiting counts to active
    Object.keys(tournament.divisions_waiting).forEach(div => {
      tournament.divisions_active[div] = tournament.divisions_waiting[div]
      tournament.divisions_waiting[div] = 0
    })

    // Create first round
    await this.createTournamentRound(tournamentId)
  }

  async endTournament(tournamentId: string): Promise<void> {
    const tournament = this.tournaments.get(tournamentId)
    if (!tournament) {
      throw new Error('Tournament not found')
    }

    tournament.active = 0
    tournament.dateEnded = Date.now()

    // Mark all games as completed
    const games = this.tournamentGames.get(tournamentId) || []
    games.forEach(game => {
      if (game.state !== 'COMPLETED') {
        game.state = 'COMPLETED'
      }
    })
  }

  async archiveTournament(tournamentId: string): Promise<void> {
    const tournament = this.tournaments.get(tournamentId)
    if (!tournament) {
      throw new Error('Tournament not found')
    }

    tournament.archived = true
  }
}