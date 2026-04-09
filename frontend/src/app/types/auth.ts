export type AuthScreen = 'signin' | 'signup'
export type ThemeMode = 'light' | 'dark'

export interface SignInFormValues {
  email: string
  password: string
}

export interface SignUpFormValues {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export type FormErrors<T> = {
  [K in keyof T]?: string
}

export type SignInFormErrors = FormErrors<SignInFormValues>
export type SignUpFormErrors = FormErrors<SignUpFormValues>
