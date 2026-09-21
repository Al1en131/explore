<script setup lang="ts">
import '~/assets/css/typography.css'
import AppHeader from './components/AppHeader.vue'
import AppPreloader from './components/AppPreloader.vue'
</script>

<template>
  <main class="page-root">
    <!-- Global Preloader for Initial Load & Page Navigation -->
    <AppPreloader />

    <!-- Global Sticky App Header (Navbar) -->
    <AppHeader />

    <!-- Nuxt Page Router Rendering (/ or /product) -->
    <NuxtPage />
  </main>
</template>

<style scoped>
.page-root {
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  color: #000000;
  display: flex;
  flex-direction: column;
}
</style>
