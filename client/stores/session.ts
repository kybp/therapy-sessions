import { defineStore } from 'pinia'

export type Session = {
  id: string
  therapist: number
  client: number | null
  date: string
}

export type CreateSessionParams = {
  date: string
}

export const useSessionStore = defineStore('session', () => {
  // The user's sessions to display on their dashboard
  const sessions = ref<Session[]>([])

  // A list of unbooked sessions
  const openSessions = ref<Session[]>([])

  const fetchDashboardErrors = ref<string[] | null>(null)

  const fetchDashboard = async () => {
    const authStore = useAuthStore()
    const token = authStore.account?.token

    const response = await useFetch<Session[]>('/api/sessions/', {
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    })

    if (response.data.value) sessions.value = response.data.value
    if (response.error.value) {
      fetchDashboardErrors.value = response.error.value.data.data
    }

    return response
  }

  const fetchOpenSessionsErrors = ref<string[] | null>(null)

  const fetchOpenSessions = async () => {
    const authStore = useAuthStore()
    const token = authStore.account?.token

    const response = await useFetch<Session[]>('/api/sessions/open', {
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    })

    if (response.data.value) openSessions.value = response.data.value
    if (response.error.value) {
      fetchOpenSessionsErrors.value = response.error.value.data.data
    }

    return response
  }

  const create = async ({ date }: CreateSessionParams) => {
    const authStore = useAuthStore()
    const token = authStore.account?.token

    const response = await useFetch<Session>('/api/sessions', {
      method: 'POST',
      body: { date },
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    })

    if (response.data.value) {
      sessions.value = sessions.value.concat(response.data.value)
    }
  }

  const book = async (session: Session) => {
    const authStore = useAuthStore()
    const token = authStore.account?.token

    const response = await useFetch<Session>(
      `/api/sessions/${session.id}/book`,
      {
        method: 'POST',
        headers: {
          authorization: token ? `Bearer ${token}` : '',
        },
      },
    )

    const newSession = response.data.value
    if (newSession) {
      const newSessions = sessions.value.slice()
      for (let i = 0; i < newSessions.length; ++i) {
        if (newSessions[i].id === newSession.id) {
          newSessions[i] = newSession
          break
        }
      }

      sessions.value = newSessions
    }
  }

  return {
    sessions,
    openSessions,
    fetchDashboard,
    fetchDashboardErrors,
    fetchOpenSessions,
    fetchOpenSessionsErrors,
    create,
    book,
  }
})

export type SessionsStore = ReturnType<typeof useSessionStore>
