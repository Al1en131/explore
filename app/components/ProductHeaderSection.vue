<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'

const router = useRouter()
const sectionRef = ref<HTMLElement | null>(null)
const numberRef = ref<HTMLElement | null>(null)
const rightColRef = ref<HTMLElement | null>(null)
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

const alignRightCol = () => {
  if (import.meta.client && rightColRef.value && sectionRef.value) {
    const navItem = document.querySelector(
      '.app-header .header-nav .nav-link'
    ) as HTMLElement
    if (navItem) {
      const navRect = navItem.getBoundingClientRect()
      const sectionRect = sectionRef.value.getBoundingClientRect()
      const sectionPaddingLeft = parseFloat(getComputedStyle(sectionRef.value).paddingLeft) || 0
      const offsetLeft = navRect.left - sectionRect.left - sectionPaddingLeft
      if (offsetLeft > 0) {
        rightColRef.value.style.marginLeft = `${offsetLeft}px`
      }
    }
  }
}

const splitElementWords = (element: HTMLElement) => {
  if (!element) return
  element.style.opacity = '1'
  element.style.perspective = '1000px'

  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || ''
      if (!text.trim() && text !== ' ') return
      const frag = document.createDocumentFragment()
      const parts = text.split(/(\s+)/)
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i]
        if (!part) continue
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(' '))
        } else {
          const span = document.createElement('span')
          span.className = 'word-span'
          span.style.display = 'inline-block'
          span.style.willChange = 'transform, opacity'
          span.style.transformOrigin = '50% 100%'
          span.textContent = part
          frag.appendChild(span)
        }
      }
      if (frag.childNodes.length > 0) {
        node.parentNode?.replaceChild(frag, node)
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement
      if (el.classList.contains('indent-space')) return
      Array.from(el.childNodes).forEach(walk)
    }
  }

  Array.from(element.childNodes).forEach(walk)
}

onMounted(() => {
  if (import.meta.client) {
    alignRightCol()
    window.addEventListener('resize', alignRightCol)
    setTimeout(alignRightCol, 100)
    setTimeout(alignRightCol, 300)
    setTimeout(alignRightCol, 600)

    const tl = gsap.timeline({ delay: 0.1 })

    // 1. Entrance animation for Number 18
    if (numberRef.value) {
      tl.fromTo(
        numberRef.value,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out' }
      )
    }

    // 2. Word-by-Word Entrance animation for Title
    if (titleRef.value) {
      splitElementWords(titleRef.value)
      const words = titleRef.value.querySelectorAll('.word-span')
      if (words.length > 0) {
        tl.fromTo(
          words,
          { y: 30, opacity: 0, rotateX: -20 },
          { y: 0, opacity: 1, rotateX: 0, duration: 0.6, stagger: 0.035, ease: 'power2.out' },
          '-=0.8'
        )
      } else {
        tl.fromTo(
          titleRef.value,
          { y: 30, opacity: 0, rotateX: -20 },
          { y: 0, opacity: 1, rotateX: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.8'
        )
      }
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

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('resize', alignRightCol)
  }
})
</script>

<template>
  <section ref="sectionRef" class="product-header-section">
    <div class="product-header-container">
      <!-- Left Column: Number 18 positioned absolute left -->
      <div class="left-col">
        <span ref="numberRef" class="product-number">18</span>
      </div>

      <!-- Right Column: Title + Line + Sub Navigation aligned left edge with middle navbar menu -->
      <div ref="rightColRef" class="right-col">
        <!-- Main Title with PP Neue Montreal exact spec -->
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
  padding-top: 18vw; /* 206px / 15 */
  padding-bottom: 4.876vw;
  padding-left: var(--section-px);
  padding-right: var(--section-px);
  background-color: #ffffff;
  box-sizing: border-box;
}

.product-header-container {
  width: 100%;
  position: relative;
  box-sizing: border-box;
}

.left-col {
  position: absolute;
  top: 0;
  left: 0;
  flex-shrink: 0;
  text-align: left;
}

.product-number {
  font-family: 'Test Manuka', 'Test Manuka Condensed', 'Bebas Neue', 'Impact', sans-serif-condensed, sans-serif;
  font-weight: 500;
  font-style: normal;
  font-size: 12.9333vw;
  line-height: 12.9333vw;
  letter-spacing: 0em;
  color: #333333;
  display: inline-block;
  user-select: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.right-col {
  width: auto;
  max-width: calc(100vw - var(--section-px) - 35.4667vw);
  margin-left: 31.55vw; /* Initial fallback margin-left matching middle menu position */
  display: flex;
  flex-direction: column;
}

.product-title {
  width: 100%;
  font-family: 'PP Neue Montreal', var(--font-family-base);
  font-weight: 500;
  font-style: normal;
  font-size: 8.5333vw;
  line-height: 7.6vw;
  letter-spacing: -0.04em; /* -4% letter spacing */
  color: #333333;
  margin: 0;
  margin-bottom: 4.6667vw;
}

.char-span {
  display: inline-block;
  will-change: transform, opacity;
  perspective: 1000px;
}

.divider-line {
  width: 100%;
  height: 1px;
  background-color: #b0b0b0;
  margin-bottom: 1.6vw;
  transform-origin: left center;
  will-change: transform;
}

.sub-nav {
  display: flex;
  align-items: center;
  gap: 2.1333vw;
}

.nav-tab {
  background: none;
  border: none;
  padding: 0;
  font-family: 'PP Neue Montreal', var(--font-family-base);
  font-weight: 400;
  font-size: 1.0667vw;
  line-height: 1.2vw;
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
  font-size: 1.0667vw;
  line-height: 1.2vw;
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
  .left-col {
    position: relative;
    width: 100%;
    margin-bottom: 20px;
  }
  .right-col {
    margin-left: 0 !important;
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
