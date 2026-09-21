<script setup lang="ts">
import { onMounted, ref } from "vue";
import { gsap } from "gsap";
import { usePreloader } from "~/composables/usePreloader";

const { onPreloaderComplete } = usePreloader();
const headerRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (headerRef.value) {
    const items = headerRef.value.querySelectorAll(".header-text");
    onPreloaderComplete(() => {
      gsap.fromTo(
        items,
        {
          y: -20,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.2,
        },
      );
    });
  }
});
</script>

<template>
  <header
    ref="headerRef"
    class="app-header"
  >
    <div class="header-brand">
      <NuxtLink to="/" class="header-text nav-link brand-link">
        Franklin&Co.
      </NuxtLink>
    </div>
    <div class="header-nav">
      <NuxtLink to="/product" class="header-text nav-link">Products</NuxtLink>
      <span class="header-text nav-sep">, </span>
      <span class="header-text nav-link static-item">Solutions</span>
      <span class="header-text nav-sep">, </span>
      <NuxtLink to="/stories" class="header-text nav-link">Stories</NuxtLink>
    </div>
    <div class="header-action">
      <span class="header-text nav-link">Menu</span>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  width: 100%;
  padding-top: 4.333vw;
  padding-bottom: 1.0667vw;
  padding-left: var(--section-px);
  padding-right: var(--section-px);
  background-color: transparent;
  pointer-events: none; /* Header container lets scroll pass through */
  mix-blend-mode: difference;
}

.header-text {
  opacity: 0; /* Animated by GSAP */
}

.nav-link {
  color: #ffffff;
  text-decoration: none;
  transition:
    opacity 0.2s ease,
    color 0.3s ease;
  pointer-events: auto; /* Active links clickable */
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-size: 1.0667vw;
  line-height: 1.2vw;
}

.nav-link:hover {
  opacity: 0.7;
}

.nav-sep {
  color: #ffffff;
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-size: 1.0667vw;
  transition: color 0.3s ease;
}

.header-brand {
  flex-shrink: 0;
  pointer-events: auto;
}

.header-nav {
  padding-left: 25.0833vw;
  flex-grow: 1;
  text-align: left;
  pointer-events: auto;
}

.header-action {
  margin-left: auto;
  flex-shrink: 0;
  text-align: right;
  pointer-events: auto;
}

/* Active route styling */
:deep(.router-link-active) {
  font-weight: 500;
}

@media (max-width: 1024px) {
  .header-nav {
    padding-left: clamp(1.3333vw, 8vw, 25.0833vw);
  }
}

@media (max-width: 768px) {
  .app-header {
    padding-left: 1.3333vw;
    padding-right: 1.3333vw;
    padding-top: 1.6vw;
    padding-bottom: 0.8vw;
  }
  .header-nav {
    display: none;
  }
}
</style>
