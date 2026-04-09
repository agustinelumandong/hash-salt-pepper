import { useEffect, useState } from 'react'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage'
import { SuccessPage } from './pages/SuccessPage'
import type { AuthScreen, AuthSuccessKind, ThemeMode } from './app/types/auth'
import './styles/auth.css'

function App() {
  const [screen, setScreen] = useState<AuthScreen>('signin')
  const [successKind, setSuccessKind] = useState<AuthSuccessKind>('signin')
  const [activeUsername, setActiveUsername] = useState('')
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
        onSuccess={(username) => {
          setActiveUsername(username)
          setSuccessKind('signin')
          setScreen('success')
        }}
        themeMode={themeMode}
        onToggleTheme={handleToggleTheme}
      />
    )
  }

  if (screen === 'success') {
    return (
      <SuccessPage
        kind={successKind}
        username={activeUsername}
        themeMode={themeMode}
        onToggleTheme={handleToggleTheme}
        onBackToSignIn={() => setScreen('signin')}
      />
    )
  }

  return (
    <SignUpPage
      onSwitchToSignIn={() => setScreen('signin')}
      onSuccess={(username) => {
        setActiveUsername(username)
        setSuccessKind('signup')
        setScreen('success')
      }}
      themeMode={themeMode}
      onToggleTheme={handleToggleTheme}
    />
  )
}

export default App
