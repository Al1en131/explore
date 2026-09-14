<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'

const headerRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (headerRef.value) {
    const items = headerRef.value.querySelectorAll('.header-text')
    gsap.fromTo(
      items,
      {
        y: -20,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.2
      }
    )
  }
})
</script>

<template>
  <header ref="headerRef" class="app-header">
    <div class="header-brand">
      <span class="header-text">Franklin&Co.</span>
    </div>
    <div class="header-nav">
      <span class="header-text">Products, Solutions, Stories</span>
    </div>
    <div class="header-action">
      <span class="header-text">Menu</span>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  width: 100%;
  padding-top: 40px;
  padding-bottom: 16px;
  padding-left: var(--section-px);
  padding-right: var(--section-px);
  background-color: transparent;
}

.header-text {
  opacity: 0; /* Animated by GSAP */
}

.header-brand {
  flex-shrink: 0;
}

.header-nav {
  padding-left: 376.25px;
  flex-grow: 1;
  text-align: left;
}

.header-action {
  margin-left: auto;
  flex-shrink: 0;
  text-align: right;
}

@media (max-width: 1024px) {
  .header-nav {
    padding-left: clamp(20px, 8vw, 376.25px);
  }
}

@media (max-width: 768px) {
  .app-header {
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 24px;
    padding-bottom: 12px;
  }
  .header-nav {
    display: none;
  }
}
</style>
