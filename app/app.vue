<script setup lang="ts">
import '~/assets/css/typography.css'
import AppHeader from './components/AppHeader.vue'
import HeroBanner from './components/HeroBanner.vue'
import IntroSection from './components/IntroSection.vue'
import GallerySection from './components/GallerySection.vue'
import MarqueeSection from './components/MarqueeSection.vue'
import ParallaxSection from './components/ParallaxSection.vue'
import CollectiveSection from './components/CollectiveSection.vue'
</script>

<template>
  <main class="page-root">
    <!-- Section Header (Navbar) -->
    <AppHeader />

    <!-- Hero Banner Section -->
    <HeroBanner />

    <!-- Editorial Intro Section (Below Hero Banner) -->
    <IntroSection />

    <!-- Draggable Gallery Section (Below Intro Section) -->
    <GallerySection />

    <!-- Directional Marquee Section (Below Gallery Section) -->
    <MarqueeSection />

    <!-- Parallax Image Editorial Banner Section -->
    <ParallaxSection />

    <!-- Another Collective Section (Herman Miller x HAY) -->
    <CollectiveSection />
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
