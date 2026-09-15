<script setup lang="ts">
import { onMounted, ref, onUnmounted } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const containerRef = ref<HTMLElement | null>(null);
const trackRef = ref<HTMLElement | null>(null);
const heroContentRef = ref<HTMLElement | null>(null);
const craftTitleRef = ref<HTMLElement | null>(null);
let scrollTriggerInstance: ScrollTrigger | null = null;

const alignHeroContent = () => {
  if (import.meta.client && heroContentRef.value) {
    const navItem = document.querySelector(
      ".app-header .header-nav .nav-link",
    ) as HTMLElement;
    if (navItem) {
      const rect = navItem.getBoundingClientRect();
      heroContentRef.value.style.left = `${rect.left}px`;
    }
  }
};

onMounted(() => {
  if (import.meta.client) {
    alignHeroContent();
    window.addEventListener("resize", alignHeroContent);
    setTimeout(alignHeroContent, 100);
    setTimeout(alignHeroContent, 500);

    gsap.registerPlugin(ScrollTrigger);

    const track = trackRef.value;
    const container = containerRef.value;

    if (track && container) {
      // Calculate horizontal movement distance
      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

      const animation = gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      scrollTriggerInstance = animation.scrollTrigger;

      // GSAP SplitText ScrollTrigger animation for Fine Forms, — Refined.
      if (craftTitleRef.value) {
        const titleEl = craftTitleRef.value;
        const chars = titleEl.querySelectorAll(".char-span");

        if (chars.length > 0) {
          gsap.fromTo(
            chars,
            {
              y: 120,
              opacity: 0,
              rotateX: -45,
            },
            {
              y: 0,
              opacity: 1,
              rotateX: 0,
              duration: 1,
              stagger: 0.03,
              ease: "power3.out",
              scrollTrigger: {
                trigger: titleEl,
                containerAnimation: animation,
                start: "left 85%",
                toggleActions: "play none none reverse",
              },
            },
          );
        }
      }
    }
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener("resize", alignHeroContent);
  }
  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill();
  }
});
</script>

