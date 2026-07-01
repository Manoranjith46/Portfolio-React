import { SlidePanel } from '@/components/shared/Modal'
import { useMedia, useDeleteMedia } from '@/api/media'
import Loader from '@/components/shared/Loader'
import { useToast } from '@/components/shared/Toast'
import ImageUploader from './ImageUploader'

interface MediaLibraryProps {
  isOpen: boolean
  onClose: () => void
}

export default function MediaLibrary({ isOpen, onClose }: MediaLibraryProps) {
  const { data: media, isLoading, refetch } = useMedia()
  const deleteMedia = useDeleteMedia()
  const { showToast } = useToast()

  const handleDelete = async (id: string) => {
    try {
      await deleteMedia.mutateAsync(id)
      showToast('Media deleted', 'success')
    } catch {
      showToast('Delete failed', 'error')
    }
  }

  return (
    <SlidePanel isOpen={isOpen} onClose={onClose} title="Media Library">
      <div className="admin-panel">
        <ImageUploader onUploaded={() => { void refetch() }} />
        {isLoading ? <Loader /> : (
          <div className="admin-grid" style={{ marginTop: 16 }}>
            {(media ?? []).map((item) => (
              <div key={item.id} className="admin-card">
                <img src={item.thumbnailUrl ?? item.url} alt={item.filename} style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 4, marginBottom: 8 }} />
                <p style={{ fontSize: 11, marginBottom: 4 }}>{item.filename}</p>
                <button type="button" className="btn" style={{ fontSize: 11 }} onClick={() => { navigator.clipboard.writeText(item.url); showToast('URL copied', 'success') }}>
                  Copy URL
                </button>
                <button type="button" className="btn" style={{ fontSize: 11, marginLeft: 4 }} onClick={() => { void handleDelete(item.id) }}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </SlidePanel>
  )
}
