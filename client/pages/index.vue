<script setup lang="ts">
const username = ref('')
const password = ref('')
const id = ref<number | null>(null)

const usernameError = computed(() => {
  if (!username.value.length) return 'Username cannot be empty'
})

const passwordError = computed(() => {
  if (password.value.length < 8) return 'Password must be 8 characters'
})

const submitForm = async () => {
  const response = await useFetch<string>('/api/auth/register/', {
    method: 'POST',
    body: { username: username.value, password: password.value },
  })

  id.value = response.data.value.id
}
</script>

<template>
  <Title v-if="id">{{ id }} Dashboard</Title>
  <Title v-else>Therapy Sessions</Title>

  <h1 v-if="id">{{ id }} Dashboard</h1>
  <form v-else @submit.prevent="submitForm">
    <div class="field">
      <label for="username">Username:</label>
      <input
        data-testid="username-input"
        id="username"
        type="text"
        v-model="username"
      />
      <p v-if="usernameError" class="error">{{ usernameError }}</p>

      <label for="password">Password:</label>
      <input
        data-testid="password-input"
        id="password"
        type="password"
        v-model="password"
      />
      <p v-if="passwordError" class="error">{{ passwordError }}</p>

      <button type="submit">Submit</button>
    </div>
  </form>
</template>
