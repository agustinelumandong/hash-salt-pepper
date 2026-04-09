import { useState, type ChangeEvent, type FocusEvent, type FormEvent } from 'react'
import { AuthCard } from '../components/auth/AuthCard'
import { AuthInput } from '../components/auth/AuthInput'
import { AuthSwitchLink } from '../components/auth/AuthSwitchLink'
import { signIn } from '../app/api/auth'
import type {
  SignInFormErrors,
  SignInFormValues,
  ThemeMode,
} from '../app/types/auth'

type SignInPageProps = {
  onSwitchToSignUp: () => void
  onSuccess: (username: string) => void
  themeMode: ThemeMode
  onToggleTheme: () => void
}

const initialValues: SignInFormValues = {
  username: '',
  password: '',
}

type SignInField = keyof SignInFormValues

const usernamePattern = /^[A-Za-z][A-Za-z0-9_]{2,23}$/

const commonWeakPasswords = new Set([
  '12345678',
  'password',
  'qwerty123',
  'letmein123',
])

function validateSignInField(field: SignInField, values: SignInFormValues): string | undefined {
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

  if (!value) {
    return 'Password is required.'
  }

  if (value.length < 8) {
    return 'Password must be at least 8 characters.'
  }

  if (commonWeakPasswords.has(value.toLowerCase())) {
    return 'Use a less common password.'
  }

  if (/^\d+$/.test(value)) {
    return 'Password cannot be only numbers.'
  }

  if (value.length > 128) {
    return 'Password must be 128 characters or fewer.'
  }

  return undefined
}

function validateSignIn(values: SignInFormValues): SignInFormErrors {
  const errors: SignInFormErrors = {}

  const usernameError = validateSignInField('username', values)
  const passwordError = validateSignInField('password', values)

  if (usernameError) {
    errors.username = usernameError
  }

  if (passwordError) {
    errors.password = passwordError
  }

  return errors
}

export function SignInPage({
  onSwitchToSignUp,
  onSuccess,
  themeMode,
  onToggleTheme,
}: SignInPageProps) {
  const [values, setValues] = useState<SignInFormValues>(initialValues)
  const [errors, setErrors] = useState<SignInFormErrors>({})
  const [touched, setTouched] = useState<Record<SignInField, boolean>>({
    username: false,
    password: false,
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

    const field = name as SignInField
    if (!touched[field] && !attemptedSubmit) {
      return
    }

    const nextValues = {
      ...values,
      [field]: value,
    }

    const nextError = validateSignInField(field, nextValues)
    setErrors((prev) => ({
      ...prev,
      [field]: nextError,
    }))
  }

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    const field = event.target.name as SignInField
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }))

    const nextError = validateSignInField(field, values)
    setErrors((prev) => ({
      ...prev,
      [field]: nextError,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAttemptedSubmit(true)
    setTouched({ username: true, password: true })

    const nextErrors = validateSignIn(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await signIn(values)
      onSuccess(response.username)
      setIsSubmitting(false)
      return
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to sign in right now.')
    }

    setIsSubmitting(false)
  }

  const shouldShowUsernameError = (touched.username || attemptedSubmit)
    ? errors.username
    : undefined
  const shouldShowPasswordError = (touched.password || attemptedSubmit)
    ? errors.password
    : undefined

  return (
    <AuthCard
      title="Sign In"
      subtitle="Welcome back. Enter your credentials to continue."
      themeMode={themeMode}
      onToggleTheme={onToggleTheme}
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {submitError && <p className="auth-error">{submitError}</p>}

        <AuthInput
          id="signin-username"
          label="Username"
          name="username"
          type="text"
          value={values.username}
          placeholder="root_user"
          autoComplete="username"
          maxLength={24}
          icon="user"
          error={shouldShowUsernameError}
          onBlur={handleBlur}
          onChange={handleChange}
        />

        <AuthInput
          id="signin-password"
          label="Password"
          name="password"
          type="password"
          value={values.password}
          placeholder="Enter your password"
          autoComplete="current-password"
          maxLength={128}
          icon="lock"
          error={shouldShowPasswordError}
          onBlur={handleBlur}
          onChange={handleChange}
        />

        <button className="auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <AuthSwitchLink
        text="No account yet?"
        actionText="Create one"
        onSwitch={onSwitchToSignUp}
      />
    </AuthCard>
  )
}
