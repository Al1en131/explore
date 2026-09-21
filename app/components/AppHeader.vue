<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import { gsap } from "gsap";
import { usePreloader } from "~/composables/usePreloader";

const { onPreloaderComplete } = usePreloader();
const route = useRoute();
const headerRef = ref<HTMLElement | null>(null);
const overlayRef = ref<HTMLElement | null>(null);

const isMenuOpen = ref(false);
const isDarkTheme = ref(false);
let activeTl: gsap.core.Timeline | null = null;

// Dynamic Header Color Detection on Scroll: ensures menu text is WHITE on dark/gray backgrounds
const checkHeaderTheme = () => {
  if (!import.meta.client || !headerRef.value) return;

  const rect = headerRef.value.getBoundingClientRect();
  const checkX = window.innerWidth / 2;
  const checkY = Math.max(10, rect.top + rect.height / 2);

  const el = document.elementFromPoint(checkX, checkY);
  if (!el) return;

  let current: HTMLElement | null = el as HTMLElement;
  let bg = "rgb(255, 255, 255)";

  while (current && current !== document.body) {
    const style = window.getComputedStyle(current);
    const bgColor = style.backgroundColor;
    if (bgColor && bgColor !== "rgba(0, 0, 0, 0)" && bgColor !== "transparent") {
      bg = bgColor;
      break;
    }
    current = current.parentElement;
  }

  if (!current || current === document.body) {
    bg = window.getComputedStyle(document.body).backgroundColor || "rgb(255, 255, 255)";
  }

  const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    if (luminance < 0.85 || (r < 235 && g < 235 && b < 235 && Math.abs(r - g) < 25 && Math.abs(g - b) < 25)) {
      isDarkTheme.value = true;
    } else {
      isDarkTheme.value = false;
    }
  }
};

const lockScroll = () => {
  if (import.meta.client) {
    document.body.style.overflow = "hidden";
  }
};

const unlockScroll = () => {
  if (import.meta.client) {
    document.body.style.overflow = "";
  }
};

const openMenu = () => {
  if (activeTl) activeTl.kill();
  isMenuOpen.value = true;
  lockScroll();

  nextTick(() => {
    if (!overlayRef.value) return;
    const overlay = overlayRef.value;
    const container = overlay.querySelector(".popup-container");
    const chars = overlay.querySelectorAll(".popup-char");
    const nums = overlay.querySelectorAll(".popup-link-num");

    activeTl = gsap.timeline({
      onComplete: () => {
        activeTl = null;
      },
    });

    // 1. Overlay Backdrop Fade-In
    gsap.set(overlay, { opacity: 0 });
    activeTl.to(overlay, {
      opacity: 1,
      duration: 0.4,
      ease: "power2.out",
    });

    // 2. Pop-up Panel Clip-Path Wipes Down from TOP (inset(0% 0% 100% 0%) -> inset(0% 0% 0% 0%))
    if (container) {
      gsap.set(container, { clipPath: "inset(0% 0% 100% 0%)" });
      activeTl.to(
        container,
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.65,
          ease: "power3.inOut",
        },
        "-=0.35"
      );
    }

    // 3. Per-Character Text Reveal Cascade
    if (chars.length > 0) {
      gsap.set(chars, { opacity: 0, y: 10 });
      activeTl.to(
        chars,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.015,
          ease: "power3.out",
        },
        "-=0.35"
      );
    }

    // 4. Link Numbers Reveal
    if (nums.length > 0) {
      gsap.set(nums, { opacity: 0, y: 8 });
      activeTl.to(
        nums,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.out",
        },
        "-=0.4"
      );
    }
  });
};

const closeMenu = () => {
  if (!isMenuOpen.value) return;
  if (activeTl) activeTl.kill();

  if (!overlayRef.value) {
    isMenuOpen.value = false;
    unlockScroll();
    return;
  }

  const overlay = overlayRef.value;
  const container = overlay.querySelector(".popup-container");
  const chars = overlay.querySelectorAll(".popup-char");

  activeTl = gsap.timeline({
    onComplete: () => {
      isMenuOpen.value = false;
      unlockScroll();
      activeTl = null;
    },
  });

  // 1. Text Characters Fade Out
  if (chars.length > 0) {
    activeTl.to(chars, {
      opacity: 0,
      y: -8,
      duration: 0.18,
      stagger: 0.008,
      ease: "power2.in",
    });
  }

  // 2. Pop-up Panel Clip-Path Wipes UP back to TOP
  if (container) {
    activeTl.to(
      container,
      {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.45,
        ease: "power3.inOut",
      },
      "-=0.1"
    );
  }

  // 3. Overlay Backdrop Fade Out
  activeTl.to(
    overlay,
    {
      opacity: 0,
      duration: 0.3,
      ease: "power2.inOut",
    },
    "-=0.2"
  );
};

const toggleMenu = () => {
  if (isMenuOpen.value) {
    closeMenu();
  } else {
    openMenu();
  }
};

watch(
  () => route.path,
  () => {
    if (isMenuOpen.value) {
      closeMenu();
    }
    setTimeout(checkHeaderTheme, 100);
  }
);

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener("scroll", checkHeaderTheme, { passive: true });
    window.addEventListener("resize", checkHeaderTheme, { passive: true });
    setTimeout(checkHeaderTheme, 100);
    setTimeout(checkHeaderTheme, 500);

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
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener("scroll", checkHeaderTheme);
    window.removeEventListener("resize", checkHeaderTheme);
    unlockScroll();
  }
});
</script>