<template>
  <div class="stories-page-root">
    <!-- Pinned Horizontal Scroll Section -->
    <section ref="containerRef" class="horizontal-scroll-container">
      <div ref="trackRef" class="horizontal-track">
        <!-- Panel 1: Hero Cover (Matching reference image) -->
        <div class="story-panel panel-hero">
          <div class="hero-bg-overlay">
            <img
              src="/images/stories-hero.jpg"
              alt="Eames Moulded Plywood Hero Dummy"
              class="hero-img"
            />
            <div class="dark-gradient"></div>
          </div>
          <!-- Hero Content aligned horizontally with middle navbar menu -->
          <div ref="heroContentRef" class="hero-content">
            <span class="hero-tag">01 / DESIGN STORY</span>
            <h1 class="hero-title">Eames Moulded<br />Plywood</h1>
          </div>
        </div>

        <!-- Panel 2: Fine - Forms (Legacy Panel) -->
        <div class="story-panel panel-legacy">
          <div class="panel-inner">
            <div class="legacy-text-col">
              <h2 class="legacy-title">Fine -<br />Forms</h2>
              <div class="legacy-paragraphs">
                <p class="legacy-p">
                  The story behind the Eames Moulded Plywood Chairs reveals how
                  imagination and serendipity play a major role in design. In
                  the early 1940s, when Charles Eames was working on MGM set
                  designs, he and his wife Ray were experimenting with
                  wood-moulding techniques that would have a profound effect on
                  the world of design.
                </p>
                <p class="legacy-p">
                  Their discoveries led to a commission from the US Navy to
                  develop plywood splints, stretchers and glider shells, moulded
                  under heat and pressure, that were used successfully in World
                  War II.
                </p>
              </div>
            </div>
            <div class="legacy-img-col">
              <div class="img-card">
                <img
                  src="/images/stories-fine-forms.jpg"
                  alt="Eames Chair Fine Forms"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Panel 3: Distinctive Craft (Fine Forms, — Refined) -->
        <div class="story-panel panel-craft">
          <div class="craft-bg-illustration">
            <img
              src="/images/stories-craft-bg.png"
              alt="Blueprint Illustration"
              class="craft-bg-img"
            />
          </div>
          <div class="panel-inner craft-inner">
            <!-- Left Group: Quote & 2 Paragraphs -->
            <div class="craft-left-col">
              <div class="quote-badge">
                “Recognising the need<br />
                is the primary<br />
                condition for design.”
              </div>
              <div class="craft-paragraphs">
                <p class="craft-p">
                  These chairs can be upholstered in just about any fabric you
                  like. When upholstered, the chair's back and seat have exposed
                  veneer on the back sides. Veneers are available in six wood.
                </p>
                <p class="craft-p">
                  These chairs can be upholstered in just about any fabric you
                  like. When upholstered, the chair's back and seat have exposed
                  veneer on the back sides. Veneers are available in six wood.
                </p>
              </div>
            </div>

            <!-- Right Group: Giant 358px Title with GSAP SplitText Motion -->
            <div class="craft-right-col">
              <h2 ref="craftTitleRef" class="craft-giant-title">
                <span class="title-line">
                  <span
                    v-for="(char, i) in 'Fine Forms,'"
                    :key="'c1-' + i"
                    class="char-span"
                  >
                    {{ char === " " ? "\u00A0" : char }}
                  </span>
                </span>
                <span class="title-line">
                  <span
                    v-for="(char, i) in '— Refined'"
                    :key="'c2-' + i"
                    class="char-span"
                  >
                    {{ char === " " ? "\u00A0" : char }}
                  </span>
                  <span class="char-span orange-dot">.</span>
                </span>
              </h2>
            </div>
          </div>
        </div>

        <!-- Panel 4: Architectural Studio Gallery & Herman Miller Legacy -->
        <div class="story-panel panel-gallery">
          <div class="panel-inner gallery-inner">
            <!-- Left Group: Charles & Ray Eames Portrait with Black Quote Badge -->
            <div class="gallery-left-col">
              <div class="portrait-card">
                <img
                  src="/images/stories-eames-portrait.jpg"
                  alt="Charles & Ray Eames Portrait"
                  class="portrait-img"
                />
                <div class="gallery-quote-badge">
                  “Recognising the need<br />
                  is the primary<br />
                  condition for design.”
                </div>
              </div>
            </div>

            <!-- Right Group: Chair Photo, Herman Miller Quote, 1946 & Paragraph -->
            <div class="gallery-right-col">
              <div class="chair-card">
                <img
                  src="/images/stories-chair-orange.jpg"
                  alt="Eames Chair Orange Highlight"
                  class="chair-img"
                />
              </div>
              <div class="gallery-text-block">
                <h2 class="herman-quote">
                  “Herman Miller is built<br />
                  on a legacy of creative<br />
                  partnership.”
                </h2>
                <div class="gallery-year-block">
                  <span class="gallery-year">1946</span>
                  <p class="gallery-p">
                    These chairs can be upholstered in just about any fabric you
                    like. When upholstered, the chair's back and seat have
                    exposed veneer on the back sides. Veneers are available in
                    six wood.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Panel 5: Distinctive Features (Exposed Veneer, Distinctive Design, Wood-Moulding) -->
        <div class="story-panel panel-features">
          <div class="feature-col col-dark">
            <div class="feature-top">
              <div class="feature-num num-white">01</div>
              <h2 class="feature-title">Exposed<br />Veneer.</h2>
            </div>
            <div class="feature-img-box">
              <img
                src="/images/stories-feature-1.png"
                alt="Exposed Veneer Detail"
                class="feature-img"
              />
            </div>
            <p class="feature-p">
              Their discoveries led to a commission from the US Navy to develop
              plywood splints, stretchers and glider shells, moulded under heat
              and pressure, that were used successfully in World War II.
            </p>
          </div>

          <div class="feature-col col-light">
            <div class="feature-top">
              <div class="feature-num num-black">02</div>
              <h2 class="feature-title">Distinctive<br />Design.</h2>
            </div>
            <div class="feature-img-box">
              <img
                src="/images/stories-feature-2.png"
                alt="Distinctive Design Detail"
                class="feature-img"
              />
            </div>
            <p class="feature-p">
              Their discoveries led to a commission from the US Navy to develop
              plywood splints, stretchers and glider shells, moulded under heat
              and pressure, that were used successfully in World War II.
            </p>
          </div>

          <div class="feature-col col-dark">
            <div class="feature-top">
              <div class="feature-num num-white">03</div>
              <h2 class="feature-title">Wood-<br />Moulding.</h2>
            </div>
            <div class="feature-img-box">
              <img
                src="/images/stories-feature-3.png"
                alt="Wood-Moulding Detail"
                class="feature-img"
              />
            </div>
            <p class="feature-p">
              Their discoveries led to a commission from the US Navy to develop
              plywood splints, stretchers and glider shells, moulded under heat
              and pressure, that were used successfully in World War II.
            </p>
          </div>
        </div>

        <!-- Panel 6: Chair Design Collage -->
        <div class="story-panel panel-collage">
          <div class="collage-card card-1">
            <img
              src="/images/stories-collage-1.png"
              alt="Eames Chair Back View"
              class="collage-img"
            />
          </div>
          <div class="collage-card card-2">
            <img
              src="/images/stories-collage-2.png"
              alt="Eames Chair Wood Curves Detail"
              class="collage-img"
            />
          </div>
          <div class="collage-card card-3">
            <img
              src="/images/stories-collage-3.png"
              alt="Eames Chair 3/4 Side Profile"
              class="collage-img"
            />
          </div>
        </div>

        <!-- Panel 7: Ending Cover (Fine forms, — Refined.) -->
        <div class="story-panel panel-end">
          <div class="end-bg-illustration">
            <img
              src="/images/stories-end-bg.png"
              alt="Blueprint Dark Illustration"
              class="end-bg-img"
            />
          </div>
          <div class="panel-inner end-inner">
            <div class="end-content">
              <h2 class="end-giant-title">
                <span class="end-title-line line-1">Fine forms,</span>
                <span class="end-title-line line-2">— Refined.</span>
              </h2>
              <!-- <div class="end-action">
                <span class="end-subtitle">HERMAN MILLER COLLECTION</span>
                <NuxtLink to="/product" class="cta-btn">
                  EXPLORE PRODUCT OVERVIEW →
                </NuxtLink>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stories-page-root {
  width: 100%;
  background-color: #0d0d0d;
  color: #ffffff;
  overflow-x: hidden;
}

