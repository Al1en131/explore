<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'

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

  // 1. Wipe curtain down to cover screen
  gsap.fromTo(
    preloaderRef.value,
    { yPercent: 100 },
    {
      yPercent: 0,
      duration: 0.4,
      ease: 'power3.inOut',
      onComplete: () => {
        // 2. Animate counter from 0% to 100%
        gsap.to(counterObj, {
          val: 100,
          duration: 0.6,
          ease: 'power2.inOut',
          onUpdate: () => {
            progress.value = counterObj.val
          },
          onComplete: () => {
            // Change route once counter reaches 100%
            nextFn()

            // 3. Short pause then wipe curtain up to reveal new page
            setTimeout(() => {
              if (preloaderRef.value) {
                gsap.to(preloaderRef.value, {
                  yPercent: -100,
                  duration: 0.6,
                  ease: 'power3.inOut',
                  onComplete: () => {
                    isTransitioning.value = false
                  }
                })
              }
            }, 80)
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
      if (to.path !== from.path && !isInitialLoading.value) {
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
        <!-- <span class="brand-sub">EDITORIAL COLLECTION</span> -->
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
  overflow: hidden;
  pointer-events: all;
  will-change: transform;
}

.preloader-content {
  width: 100%;
  max-width: 40vw;
  padding: 0 4vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3.2vw;
  text-align: center;
}

.brand-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8vw;
}

.brand-name {
  font-family: 'PP Neue Montreal', var(--font-family-base);
  font-weight: 500;
  font-size: 3.2vw;
  line-height: 3.2vw;
  letter-spacing: -0.03em;
  color: #ffffff;
}

.brand-sub {
  font-family: 'PP Neue Montreal', var(--font-family-base);
  font-weight: 400;
  font-size: 0.8vw;
  line-height: 0.9333vw;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #888888;
}

.counter-block {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2vw;
}

.counter-val {
  font-family: 'PP Neue Montreal', var(--font-family-base);
  font-weight: 500;
  font-size: 4.8vw;
  line-height: 4.8vw;
  letter-spacing: -0.04em;
  color: #ffffff;
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
  transition: width 0.05s linear;
}

@media (max-width: 768px) {
  .preloader-content {
    max-width: 80vw;
    gap: 24px;
  }
  .brand-name {
    font-size: 2rem;
    line-height: 1;
  }
  .brand-sub {
    font-size: 0.75rem;
  }
  .counter-val {
    font-size: 3rem;
    line-height: 1;
  }
}
</style>
