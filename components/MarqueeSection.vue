<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const sectionRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
let marqueeTween: gsap.core.Tween | null = null
let scrollTriggerInstance: ScrollTrigger | null = null

onMounted(() => {
  if (import.meta.client) {
    gsap.registerPlugin(ScrollTrigger)

    if (trackRef.value) {
      // 1. Infinite horizontal marquee loop
      marqueeTween = gsap.to(trackRef.value, {
        xPercent: -50,
        repeat: -1,
        duration: 25,
        ease: 'none'
      })

      // 2. ScrollTrigger directional & velocity responsiveness
      if (sectionRef.value) {
        scrollTriggerInstance = ScrollTrigger.create({
          trigger: sectionRef.value,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            if (!marqueeTween) return
            // Change direction based on scroll direction (1 = down, -1 = up)
            const direction = self.direction || 1
            const velocity = Math.abs(self.getVelocity()) / 300
            const targetTimeScale = direction * (1 + velocity)

            gsap.to(marqueeTween, {
              timeScale: targetTimeScale,
              duration: 0.4,
              overwrite: 'auto',
              ease: 'power1.out'
            })
          }
        })
      }
    }
  }
})

onUnmounted(() => {
  if (marqueeTween) marqueeTween.kill()
  if (scrollTriggerInstance) scrollTriggerInstance.kill()
})
</script>

<template>
  <section ref="sectionRef" class="marquee-section">
    
    <!-- Infinite Horizontal Marquee Container -->
    <div class="marquee-viewport">
      <div ref="trackRef" class="marquee-track">
        <span class="heading marquee-text">Fine forms, — Refined.</span>
        <span class="heading marquee-text">Fine forms, — Refined.</span>
        <span class="heading marquee-text">Fine forms, — Refined.</span>
        <span class="heading marquee-text">Fine forms, — Refined.</span>
      </div>
    </div>

    <!-- Bottom Meta Row matching reference screenshot media_1789409064360.png -->
    <div class="marquee-bottom-row">
      <div class="bottom-left">
        <span class="label">/ THESE CHAIRS CAN BE</span>
      </div>
      <div class="bottom-right">
        <p class="body-text">
          Fresh eyes see new possibilities for classic Eames designs, including a bold new colour palette and updated materials.
        </p>
      </div>
    </div>

  </section>
</template>

<style scoped>
.marquee-section {
  width: 100%;
  padding-top: 80px;
  padding-bottom: 120px;
  background-color: #ffffff;
  overflow: hidden;
}

.marquee-viewport {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  margin-bottom: 60px;
}

.marquee-track {
  display: inline-flex;
  white-space: nowrap;
  will-change: transform;
}

.marquee-text {
  display: inline-block;
  white-space: nowrap;
  padding-right: 48px; /* Gap between marquee phrases */
  user-select: none;
}

/* Bottom Row Layout matching original design with padding-right 170px */
.marquee-bottom-row {
  width: 100%;
  padding-left: var(--section-px);
  padding-right: var(--section-px);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;
}

.bottom-left {
  flex-shrink: 0;
}

.bottom-right {
  max-width: 377px;
  margin-right: 170px;
}

@media (max-width: 1024px) {
  .bottom-right {
    margin-right: 0;
  }
}

@media (max-width: 768px) {
  .marquee-section {
    padding-top: 40px;
    padding-bottom: 60px;
  }

  .marquee-bottom-row {
    flex-direction: column;
    gap: 20px;
  }

  .bottom-right {
    padding-right: 0;
    max-width: 100%;
  }
}
</style>
