import { useState } from 'react'
import { useEditorStore } from '@/stores/editorStore'
import { useSaveDraft, usePublishDraft } from '@/api/draft'
import { useToast } from '@/components/shared/Toast'
import { registerEditorShortcuts } from '@/stores/editorStore'
import PreviewModeToggle from './PreviewModeToggle'
import { useEffect } from 'react'
import '@/css/admin.css'

export default function EditModeBar() {
  const { mode, hasUnsaved, clearDraft, setMode, draftChanges, setHasUnsaved } = useEditorStore()
  const saveDraft = useSaveDraft()
  const publishDraft = usePublishDraft()
  const { showToast } = useToast()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSaveDraft = async () => {
    try {
      await saveDraft.mutateAsync(draftChanges)
      setHasUnsaved(false)
      showToast('Draft saved', 'success')
    } catch {
      showToast('Failed to save draft', 'error')
    }
  }

  useEffect(() => {
    if (mode !== 'edit' && mode !== 'preview') return
    return registerEditorShortcuts(
      () => { void handleSaveDraft() },
      () => { clearDraft(); showToast('Changes discarded', 'info') },
    )
  }, [mode, draftChanges])

  const handlePublish = async () => {
    try {
      if (hasUnsaved) await handleSaveDraft()
      await publishDraft.mutateAsync()
      clearDraft()
      setMode('view')
      showToast('Published successfully', 'success')
    } catch {
      showToast('Failed to publish', 'error')
    }
  }

  return (
    <>
      <PreviewModeToggle menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      {(mode === 'edit' || mode === 'preview') && (
        <div className="edit-mode-bar">
          <span>{hasUnsaved ? 'Unsaved changes' : mode === 'preview' ? 'Preview mode' : 'Edit mode'}</span>
          <div className="actions">
            <button type="button" onClick={() => { clearDraft(); setMode('view') }}>Cancel</button>
            <button type="button" onClick={() => { void handleSaveDraft() }} disabled={saveDraft.isPending}>
              Save Draft
            </button>
            <button type="button" onClick={() => setMode(mode === 'preview' ? 'edit' : 'preview')}>
              {mode === 'preview' ? 'Back to Edit' : 'Preview'}
            </button>
            <button type="button" className="primary" onClick={() => { void handlePublish() }} disabled={publishDraft.isPending}>
              Publish
            </button>
          </div>
        </div>
      )}
    </>
  )
}
