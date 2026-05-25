import { useState, type ChangeEvent, type FocusEvent, type FormEvent } from 'react'
import { AuthCard } from '../components/auth/AuthCard'
import { AuthInput } from '../components/auth/AuthInput'
import { AuthSwitchLink } from '../components/auth/AuthSwitchLink'
import { signUp } from '../app/api/auth'
import type {
  SignUpFormErrors,
  SignUpFormValues,
  ThemeMode,
} from '../app/types/auth'

type SignUpPageProps = {
  onSwitchToSignIn: () => void
  onSuccess: (username: string) => void
  themeMode: ThemeMode
  onToggleTheme: () => void
}

const initialValues: SignUpFormValues = {
  username: '',
  password: '',
  confirmPassword: '',
}

const PASSWORD_CRITERIA_ERROR = 'Password criteria unmet.'

type SignUpField = keyof SignUpFormValues

const usernamePattern = /^[A-Za-z][A-Za-z0-9_]{2,23}$/

function getPasswordStrength(password: string) {
  return {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    digit: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }
}

function isPasswordCriteriaMet(password: string) {
  return Object.values(getPasswordStrength(password)).every(Boolean)
}

function validateSignUpField(field: SignUpField, values: SignUpFormValues): string | undefined {
  const value = values[field].trim()

  if (field === 'username') {
    if (!value) {
      return 'Username is required.'
    }

    if (!usernamePattern.test(value)) {
      return 'Use 3-24 chars, start with a letter, letters/numbers/_ only.'
    }

    if (value.length > 24) {
      return 'Username must be 24 characters or fewer.'
    }

    return undefined
  }

  if (field === 'password') {
    if (!value) {
      return 'Password is required.'
    }

    if (value.length > 128) {
      return 'Password must be 128 characters or fewer.'
    }

    if (!isPasswordCriteriaMet(value)) {
      return PASSWORD_CRITERIA_ERROR
    }

    return undefined
  }

  if (!value) {
    return 'Please confirm your password.'
  }

  if (value !== values.password) {
    return 'Passwords do not match.'
  }

  return undefined
}

function validateSignUp(values: SignUpFormValues): SignUpFormErrors {
  const errors: SignUpFormErrors = {}

  const usernameError = validateSignUpField('username', values)
  const passwordError = validateSignUpField('password', values)
  const confirmPasswordError = validateSignUpField('confirmPassword', values)

  if (usernameError) {
    errors.username = usernameError
  }

  if (passwordError) {
    errors.password = passwordError
  }

  if (confirmPasswordError) {
    errors.confirmPassword = confirmPasswordError
  }

  return errors
}

export function SignUpPage({
  onSwitchToSignIn,
  onSuccess,
  themeMode,
  onToggleTheme,
}: SignUpPageProps) {
  const [values, setValues] = useState<SignUpFormValues>(initialValues)
  const [errors, setErrors] = useState<SignUpFormErrors>({})
  const [touched, setTouched] = useState<Record<SignUpField, boolean>>({
    username: false,
    password: false,
    confirmPassword: false,
  })
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    if (submitError) {
      setSubmitError(null)
    }

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }))

    const field = name as SignUpField

    if (touched[field] || attemptedSubmit) {
      const nextValues = {
        ...values,
        [field]: value,
      }

      const nextError = validateSignUpField(field, nextValues)
      setErrors((prev) => ({
        ...prev,
        [field]: nextError,
      }))

      if (field === 'password' && (touched.confirmPassword || attemptedSubmit)) {
        const confirmError = validateSignUpField('confirmPassword', nextValues)
        setErrors((prev) => ({
          ...prev,
          confirmPassword: confirmError,
        }))
      }
    }
  }

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    const field = event.target.name as SignUpField
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }))

    const nextError = validateSignUpField(field, values)
    setErrors((prev) => ({
      ...prev,
      [field]: nextError,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAttemptedSubmit(true)
    setTouched({
      username: true,
      password: true,
      confirmPassword: true,
    })

    const nextErrors = validateSignUp(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await signUp({
        username: values.username,
        password: values.password,
      })
      onSuccess(response.username)
      setIsSubmitting(false)
      return
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to create account right now.')
    }

    setIsSubmitting(false)
  }

  const passwordStrength = getPasswordStrength(values.password)
  const strengthScore = Object.values(passwordStrength).filter(Boolean).length
  const showError = (field: SignUpField) => (touched[field] || attemptedSubmit)
    ? errors[field]
    : undefined
  const passwordError = showError('password')
  const visiblePasswordError = passwordError === PASSWORD_CRITERIA_ERROR ? undefined : passwordError

  return (
    <AuthCard
      title="Create Account"
      subtitle="Register using your username and password."
      themeMode={themeMode}
      onToggleTheme={onToggleTheme}
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {submitError && <p className="auth-error">{submitError}</p>}

        <AuthInput
          id="signup-username"
          label="Username"
          name="username"
          type="text"
          value={values.username}
          placeholder="root_user"
          autoComplete="username"
          maxLength={24}
          icon="user"
          error={showError('username')}
          onBlur={handleBlur}
          onChange={handleChange}
        />

        <div className="auth-field-wrapper">
          <AuthInput
            id="signup-password"
            label="Password"
            name="password"
            type="password"
            value={values.password}
            placeholder="Create a password"
            autoComplete="new-password"
            maxLength={128}
            icon="lock"
            error={visiblePasswordError}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          {( values.password || attemptedSubmit) && (
            <div className="password-strength">
              <div className="password-strength-bar-container">
                <div
                  className={`password-strength-bar ${
                    strengthScore === 5
                      ? 'password-strength-bar--complete'
                      : 'password-strength-bar--incomplete'
                  }`}
                  style={{ width: `${(strengthScore / 5) * 100}%` }}
                />
              </div>
              <ul className="password-criteria-list">
                <li className={passwordStrength.length ? 'met' : ''}>At least 12 char</li>
                <li className={passwordStrength.uppercase ? 'met' : ''}>One uppercase</li>
                <li className={passwordStrength.lowercase ? 'met' : ''}>One lowercase</li>
                <li className={passwordStrength.digit ? 'met' : ''}>One digit</li>
                <li className={passwordStrength.special ? 'met' : ''}>One special</li>
              </ul>
            </div>
          )}
        </div>

        <AuthInput
          id="signup-confirm-password"
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          maxLength={128}
          icon="lock"
          error={showError('confirmPassword')}
          onBlur={handleBlur}
          onChange={handleChange}
        />

        <button className="auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <AuthSwitchLink
        text="Already have an account?"
        actionText="Sign in"
        onSwitch={onSwitchToSignIn}
      />
    </AuthCard>
  )
}
