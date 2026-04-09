import type { ChangeEventHandler, FocusEventHandler } from 'react'

type AuthInputProps = {
  id: string
  label: string
  name: string
  type: 'text' | 'email' | 'password'
  value: string
  placeholder?: string
  autoComplete?: string
  maxLength?: number
  error?: string
  hint?: string
  icon?: 'user' | 'mail' | 'lock'
  onBlur?: FocusEventHandler<HTMLInputElement>
  onChange: ChangeEventHandler<HTMLInputElement>
}

export function AuthInput({
  id,
  label,
  name,
  type,
  value,
  placeholder,
  autoComplete,
  maxLength,
  error,
  hint,
  icon,
  onBlur,
  onChange,
}: AuthInputProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={`auth-field${icon ? ` auth-field--${icon}` : ''}`}>
      <label htmlFor={id} className="auth-label">
        {label}
      </label>
      <input
        id={id}
        className="auth-input"
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
      />
      {hint ? (
        <p id={`${id}-hint`} className="auth-hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="auth-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
