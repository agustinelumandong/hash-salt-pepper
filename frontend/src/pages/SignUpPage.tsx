import { useState, type ChangeEvent, type FormEventHandler } from 'react'
import { AuthCard } from '../components/auth/AuthCard'
import { AuthInput } from '../components/auth/AuthInput'
import { AuthSwitchLink } from '../components/auth/AuthSwitchLink'
import type {
  SignUpFormErrors,
  SignUpFormValues,
  ThemeMode,
} from '../app/types/auth'

type SignUpPageProps = {
  onSwitchToSignIn: () => void
  themeMode: ThemeMode
  onToggleTheme: () => void
}

const initialValues: SignUpFormValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

function validateSignUp(values: SignUpFormValues): SignUpFormErrors {
  const errors: SignUpFormErrors = {}

  if (!values.name.trim()) {
    errors.name = 'Name is required.'
  }

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

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.'
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match.'
  }

  return errors
}

export function SignUpPage({
  onSwitchToSignIn,
  themeMode,
  onToggleTheme,
}: SignUpPageProps) {
  const [values, setValues] = useState<SignUpFormValues>(initialValues)
  const [errors, setErrors] = useState<SignUpFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }))

    setErrors((prev) => {
      if (!prev[name as keyof SignUpFormErrors]) {
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

    const nextErrors = validateSignUp(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    console.log('Sign up payload:', values)
    setIsSubmitting(false)
  }

  return (
    <AuthCard
      title="Create Account"
      subtitle="Set up your account to get started."
      themeMode={themeMode}
      onToggleTheme={onToggleTheme}
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <AuthInput
          id="signup-name"
          label="Name"
          name="name"
          type="text"
          value={values.name}
          placeholder="Your full name"
          autoComplete="name"
          error={errors.name}
          onChange={handleChange}
        />

        <AuthInput
          id="signup-email"
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
          id="signup-password"
          label="Password"
          name="password"
          type="password"
          value={values.password}
          placeholder="Create a password"
          autoComplete="new-password"
          error={errors.password}
          onChange={handleChange}
        />

        <AuthInput
          id="signup-confirm-password"
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          error={errors.confirmPassword}
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
