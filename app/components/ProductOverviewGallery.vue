<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const sectionRef = ref<HTMLElement | null>(null)
const card1Ref = ref<HTMLElement | null>(null)
const card2Ref = ref<HTMLElement | null>(null)
const card3Ref = ref<HTMLElement | null>(null)
const card4Ref = ref<HTMLElement | null>(null)

// Part 2 Refs
const textBlockRef = ref<HTMLElement | null>(null)
const card5Ref = ref<HTMLElement | null>(null)
const card6Ref = ref<HTMLElement | null>(null)
const card7Ref = ref<HTMLElement | null>(null)
const card8Ref = ref<HTMLElement | null>(null)
const card9Ref = ref<HTMLElement | null>(null)

// Part 3 Refs
const card10Ref = ref<HTMLElement | null>(null)
const card11Ref = ref<HTMLElement | null>(null)
const card12Ref = ref<HTMLElement | null>(null)
const card13Ref = ref<HTMLElement | null>(null)

// Part 4 Refs
const ultricesTextBlockRef = ref<HTMLElement | null>(null)
const card14Ref = ref<HTMLElement | null>(null)
const card15Ref = ref<HTMLElement | null>(null)

onMounted(() => {
  if (import.meta.client) {
    gsap.registerPlugin(ScrollTrigger)

    if (sectionRef.value) {
      // 1. Staggered Image Entrance Clip-Path & Lift Reveal (NO opacity fade, distinct staggered cascade)
      const rows = sectionRef.value.querySelectorAll('.gallery-row')
      rows.forEach((row) => {
        const cards = row.querySelectorAll('.gallery-card')
        cards.forEach((card, index) => {
          const imageBox = card.querySelector('.image-box')
          if (imageBox) {
            gsap.fromTo(
              imageBox,
              { clipPath: 'inset(100% 0% 0% 0%)', y: 40 },
              {
                clipPath: 'inset(0% 0% 0% 0%)',
                y: 0,
                duration: 1.2,
                delay: index * 0.18, // Distinct staggered delay for side-by-side images
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: card,
                  start: 'top 88%',
                  toggleActions: 'play none none reverse'
                }
              }
            )
          }
        })
      })

      // 2. Image Parallax Scroll Effect (Pure vertical movement, zero opacity alteration)
      const imageBoxesAll = sectionRef.value.querySelectorAll('.image-box')
      imageBoxesAll.forEach((box) => {
        const img = box.querySelector('.card-img')
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -20, scale: 1.25 },
            {
              yPercent: 20,
              scale: 1.25,
              ease: 'none',
              scrollTrigger: {
                trigger: box,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
              }
            }
          )
        }
      })

      // 3. Deep Scrubbed Opacity & Motion ONLY for the Big Text Blocks (1946 / DISTINCTIVE DESIGN & ULTRICES)
      const bigTextBlocks = sectionRef.value.querySelectorAll('.text-block, .ultrices-text-block')
      bigTextBlocks.forEach((block) => {
        const children = block.children

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: block,
            start: 'top 92%',
            end: 'bottom 8%',
            scrub: 1
          }
        })

        // Phase 1: Deep Entrance Fade-IN (opacity 0 -> 1, y: 60 -> 0)
        tl.fromTo(
          children,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.08,
            ease: 'power2.out'
          },
          0
        )

        // Phase 2: Active Focus State (100% crystal clear in center viewing zone)
        tl.to(children, { opacity: 1, y: 0, duration: 0.3 }, '>+=0.1')

        // Phase 3: Deep Exit Fade-OUT (opacity 1 -> 0, y: 0 -> -60) as text scrolls off top
        tl.to(
          children,
          {
            opacity: 0,
            y: -60,
            duration: 0.35,
            stagger: 0.05,
            ease: 'power2.in'
          },
          '>'
        )
      })
    }
  }
})
</script>

