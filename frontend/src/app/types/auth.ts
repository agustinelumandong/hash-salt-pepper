export type AuthScreen = 'signin' | 'signup' | 'success'
export type ThemeMode = 'light' | 'dark'

export type AuthSuccessKind = 'signin' | 'signup'

export interface SignInFormValues {
  username: string
  password: string
}

export interface SignUpFormValues {
  username: string
  password: string
  confirmPassword: string
}

export type FormErrors<T> = {
  [K in keyof T]?: string
}

export type SignInFormErrors = FormErrors<SignInFormValues>
export type SignUpFormErrors = FormErrors<SignUpFormValues>
