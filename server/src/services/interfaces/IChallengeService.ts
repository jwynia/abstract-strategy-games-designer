import { 
  FullChallenge, 
  NewChallengeRequest, 
  StandingChallenge 
} from '../../schemas/challenge'

export interface IChallengeService {
  // Challenge management
  createChallenge(userId: string, request: NewChallengeRequest): Promise<string>
  getChallenge(challengeId: string): Promise<FullChallenge | null>
  listChallenges(options?: { 
    status?: 'pending' | 'accepted' | 'declined' | 'all'
    metaGame?: string
    userId?: string
  }): Promise<FullChallenge[]>
  
  // Challenge responses
  acceptChallenge(challengeId: string, userId: string): Promise<{ gameId?: string }>
  declineChallenge(challengeId: string, userId: string): Promise<void>
  revokeChallenge(challengeId: string, userId: string): Promise<void>
  
  // Standing challenges
  getStandingChallenges(userId?: string, metaGame?: string): Promise<StandingChallenge[]>
  updateStandingChallenges(userId: string, challenges: StandingChallenge[]): Promise<void>
  
  // Challenge validation
  canUserAcceptChallenge(challengeId: string, userId: string): Promise<boolean>
  canUserRevokeChallenge(challengeId: string, userId: string): Promise<boolean>
}