<template>
  <section ref="sectionRef" class="overview-gallery-section">
    <div class="gallery-container">
      
      <!-- ================= PART 1 ================= -->
      <!-- Row 1: Small Card Left + Wide Close-up Right -->
      <div class="gallery-row row-1">
        <div ref="card1Ref" class="gallery-card card-small-left">
          <div class="image-box">
            <div class="img-wrapper">
              <img src="/images/overview-1.jpg" alt="Eames Chair Rear Angle" class="card-img" />
            </div>
          </div>
          <span class="card-label">PULVINAR PELLENT</span>
        </div>

        <div ref="card2Ref" class="gallery-card card-wide-right">
          <div class="image-box">
            <div class="img-wrapper">
              <img src="/images/overview-2.jpg" alt="Eames Chair Wood Grain Detail" class="card-img" />
            </div>
          </div>
          <span class="card-label">PULVINAR PELLENT</span>
        </div>
      </div>

      <!-- Row 2: Wide Studio Left + Small Profile Right -->
      <div class="gallery-row row-2">
        <div ref="card3Ref" class="gallery-card card-wide-left">
          <div class="image-box">
            <div class="img-wrapper">
              <img src="/images/overview-3.jpg" alt="Eames Chairs Studio Pair" class="card-img" />
            </div>
          </div>
          <span class="card-label">PULVINAR PELLENT</span>
        </div>

        <div ref="card4Ref" class="gallery-card card-small-right">
          <div class="image-box">
            <div class="img-wrapper">
              <img src="/images/overview-4.jpg" alt="Eames Chair Side Profile" class="card-img" />
            </div>
          </div>
          <span class="card-label">PULVINAR PELLENT</span>
        </div>
      </div>

      <!-- ================= PART 2 ================= -->
      <!-- Row 3: 1946 Text Block (margin-left: 157px) + 2 Cards Right -->
      <div class="gallery-row row-3">
        <!-- Text Block: 1946 + DISTINCTIVE DESIGN + Specs List (margin-left: 157px) -->
        <div ref="textBlockRef" class="text-block">
          <span class="year-text">1946</span>
          <h3 class="distinctive-title">DISTINCTIVE DESIGN</h3>
          <ul class="text-list">
            <li>Tristique mollis metus</li>
            <li>Pulvinar pellent</li>
            <li>Mauris nisl senectus</li>
            <li>Tincidunt nunc</li>
          </ul>
        </div>

        <!-- Right Side Cards: Card 5 (Tall Detail) & Card 6 (Front Profile) -->
        <div class="row-3-cards">
          <div ref="card5Ref" class="gallery-card card-5">
            <div class="image-box">
              <div class="img-wrapper">
                <img src="/images/overview-5.jpg" alt="Eames Chair Seat Curve Detail" class="card-img" />
              </div>
            </div>
            <span class="card-label">PULVINAR PELLENT</span>
          </div>

          <div ref="card6Ref" class="gallery-card card-6">
            <div class="image-box">
              <div class="img-wrapper">
                <img src="/images/overview-6.jpg" alt="Eames Chair Front Studio" class="card-img" />
              </div>
            </div>
            <span class="card-label">PULVINAR PELLENT</span>
          </div>
        </div>
      </div>

      <!-- Row 4: Small & Detail Cards Left + Wide Landscape Right -->
      <div class="gallery-row row-4">
        <!-- Left Grouping: Card 7 (Small Back View) + Card 8 (Backrest Detail) -->
        <div class="row-4-left">
          <div ref="card7Ref" class="gallery-card card-7">
            <div class="image-box">
              <div class="img-wrapper">
                <img src="/images/overview-7.jpg" alt="Eames Chair Small Back View" class="card-img" />
              </div>
            </div>
            <span class="card-label">PULVINAR PELLENT</span>
          </div>

          <div ref="card8Ref" class="gallery-card card-8">
            <div class="image-box">
              <div class="img-wrapper">
                <img src="/images/overview-8.jpg" alt="Eames Chair Backrest Detail" class="card-img" />
              </div>
            </div>
            <span class="card-label">PULVINAR PELLENT</span>
          </div>
        </div>

        <!-- Right Card: Card 9 (Wide Rear View) -->
        <div ref="card9Ref" class="gallery-card card-9">
          <div class="image-box">
            <div class="img-wrapper">
              <img src="/images/overview-9.jpg" alt="Eames Chair Side Rear View" class="card-img" />
            </div>
          </div>
          <span class="card-label">PULVINAR PELLENT</span>
        </div>
      </div>

      <!-- ================= PART 3 ================= -->
      <!-- Row 5: Wide Architectural Left + Studio Profile Right -->
      <div class="gallery-row row-5">
        <div ref="card10Ref" class="gallery-card card-10">
          <div class="image-box">
            <div class="img-wrapper">
              <img src="/images/overview-10.jpg" alt="Eames Chair Architectural Setting" class="card-img" />
            </div>
          </div>
          <span class="card-label">PULVINAR PELLENT</span>
        </div>

        <div ref="card11Ref" class="gallery-card card-11">
          <div class="image-box">
            <div class="img-wrapper">
              <img src="/images/overview-11.jpg" alt="Eames Chair Metal Frame Profile" class="card-img" />
            </div>
          </div>
          <span class="card-label">PULVINAR PELLENT</span>
        </div>
      </div>

      <!-- Row 6: Staggered Center Cards (Card 12 & Card 13) -->
      <div class="gallery-row row-6">
        <div class="row-6-center">
          <div ref="card12Ref" class="gallery-card card-12">
            <div class="image-box">
              <div class="img-wrapper">
                <img src="/images/overview-12.jpg" alt="Eames Chair Interior Living Setting" class="card-img" />
              </div>
            </div>
            <span class="card-label">PULVINAR PELLENT</span>
          </div>

          <div ref="card13Ref" class="gallery-card card-13">
            <div class="image-box">
              <div class="img-wrapper">
                <img src="/images/overview-13.jpg" alt="Eames Chair Shell Profile Detail" class="card-img" />
              </div>
            </div>
            <span class="card-label">PULVINAR PELLENT</span>
          </div>
        </div>
      </div>

      <!-- ================= PART 4 ================= -->
      <!-- Row 7: ULTRICES Text Block + Images (Card 14 & Card 15) -->
      <div class="gallery-row row-7-text">
        <div ref="ultricesTextBlockRef" class="ultrices-text-block">
          <h3 class="ultrices-title">ULTRICES</h3>
          <ul class="text-list">
            <li>Tristique mollis metus</li>
            <li>Pulvinar pellent</li>
            <li>Mauris nisl senectus</li>
            <li>Tincidunt nunc</li>
          </ul>
        </div>
      </div>

      <div class="gallery-row row-7-images">
        <div ref="card14Ref" class="gallery-card card-14">
          <div class="image-box">
            <div class="img-wrapper">
              <img src="/images/overview-14.jpg" alt="Eames Chair Frame Detail Studio" class="card-img" />
            </div>
          </div>
          <span class="card-label">PULVINAR PELLENT</span>
        </div>

        <div ref="card15Ref" class="gallery-card card-15">
          <div class="image-box">
            <div class="img-wrapper">
              <img src="/images/overview-15.jpg" alt="Eames Chairs Living Window Setting" class="card-img" />
            </div>
          </div>
          <span class="card-label">PULVINAR PELLENT</span>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.overview-gallery-section {
  width: 100%;
  padding-top: 4.876vw;
  padding-bottom: 5.4vw;
  padding-left: var(--section-px);
  padding-right: var(--section-px);
  background-color: #ffffff;
  box-sizing: border-box;
}

