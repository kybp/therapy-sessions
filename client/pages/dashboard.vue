<script setup lang="ts">
definePageMeta({
  middleware: 'check-signed-in',
})

const authStore = useAuthStore()
const { account } = storeToRefs(authStore)

const sessionStore = useSessionStore()
const { sessions } = storeToRefs(sessionStore)

const title = computed(() => `${account.value.username}'s Dashboard`)

await sessionStore.fetchDashboard()
</script>

<template>
  <Title>{{ title }}</Title>
  <h1>{{ title }}</h1>
  <NuxtLink v-if="account.type === 'therapist'" to="/sessions/new"
    >Create</NuxtLink
  >
  <NuxtLink v-if="account.type === 'client'" to="/sessions/book">Book</NuxtLink>
  <ul>
    <li v-for="session in sessions" :key="session.username">
      <div v-if="account.type === 'client'">
        Session with {{ session.therapistName }} at {{ session.date }}
      </div>
      <div v-if="account.type === 'therapist' && session.clientName">
        Session with {{ session.clientName }} at {{ session.date }}
      </div>
      <div v-if="account.type === 'therapist' && !session.clientName">
        Open session at {{ session.date }}
      </div>
    </li>
  </ul>
</template>
