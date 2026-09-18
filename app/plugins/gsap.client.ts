import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Draggable } from 'gsap/Draggable'
import Lenis from 'lenis'

export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    // Register GSAP Plugins
    gsap.registerPlugin(ScrollTrigger, Draggable)

    // Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    window.addEventListener('load', () => {
      setTimeout(() => {
        ScrollTrigger.refresh()
      }, 200)
    })

    return {
      provide: {
        gsap,
        ScrollTrigger,
        Draggable,
        lenis
      }
    }
  }
})
