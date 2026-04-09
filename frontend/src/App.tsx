import { useEffect, useState } from 'react'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage'
import type { AuthScreen, ThemeMode } from './app/types/auth'
import './styles/auth.css'

function App() {
  const [screen, setScreen] = useState<AuthScreen>('signin')
  const [themeMode, setThemeMode] = useState<ThemeMode>('light')

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode
  }, [themeMode])

  const handleToggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  if (screen === 'signin') {
    return (
      <SignInPage
        onSwitchToSignUp={() => setScreen('signup')}
        themeMode={themeMode}
        onToggleTheme={handleToggleTheme}
      />
    )
  }

  return (
    <SignUpPage
      onSwitchToSignIn={() => setScreen('signin')}
      themeMode={themeMode}
      onToggleTheme={handleToggleTheme}
    />
  )
}

export default App
