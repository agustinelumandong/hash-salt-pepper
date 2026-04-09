import type { SignInFormValues, SignUpFormValues } from '../types/auth'

type ApiAuthResponse = {
  message: string
  username: string
}

type ApiErrorResponse = {
  detail?: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'

async function requestAuth(
  path: string,
  payload: SignInFormValues | Pick<SignUpFormValues, 'username' | 'password'>,
): Promise<ApiAuthResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    let fallbackMessage = 'Authentication request failed.'
    const errorPayload = ((await response.json().catch(() => null)) as ApiErrorResponse | null)
    if (errorPayload?.detail) {
      fallbackMessage = errorPayload.detail
    }

    throw new Error(fallbackMessage)
  }

  return (await response.json()) as ApiAuthResponse
}

export function signIn(values: SignInFormValues) {
  return requestAuth('/auth/login', values)
}

export function signUp(values: Pick<SignUpFormValues, 'username' | 'password'>) {
  return requestAuth('/auth/register', values)
}
