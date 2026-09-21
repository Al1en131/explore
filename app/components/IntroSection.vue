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

const splitElementWords = (element: HTMLElement) => {
  if (!element) return;
  element.style.opacity = "1";
  element.style.perspective = "1000px";

  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";
      if (!text.trim() && text !== " ") return;
      const frag = document.createDocumentFragment();
      const parts = text.split(/(\s+)/);
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!part) continue;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(" "));
        } else {
          const span = document.createElement("span");
          span.className = "word-span";
          span.style.display = "inline-block";
          span.style.willChange = "transform, opacity";
          span.style.transformOrigin = "50% 100%";
          span.textContent = part;
          frag.appendChild(span);
        }
      }
      if (frag.childNodes.length > 0) {
        node.parentNode?.replaceChild(frag, node);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      if (el.classList.contains("indent-space")) return;
      Array.from(el.childNodes).forEach(walk);
    }
  };

  Array.from(element.childNodes).forEach(walk);
};

onMounted(() => {
  if (import.meta.client) {
    gsap.registerPlugin(ScrollTrigger);

    if (sectionRef.value) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // 1. Heading Word-by-Word Motion (subtle y: 30)
      if (headingRef.value) {
        splitElementWords(headingRef.value);
        const words = headingRef.value.querySelectorAll(".word-span");
        if (words.length > 0) {
          tl.fromTo(
            words,
            { y: 30, opacity: 0, rotateX: -20 },
            {
              y: 0,
              opacity: 1,
              rotateX: 0,
              duration: 0.75,
              stagger: 0.035,
              ease: "power2.out",
            },
          );
        }
      }

      // 2. Underline Line ScaleX Reveal (FIRST before bottom row <p> text)
      if (lineRef.value) {
        tl.fromTo(
          lineRef.value,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.9,
            ease: "power3.inOut",
          },
          "-=0.3",
        );
      }

      // 3. Bottom Row Reveal (Label & Paragraph <p> reveal AFTER the line is drawn)
      if (bottomRowRef.value) {
        const labelEl = bottomRowRef.value.querySelector(".bottom-left");
        const pEl = bottomRowRef.value.querySelector(".body-text");

        if (labelEl) {
          tl.fromTo(
            labelEl,
            { y: 25, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
            },
            "-=0.2",
          );
        }

        if (pEl) {
          tl.fromTo(
            pEl,
            {
              clipPath: "inset(0% 0% 100% 0%)",
              y: 35,
              opacity: 0,
            },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power2.out",
            },
            "-=0.4",
          );
        }
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

.line-reveal {
  display: block;
  overflow: hidden;
  text-indent: 0;
}

.line-content {
  display: block;
  will-change: transform, opacity;
}

@media (max-width: 1024px) {
  .indent-space {
    width: clamp(40px, 10vw, 100px) !important;
  }
}

@media (max-width: 768px) {
  .intro-section {
    padding-left: var(--section-px);
    padding-right: var(--section-px);
    padding-top: 48px;
    padding-bottom: 48px;
  }

  .intro-container {
    max-width: 100%;
  }

  .indent-space {
    display: none;
  }

  .bottom-row {
    flex-direction: column;
    gap: 16px;
  }

  .bottom-right {
    max-width: 100%;
  }

  .bottom-right p {
    width: 320px;
  }

  /* .intro-h2 {
    width: 380px;
  } */
}
</style>
