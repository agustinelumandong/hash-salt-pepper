import { AuthCard } from '../components/auth/AuthCard'
import type { AuthSuccessKind, ThemeMode } from '../app/types/auth'

type SuccessPageProps = {
  kind: AuthSuccessKind
  username: string
  themeMode: ThemeMode
  onToggleTheme: () => void
  onBackToSignIn: () => void
}

const successCopy: Record<AuthSuccessKind, { title: string; subtitle: string }> = {
  signin: {
    title: 'Access Granted',
    subtitle: 'You are authenticated. Session initialized.',
  },
  signup: {
    title: 'Account Provisioned',
    subtitle: 'Registration complete. You can now sign in securely.',
  },
}

export function SuccessPage({
  kind,
  username,
  themeMode,
  onToggleTheme,
  onBackToSignIn,
}: SuccessPageProps) {
  const copy = successCopy[kind]

  return (
    <AuthCard
      title={copy.title}
      subtitle={copy.subtitle}
      themeMode={themeMode}
      onToggleTheme={onToggleTheme}
    >
      <div className="auth-success" role="status" aria-live="polite">
        <div className="auth-success-icon" aria-hidden="true" />
        <p className="auth-success-text">Status: SUCCESS</p>
        <p className="auth-subtitle">User: {username}</p>
        <button className="auth-submit" type="button" onClick={onBackToSignIn}>
          Back to Sign In
        </button>
      </div>
    </AuthCard>
  )
}
