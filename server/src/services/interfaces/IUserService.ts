import { 
  User, 
  UsersData, 
  UserSettings, 
  PushSubscription,
  MetaGameCounts 
} from '../../schemas/user'

export interface IUserService {
  // User management
  getUser(userId: string): Promise<User | null>
  getAllUsers(): Promise<UsersData[]>
  createUser(userData: Partial<User>): Promise<User>
  updateProfile(userId: string, updates: Partial<User>): Promise<void>
  
  // Settings
  getUserSettings(userId: string): Promise<UserSettings>
  updateUserSettings(userId: string, settings: Partial<UserSettings>): Promise<void>
  updateGameSettings(userId: string, metaGame: string, settings: any): Promise<void>
  
  // Push notifications
  savePushSubscription(userId: string, subscription: PushSubscription): Promise<void>
  removePushSubscription(userId: string): Promise<void>
  getPushSubscription(userId: string): Promise<PushSubscription | null>
  
  // Game preferences
  toggleStar(userId: string, metaGame: string): Promise<boolean>
  getStarredGames(userId: string): Promise<string[]>
  
  // Statistics
  getMetaGameCounts(userId: string): Promise<MetaGameCounts>
  updateLastSeen(userId: string): Promise<void>
  
  // Tags and palettes
  saveTags(userId: string, tags: any[]): Promise<void>
  getTags(userId: string): Promise<any[]>
  savePalettes(userId: string, palettes: any[]): Promise<void>
  getPalettes(userId: string): Promise<any[]>
}