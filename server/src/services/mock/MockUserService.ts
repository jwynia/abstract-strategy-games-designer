import { IUserService } from '../interfaces/IUserService'
import { User, UsersData, UserSettings, PushSubscription, MetaGameCounts } from '../../schemas/user'

export class MockUserService implements IUserService {
  private users: Map<string, User> = new Map([
    ['user1', {
      id: 'user1',
      name: 'Alice',
      email: 'alice@example.com',
      country: 'US',
      lastSeen: Date.now(),
      stars: 5
    }],
    ['user2', {
      id: 'user2',
      name: 'Bob',
      email: 'bob@example.com',
      country: 'UK',
      lastSeen: Date.now() - 86400000,
      stars: 3
    }],
    ['bot', {
      id: 'bot',
      name: 'AI Bot',
      lastSeen: Date.now()
    }]
  ])

  private userSettings: Map<string, UserSettings> = new Map()
  private pushSubscriptions: Map<string, PushSubscription> = new Map()
  private starredGames: Map<string, Set<string>> = new Map()
  private userTags: Map<string, any[]> = new Map()
  private userPalettes: Map<string, any[]> = new Map()

  async getUser(userId: string): Promise<User | null> {
    return this.users.get(userId) || null
  }

  async getAllUsers(): Promise<UsersData[]> {
    return Array.from(this.users.values()).map(u => ({
      id: u.id,
      name: u.name,
      country: u.country,
      stars: u.stars,
      lastSeen: u.lastSeen,
      bggid: u.bggid,
      about: u.about
    }))
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const user: User = {
      id: userData.id || crypto.randomUUID(),
      name: userData.name || 'New User',
      email: userData.email,
      lastSeen: Date.now(),
      ...userData
    }
    this.users.set(user.id, user)
    return user
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<void> {
    const user = this.users.get(userId)
    if (user) {
      Object.assign(user, updates)
      this.users.set(userId, user)
    }
  }

  async getUserSettings(userId: string): Promise<UserSettings> {
    return this.userSettings.get(userId) || {
      all: {
        color: '#007bff',
        annotate: true,
        notifications: {
          gameStart: true,
          gameEnd: true,
          challenges: true,
          yourturn: true,
          tournamentStart: true,
          tournamentEnd: true
        }
      }
    }
  }

  async updateUserSettings(userId: string, settings: Partial<UserSettings>): Promise<void> {
    const current = await this.getUserSettings(userId)
    const updated = { ...current, ...settings }
    this.userSettings.set(userId, updated)
  }

  async updateGameSettings(userId: string, metaGame: string, settings: any): Promise<void> {
    const userSettings = await this.getUserSettings(userId)
    userSettings[metaGame] = settings
    this.userSettings.set(userId, userSettings)
  }

  async savePushSubscription(userId: string, subscription: PushSubscription): Promise<void> {
    this.pushSubscriptions.set(userId, subscription)
  }

  async removePushSubscription(userId: string): Promise<void> {
    this.pushSubscriptions.delete(userId)
  }

  async getPushSubscription(userId: string): Promise<PushSubscription | null> {
    return this.pushSubscriptions.get(userId) || null
  }

  async toggleStar(userId: string, metaGame: string): Promise<boolean> {
    if (!this.starredGames.has(userId)) {
      this.starredGames.set(userId, new Set())
    }
    const starred = this.starredGames.get(userId)!
    if (starred.has(metaGame)) {
      starred.delete(metaGame)
      return false
    } else {
      starred.add(metaGame)
      return true
    }
  }

  async getStarredGames(userId: string): Promise<string[]> {
    const starred = this.starredGames.get(userId)
    return starred ? Array.from(starred) : []
  }

  async getMetaGameCounts(userId: string): Promise<MetaGameCounts> {
    // Mock counts
    return {
      chess: {
        currentgames: 2,
        completedgames: 50,
        standingchallenges: 1,
        stars: 150
      },
      go: {
        currentgames: 1,
        completedgames: 20,
        standingchallenges: 0,
        stars: 75
      }
    }
  }

  async updateLastSeen(userId: string): Promise<void> {
    const user = this.users.get(userId)
    if (user) {
      user.lastSeen = Date.now()
      this.users.set(userId, user)
    }
  }

  async saveTags(userId: string, tags: any[]): Promise<void> {
    this.userTags.set(userId, tags)
  }

  async getTags(userId: string): Promise<any[]> {
    return this.userTags.get(userId) || []
  }

  async savePalettes(userId: string, palettes: any[]): Promise<void> {
    this.userPalettes.set(userId, palettes)
  }

  async getPalettes(userId: string): Promise<any[]> {
    return this.userPalettes.get(userId) || []
  }
}