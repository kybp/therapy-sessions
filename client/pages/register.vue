<script setup lang="ts">
definePageMeta({
  middleware: 'check-not-signed-in',
})

const authStore = useAuthStore()

const username = ref('')
const password = ref('')

const usernameError = computed(() => {
  if (!username.value.length) return 'Username cannot be empty'
})

const passwordError = computed(() => {
  if (password.value.length < 8) return 'Password must be 8 characters'
})

const submitForm = async () => {
  const params = { username: username.value, password: password.value }
  await authStore.register(params)
  navigateTo('/dashboard')
}
</script>

<template>
  <form @submit.prevent="submitForm">
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

      <button type="submit">Register</button>
    </div>
  </form>
</template>
