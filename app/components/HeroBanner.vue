<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const heroSectionRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (import.meta.client) {
    gsap.registerPlugin(ScrollTrigger)

    const timeline = gsap.timeline({ defaults: { ease: 'power4.out' } })

    // 1. Hero Title Reveal
    if (titleRef.value) {
      timeline.fromTo(
        titleRef.value,
        {
          y: 60,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.3,
          delay: 0.35
        }
      )
    }

    // 2. Hero Image Entrance Reveal
    if (imageRef.value) {
      timeline.fromTo(
        imageRef.value,
        {
          scale: 1.12,
          opacity: 0
        },
        {
          scale: 1.0,
          opacity: 1,
          duration: 1.4,
          ease: 'power3.out'
        },
        '-=0.9'
      )

      // 3. Scroll Parallax Effect on Hero Image
      gsap.to(imageRef.value, {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSectionRef.value,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      })
    }
  }
})
</script>

<template>
  <section ref="heroSectionRef" class="hero-section">
    <!-- Big Title in hero banner using exact spec -->
    <div class="heading-wrapper">
      <h1 ref="titleRef" class="hero-title">Maréchal Verchetti</h1>
    </div>

    <!-- Hero Image Banner -->
    <div class="banner-container">
      <img
        ref="imageRef"
        src="/images/hero-banner-original.jpg"
        alt="Maréchal Verchetti Modern Furniture Collection"
        class="hero-image"
      />
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  width: 100%;
  padding-top: 13vw;
  padding-bottom: 3.6305vw;
  padding-left: var(--section-px);
  padding-right: var(--section-px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.heading-wrapper {
  width: 100%;
  overflow: hidden;
  margin-top: 1.6vw;
  margin-bottom: 1.6vw;
  text-align: left;
}

.hero-title {
  font-family: 'PP Neue Montreal', var(--font-family-base);
  font-weight: 500;
  font-size: 12.400vw; /* 187.96px / 15 */
  line-height: 12.400vw; /* 187.96px / 15 */
  letter-spacing: -0.04em; /* -4% letter spacing */
  white-space: nowrap;
  width: 100%;
  display: block;
  margin: 0;
  opacity: 0; /* Animated by GSAP */
  will-change: transform, opacity;
}

.banner-container {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  opacity: 0; /* Animated by GSAP */
  will-change: transform, opacity;
}

@media (max-width: 768px) {
  .hero-section {
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 24px;
  }
  
  .heading-wrapper {
    margin-top: 12px;
    margin-bottom: 16px;
  }
}
</style>
