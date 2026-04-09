import { useState, type ChangeEvent, type FormEventHandler } from 'react'
import { AuthCard } from '../components/auth/AuthCard'
import { AuthInput } from '../components/auth/AuthInput'
import { AuthSwitchLink } from '../components/auth/AuthSwitchLink'
import type {
  SignInFormErrors,
  SignInFormValues,
  ThemeMode,
} from '../app/types/auth'

type SignInPageProps = {
  onSwitchToSignUp: () => void
  themeMode: ThemeMode
  onToggleTheme: () => void
}

const initialValues: SignInFormValues = {
  email: '',
  password: '',
}

function validateSignIn(values: SignInFormValues): SignInFormErrors {
  const errors: SignInFormErrors = {}

  if (!values.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!values.password) {
    errors.password = 'Password is required.'
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.'
  }

  return errors
}

export function SignInPage({
  onSwitchToSignUp,
  themeMode,
  onToggleTheme,
}: SignInPageProps) {
  const [values, setValues] = useState<SignInFormValues>(initialValues)
  const [errors, setErrors] = useState<SignInFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }))

    setErrors((prev) => {
      if (!prev[name as keyof SignInFormErrors]) {
        return prev
      }

      return {
        ...prev,
        [name]: undefined,
      }
    })
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    const nextErrors = validateSignIn(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    console.log('Sign in payload:', values)
    setIsSubmitting(false)
  }

  return (
    <AuthCard
      title="Sign In"
      subtitle="Welcome back. Enter your credentials to continue."
      themeMode={themeMode}
      onToggleTheme={onToggleTheme}
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <AuthInput
          id="signin-email"
          label="Email"
          name="email"
          type="email"
          value={values.email}
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email}
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
          error={errors.password}
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
