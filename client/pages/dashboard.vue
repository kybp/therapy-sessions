<script setup lang="ts">
const authStore = useAuthStore()
const { account } = storeToRefs(authStore)

const title = computed(() => `${account.value.username}'s Dashboard`)
</script>

<template>
  <Title>{{ title }}</Title>
  <h1>{{ title }}</h1>
</template>
