<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const router = useRouter()
const preloaderRef = ref<HTMLElement | null>(null)
const brandRef = ref<HTMLElement | null>(null)
const counterRef = ref<HTMLElement | null>(null)
const progress = ref(0)
const isInitialLoading = ref(true)
const isTransitioning = ref(false)

const startInitialLoad = () => {
  if (!import.meta.client) return

  const duration = 1.2
  const counterObj = { val: 0 }

  gsap.to(counterObj, {
    val: 100,
    duration: duration,
    ease: 'power2.inOut',
    onUpdate: () => {
      progress.value = counterObj.val
    },
    onComplete: () => {
      // Reveal page with curtain slide up
      if (preloaderRef.value) {
        gsap.to(preloaderRef.value, {
          yPercent: -100,
          duration: 0.8,
          ease: 'power4.inOut',
          onComplete: () => {
            isInitialLoading.value = false
            setTimeout(() => {
              ScrollTrigger.refresh()
            }, 100)
          }
        })
      }
    }
  })
}

const triggerPageTransition = (nextFn: () => void) => {
  if (!import.meta.client || !preloaderRef.value) {
    nextFn()
    return
  }

  isTransitioning.value = true
  progress.value = 0
  const counterObj = { val: 0 }

  // Step 1: Curtain slides up from bottom (100% -> 0%) to cover screen smoothly
  gsap.fromTo(
    preloaderRef.value,
    { yPercent: 100 },
    {
      yPercent: 0,
      duration: 0.45,
      ease: 'power3.inOut',
      onComplete: () => {
        // Step 2: Animate counter from 0% to 100%
        gsap.to(counterObj, {
          val: 100,
          duration: 0.4,
          ease: 'power2.inOut',
          onUpdate: () => {
            progress.value = counterObj.val
          },
          onComplete: () => {
            // Change route & reset scroll position to top
            nextFn()
            window.scrollTo(0, 0)

            // Step 3: Curtain slides up out to top (0% -> -100%) revealing new page
            setTimeout(() => {
              if (preloaderRef.value) {
                gsap.to(preloaderRef.value, {
                  yPercent: -100,
                  duration: 0.6,
                  ease: 'power3.inOut',
                  onComplete: () => {
                    isTransitioning.value = false
                    setTimeout(() => {
                      ScrollTrigger.refresh()
                    }, 150)
                  }
                })
              }
            }, 60)
          }
        })
      }
    }
  )
}

onMounted(() => {
  if (import.meta.client) {
    startInitialLoad()

    // Navigation guard for every route change
    router.beforeEach((to, from, next) => {
      if (to.path !== from.path && !isInitialLoading.value && !isTransitioning.value) {
        triggerPageTransition(next)
      } else {
        next()
      }
    })
  }
})
</script>

<template>
  <div ref="preloaderRef" class="preloader-overlay">
    <div class="preloader-content">
      <!-- Minimalist Editorial Brand Header -->
      <div ref="brandRef" class="brand-block">
        <span class="brand-name">Franklin&Co.</span>
      </div>

      <!-- Percentage Counter & Progress Line -->
      <div ref="counterRef" class="counter-block">
        <span class="counter-val">{{ Math.floor(progress) }}%</span>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preloader-overlay {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background-color: #0d0d0d;
  color: #ffffff;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform;
}

.preloader-content {
  width: 100%;
  max-width: 1200px;
  padding: 0 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.brand-block {
  margin-bottom: 40px;
  text-align: center;
}

.brand-name {
  font-family: 'Manuka', sans-serif;
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1;
  display: block;
  color: #ffffff;
}

.counter-block {
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.counter-val {
  font-family: 'PP Neue Montreal', sans-serif;
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
  color: #a0a0a0;
}

.progress-track {
  width: 100%;
  height: 2px;
  background-color: rgba(255, 255, 255, 0.15);
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #ffffff;
  position: absolute;
  top: 0;
  left: 0;
  will-change: width;
}
</style>
