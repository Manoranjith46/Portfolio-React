import { useState } from 'react'
import { useUploadMedia } from '@/api/media'
import { useToast } from '@/components/shared/Toast'

interface ImageUploaderProps {
  onUploaded: () => void
}

export default function ImageUploader({ onUploaded }: ImageUploaderProps) {
  const [dragging, setDragging] = useState(false)
  const uploadMedia = useUploadMedia()
  const { showToast } = useToast()

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Images only', 'error')
      return
    }
    try {
      await uploadMedia.mutateAsync({ file })
      showToast('Upload complete', 'success')
      onUploaded()
    } catch {
      showToast('Upload failed', 'error')
    }
  }

  return (
    <div
      className={`upload-zone ${dragging ? 'dragging' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) void handleFile(file)
      }}
      onClick={() => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.onchange = () => {
          const file = input.files?.[0]
          if (file) void handleFile(file)
        }
        input.click()
      }}
    >
      {uploadMedia.isPending ? 'Uploading...' : 'Drop image here or click to upload'}
    </div>
  )
}
