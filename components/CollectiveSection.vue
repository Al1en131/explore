<script setup lang="ts">
import { onMounted, ref } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const sectionRef = ref<HTMLElement | null>(null);
const topTextRef = ref<HTMLElement | null>(null);
const bannerRef = ref<HTMLElement | null>(null);
const bannerImgRef = ref<HTMLElement | null>(null);
const bottomTitleRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (import.meta.client) {
    gsap.registerPlugin(ScrollTrigger);

    if (sectionRef.value) {
      // 1. Top text entrance reveal
      if (topTextRef.value) {
        gsap.fromTo(
          topTextRef.value,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: topTextRef.value,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      // 2. Middle Banner Image Parallax
      if (bannerRef.value && bannerImgRef.value) {
        gsap.fromTo(
          bannerRef.value,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: bannerRef.value,
              start: "top 80%",
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

      // 3. Bottom Display Title Reveal
      if (bottomTitleRef.value) {
        gsap.fromTo(
          bottomTitleRef.value,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
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
});
</script>

<template>
  <section ref="sectionRef" class="collective-section">
    <!-- Top Text Block (Positioned Left, width 1097px, H2 style with indent) -->
    <div class="top-text-wrapper">
      <h2 ref="topTextRef" class="h2 collective-h2">
        <span class="indent-space"></span>Herman Miller is built on a legacy of
        creative partnership. In a first-of-its-kind collaboration, the Danish
        design house HAY
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
      <h1 ref="bottomTitleRef" class="collective-title">Another Collective</h1>
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
  width: 71vw;
  max-width: 71vw; /* Exact requested width 1097px */
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
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-weight: 500;
  font-size: 12.465vw;
  line-height: 12.465vw;
  letter-spacing: -0.04em; /* -4% letter spacing */
  color: #000000;
  margin: 0;
}

@media (max-width: 1200px) {
  .collective-section {
    padding-top: 100px;
    padding-bottom: 80px;
  }
  .banner-viewport {
    height: clamp(450px, 65vw, 875.76513671875px);
  }
  .collective-h2 {
    width: 100%;
    max-width: 100%;
  }
  .collective-title {
    font-size: clamp(3.5rem, 13vw, 190.71px);
    line-height: 1;
  }
  .indent-space {
    width: 120px;
  }
}

@media (max-width: 768px) {
  .collective-section {
    padding-top: 60px;
    padding-bottom: 60px;
  }
  .top-text-wrapper {
    margin-bottom: 40px;
  }
  .indent-space {
    display: none;
  }
  .banner-viewport {
    height: 380px;
  }
  .collective-title {
    font-size: clamp(2.5rem, 11vw, 100px);
    line-height: 1;
  }
}
</style>
