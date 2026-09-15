<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'

const router = useRouter()
const sectionRef = ref<HTMLElement | null>(null)
const numberRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const tabsRef = ref<HTMLElement | null>(null)

const activeTab = ref('Overview')
const tabs = ['Overview', 'Design', 'Specification', 'Images', '3D Model', 'Stories']

const handleTabClick = (tab: string) => {
  activeTab.value = tab
  if (tab === 'Stories') {
    router.push('/stories')
  }
}

onMounted(() => {
  if (import.meta.client) {
    const tl = gsap.timeline({ delay: 0.1 })

    // 1. Entrance animation for Number 18
    if (numberRef.value) {
      tl.fromTo(
        numberRef.value,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out' }
      )
    }

    // 2. Entrance animation for Title
    if (titleRef.value) {
      tl.fromTo(
        titleRef.value,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' },
        '-=0.8'
      )
    }

    // 3. Line ScaleX animation
    if (lineRef.value) {
      tl.fromTo(
        lineRef.value,
        { scaleX: 0 },
        { scaleX: 1, duration: 1, ease: 'power3.inOut' },
        '-=0.7'
      )
    }

    // 4. Stagger animation for Tabs
    if (tabsRef.value) {
      const children = tabsRef.value.children
      tl.fromTo(
        children,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out' },
        '-=0.4'
      )
    }
  }
})
</script>

<template>
  <section ref="sectionRef" class="product-header-section">
    <div class="product-header-container">
      <!-- Left Column: Number 18 aligned left -->
      <div class="left-col">
        <span ref="numberRef" class="product-number">18</span>
      </div>

      <!-- Right Column: Title (Width 938.0000000000035px aligned right) + Line + Sub Navigation -->
      <div class="right-col">
        <!-- Main Title with PP Neue Montreal exact spec & requested width 938.0000000000035px -->
        <h1 ref="titleRef" class="product-title">
          Eames Moulded<br />Plywood
        </h1>

        <!-- Horizontal Divider Line -->
        <div ref="lineRef" class="divider-line"></div>

        <!-- Sub Navigation Tabs -->
        <nav ref="tabsRef" class="sub-nav">
          <button
            v-for="tab in tabs"
            :key="tab"
            class="nav-tab"
            :class="{ active: activeTab === tab }"
            @click="handleTabClick(tab)"
          >
            {{ tab }}
          </button>
        </nav>
      </div>
    </div>
  </section>
</template>

<style scoped>
.product-header-section {
  width: 100%;
  padding-top: 100px;
  padding-bottom: 80px;
  padding-left: var(--section-px);
  padding-right: var(--section-px);
  background-color: #ffffff;
  box-sizing: border-box;
}

.product-header-container {
  width: 100%;
  display: flex;
  justify-content: space-between; /* Flex justify between to push right-col to right */
  align-items: flex-start;
}

.left-col {
  flex-shrink: 0;
  text-align: left;
}

.product-number {
  font-family: 'Test Manuka', 'Test Manuka Condensed', 'Bebas Neue', 'Impact', sans-serif-condensed, sans-serif;
  font-weight: 500;
  font-style: normal;
  font-size: 194px;
  line-height: 194px;
  letter-spacing: 0em;
  color: #000000;
  display: inline-block;
  user-select: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.right-col {
  width: 938.0000000000035px;
  max-width: 938.0000000000035px;
  flex-shrink: 0;
  margin-left: auto; /* Aligned right */
  display: flex;
  flex-direction: column;
}

.product-title {
  width: 938.0000000000035px;
  max-width: 938.0000000000035px;
  font-family: 'PP Neue Montreal', var(--font-family-base);
  font-weight: 500;
  font-style: normal;
  font-size: 128px;
  line-height: 114px;
  letter-spacing: -0.04em; /* -4% letter spacing */
  color: #000000;
  margin: 0;
  margin-bottom: 70px;
}

.divider-line {
  width: 100%;
  height: 1px;
  background-color: #b0b0b0;
  margin-bottom: 24px;
  transform-origin: left center;
  will-change: transform;
}

.sub-nav {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-tab {
  background: none;
  border: none;
  padding: 0;
  font-family: 'PP Neue Montreal', var(--font-family-base);
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
  letter-spacing: -0.005em; /* -0.5% */
  color: #a0a0a0;
  cursor: pointer;
  transition: color 0.25s ease, font-weight 0.25s ease;
}

.nav-tab:hover {
  color: #000000;
}

.nav-tab.active {
  font-family: 'PP Neue Montreal', var(--font-family-base);
  font-weight: 500; /* Medium weight */
  font-size: 16px;
  line-height: 18px;
  letter-spacing: -0.005em; /* -0.5% */
  color: #000000;
}

@media (max-width: 1200px) {
  .right-col,
  .product-title {
    width: 100%;
    max-width: 100%;
  }
  .product-number {
    font-size: clamp(6rem, 15vw, 194px);
    line-height: 1;
  }
  .product-title {
    font-size: clamp(3.5rem, 9vw, 128px);
    line-height: 1.02;
    margin-bottom: 40px;
  }
}

@media (max-width: 768px) {
  .product-header-section {
    padding-top: 40px;
    padding-bottom: 40px;
  }
  .product-header-container {
    flex-direction: column;
    gap: 30px;
  }
  .left-col {
    width: 100%;
  }
  .right-col {
    margin-left: 0;
  }
  .product-title {
    margin-bottom: 30px;
  }
  .sub-nav {
    flex-wrap: wrap;
    gap: 20px;
  }
}
</style>
