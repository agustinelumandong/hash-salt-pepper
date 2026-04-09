import type { ChangeEventHandler } from 'react'

type AuthInputProps = {
  id: string
  label: string
  name: string
  type: 'text' | 'email' | 'password'
  value: string
  placeholder?: string
  autoComplete?: string
  error?: string
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
  error,
  onChange,
}: AuthInputProps) {
  const describedBy = error ? `${id}-error` : undefined

  return (
    <div className="auth-field">
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
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
      />
      {error ? (
        <p id={`${id}-error`} className="auth-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
