export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  if (authStore.isSignedIn) return navigateTo('/dashboard')
})
