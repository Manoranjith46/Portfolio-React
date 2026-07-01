import { useEffect, useRef, useState } from 'react'
import { useEditorStore } from '@/stores/editorStore'
import '@/css/admin.css'

interface OverlayEditorProps {
  rect: DOMRect
  initialValue: string
  fieldPath: string
  onClose: () => void
}

export default function OverlayEditor({ rect, initialValue, fieldPath, onClose }: OverlayEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const { updateField } = useEditorStore()
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    editorRef.current?.focus()
    const range = document.createRange()
    const sel = window.getSelection()
    if (editorRef.current?.firstChild) {
      range.selectNodeContents(editorRef.current)
      range.collapse(false)
      sel?.removeAllRanges()
      sel?.addRange(range)
    }
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        updateField(fieldPath, value)
        onClose()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [value, fieldPath, onClose, updateField])

  const handleBlur = () => {
    updateField(fieldPath, value)
    onClose()
  }

  return (
    <div
      ref={editorRef}
      className="overlay-editor"
      contentEditable
      suppressContentEditableWarning
      style={{
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        minHeight: rect.height,
      }}
      onInput={(e) => setValue(e.currentTarget.textContent ?? '')}
      onBlur={handleBlur}
      dangerouslySetInnerHTML={{ __html: initialValue }}
    />
  )
}
