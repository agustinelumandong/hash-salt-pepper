import type { PropsWithChildren } from 'react'
import type { ThemeMode } from '../../app/types/auth'
import { ThemeToggle } from './ThemeToggle'

type AuthCardProps = PropsWithChildren<{
  title: string
  subtitle: string
  themeMode: ThemeMode
  onToggleTheme: () => void
}>

export function AuthCard({
  title,
  subtitle,
  themeMode,
  onToggleTheme,
  children,
}: AuthCardProps) {
  return (
    <section className="auth-page" aria-labelledby="auth-title">
      <div className="theme-toggle-wrap">
        <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
      </div>
      <div className="auth-card">
        <header className="auth-header">
          <h1 id="auth-title" className="auth-title">
            {title}
          </h1>
          <p className="auth-subtitle">{subtitle}</p>
        </header>
        {children}
      </div>
    </section>
  )
}
