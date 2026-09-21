import { ref } from 'vue'

const isPreloaderDone = ref(false)

export function usePreloader() {
  const markPreloaderDone = () => {
    isPreloaderDone.value = true
    if (import.meta.client) {
      window.dispatchEvent(new CustomEvent('preloader-complete'))
    }
  }

  const onPreloaderComplete = (callback: () => void) => {
    if (!import.meta.client) return

    if (isPreloaderDone.value) {
      callback()
    } else {
      const handler = () => {
        window.removeEventListener('preloader-complete', handler)
        callback()
      }
      window.addEventListener('preloader-complete', handler)
    }
  }

  return {
    isPreloaderDone,
    markPreloaderDone,
    onPreloaderComplete
  }
}
