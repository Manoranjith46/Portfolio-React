import { useState, useRef } from 'react'
import { SlidePanel } from '@/components/shared/Modal'
import { useUploadResume, useResumeDiff, useApproveResume } from '@/api/resume'
import ResumeDiff from './ResumeDiff'
import Loader from '@/components/shared/Loader'
import { useToast } from '@/components/shared/Toast'

interface ResumeApprovalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ResumeApproval({ isOpen, onClose }: ResumeApprovalProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<'upload' | 'processing' | 'review'>('upload')
  const uploadResume = useUploadResume()
  const { data: diff, refetch: refetchDiff, isLoading } = useResumeDiff()
  const approveResume = useApproveResume()
  const { showToast } = useToast()

  const handleUpload = async (file: File) => {
    setStep('processing')
    try {
      await uploadResume.mutateAsync(file)
      setStep('review')
      await refetchDiff()
      showToast('Resume processed — ready for review', 'success')
    } catch {
      setStep('upload')
      showToast('Resume upload failed', 'error')
    }
  }

  const handleApprove = async (fields: string[]) => {
    try {
      await approveResume.mutateAsync(fields)
      showToast('Resume changes approved', 'success')
      setStep('upload')
      onClose()
    } catch {
      showToast('Approval failed', 'error')
    }
  }

  return (
    <SlidePanel isOpen={isOpen} onClose={onClose} title="Resume Pipeline">
      <div className="admin-panel">
        {step === 'upload' && (
          <>
            <div
              className="upload-zone"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                const file = e.dataTransfer.files[0]
                if (file) void handleUpload(file)
              }}
            >
              <p>Drop PDF resume here or click to upload</p>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) void handleUpload(file)
                }}
              />
            </div>
          </>
        )}
        {step === 'processing' && <Loader />}
        {step === 'review' && (
          isLoading ? <Loader /> : (
            <ResumeDiff
              diff={diff ?? { added: [], changed: [], removed: [] }}
              onApprove={handleApprove}
            />
          )
        )}
      </div>
    </SlidePanel>
  )
}
