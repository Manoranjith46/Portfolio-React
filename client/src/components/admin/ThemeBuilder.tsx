import { useState } from 'react'
import { SlidePanel } from '@/components/shared/Modal'
import { THEME_SLOTS } from '@/constants/themes'
import { useTheme } from '@/hooks/useTheme'
import { useUpdateTheme } from '@/api/settings'
import { useToast } from '@/components/shared/Toast'

interface ThemeBuilderProps {
  isOpen: boolean
  onClose: () => void
}

export default function ThemeBuilder({ isOpen, onClose }: ThemeBuilderProps) {
  const [activeId, setActiveId] = useState(THEME_SLOTS[0].id)
  const { applyThemeVars, setIsDark } = useTheme()
  const updateTheme = useUpdateTheme()
  const { showToast } = useToast()

  const applySlot = (slotId: string) => {
    const slot = THEME_SLOTS.find((s) => s.id === slotId)
    if (!slot) return
    setActiveId(slotId)
    setIsDark(slot.mode === 'dark')
    applyThemeVars({
      '--color-primary': slot.accentColor,
      '--color-primary-accent': slot.accentColor,
    })
  }

  const handleSave = async () => {
    const slot = THEME_SLOTS.find((s) => s.id === activeId)
    if (!slot) return
    try {
      await updateTheme.mutateAsync({
        primaryColor: slot.primaryColor,
        accentColor: slot.accentColor,
        fontFamily: slot.fontFamily,
        borderRadius: slot.borderRadius,
        animationSpeed: slot.animationSpeed,
        mode: slot.mode,
      })
      showToast('Theme saved to draft', 'success')
    } catch {
      showToast('Failed to save theme', 'error')
    }
  }

  return (
    <SlidePanel isOpen={isOpen} onClose={onClose} title="Theme Builder">
      <div className="admin-panel">
        <div className="theme-slots">
          {THEME_SLOTS.map((slot) => (
            <div
              key={slot.id}
              className={`theme-slot ${activeId === slot.id ? 'active' : ''}`}
              onClick={() => applySlot(slot.id)}
            >
              <div
                className="theme-preview"
                style={{ background: `linear-gradient(135deg, ${slot.primaryColor}, ${slot.accentColor})` }}
              />
              <strong>{slot.name}</strong>
            </div>
          ))}
        </div>
        <button type="button" className="btn btn__primary" style={{ marginTop: 16 }} onClick={() => { void handleSave() }}>
          Save Theme to Draft
        </button>
      </div>
    </SlidePanel>
  )
}
