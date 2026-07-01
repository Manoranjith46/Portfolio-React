import { useState } from 'react'
import { SlidePanel } from '@/components/shared/Modal'
import { useSettings, useUpdateSettings } from '@/api/settings'
import Loader from '@/components/shared/Loader'
import { useToast } from '@/components/shared/Toast'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

type Tab = 'seo' | 'social' | 'contact' | 'flags'

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [tab, setTab] = useState<Tab>('seo')
  const { data: settings, isLoading } = useSettings()
  const updateSettings = useUpdateSettings()
  const { showToast } = useToast()

  const handleSave = async (updates: Parameters<typeof updateSettings.mutateAsync>[0]) => {
    try {
      await updateSettings.mutateAsync(updates)
      showToast('Settings saved', 'success')
    } catch {
      showToast('Failed to save settings', 'error')
    }
  }

  return (
    <SlidePanel isOpen={isOpen} onClose={onClose} title="Settings">
      <div className="admin-panel">
        <div className="settings-tabs">
          {(['seo', 'social', 'contact', 'flags'] as Tab[]).map((t) => (
            <button key={t} type="button" className={`settings-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>
        {isLoading ? <Loader /> : settings && (
          <>
            {tab === 'seo' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input className="control login-form" defaultValue={settings.seo.pageTitle} placeholder="Page title" id="seo-title" />
                <textarea className="control login-form" defaultValue={settings.seo.metaDescription} placeholder="Meta description" rows={3} id="seo-desc" />
                <button type="button" className="btn btn__primary" onClick={() => {
                  const title = (document.getElementById('seo-title') as HTMLInputElement).value
                  const desc = (document.getElementById('seo-desc') as HTMLTextAreaElement).value
                  void handleSave({ seo: { ...settings.seo, pageTitle: title, metaDescription: desc } })
                }}>Save SEO</button>
              </div>
            )}
            {tab === 'flags' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {Object.entries(settings.featureFlags).map(([key, value]) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="checkbox"
                      defaultChecked={value}
                      onChange={(e) => {
                        void handleSave({
                          featureFlags: { ...settings.featureFlags, [key]: e.target.checked },
                        })
                      }}
                    />
                    {key}
                  </label>
                ))}
              </div>
            )}
            {tab === 'social' && <p className="text__muted">Configure social links in the profile section.</p>}
            {tab === 'contact' && <p className="text__muted">Contact info: {settings.contact.email}</p>}
          </>
        )}
      </div>
    </SlidePanel>
  )
}