<template>
  <header
    ref="headerRef"
    class="app-header"
    :class="{
      'is-dark-theme': isDarkTheme || isMenuOpen,
      'is-light-theme': !isDarkTheme && !isMenuOpen,
      'is-menu-open': isMenuOpen
    }"
  >
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

  <!-- Responsive Top Drawer Pop-up Modal (Single Header Instance on Top) -->
  <Teleport to="body">
    <div
      v-if="isMenuOpen"
      ref="overlayRef"
      class="mobile-menu-overlay"
      @click.self="closeMenu"
    >
      <div class="popup-container">
        <nav class="popup-nav-links">
          <NuxtLink to="/" class="popup-link" @click="closeMenu">
            <span class="popup-link-num">01</span>
            <span class="popup-link-text">
              <span v-for="(char, i) in 'Home'" :key="'h-' + i" class="popup-char">{{ char }}</span>
            </span>
          </NuxtLink>

          <NuxtLink to="/product" class="popup-link" @click="closeMenu">
            <span class="popup-link-num">02</span>
            <span class="popup-link-text">
              <span v-for="(char, i) in 'Products'" :key="'p-' + i" class="popup-char">{{ char }}</span>
            </span>
          </NuxtLink>

          <div class="popup-link static-item">
            <span class="popup-link-num">03</span>
            <span class="popup-link-text">
              <span v-for="(char, i) in 'Solutions'" :key="'s-' + i" class="popup-char">{{ char }}</span>
            </span>
          </div>

          <NuxtLink to="/stories" class="popup-link" @click="closeMenu">
            <span class="popup-link-num">04</span>
            <span class="popup-link-text">
              <span v-for="(char, i) in 'Stories'" :key="'st-' + i" class="popup-char">{{ char }}</span>
            </span>
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
  z-index: 100000; /* Stays above overlay at 99999 so main header text IS the pop up header */
  display: flex;
  align-items: center;
  width: 100%;
  padding-top: clamp(20px, 4.333vw, 65px);
  padding-bottom: clamp(10px, 1.0667vw, 16px);
  padding-left: var(--section-px);
  padding-right: var(--section-px);
  background-color: transparent;
  pointer-events: none;
  transition: color 0.3s ease;
}

.app-header.is-dark-theme,
.app-header.is-menu-open {
  mix-blend-mode: normal !important;
}

.app-header.is-dark-theme .nav-link,
.app-header.is-dark-theme .nav-sep,
.app-header.is-dark-theme .menu-toggle-btn,
.app-header.is-dark-theme .brand-link,
.app-header.is-menu-open .nav-link,
.app-header.is-menu-open .nav-sep,
.app-header.is-menu-open .menu-toggle-btn,
.app-header.is-menu-open .brand-link {
  color: #ffffff !important;
}

.app-header.is-light-theme:not(.is-menu-open) .nav-link,
.app-header.is-light-theme:not(.is-menu-open) .nav-sep,
.app-header.is-light-theme:not(.is-menu-open) .menu-toggle-btn,
.app-header.is-light-theme:not(.is-menu-open) .brand-link {
  color: #000000 !important;
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

/* Backdrop Overlay: Smooth Blur & Opacity Fade */
.mobile-menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background-color: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-sizing: border-box;
  will-change: opacity;
}

/* Pop-up Panel: Setengah dari frame, Sharp Edges (border-radius: 0), Clip-Path Motion */
.popup-container {
  width: 100%;
  min-height: 55vh;
  max-height: 85vh;
  background: #121212;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 0 !important;
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: clamp(90px, 12vw, 145px); /* Room for main app-header sitting on top */
  padding-bottom: clamp(24px, 3vw, 40px);
  padding-left: var(--section-px);
  padding-right: var(--section-px);
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  will-change: clip-path;
}

.popup-nav-links {
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 3vw, 32px);
  margin-top: auto;
  margin-bottom: auto;
  padding: 3vw 0;
}

.popup-link {
  display: flex;
  align-items: baseline;
  gap: clamp(12px, 3vw, 24px);
  text-decoration: none;
  color: #ffffff;
  transition: opacity 0.25s ease;
  width: fit-content;
}

.popup-link:hover {
  opacity: 0.7;
}

.popup-link.static-item {
  opacity: 0.4;
  cursor: default;
}

.popup-link.static-item:hover {
  opacity: 0.4;
}

.popup-link-num {
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-size: clamp(12px, 1vw, 15px);
  color: rgba(255, 255, 255, 0.45);
  font-weight: 500;
  transition: color 0.25s ease;
  will-change: opacity, transform;
}

.popup-link:hover .popup-link-num {
  color: #ffffff;
}

.popup-link-text {
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-size: clamp(2rem, 5.5vw, 56px);
  font-weight: 500;
  line-height: 1.05;
  letter-spacing: -0.03em;
  display: inline-flex;
}

.popup-char {
  display: inline-block;
  will-change: opacity, transform;
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
  will-change: opacity, transform;
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
  .popup-container {
    min-height: 60vh;
    padding-top: 80px;
    padding-bottom: 24px;
    padding-left: 24px;
    padding-right: 24px;
  }
}
</style>
