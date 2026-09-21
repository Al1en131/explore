<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const sectionRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLElement | null>(null)
const headingRef = ref<HTMLElement | null>(null)
const textRef = ref<HTMLElement | null>(null)

const splitElementWords = (element: HTMLElement) => {
  if (!element) return;
  element.style.opacity = '1';
  element.style.perspective = '1000px';

  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      if (!text.trim() && text !== ' ') return;
      const frag = document.createDocumentFragment();
      const parts = text.split(/(\s+)/);
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!part) continue;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(' '));
        } else {
          const span = document.createElement('span');
          span.className = 'word-span';
          span.style.display = 'inline-block';
          span.style.willChange = 'transform, opacity';
          span.style.transformOrigin = '50% 100%';
          span.textContent = part;
          frag.appendChild(span);
        }
      }
      if (frag.childNodes.length > 0) {
        node.parentNode?.replaceChild(frag, node);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      if (el.classList.contains('indent-space')) return;
      Array.from(el.childNodes).forEach(walk);
    }
  };

  Array.from(element.childNodes).forEach(walk);
};

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

    // 2. Text Reveal Entrance Word-by-Word Motion (subtle y: 30)
    if (sectionRef.value) {
      if (headingRef.value) {
        splitElementWords(headingRef.value)
        const words = headingRef.value.querySelectorAll('.word-span')
        if (words.length > 0) {
          gsap.fromTo(
            words,
            { y: 30, opacity: 0, rotateX: -20 },
            {
              y: 0,
              opacity: 1,
              rotateX: 0,
              duration: 0.75,
              stagger: 0.035,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: headingRef.value,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
              }
            }
          )
        }
      }

      if (textRef.value) {
        gsap.fromTo(
          textRef.value,
          {
            clipPath: 'inset(0% 0% 100% 0%)',
            y: 35,
            opacity: 0
          },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: textRef.value,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
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
            Fresh eyes see new possibilities for classic Eames designs,
            including a bold new colour palette and updated materials.
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
  padding-bottom: 8vw;
  background-color: #ffffff;
  box-sizing: border-box;
}

.parallax-viewport {
  width: 100%;
  height: clamp(380px, 93vw, 1395px); /* Fluid height matching aspect on all screens */
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
  padding: 5.3333vw var(--section-px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  pointer-events: none;
  z-index: 2;
}

.heading-container {
  width: 58.3723vw;
  max-width: 58.3723vw;
  text-align: left;
}

.parallax-h3 {
  color: #ffffff;
  margin: 0;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.35);
}

.char-span {
  display: inline-block;
  will-change: transform, opacity;
}

.indent-space {
  display: inline-block;
  width: 15vw;
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

.bottom-container {
  width: 13.3333vw;
  max-width: 13.3333vw;
  text-align: left;
}

.parallax-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: clamp(14px, 1.0667vw, 18px);
  line-height: 1.5;
  margin: 0;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.3);
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
  .heading-container {
    width: 100%;
    max-width: 90%;
  }
  .indent-space {
    width: clamp(40px, 10vw, 100px);
  }
}

@media (max-width: 768px) {
  .parallax-section {
    padding-bottom: 48px;
  }
  .parallax-viewport {
    height: clamp(360px, 80vh, 550px);
  }
  .overlay-content {
    padding: 32px var(--section-px);
  }
  .heading-container {
    width: 100%;
    max-width: 100%;
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
