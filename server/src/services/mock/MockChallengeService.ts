import { IChallengeService } from '../interfaces/IChallengeService'
import { FullChallenge, NewChallengeRequest, StandingChallenge } from '../../schemas/challenge'

export class MockChallengeService implements IChallengeService {
  private challenges: Map<string, FullChallenge> = new Map()
  private standingChallenges: Map<string, StandingChallenge[]> = new Map()

  async createChallenge(userId: string, request: NewChallengeRequest): Promise<string> {
    const challengeId = crypto.randomUUID()
    const challenge: FullChallenge = {
      pk: 'CHALLENGE',
      sk: challengeId,
      ...request,
      challenger: { id: userId, name: 'Challenger' },
      players: [{ id: userId, name: 'Challenger' }],
      dateIssued: Date.now()
    }
    
    this.challenges.set(challengeId, challenge)
    return challengeId
  }

  async getChallenge(challengeId: string): Promise<FullChallenge | null> {
    return this.challenges.get(challengeId) || null
  }

  async listChallenges(options?: { 
    status?: 'pending' | 'accepted' | 'declined' | 'all'
    metaGame?: string
    userId?: string
  }): Promise<FullChallenge[]> {
    let challenges = Array.from(this.challenges.values())
    
    if (options?.metaGame) {
      challenges = challenges.filter(ch => ch.metaGame === options.metaGame)
    }
    
    if (options?.userId) {
      challenges = challenges.filter(ch => 
        ch.challenger.id === options.userId ||
        ch.challengees?.some(p => p.id === options.userId) ||
        ch.players?.some(p => p.id === options.userId)
      )
    }
    
    // Filter by status if needed
    // Mock implementation doesn't track status separately
    
    return challenges
  }

  async acceptChallenge(challengeId: string, userId: string): Promise<{ gameId?: string }> {
    const challenge = this.challenges.get(challengeId)
    if (!challenge) {
      throw new Error('Challenge not found')
    }

    // Add player to challenge
    if (!challenge.players) {
      challenge.players = []
    }
    challenge.players.push({ id: userId, name: 'Player' })
    
    // If all players joined, create game
    if (challenge.players.length === challenge.numPlayers) {
      const gameId = crypto.randomUUID()
      this.challenges.delete(challengeId)
      return { gameId }
    }
    
    return {}
  }

  async declineChallenge(challengeId: string, userId: string): Promise<void> {
    const challenge = this.challenges.get(challengeId)
    if (!challenge) {
      throw new Error('Challenge not found')
    }
    
    // Mark as declined and remove
    this.challenges.delete(challengeId)
  }

  async revokeChallenge(challengeId: string, userId: string): Promise<void> {
    const challenge = this.challenges.get(challengeId)
    if (!challenge) {
      throw new Error('Challenge not found')
    }
    
    if (challenge.challenger.id !== userId) {
      throw new Error('Only the challenger can revoke')
    }
    
    this.challenges.delete(challengeId)
  }

  async getStandingChallenges(userId?: string, metaGame?: string): Promise<StandingChallenge[]> {
    let allChallenges: StandingChallenge[] = []
    
    if (userId) {
      allChallenges = this.standingChallenges.get(userId) || []
    } else {
      for (const challenges of this.standingChallenges.values()) {
        allChallenges.push(...challenges)
      }
    }
    
    if (metaGame) {
      allChallenges = allChallenges.filter(ch => ch.metaGame === metaGame)
    }
    
    return allChallenges
  }

  async updateStandingChallenges(userId: string, challenges: StandingChallenge[]): Promise<void> {
    this.standingChallenges.set(userId, challenges)
  }

  async canUserAcceptChallenge(challengeId: string, userId: string): Promise<boolean> {
    const challenge = await this.getChallenge(challengeId)
    if (!challenge) return false
    
    // Check if user is in challengees
    return challenge.challengees?.some(u => u.id === userId) || false
  }

  async canUserRevokeChallenge(challengeId: string, userId: string): Promise<boolean> {
    const challenge = await this.getChallenge(challengeId)
    if (!challenge) return false
    
    return challenge.challenger.id === userId
  }
}