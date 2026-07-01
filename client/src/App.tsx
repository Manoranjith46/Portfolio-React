import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Portfolio from '@/pages/Portfolio'
import { ToastProvider } from '@/components/shared/Toast'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  useEffect(() => {
    const storageKey = 'theme'
    const mql = window.matchMedia('(prefers-color-scheme:dark)')
    const storedTheme = localStorage.getItem(storageKey)
    const darkMode = storedTheme ? JSON.parse(storedTheme) : mql.matches
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Portfolio />
      </ToastProvider>
    </QueryClientProvider>
  )
}

export default App
