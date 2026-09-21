<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import { gsap } from "gsap";
import { usePreloader } from "~/composables/usePreloader";

const { onPreloaderComplete } = usePreloader();
const route = useRoute();
const headerRef = ref<HTMLElement | null>(null);
const overlayRef = ref<HTMLElement | null>(null);

const isMenuOpen = ref(false);
const isAnimating = ref(false);

const openMenu = () => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  isMenuOpen.value = true;

  nextTick(() => {
    if (!overlayRef.value) return;
    const overlay = overlayRef.value;
    const links = overlay.querySelectorAll(".popup-link");
    const headerEl = overlay.querySelector(".menu-popup-header");
    const footerEl = overlay.querySelector(".popup-footer");

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.value = false;
      },
    });

    tl.fromTo(
      overlay,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "power2.out" }
    );

    if (headerEl) {
      tl.fromTo(
        headerEl,
        { y: -15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
        "-=0.3"
      );
    }

    if (links.length > 0) {
      tl.fromTo(
        links,
        { y: 45, opacity: 0, rotateX: -15 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: "power3.out",
        },
        "-=0.2"
      );
    }

    if (footerEl) {
      tl.fromTo(
        footerEl,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        "-=0.5"
      );
    }
  });
};

const closeMenu = () => {
  if (!isMenuOpen.value || isAnimating.value) return;
  if (!overlayRef.value) {
    isMenuOpen.value = false;
    return;
  }

  isAnimating.value = true;
  const overlay = overlayRef.value;
  const links = overlay.querySelectorAll(".popup-link");

  const tl = gsap.timeline({
    onComplete: () => {
      isMenuOpen.value = false;
      isAnimating.value = false;
    },
  });

  if (links.length > 0) {
    tl.to(links, {
      y: -20,
      opacity: 0,
      duration: 0.25,
      stagger: 0.04,
      ease: "power2.in",
    });
  }

  tl.to(
    overlay,
    {
      opacity: 0,
      duration: 0.35,
      ease: "power2.inOut",
    },
    "-=0.15"
  );
};

const toggleMenu = () => {
  if (isMenuOpen.value) {
    closeMenu();
  } else {
    openMenu();
  }
};

// Close mobile menu pop-up on route change
watch(
  () => route.path,
  () => {
    if (isMenuOpen.value) {
      closeMenu();
    }
  }
);

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
        }
      );
    });
  }
});
</script>

<template>
  <header ref="headerRef" class="app-header">
    <div class="header-brand">
      <NuxtLink to="/" class="header-text nav-link brand-link" @click="closeMenu">
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
      <button
        type="button"
        class="header-text nav-link menu-toggle-btn"
        :class="{ 'is-active': isMenuOpen }"
        @click="toggleMenu"
      >
        {{ isMenuOpen ? "Close" : "Menu" }}
      </button>
    </div>
  </header>

  <!-- Responsive Navigation Pop-up Overlay Modal -->
  <Teleport to="body">
    <div
      v-if="isMenuOpen"
      ref="overlayRef"
      class="mobile-menu-overlay"
      @click.self="closeMenu"
    >
      <div class="popup-container">
        <div class="menu-popup-header">
          <NuxtLink to="/" class="popup-brand" @click="closeMenu">
            Franklin&Co.
          </NuxtLink>
          <button type="button" class="popup-close-btn" @click="closeMenu">
            Close ✕
          </button>
        </div>

        <nav class="popup-nav-links">
          <NuxtLink to="/" class="popup-link" @click="closeMenu">
            <span class="popup-link-num">01</span>
            <span class="popup-link-text">Home</span>
          </NuxtLink>

          <NuxtLink to="/product" class="popup-link" @click="closeMenu">
            <span class="popup-link-num">02</span>
            <span class="popup-link-text">Products</span>
          </NuxtLink>

          <div class="popup-link static-item">
            <span class="popup-link-num">03</span>
            <span class="popup-link-text">Solutions</span>
          </div>

          <NuxtLink to="/stories" class="popup-link" @click="closeMenu">
            <span class="popup-link-num">04</span>
            <span class="popup-link-text">Stories</span>
          </NuxtLink>
        </nav>

        <div class="popup-footer">
          <span class="popup-footer-text">FRANKLIN & CO. COLLECTION</span>
          <span class="popup-footer-copy">© 2026</span>
        </div>
      </div>
    </div>
  </Teleport>
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
  padding-top: clamp(20px, 4.333vw, 65px);
  padding-bottom: clamp(10px, 1.0667vw, 16px);
  padding-left: var(--section-px);
  padding-right: var(--section-px);
  background-color: transparent;
  pointer-events: none;
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
  pointer-events: auto;
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-size: clamp(13px, 1.0667vw, 16px);
  line-height: 1.2;
}

.menu-toggle-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  font: inherit;
}

.nav-link:hover {
  opacity: 0.7;
}

.nav-sep {
  color: #ffffff;
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-size: clamp(13px, 1.0667vw, 16px);
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

/* Responsive Menu Overlay Styles */
.mobile-menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background-color: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  will-change: opacity;
  transform: translate3d(0, 0, 0);
}

.popup-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: clamp(20px, 4.333vw, 65px) var(--section-px) clamp(24px, 4vw, 50px) var(--section-px);
  box-sizing: border-box;
}

.menu-popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  will-change: transform, opacity;
}

.popup-brand {
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-size: clamp(14px, 1.2vw, 18px);
  font-weight: 500;
  color: #ffffff;
  text-decoration: none;
}

.popup-close-btn {
  background: transparent;
  border: none;
  color: #ffffff;
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-size: clamp(13px, 1.1vw, 16px);
  font-weight: 500;
  cursor: pointer;
  padding: 4px 0;
  transition: opacity 0.2s ease;
}

.popup-close-btn:hover {
  opacity: 0.7;
}

.popup-nav-links {
  display: flex;
  flex-direction: column;
  gap: clamp(20px, 4vw, 44px);
  margin-top: auto;
  margin-bottom: auto;
  padding: 8vw 0;
  perspective: 1000px;
}

.popup-link {
  display: flex;
  align-items: baseline;
  gap: clamp(12px, 3vw, 24px);
  text-decoration: none;
  color: #ffffff;
  transition: opacity 0.25s ease, transform 0.25s ease;
  width: fit-content;
  will-change: transform, opacity;
  transform-origin: 0% 100%;
}

.popup-link:hover {
  opacity: 0.7;
  transform: translateX(12px);
}

.popup-link.static-item {
  opacity: 0.4;
  cursor: default;
}

.popup-link.static-item:hover {
  transform: none;
}

.popup-link-num {
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-size: clamp(12px, 1vw, 15px);
  color: #f05a24;
  font-weight: 500;
}

.popup-link-text {
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-size: clamp(2.2rem, 7vw, 68px);
  font-weight: 500;
  line-height: 1.05;
  letter-spacing: -0.03em;
}

.popup-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  padding-top: 20px;
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-size: clamp(11px, 0.9vw, 14px);
  color: #888888;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  will-change: transform, opacity;
}

@media (max-width: 1024px) {
  .header-nav {
    padding-left: clamp(1.3333vw, 8vw, 25.0833vw);
  }
}

@media (max-width: 768px) {
  .app-header {
    padding-left: var(--section-px);
    padding-right: var(--section-px);
    padding-top: 20px;
    padding-bottom: 12px;
  }
  .header-nav {
    display: none;
  }
}
</style>