.horizontal-scroll-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.horizontal-track {
  display: flex;
  flex-wrap: nowrap;
  width: fit-content;
  height: 100vh;
  will-change: transform;
}

.story-panel {
  height: 100vh;
  flex-shrink: 0;
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ================= PANEL 1: HERO ================= */
.panel-hero {
  width: 100vw;
  background-color: #000000;
}

.hero-bg-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dark-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.25) 50%,
    rgba(0, 0, 0, 0.75) 100%
  );
}

/* Align left edge of title dynamically with middle menu (Products link) in AppHeader */
.hero-content {
  position: absolute;
  bottom: 5.3333vw;
  left: calc(var(--section-px) + 6.4667vw + 25.0833vw);
  width: 62.5333vw;
  max-width: calc(100vw - var(--section-px) - 2.6667vw);
  z-index: 2;
  text-align: left;
}

.hero-tag {
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-weight: 500;
  font-size: 0.9333vw;
  line-height: 1.2vw;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #e0e0e0;
  margin-bottom: 1.6vw;
  display: block;
}

.hero-title {
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-weight: 500;
  font-size: 8.5333vw;
  line-height: 7.6vw;
  letter-spacing: -0.04em; /* -4% letter spacing */
  color: #ffffff;
  margin: 0;
}

/* ================= PANEL 2: LEGACY (FINE - FORMS) ================= */
.panel-legacy {
  width: 109.3333vw;
  min-width: 109.3333vw;
  flex-shrink: 0;
  height: 100vh;
  padding-top: 7.8667vw;
  padding-bottom: 7.8667vw;
  padding-left: 12.4667vw;
  padding-right: 4.5333vw;
  background-color: #191919;
  box-sizing: border-box;
}

