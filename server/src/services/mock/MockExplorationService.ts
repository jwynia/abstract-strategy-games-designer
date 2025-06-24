import { IExplorationService } from '../interfaces/IExplorationService'
import { 
  Exploration,
  ExplorationNote,
  ExplorationComment,
  NewExplorationRequest
} from '../../schemas/exploration'

export class MockExplorationService implements IExplorationService {
  private explorations: Map<string, Exploration> = new Map()
  private notes: Map<string, ExplorationNote[]> = new Map()
  private comments: Map<string, ExplorationComment[]> = new Map()
  private playgroundStates: Map<string, any> = new Map()

  async createExploration(userId: string, request: NewExplorationRequest): Promise<string> {
    const explorationId = crypto.randomUUID()
    const exploration: Exploration = {
      pk: 'EXPLORATION',
      sk: explorationId,
      id: explorationId,
      gameId: request.gameId,
      gameName: request.gameName || 'Unknown Game',
      userId,
      userName: 'User ' + userId,
      title: request.title || 'New Exploration',
      description: request.description,
      state: request.state || {},
      createdAt: Date.now(),
      updatedAt: Date.now(),
      public: request.public || false,
      tags: request.tags || []
    }
    
    this.explorations.set(explorationId, exploration)
    this.notes.set(explorationId, [])
    this.comments.set(explorationId, [])
    this.playgroundStates.set(explorationId, request.state || {})
    
    return explorationId
  }

  async getExploration(explorationId: string): Promise<Exploration | null> {
    return this.explorations.get(explorationId) || null
  }

  async listExplorations(options?: {
    gameId?: string
    userId?: string
  }): Promise<Exploration[]> {
    let explorations = Array.from(this.explorations.values())
    
    if (options?.gameId) {
      explorations = explorations.filter(e => e.gameId === options.gameId)
    }
    
    if (options?.userId) {
      explorations = explorations.filter(e => e.userId === options.userId)
    }
    
    return explorations.sort((a, b) => b.updatedAt - a.updatedAt)
  }

  async deleteExploration(explorationId: string, userId: string): Promise<void> {
    const exploration = this.explorations.get(explorationId)
    if (!exploration) {
      throw new Error('Exploration not found')
    }
    
    if (exploration.userId !== userId) {
      throw new Error('Not authorized to delete this exploration')
    }
    
    this.explorations.delete(explorationId)
    this.notes.delete(explorationId)
    this.comments.delete(explorationId)
    this.playgroundStates.delete(explorationId)
  }

  async updatePlaygroundState(explorationId: string, userId: string, state: any): Promise<void> {
    const exploration = this.explorations.get(explorationId)
    if (!exploration) {
      throw new Error('Exploration not found')
    }
    
    if (exploration.userId !== userId) {
      throw new Error('Not authorized to update this exploration')
    }
    
    this.playgroundStates.set(explorationId, state)
    exploration.state = state
    exploration.updatedAt = Date.now()
  }

  async getPlaygroundState(explorationId: string): Promise<any> {
    const state = this.playgroundStates.get(explorationId)
    if (!state) {
      throw new Error('Exploration not found')
    }
    return state
  }

  async addNote(explorationId: string, userId: string, note: string, moveNumber: number): Promise<string> {
    const exploration = this.explorations.get(explorationId)
    if (!exploration) {
      throw new Error('Exploration not found')
    }
    
    if (exploration.userId !== userId) {
      throw new Error('Not authorized to add notes to this exploration')
    }
    
    const noteId = crypto.randomUUID()
    const noteData: ExplorationNote = {
      id: noteId,
      explorationId,
      userId,
      note,
      moveNumber,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    
    const notes = this.notes.get(explorationId) || []
    notes.push(noteData)
    this.notes.set(explorationId, notes)
    
    return noteId
  }

  async getNote(explorationId: string, noteId: string): Promise<ExplorationNote | null> {
    const notes = this.notes.get(explorationId) || []
    return notes.find(n => n.id === noteId) || null
  }

  async updateNote(explorationId: string, noteId: string, userId: string, note: string): Promise<void> {
    const notes = this.notes.get(explorationId) || []
    const noteIndex = notes.findIndex(n => n.id === noteId)
    
    if (noteIndex === -1) {
      throw new Error('Note not found')
    }
    
    if (notes[noteIndex].userId !== userId) {
      throw new Error('Not authorized to update this note')
    }
    
    notes[noteIndex].note = note
    notes[noteIndex].updatedAt = Date.now()
  }

  async deleteNote(explorationId: string, noteId: string, userId: string): Promise<void> {
    const notes = this.notes.get(explorationId) || []
    const noteIndex = notes.findIndex(n => n.id === noteId)
    
    if (noteIndex === -1) {
      throw new Error('Note not found')
    }
    
    if (notes[noteIndex].userId !== userId) {
      throw new Error('Not authorized to delete this note')
    }
    
    notes.splice(noteIndex, 1)
    this.notes.set(explorationId, notes)
  }

  async listNotes(explorationId: string): Promise<ExplorationNote[]> {
    return this.notes.get(explorationId) || []
  }

  async addComment(explorationId: string, userId: string, comment: string): Promise<string> {
    const exploration = this.explorations.get(explorationId)
    if (!exploration) {
      throw new Error('Exploration not found')
    }
    
    const commentId = crypto.randomUUID()
    const commentData: ExplorationComment = {
      id: commentId,
      explorationId,
      userId,
      userName: 'User ' + userId,
      comment,
      createdAt: Date.now()
    }
    
    const comments = this.comments.get(explorationId) || []
    comments.push(commentData)
    this.comments.set(explorationId, comments)
    
    return commentId
  }

  async getComments(explorationId: string): Promise<ExplorationComment[]> {
    return this.comments.get(explorationId) || []
  }

  async deleteComment(explorationId: string, commentId: string, userId: string): Promise<void> {
    const comments = this.comments.get(explorationId) || []
    const commentIndex = comments.findIndex(c => c.id === commentId)
    
    if (commentIndex === -1) {
      throw new Error('Comment not found')
    }
    
    if (comments[commentIndex].userId !== userId) {
      throw new Error('Not authorized to delete this comment')
    }
    
    comments.splice(commentIndex, 1)
    this.comments.set(explorationId, comments)
  }

  async shareExploration(explorationId: string, userId: string): Promise<{ shareUrl: string }> {
    const exploration = this.explorations.get(explorationId)
    if (!exploration) {
      throw new Error('Exploration not found')
    }
    
    if (exploration.userId !== userId) {
      throw new Error('Not authorized to share this exploration')
    }
    
    exploration.public = true
    const shareId = Buffer.from(explorationId).toString('base64url')
    
    return {
      shareUrl: `https://play.example.com/explore/shared/${shareId}`
    }
  }

  async getSharedExploration(shareId: string): Promise<Exploration | null> {
    try {
      const explorationId = Buffer.from(shareId, 'base64url').toString()
      const exploration = this.explorations.get(explorationId)
      
      if (exploration?.public) {
        return exploration
      }
      
      return null
    } catch {
      return null
    }
  }

  async canUserModifyExploration(explorationId: string, userId: string): Promise<boolean> {
    const exploration = this.explorations.get(explorationId)
    return exploration ? exploration.userId === userId : false
  }
}