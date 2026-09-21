<script setup lang="ts">
import { onMounted, ref } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const sectionRef = ref<HTMLElement | null>(null);
const topTextRef = ref<HTMLElement | null>(null);
const bannerRef = ref<HTMLElement | null>(null);
const bannerImgRef = ref<HTMLElement | null>(null);
const bottomTitleRef = ref<HTMLElement | null>(null);

const splitElementWords = (element: HTMLElement) => {
  if (!element) return;
  element.style.opacity = "1";
  element.style.perspective = "1000px";

  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";
      if (!text.trim()) return;
      const frag = document.createDocumentFragment();
      const parts = text.split(/(\s+)/);
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!part) continue;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
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
      if (el.classList.contains("indent-space") || el.tagName === "BR") return;
      Array.from(el.childNodes).forEach(walk);
    }
  };

  Array.from(element.childNodes).forEach(walk);
};

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

    if (sectionRef.value) {
      // 1. Top text Word-by-Word Motion (subtle y: 30)
      if (topTextRef.value) {
        splitElementWords(topTextRef.value);
        const words = topTextRef.value.querySelectorAll(".word-span");
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
              ease: "power2.out",
              scrollTrigger: {
                trigger: topTextRef.value,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            },
          );
        }
      }

      // 2. Middle Banner Image Clip-Path Curtain Reveal & Parallax
      if (bannerRef.value && bannerImgRef.value) {
        gsap.fromTo(
          bannerRef.value,
          {
            clipPath: "inset(100% 0% 0% 0%)",
            opacity: 0,
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            duration: 1.4,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: bannerRef.value,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );

        gsap.fromTo(
          bannerImgRef.value,
          { scale: 1.15 },
          {
            scale: 1.0,
            duration: 1.4,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: bannerRef.value,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );

        gsap.to(bannerImgRef.value, {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: bannerRef.value,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // 3. Bottom Single-Line Title Per-Character Motion (subtle y: 30)
      if (bottomTitleRef.value) {
        splitElementChars(bottomTitleRef.value);
        const chars = bottomTitleRef.value.querySelectorAll(".char-span");
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
              scrollTrigger: {
                trigger: bottomTitleRef.value,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            },
          );
        }
      }
    }
  }
});
</script>

<template>
  <section ref="sectionRef" class="collective-section">
    <!-- Top Text Block (Positioned Left, width 1097px, H2 style with indent) -->
    <div class="top-text-wrapper">
      <h2 ref="topTextRef" class="h2 collective-h2">
        <span class="indent-space"></span>Herman Miller is built on a legacy of creative partnership. In a first-of-its-kind collaboration, the Danish design house HAY
      </h2>
    </div>

    <!-- Middle Image Banner Container (Exact Height 875.76513671875px) -->
    <div ref="bannerRef" class="banner-container">
      <div class="banner-viewport">
        <img
          ref="bannerImgRef"
          src="/images/collective-banner.jpg"
          alt="Herman Miller x HAY Chairs Collection"
          class="banner-image"
        />
      </div>
    </div>

    <!-- Bottom Display Title ("Another Collective" exact spec: 190.71px font-size/line-height, -4% letter-spacing) -->
    <div class="bottom-title-wrapper">
      <h1 ref="bottomTitleRef" class="collective-title">
        Another Collective
      </h1>
    </div>
  </section>
</template>

<style scoped>
.collective-section {
  width: 100%;
  padding-left: var(--section-px);
  padding-right: var(--section-px);
  padding-top: 1.5vw;
  padding-bottom: 4vw;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.top-text-wrapper {
  width: 100%;
  display: flex;
  justify-content: flex-start; /* Aligned left as requested */
  margin-bottom: 12.067vw;
}

.collective-h2 {
  width: 76vw;
  max-width: 76vw; /* Slightly widened to 76vw to comfortably fit 4 lines without awkward line wrap */
  color: #000000;
  text-align: left;
}

.indent-space {
  display: inline-block;
  width: 22.067vw;
}

.banner-container {
  width: 100%;
  margin-bottom: 4vw;
  overflow: hidden;
  border-radius: 0px;
}

.banner-viewport {
  width: 100%;
  height: 58.3843vw; /* Exact requested height */
  position: relative;
  overflow: hidden;
  background-color: #d1d4d6;
}

.banner-image {
  position: absolute;
  top: -10%;
  left: 0;
  width: 100%;
  height: 120%;
  object-fit: cover;
  will-change: transform;
}

.bottom-title-wrapper {
  width: 100%;
  text-align: left;
}

.collective-title {
  font-family: 'PP Neue Montreal', var(--font-family-base);
  font-weight: 500;
  font-size: clamp(2.2rem, 12.465vw, 190px);
  line-height: 1.0;
  letter-spacing: -0.04em; /* -4% letter spacing */
  color: #000000;
  margin: 0;
}

.char-span {
  display: inline-block;
  will-change: transform, opacity;
}

@media (max-width: 1200px) {
  .collective-section {
    padding-top: 60px;
    padding-bottom: 60px;
  }
  .banner-viewport {
    height: clamp(320px, 58.3843vw, 875px);
  }
  .collective-h2 {
    width: 100%;
    max-width: 100%;
  }
  .collective-title {
    font-size: clamp(2.5rem, 11vw, 190px);
    line-height: 1;
  }
  .indent-space {
    width: clamp(40px, 12vw, 120px);
  }
}

@media (max-width: 768px) {
  .collective-section {
    padding-top: 10px;
    padding-bottom: 48px;
  }
  .top-text-wrapper {
    margin-bottom: 24px;
  }
  .indent-space {
    display: none;
  }
  .banner-viewport {
    height: clamp(240px, 60vw, 380px);
  }
  .collective-title {
    font-size: clamp(1.8rem, 9.5vw, 90px);
    line-height: 1;
  }

  .top-text-wrapper {
    width: 340px;
  }
}
</style>
