import { 
  Tournament, 
  TournamentPlayer, 
  TournamentGame,
  NewTournamentRequest,
  JoinTournamentRequest 
} from '../../schemas/tournament'

export interface ITournamentService {
  // Tournament management
  createTournament(userId: string, request: NewTournamentRequest): Promise<string>
  getTournament(tournamentId: string): Promise<Tournament | null>
  listTournaments(options?: {
    status?: 'waiting' | 'active' | 'completed' | 'all'
    metaGame?: string
  }): Promise<Tournament[]>
  
  // Player management
  joinTournament(tournamentId: string, userId: string, once: boolean): Promise<{ division?: number }>
  withdrawFromTournament(tournamentId: string, userId: string): Promise<void>
  getTournamentPlayers(tournamentId: string): Promise<TournamentPlayer[]>
  
  // Game management
  getTournamentGames(tournamentId: string, round?: number, playerId?: string): Promise<TournamentGame[]>
  createTournamentRound(tournamentId: string): Promise<void>
  
  // Standings
  getTournamentStandings(tournamentId: string, division?: number): Promise<{
    rank: number
    player: TournamentPlayer
    wins: number
    losses: number
    draws: number
  }[]>
  
  // Tournament lifecycle
  startTournament(tournamentId: string): Promise<void>
  endTournament(tournamentId: string): Promise<void>
  archiveTournament(tournamentId: string): Promise<void>
}