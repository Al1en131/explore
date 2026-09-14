<script setup lang="ts">
import HeroBanner from '~/components/HeroBanner.vue'
import IntroSection from '~/components/IntroSection.vue'
import GallerySection from '~/components/GallerySection.vue'
import MarqueeSection from '~/components/MarqueeSection.vue'
import ParallaxSection from '~/components/ParallaxSection.vue'
import CollectiveSection from '~/components/CollectiveSection.vue'
</script>

<template>
  <div class="home-page">
    <!-- Hero Banner Section -->
    <HeroBanner />

    <!-- Editorial Intro Section -->
    <IntroSection />

    <!-- Draggable Gallery Section -->
    <GallerySection />

    <!-- Directional Marquee Section -->
    <MarqueeSection />

    <!-- Parallax Image Banner Section -->
    <ParallaxSection />

    <!-- Another Collective Section (Herman Miller x HAY) -->
    <CollectiveSection />
  </div>
</template>
