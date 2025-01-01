<script setup lang="ts">
definePageMeta({
  middleware: 'check-not-signed-in',
})
</script>

<template>
  <Title>Therapy Sessions</Title>

  <NuxtLink data-testid="register-link" to="/register">Register</NuxtLink>
  <NuxtLink data-testid="sign-in-link" to="/sign-in">Sign In</NuxtLink>
</template>