.gallery-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 13.485vw;
}

.gallery-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

/* Row 1 & Row 2 Sizing */
.row-1 {
  align-items: flex-end;
  gap: 5.3333vw;
}

.row-2 {
  align-items: flex-start;
  gap: 5.3333vw;
}

.gallery-card {
  display: flex;
  flex-direction: column;
  will-change: transform, opacity;
}

.image-box {
  width: 100%;
  overflow: hidden;
  background-color: #e5e7e9;
  position: relative;
  margin-bottom: 1.6vw;
  border-radius: 0px;
  transition: border-radius 0.45s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease;
}

.img-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  will-change: transform;
  transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.gallery-card:hover .image-box,
.image-box:hover {
  border-radius: clamp(12px, 1.5vw, 24px);
  opacity: 0.98;
}

.gallery-card:hover .img-wrapper,
.image-box:hover .img-wrapper {
  transform: scale(1.1);
}

.card-label {
  font-family: var(--font-family-base);
  font-weight: 500;
  font-size: clamp(11px, 0.8667vw, 15px);
  line-height: 1.2;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #333333;
}

/* Part 1 Card Sizing */
.card-small-left {
  width: 14.6667vw;
  flex-shrink: 0;
}
.card-small-left .image-box {
  height: 16vw;
}

