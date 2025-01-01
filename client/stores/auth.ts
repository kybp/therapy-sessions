import { defineStore } from 'pinia'

export type RegisterParams = {
  username: string
  password: string
  type: 'client' | 'therapist'
}

export type SignInParams = {
  username: string
  password: string
}

export type Account = {
  id: number
  username: string
  token: string
}

export const useAuthStore = defineStore('auth', () => {
  const cookie = useCookie<Account | null>('account')

  /** The currently signed-in user, or `null` if we're signed out. */
  const account = ref<Account | null>(cookie.value || null)

  const signInErrors = ref<Record<string, string[]>>({})

  const signIn = async ({ username, password }: SignInParams) => {
    const response = await useFetch<Account | null>('/api/auth/sign-in/', {
      method: 'POST',
      body: { username, password },
    })

    if (response.data.value) setAccount(response.data.value)
    if (response.error.value) {
      signInErrors.value = response.error.value.data.data
    }

    return response
  }

  const registerErrors = ref<Record<string, string[]>>({})

  const register = async ({ username, password, type }: RegisterParams) => {
    const response = await useFetch<Account | null>('/api/auth/register/', {
      method: 'POST',
      body: { username, password, type },
    })

    if (response.data.value) setAccount(response.data.value)
    if (response.error.value) {
      registerErrors.value = response.error.value.data.data
    }

    return response
  }

  const setAccount = (newAccount: Account | null): void => {
    account.value = newAccount
    cookie.value = newAccount
  }

  const isSignedIn = computed(() => account.value !== null)

  return {
    account,
    isSignedIn,
    signIn,
    register,
  }
})

export type AuthStore = ReturnType<typeof useAuthStore>
