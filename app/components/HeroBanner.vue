<script setup lang="ts">
import { onMounted, ref } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePreloader } from "~/composables/usePreloader";

const { onPreloaderComplete } = usePreloader();
const heroSectionRef = ref<HTMLElement | null>(null);
const titleRef = ref<HTMLElement | null>(null);
const imageRef = ref<HTMLElement | null>(null);

const splitElementChars = (element: HTMLElement) => {
  if (!element) return;
  element.style.opacity = "1";
  element.style.perspective = "1000px";

  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";
      if (!text.trim()) return;
      const frag = document.createDocumentFragment();
      const words = text.split(/(\s+)/);
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (!word) continue;
        if (/^\s+$/.test(word)) {
          frag.appendChild(document.createTextNode(word));
        } else {
          const wordSpan = document.createElement("span");
          wordSpan.style.display = "inline-block";
          wordSpan.style.whiteSpace = "nowrap";
          for (let j = 0; j < word.length; j++) {
            const charSpan = document.createElement("span");
            charSpan.className = "char-span";
            charSpan.style.display = "inline-block";
            charSpan.style.willChange = "transform, opacity";
            charSpan.textContent = word[j];
            wordSpan.appendChild(charSpan);
          }
          frag.appendChild(wordSpan);
        }
      }
      if (frag.childNodes.length > 0) {
        node.parentNode?.replaceChild(frag, node);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      Array.from(el.childNodes).forEach(walk);
    }
  };

  Array.from(element.childNodes).forEach(walk);
};

onMounted(() => {
  if (import.meta.client) {
    gsap.registerPlugin(ScrollTrigger);

    onPreloaderComplete(() => {
      // 1. Single-line Hero Title Reveal Per-Character Motion (subtle y: 30)
      if (titleRef.value) {
        splitElementChars(titleRef.value);
        const chars = titleRef.value.querySelectorAll(".char-span");
        if (chars.length > 0) {
          gsap.fromTo(
            chars,
            { y: 30, opacity: 0, rotateX: -20 },
            {
              y: 0,
              opacity: 1,
              rotateX: 0,
              duration: 1.2,
              stagger: 0.045,
              ease: "power2.out",
              delay: 0.1,
            }
          );
        }
      }

      // 2. Hero Image Entrance Clip-Path Curtain Reveal & Scroll Parallax
      if (imageRef.value) {
        gsap.fromTo(
          imageRef.value,
          {
            clipPath: "inset(100% 0% 0% 0%)",
            scale: 1.15,
            opacity: 0,
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1.0,
            opacity: 1,
            duration: 1.4,
            delay: 0.2,
            ease: "power3.inOut",
          },
        );

        gsap.to(imageRef.value, {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: heroSectionRef.value,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    });
  }
});
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
  font-size: 12vw; /* 187.96px / 15 */
  line-height: 12vw; /* 187.96px / 15 */
  letter-spacing: -0.04em; /* -4% letter spacing */
  white-space: nowrap;
  width: 100%;
  display: block;
  margin: 0;
}

.char-span {
  display: inline-block;
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
