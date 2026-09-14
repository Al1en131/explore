<script setup lang="ts">
import '~/assets/css/typography.css'
import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <main class="page-root">
    <!-- Global Sticky App Header (Navbar) -->
    <AppHeader />

    <!-- Nuxt Page Router Rendering (/ or /product) -->
    <NuxtPage />
  </main>
</template>

<style scoped>
.page-root {
  min-height: 100vh;
  background-color: #ffffff;
  color: #000000;
  display: flex;
  flex-direction: column;
}
</style>