.card-wide-right {
  flex-grow: 1;
  width: auto;
  max-width: calc(100vw - var(--section-px) - 35.4667vw);
}

.card-wide-right .image-box {
  height: 28vw;
}

.card-wide-left {
  width: 65%;
  max-width: 52vw;
  flex-shrink: 0;
}
.card-wide-left .image-box {
  height: 30vw;
}

.card-small-right {
  width: 16.6667vw;
  flex-shrink: 0;
  margin-top: 2.6667vw;
}
.card-small-right .image-box {
  height: 20.6667vw;
}

/* ================= PART 2 STYLES ================= */
.row-3 {
  align-items: flex-start;
  justify-content: flex-start;
}

.text-block {
  display: flex;
  flex-direction: column;
  width: 28vw;
  flex-shrink: 0;
  margin-left: 10.4667vw; /* Exact requested margin-left: 157px */
  will-change: transform, opacity;
}

.year-text {
  font-family:
    "Test Manuka", "Test Manuka Condensed", "Bebas Neue", "Impact",
    sans-serif-condensed, sans-serif;
  font-weight: 500; /* Medium weight */
  font-size: 12vw;
  line-height: 12vw;
  letter-spacing: -0.02em; /* -2% letter spacing */
  color: #333333;
  margin: 0;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.distinctive-title {
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-weight: 500; /* Medium weight */
  font-size: clamp(20px, 2vw, 32px);
  line-height: 1.1;
  letter-spacing: -0.05em; /* -5% letter spacing */
  text-transform: uppercase;
  color: #000000;
  margin-top: 0.6667vw;
  margin-bottom: 3.233vw;
}

.text-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2667vw;
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-weight: 400; /* Book weight */
  font-size: clamp(12px, 0.9333vw, 16px);
  line-height: 1.4;
  letter-spacing: -0.005em; /* -0.5% letter spacing */
  text-transform: uppercase;
  width: auto;
  max-width: 20vw;
  color: #777777;
}

.row-3-cards {
  display: flex;
  align-items: flex-start;
  gap: 2.6667vw;
  margin-left: auto;
}

.card-5 {
  width: 20.8vw;
  flex-shrink: 0;
}
.card-5 .image-box {
  height: 29.4vw;
}

.card-6 {
  width: 18.776vw;
  flex-shrink: 0;
}
.card-6 .image-box {
  height: 22.985vw;
}

/* Row 4 Styles */
.row-4 {
  align-items: flex-end;
  gap: 4vw;
}

.row-4-left {
  display: flex;
  align-items: flex-start;
  gap: 2.133vw;
  flex-shrink: 0;
}

.card-7 {
  width: 10.641vw;
  flex-shrink: 0;
}
.card-7 .image-box {
  height: 11.986vw;
}

.card-8 {
  width: 18.657vw;
  flex-shrink: 0;
}
.card-8 .image-box {
  height: 22.838vw;
}

