export type EditorMode = 'view' | 'edit' | 'preview'

export interface DraftChanges {
  [fieldPath: string]: unknown
}

export interface EditorState {
  mode: EditorMode
  draftChanges: DraftChanges
  hasUnsaved: boolean
}

export interface PortfolioDraft {
  id?: string
  adminId?: string
  content: Record<string, unknown>
  status: 'draft' | 'published'
  createdAt?: string
  updatedAt?: string
}
