<template>
  <div class="app">
    <header>
      <nav>
        <NuxtLink to="/">Home</NuxtLink>
      </nav>
    </header>

    <div>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.app {
  padding: 0.5rem 1rem;
  display: block;
}

header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

nav {
  display: flex;
  gap: 0.5rem;
}
</style>
