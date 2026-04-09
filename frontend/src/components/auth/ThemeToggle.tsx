import type { ThemeMode } from '../../app/types/auth'

type ThemeToggleProps = {
  mode: ThemeMode
  onToggle: () => void
}

export function ThemeToggle({ mode, onToggle }: ThemeToggleProps) {
  const isDark = mode === 'dark'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
