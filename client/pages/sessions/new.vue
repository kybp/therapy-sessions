<script setup lang="ts">
const time = ref('')
const date = ref('')

const sessionStore = useSessionStore()

const submitForm = async () => {
  const [year, month, day] = date.value.split('-').map(Number)
  const [hour, minute] = time.value.split(':').map(Number)

  const sessionDate = new Date(year, month - 1, day, hour, minute)
  await sessionStore.create({ date: sessionDate.toISOString() })
  navigateTo('/dashboard')
}
</script>

<template>
  <form @submit.prevent="submitForm">
    <input type="time" v-model="time" />
    <input type="date" v-model="date" />
    <button type="submit">Create Session</button>
  </form>
</template>
