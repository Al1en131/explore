<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const sectionRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLElement | null>(null)
const headingRef = ref<HTMLElement | null>(null)
const textRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (import.meta.client) {
    gsap.registerPlugin(ScrollTrigger)

    // 1. Image Scroll Parallax Effect
    if (imageRef.value && sectionRef.value) {
      gsap.to(imageRef.value, {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      })
    }

    // 2. Text Reveal Entrance Fade Up
    if (sectionRef.value) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      })

      if (headingRef.value) {
        tl.fromTo(
          headingRef.value,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }
        )
      }

      if (textRef.value) {
        tl.fromTo(
          textRef.value,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
          '-=0.7'
        )
      }
    }
  }
})
</script>

<template>
  <section ref="sectionRef" class="parallax-section">
    <!-- Parallax Image Viewport with exact 1395px height -->
    <div class="parallax-viewport">
      <!-- High-res clean dummy background image -->
      <img
        ref="imageRef"
        src="/images/parallax-dummy.jpg"
        alt="Editorial Interior Collection"
        class="parallax-image"
      />

      <!-- Content Overlay -->
      <div class="overlay-content">
        <!-- Top Right Heading Container (exact width 875.58447265625px) -->
        <div class="heading-container">
          <h3 ref="headingRef" class="h3 parallax-h3">
            <span class="indent-space"></span>Maréchal Verchetti is built on a legacy of creative partnership. In a first-of-its-kind collaboration, the Frankliné Jeremy design house thought fully reimagines <span class="nowrap-phrase">eight <span class="dot-symbol">●</span></span>
          </h3>
        </div>

        <!-- Bottom Right Paragraph Container (exact width 238px) -->
        <div class="bottom-container">
          <p ref="textRef" class="body-text parallax-text">
            Fresh eyes see new possibilities for classic Eames designs, including a bold new colour palette and updated materials.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.parallax-section {
  width: 100%;
  padding-left: 0px;
  padding-right: 0px;
  padding-bottom: 120px;
  background-color: #ffffff;
  box-sizing: border-box;
}

.parallax-viewport {
  width: 100%;
  height: 1395px; /* Exact height requested by user */
  position: relative;
  overflow: hidden;
}

.parallax-image {
  position: absolute;
  top: -15%;
  left: 0;
  width: 100%;
  height: 130%;
  object-fit: cover;
  will-change: transform;
}

.overlay-content {
  position: absolute;
  inset: 0;
  padding: 80px var(--section-px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  pointer-events: none;
  z-index: 2;
}

.heading-container {
  width: 875.58447265625px;
  max-width: 875.58447265625px;
  text-align: left;
}

.parallax-h3 {
  color: #ffffff;
  margin: 0;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.35);
}

.indent-space {
  display: inline-block;
  width: 200px;
}

.nowrap-phrase {
  white-space: nowrap;
  display: inline;
}

.dot-symbol {
  display: inline;
  font-size: 0.65em;
  vertical-align: middle;
  margin-left: 6px;
}

.bottom-container {
  width: 200px;
  max-width: 200px;
  text-align: left;
}

.parallax-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  line-height: 24px;
  margin: 0;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.3);
}

@media (max-width: 1024px) {
  .parallax-viewport {
    height: 900px;
  }
  .heading-container {
    width: 100%;
    max-width: 90%;
  }
  .indent-space {
    width: 100px;
  }
}

@media (max-width: 768px) {
  .parallax-section {
    padding-bottom: 60px;
  }
  .parallax-viewport {
    height: 650px;
  }
  .overlay-content {
    padding: 24px;
  }
  .bottom-container {
    width: 100%;
    max-width: 100%;
  }
  .indent-space {
    display: none;
  }
}
</style>
