import { useEffect, useState, useCallback } from 'react'

const THEME_KEY = 'theme'

function getInitialDarkMode(): boolean {
  const stored = localStorage.getItem(THEME_KEY)
  if (!stored) return window.matchMedia('(prefers-color-scheme:dark)').matches
  try {
    return JSON.parse(stored) as boolean
  } catch {
    return stored === 'dark'
  }
}

export function useTheme() {
  const [isDark, setIsDark] = useState(getInitialDarkMode)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    localStorage.setItem(THEME_KEY, JSON.stringify(isDark))
  }, [isDark])

  const toggleTheme = useCallback(() => setIsDark((prev) => !prev), [])

  const applyThemeVars = useCallback((vars: Record<string, string>) => {
    const root = document.documentElement
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
  }, [])

  return { isDark, setIsDark, toggleTheme, applyThemeVars }
}
