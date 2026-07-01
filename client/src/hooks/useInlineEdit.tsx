import { useState, useCallback, type MouseEvent } from 'react'
import { useEditorStore } from '@/stores/editorStore'
import OverlayEditor from '@/components/admin/OverlayEditor'

export function useInlineEdit(fieldPath: string) {
  const { mode } = useEditorStore()
  const [editorState, setEditorState] = useState<{
    rect: DOMRect
    value: string
  } | null>(null)

  const handleClick = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (mode !== 'edit') return
      e.stopPropagation()
      const rect = e.currentTarget.getBoundingClientRect()
      setEditorState({ rect, value: e.currentTarget.textContent ?? '' })
    },
    [mode],
  )

  const overlay = editorState ? (
    <OverlayEditor
      rect={editorState.rect}
      initialValue={editorState.value}
      fieldPath={fieldPath}
      onClose={() => setEditorState(null)}
    />
  ) : null

  const editableProps =
    mode === 'edit'
      ? { onClick: handleClick, className: 'editable-hover' }
      : {}

  return { editableProps, overlay, isEditMode: mode === 'edit' }
}
