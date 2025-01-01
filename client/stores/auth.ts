import { defineStore } from 'pinia'

export type RegisterParams = {
  username: string
  password: string
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

  const signIn = async ({ username, password }: SignInParams) => {
    const response = await useFetch<Account | null>('/api/auth/sign-in/', {
      method: 'POST',
      body: { username, password },
    })

    if (response.data.value) setAccount(response.data.value)

    return response
  }

  const register = async ({ username, password }: RegisterParams) => {
    const response = await useFetch<Account | null>('/api/auth/register/', {
      method: 'POST',
      body: { username, password },
    })

    if (response.data.value) setAccount(response.data.value)

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
