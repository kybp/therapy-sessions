<script setup lang="ts">
const sessionStore = useSessionStore()
const { openSessions } = storeToRefs(sessionStore)

await sessionStore.fetchOpenSessions()

const session = ref<Session | null>(null)
const selectedSession = ref('')

const formatSession = (session: Session) =>
  `${session.therapistName} at ${session.date}`

const selectSession = () => {
  const selection = openSessions.value.find(
    (s) => formatSession(s) == selectedSession.value,
  )
  session.value = selection
}

const submitForm = async () => {
  if (!session.value) {
    console.error('no session selected')
    return
  }

  await sessionStore.book(session.value)
  navigateTo('/dashboard')
}
</script>

<template>
  <form @submit.prevent="submitForm">
    <select v-model="selectedSession" @change="selectSession">
      <option v-for="session in openSessions" :key="session.id">
        {{ formatSession(session) }}
      </option>
    </select>
    <button type="submit">Book Session</button>
  </form>
</template>
