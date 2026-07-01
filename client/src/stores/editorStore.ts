import { create } from 'zustand'
import type { EditorMode, DraftChanges } from '@/types/editor'

interface EditorStore {
  mode: EditorMode
  draftChanges: DraftChanges
  hasUnsaved: boolean
  activePanel: string | null
  setMode: (mode: EditorMode) => void
  updateField: (path: string, value: unknown) => void
  clearDraft: () => void
  setHasUnsaved: (value: boolean) => void
  setActivePanel: (panel: string | null) => void
}

let beforeUnloadRegistered = false

function registerBeforeUnload(getState: () => EditorStore) {
  if (beforeUnloadRegistered) return
  beforeUnloadRegistered = true
  window.addEventListener('beforeunload', (e) => {
    if (getState().hasUnsaved) {
      e.preventDefault()
      e.returnValue = ''
    }
  })
}

export const useEditorStore = create<EditorStore>((set, get) => {
  registerBeforeUnload(get)

  return {
    mode: 'view',
    draftChanges: {},
    hasUnsaved: false,
    activePanel: null,
    setMode: (mode) => set({ mode }),
    updateField: (path, value) =>
      set((state) => ({
        draftChanges: { ...state.draftChanges, [path]: value },
        hasUnsaved: true,
      })),
    clearDraft: () => set({ draftChanges: {}, hasUnsaved: false, mode: 'view' }),
    setHasUnsaved: (value) => set({ hasUnsaved: value }),
    setActivePanel: (panel) => set({ activePanel: panel }),
  }
})

// Keyboard shortcuts: Ctrl+S save draft, Esc cancel
export function registerEditorShortcuts(
  onSave: () => void,
  onCancel: () => void,
) {
  const handler = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault()
      onSave()
    }
    if (e.key === 'Escape') {
      onCancel()
    }
  }
  window.addEventListener('keydown', handler)
  return () => window.removeEventListener('keydown', handler)
}