.panel-legacy .panel-inner {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.legacy-text-col {
  width: 25.3333vw;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.legacy-title {
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-weight: 500;
  font-size: 8.5333vw;
  line-height: 8.5333vw;
  letter-spacing: -0.04em;
  color: #ffffff;
  margin: 0 0 3.6vw 0;
  text-transform: none;
  text-align: left;
}

.legacy-paragraphs {
  display: flex;
  flex-direction: column;
  gap: 1.6vw;
  width: 100%;
}

.legacy-p {
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-weight: 400;
  font-size: 1.3333vw;
  line-height: 2vw;
  letter-spacing: -0.005em;
  color: #cccccc;
  margin: 0;
  text-align: left;
  text-indent: 3.2vw;
}

.legacy-img-col {
  width: 50.9333vw;
  height: 100%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.legacy-img-col .img-card {
  width: 50.9333vw;
  height: 100%;
}

.legacy-img-col .img-card img {
  width: 50.9333vw;
  height: 100%;
  object-fit: cover;
  display: block;
}

.img-card {
  display: flex;
  flex-direction: column;
}

.img-card img {
  width: 100%;
  height: 32vw;
  object-fit: cover;
  display: block;
}

.card-caption {
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-weight: 500;
  font-size: 0.8vw;
  line-height: 0.9333vw;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #888888;
  margin-top: 0.8vw;
}

/* ================= PANEL 3: CRAFT (FINE FORMS, REFINED) ================= */
.panel-craft {
  width: 238vw;
  min-width: 238vw;
  flex-shrink: 0;
  height: 100vh;
  background-color: #ffffff;
  color: #000000;
  position: relative;
  box-sizing: border-box;
  padding: 5.3333vw 8vw;
  overflow: hidden;
}

.craft-bg-illustration {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 100%;
  width: auto;
  pointer-events: none;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.85;
}

.craft-bg-img {
  height: 100%;
  width: auto;
  object-fit: contain;
}

.craft-inner {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8vw;
}

.craft-left-col {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4vw;
  flex-shrink: 0;
  width: 54.9102vw;
}

.quote-badge {
  width: 54.9102vw;
  max-width: 54.9102vw;
  background-color: #000000;
  color: #ffffff;
  padding: 1.6vw 1.8667vw;
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-weight: 500;
  font-size: 5.3973vw;
  line-height: 5.3973vw;
  letter-spacing: -0.02em;
  box-sizing: border-box;
  display: block;
}

.craft-paragraphs {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}

.craft-p {
  width: 24vw;
  flex-shrink: 0;
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-weight: 500;
  font-size: 1.3333vw;
  line-height: 2vw;
  letter-spacing: -0.005em;
  color: #666666;
  margin: 0;
  text-align: justify;
}

.craft-right-col {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.craft-giant-title {
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-weight: 500;
  font-size: 23.8667vw;
  line-height: 0.88;
  letter-spacing: -0.04em;
  color: #000000;
  margin: 0;
  text-align: left;
  white-space: nowrap;
  perspective: 1000px;
}

.title-line {
  display: block;
  overflow: hidden;
  line-height: 0.88;
}

.char-span {
  display: inline-block;
  will-change: transform, opacity;
  transform-origin: 50% 100%;
}

.orange-dot {
  color: #f05a24;
  display: inline-block;
}

/* ================= PANEL 4: GALLERY (HERMAN MILLER LEGACY) ================= */
.panel-gallery {
  width: 226.6667vw;
  min-width: 226.6667vw;
  flex-shrink: 0;
  height: 100vh;
  background-color: #ffffff;
  color: #000000;
  box-sizing: border-box;
  padding: 0;
}

.gallery-inner {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 8vw;
  padding-right: 8vw;
  box-sizing: border-box;
}

.gallery-left-col {
  height: 100vh;
  width: 106.2667vw;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.portrait-card {
  position: relative;
  width: 106.2667vw;
  height: 100vh;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.portrait-img {
  width: 100%;
  height: 100vh;
  object-fit: cover;
  display: block;
}

.gallery-quote-badge {
  position: absolute;
  bottom: 10vw;
  right: -22.6667vw;
  background-color: #000000;
  color: #ffffff;
  padding: 1.6vw 1.8667vw;
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-weight: 500;
  font-size: 5.3973vw;
  line-height: 5.3973vw;
  letter-spacing: -0.02em;
  box-sizing: border-box;
  z-index: 3;
  width: 54.9102vw;
}

.gallery-right-col {
  height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0;
  flex-grow: 1;
}

.chair-card {
  height: 100vh;
  padding: 4.6667vw 0 4.6667vw 25.7333vw;
  box-sizing: border-box;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.chair-img {
  height: 100%;
  width: auto;
  object-fit: cover;
  display: block;
}

.gallery-text-block {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  padding: 8vw 0;
  box-sizing: border-box;
  flex-shrink: 0;
  width: 43.1628vw;
  position: relative;
  z-index: 2;
}

.herman-quote {
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-weight: 500;
  font-size: 5.4667vw;
  line-height: 5.4667vw;
  letter-spacing: -0.03em;
  color: #000000;
  margin: 0;
  text-align: left;
  width: 51.8294vw;
  margin-left: -8.6667vw;
  position: relative;
  z-index: 2;
}

.gallery-year-block {
  display: flex;
  flex-direction: column;
  gap: 1.0667vw;
  padding-left: 10vw;
}

.gallery-year {
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-weight: 500;
  font-size: 6.4vw;
  line-height: 6.7053vw;
  letter-spacing: -0.02em;
  color: #f05a24;
  display: block;
}

.gallery-p {
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-weight: 500;
  font-size: 1.3333vw;
  line-height: 2vw;
  letter-spacing: -0.005em;
  color: #777777;
  margin: 0;
  width: 24vw;
}

/* ================= PANEL 5: FEATURES ================= */
.panel-features {
  width: 119.3333vw;
  min-width: 119.3333vw;
  flex-shrink: 0;
  height: 100vh;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
}

.feature-col {
  width: 39.7778vw;
  height: 100vh;
  flex-shrink: 0;
  box-sizing: border-box;
  padding: 5.3333vw 5.7333vw 5.3333vw 8.5333vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.col-dark {
  background-color: #1a1a1a;
  color: #ffffff;
}

.col-light {
  background-color: #e3e3e3;
  color: #000000;
}

.feature-top {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2.4vw;
}

.feature-num {
  width: 4.8vw;
  height: 4.8vw;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-weight: 500;
  font-size: 2.4vw;
  line-height: 4.2667vw;
  letter-spacing: -0.02em;
}

.num-white {
  background-color: #ffffff;
  color: #000000;
}

.num-black {
  background-color: #000000;
  color: #ffffff;
}

.feature-title {
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-weight: 500;
  font-size: 4.2667vw;
  line-height: 4.2667vw;
  letter-spacing: -0.02em;
  text-transform: capitalize;
  margin: 0;
}

.col-dark .feature-title {
  color: #ffffff;
}

.col-light .feature-title {
  color: #000000;
}

.feature-img-box {
  width: 100%;
  height: 20.6667vw;
  flex-shrink: 0;
  overflow: hidden;
}

.feature-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.feature-p {
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-weight: 400;
  font-size: 1.3333vw;
  line-height: 2vw;
  letter-spacing: -0.005em;
  margin: 0;
}

.col-dark .feature-p {
  color: #cccccc;
}

/* ================= PANEL 6: COLLAGE ================= */
.panel-collage {
  width: 130.8667vw;
  min-width: 130.8667vw;
  flex-shrink: 0;
  height: 100vh;
  background-color: #ffffff;
  position: relative;
  box-sizing: border-box;
}

.collage-card {
  position: absolute;
  box-sizing: border-box;
}

.collage-card.card-1 {
  width: 17.3333vw;
  height: 19.3333vw;
  left: 8vw;
  bottom: 6.6667vw;
}

.collage-card.card-2 {
  width: 23.3333vw;
  height: 28.6667vw;
  left: 40.6667vw;
  top: 8vw;
}

.collage-card.card-3 {
  width: 56.6667vw;
  height: 38vw;
  right: 8vw;
  top: 8vw;
}

.collage-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ================= PANEL 7: END ================= */
.panel-end {
  width: 154.4vw;
  min-width: 154.4vw;
  flex-shrink: 0;
  height: 100vh;
  background-color: #000000;
  color: #ffffff;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
}

.end-bg-illustration {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
}

.end-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.end-inner {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 5.3333vw 9.3333vw;
  box-sizing: border-box;
}

.end-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  padding: 2.6667vw 0;
  box-sizing: border-box;
}

.end-giant-title {
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-weight: 500;
  font-size: 21.3333vw;
  line-height: 0.88;
  letter-spacing: -0.04em;
  color: #ffffff;
  margin: auto 0;
  text-align: left;
  white-space: nowrap;
}

.end-title-line {
  display: block;
}

.end-title-line.line-1 {
  padding-left: 0;
}

.end-title-line.line-2 {
  padding-left: 29.3333vw;
}

.end-action {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 2.6667vw;
}

.end-subtitle {
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-weight: 500;
  font-size: 0.9333vw;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #888888;
}

.cta-btn {
  display: inline-block;
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-weight: 500;
  font-size: 1vw;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #ffffff;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.9333vw 1.8667vw;
  border-radius: 2.6667vw;
  text-decoration: none;
  transition: all 0.3s ease;
}

.cta-btn:hover {
  background-color: #ffffff;
  color: #000000;
  border-color: #ffffff;
}

@media (max-width: 1024px) {
  .hero-left-spacer {
    display: none;
  }
  .hero-content {
    width: 100%;
    max-width: 100%;
  }
  .hero-title {
    font-size: clamp(3.5rem, 10vw, 8.5333vw);
    line-height: 1;
  }
  .panel-legacy,
  .panel-craft,
  .panel-gallery {
    width: 100vw;
    padding: 0 40px;
  }
  .legacy-year {
    font-size: clamp(6rem, 15vw, 12.9333vw);
    line-height: 1;
  }
  .end-title {
    font-size: clamp(2.5rem, 6vw, 4.8vw);
    line-height: 1;
  }
}
</style>
