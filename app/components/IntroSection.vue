<script setup lang="ts">
import { onMounted, ref } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const props = defineProps({
  indent: {
    type: String,
    default: "19vw",
  },
});

const sectionRef = ref<HTMLElement | null>(null);
const headingRef = ref<HTMLElement | null>(null);
const lineRef = ref<HTMLElement | null>(null);
const bottomRowRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (import.meta.client) {
    gsap.registerPlugin(ScrollTrigger);

    if (sectionRef.value) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      // 1. Heading Fade Up Reveal
      if (headingRef.value) {
        tl.fromTo(
          headingRef.value,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" },
        );
      }

      // 2. Underline Line ScaleX Reveal
      if (lineRef.value) {
        tl.fromTo(
          lineRef.value,
          { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: "power3.inOut" },
          "-=0.7",
        );
      }

      // 3. Bottom Row Reveal (Label & Paragraph)
      if (bottomRowRef.value) {
        const items = bottomRowRef.value.children;
        tl.fromTo(
          items,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.15,
            ease: "power3.out",
          },
          "-=0.5",
        );
      }
    }
  }
});
</script>

<template>
  <section ref="sectionRef" class="intro-section">
    <!-- Main Right-aligned block with exact width 1089.74658203125px -->
    <div class="intro-container">
      <!-- Top Large Heading with 250px inline indent & nowrap dot phrase -->
      <div class="heading-wrapper">
        <h2 ref="headingRef" class="h2 intro-h2">
          <span class="indent-space" :style="{ width: indent }"></span>Maréchal
          Verchetti is built on a legacy of creative partnership. In a
          first-of-its-kind collaboration, the Frankliné Jeremy design house
          thought fully reimagines
          <span class="nowrap-phrase"
            >eight <span class="dot-symbol">●</span></span
          >
        </h2>
      </div>

      <!-- Underline Line spanning the width of this block -->
      <div ref="lineRef" class="underline-line"></div>

      <!-- Bottom Row directly below underline -->
      <div ref="bottomRowRef" class="bottom-row">
        <div class="bottom-left">
          <span class="label">/ THESE CHAIRS CAN BE</span>
        </div>
        <div class="bottom-right">
          <p class="body-text">
            These chairs can be upholstered in just about any fabric you like.
            When upholstered, the chair's back and seat have exposed veneer on
            the back sides. Veneers are available in six wood.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.intro-section {
  width: 100%;
  padding-top: 3.6305vw;
  padding-bottom: 8vw;
  padding-left: var(--section-px);
  padding-right: var(--section-px);
  background-color: #ffffff;
  display: flex;
  justify-content: flex-end;
  box-sizing: border-box;
}

.intro-container {
  width: 100%;
  max-width: 72.6498vw;
  display: flex;
  flex-direction: column;
}

.heading-wrapper {
  width: 100%;
  margin-bottom: 4vw;
}

.intro-h2 {
  color: #000000;
  margin: 0;
  opacity: 0; /* Animated by GSAP */
  will-change: transform, opacity;
}

.indent-space {
  display: inline-block;
}

.nowrap-phrase {
  white-space: nowrap;
  display: inline;
}

.dot-symbol {
  display: inline-block;
  font-size: 0.9em;
  vertical-align: middle;
  transform: translateY(-0.1em);
  margin-left: 0.1vw;
}

.underline-line {
  width: 100%;
  height: 1px;
  background-color: #000000;
  margin-bottom: 1.6vw;
  transform-origin: left center;
  will-change: transform;
}

.bottom-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2.6667vw;
}

.bottom-left {
  flex-shrink: 0;
  will-change: transform, opacity;
}

.bottom-right {
  max-width: 33.0667vw;
  will-change: transform, opacity;
}

@media (max-width: 1024px) {
  .indent-space {
    width: 100px !important;
  }
}

@media (max-width: 768px) {
  .intro-section {
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 60px;
    padding-bottom: 60px;
  }

  .indent-space {
    display: none;
  }

  .bottom-row {
    flex-direction: column;
    gap: 20px;
  }

  .bottom-right {
    max-width: 100%;
  }
}
</style>
