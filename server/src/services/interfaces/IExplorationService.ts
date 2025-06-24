import { 
  Exploration,
  ExplorationNote,
  ExplorationComment,
  NewExplorationRequest
} from '../../schemas/exploration'

export interface IExplorationService {
  // Exploration management
  createExploration(userId: string, request: NewExplorationRequest): Promise<string>
  getExploration(explorationId: string): Promise<Exploration | null>
  listExplorations(options?: {
    gameId?: string
    userId?: string
  }): Promise<Exploration[]>
  deleteExploration(explorationId: string, userId: string): Promise<void>
  
  // Playground operations
  updatePlaygroundState(explorationId: string, userId: string, state: any): Promise<void>
  getPlaygroundState(explorationId: string): Promise<any>
  
  // Notes management
  addNote(explorationId: string, userId: string, note: string, moveNumber: number): Promise<string>
  getNote(explorationId: string, noteId: string): Promise<ExplorationNote | null>
  updateNote(explorationId: string, noteId: string, userId: string, note: string): Promise<void>
  deleteNote(explorationId: string, noteId: string, userId: string): Promise<void>
  listNotes(explorationId: string): Promise<ExplorationNote[]>
  
  // Comments management
  addComment(explorationId: string, userId: string, comment: string): Promise<string>
  getComments(explorationId: string): Promise<ExplorationComment[]>
  deleteComment(explorationId: string, commentId: string, userId: string): Promise<void>
  
  // Sharing
  shareExploration(explorationId: string, userId: string): Promise<{ shareUrl: string }>
  getSharedExploration(shareId: string): Promise<Exploration | null>
  
  // Permissions
  canUserModifyExploration(explorationId: string, userId: string): Promise<boolean>
}