.card-9 {
  flex-grow: 1;
  max-width: 50.324vw;
}

.card-9 .image-box {
  height: 34.083vw;
}

/* ================= PART 3 STYLES ================= */
.row-5 {
  align-items: flex-start;
  gap: 5.3333vw;
}

.card-10 {
  width: 62%;
  max-width: 50.067vw;
  flex-shrink: 0;
}
.card-10 .image-box {
  height: 31.022vw;
}

.card-11 {
  width: 18.776vw;
  flex-shrink: 0;
}
.card-11 .image-box {
  height: 22.985vw;
}

.row-6 {
  align-items: flex-start;
}

.row-6-center {
  display: flex;
  align-items: flex-start;
  gap: 2vw;
  margin-left: 17.3333vw; /* Offset to center-left area as shown in reference */
}

.card-12 {
  width: 28.431vw;
  flex-shrink: 0;
}
.card-12 .image-box {
  height: 33.813vw;
}

.card-13 {
  width: 20.964vw;
  flex-shrink: 0;
}
.card-13 .image-box {
  height: 25.663vw;
}

/* ================= PART 4 STYLES ================= */
.row-7-text {
  align-items: flex-start;
  margin-left: 17.3333vw;
}

.ultrices-text-block {
  display: flex;
  flex-direction: column;
  will-change: transform, opacity;
}

.ultrices-title {
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-weight: 500;
  font-size: clamp(22px, 2.1333vw, 34px);
  line-height: 1.1;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  color: #000000;
  margin: 0 0 2.267vw 0;
}

.row-7-images {
  align-items: flex-end;
  justify-content: space-between;
  gap: 5.3333vw;
}

.card-14 {
  width: 18.733vw;
  flex-shrink: 0;
}
.card-14 .image-box {
  height: 21.102vw;
}

.card-15 {
  width: 58%;
  max-width: 50.324vw;
  flex-shrink: 0;
}
.card-15 .image-box {
  height: 34.083vw;
}

@media (max-width: 1024px) {
  .gallery-container {
    gap: 60px;
  }
  .row-top,
  .row-bottom,
  .row-3,
  .row-4,
  .row-5,
  .row-6,
  .row-7-images {
    gap: 40px;
  }
  .text-block {
    margin-left: 40px;
  }
  .text-list {
    max-width: 100%;
  }
  .row-6-center,
  .row-7-text {
    margin-left: 80px;
  }
  .card-wide-right .image-box,
  .card-wide-left .image-box,
  .card-9 .image-box,
  .card-10 .image-box,
  .card-15 .image-box {
    height: 320px;
  }
  .row-3-cards,
  .row-4-left {
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .overview-gallery-section {
    padding-top: 40px;
    padding-bottom: 60px;
  }
  .gallery-container {
    gap: 48px;
  }
  .gallery-row,
  .row-3-cards,
  .row-4-left,
  .row-6-center,
  .row-7-images {
    flex-direction: column;
    gap: 36px;
  }
  .text-block,
  .row-7-text {
    width: 100%;
    margin-left: 0;
  }
  .row-6-center {
    margin-left: 0;
  }
  .year-text {
    font-size: clamp(5rem, 18vw, 120px);
    line-height: 1;
  }
  .distinctive-title,
  .ultrices-title {
    margin-top: 8px;
    margin-bottom: 16px;
  }
  .text-list {
    width: 100%;
    max-width: 100%;
  }
  .card-small-left,
  .card-wide-right,
  .card-wide-left,
  .card-small-right,
  .card-5,
  .card-6,
  .card-7,
  .card-8,
  .card-9,
  .card-10,
  .card-11,
  .card-12,
  .card-13,
  .card-14,
  .card-15 {
    width: 100%;
    max-width: 100%;
    margin-top: 0;
  }
  .image-box {
    height: clamp(220px, 65vw, 360px) !important;
  }
}
</style>
