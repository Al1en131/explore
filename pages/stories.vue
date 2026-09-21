<script setup lang="ts">
import { onMounted, ref, onUnmounted } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const containerRef = ref<HTMLElement | null>(null);
const trackRef = ref<HTMLElement | null>(null);
const heroContentRef = ref<HTMLElement | null>(null);
const heroTitleRef = ref<HTMLElement | null>(null);
const heroPanelRef = ref<HTMLElement | null>(null);
const craftTitleRef = ref<HTMLElement | null>(null);
const hermanQuoteRef = ref<HTMLElement | null>(null);
const endTitleRef = ref<HTMLElement | null>(null);
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

const splitElementWords = (element: HTMLElement) => {
  if (!element) return;
  element.style.opacity = "1";
  element.style.perspective = "1000px";

  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";
      if (!text.trim() && text !== " ") return;
      const frag = document.createDocumentFragment();
      const parts = text.split(/(\s+)/);
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!part) continue;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(" "));
        } else {
          const span = document.createElement("span");
          span.className = "word-span";
          span.style.display = "inline-block";
          span.style.willChange = "transform, opacity";
          span.style.transformOrigin = "50% 100%";
          span.textContent = part;
          frag.appendChild(span);
        }
      }
      if (frag.childNodes.length > 0) {
        node.parentNode?.replaceChild(frag, node);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      if (el.classList.contains("indent-space")) return;
      Array.from(el.childNodes).forEach(walk);
    }
  };

  Array.from(element.childNodes).forEach(walk);
};

const splitElementChars = (element: HTMLElement) => {
  if (!element) return;
  element.style.opacity = "1";
  element.style.perspective = "1000px";

  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";
      if (!text.trim()) return;
      const frag = document.createDocumentFragment();
      const words = text.split(/(\s+)/);
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (!word) continue;
        if (/^\s+$/.test(word)) {
          frag.appendChild(document.createTextNode(word));
        } else {
          const wordSpan = document.createElement("span");
          wordSpan.style.display = "inline-block";
          wordSpan.style.whiteSpace = "nowrap";
          for (let j = 0; j < word.length; j++) {
            const charSpan = document.createElement("span");
            charSpan.className = "char-span";
            charSpan.style.display = "inline-block";
            charSpan.style.willChange = "transform, opacity";
            charSpan.textContent = word[j];
            wordSpan.appendChild(charSpan);
          }
          frag.appendChild(wordSpan);
        }
      }
      if (frag.childNodes.length > 0) {
        node.parentNode?.replaceChild(frag, node);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      if (el.tagName === "BR" || el.classList.contains("indent-space")) return;
      Array.from(el.childNodes).forEach(walk);
    }
  };

  Array.from(element.childNodes).forEach(walk);
};

onMounted(() => {
  if (import.meta.client) {
    window.scrollTo(0, 0);
    if (trackRef.value) {
      gsap.set(trackRef.value, { x: 0 });
    }

    alignHeroContent();
    window.addEventListener("resize", alignHeroContent);
    setTimeout(alignHeroContent, 100);
    setTimeout(alignHeroContent, 500);

    gsap.registerPlugin(ScrollTrigger);

    onPreloaderComplete(() => {
      // Hero title entrance Per-Character Motion (Matching HeroBanner specs)
      if (heroTitleRef.value) {
        splitElementChars(heroTitleRef.value);
        const chars = heroTitleRef.value.querySelectorAll(".char-span");
        if (chars.length > 0) {
          gsap.fromTo(
            chars,
            { y: 30, opacity: 0, rotateX: -20 },
            {
              y: 0,
              opacity: 1,
              rotateX: 0,
              duration: 1.2,
              stagger: 0.045,
              ease: "power2.out",
              delay: 0.1,
            }
          );
        }
      }
    });

    let mm: gsap.MatchMedia | null = null;
    gsap.registerPlugin(ScrollTrigger);

    mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      const track = trackRef.value;
      const container = containerRef.value;

      if (track && container) {
        gsap.set(track, { x: 0 });
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

        // Depth push-back animation for Panel 1 (Hero) as Panel 2 slides OVER it
        if (heroPanelRef.value) {
          gsap.to(heroPanelRef.value, {
            scale: 0.9,
            opacity: 0,
            filter: "brightness(0.3)",
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top top",
              end: () => `+=${window.innerWidth}`,
              scrub: true,
            },
          });
        }

        // GSAP Random Exploding Character Entrance for Fine Forms, — Refined. in Panel 3
        if (craftTitleRef.value) {
          const titleEl = craftTitleRef.value;
          const chars = titleEl.querySelectorAll(".char-span");

          chars.forEach((char) => {
            gsap.from(char, {
              yPercent: "random(-200, 200)",
              rotation: "random(-20, 20)",
              opacity: 0,
              ease: "back.out(1.2)",
              scrollTrigger: {
                trigger: char,
                containerAnimation: animation,
                start: "left 100%",
                end: "left 35%",
                scrub: 1,
              },
            });
          });
        }

        // GSAP Word-by-Word 3D rotation animation for Herman Miller Quote in panel-gallery
        if (hermanQuoteRef.value) {
          splitElementWords(hermanQuoteRef.value);
          const words = hermanQuoteRef.value.querySelectorAll(".word-span");
          if (words.length > 0) {
            gsap.fromTo(
              words,
              {
                y: 30,
                opacity: 0,
                rotateX: -20,
              },
              {
                y: 0,
                opacity: 1,
                rotateX: 0,
                duration: 0.55,
                stagger: 0.03,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: hermanQuoteRef.value,
                  containerAnimation: animation,
                  start: "left 85%",
                  toggleActions: "play none none reverse",
                },
              },
            );
          }
        }

        // GSAP Random Exploding Character Entrance for Fine forms, — Refined. in Panel 7
        if (endTitleRef.value) {
          const titleEl = endTitleRef.value;
          const chars = titleEl.querySelectorAll(".char-span");

          chars.forEach((char) => {
            gsap.from(char, {
              yPercent: "random(-200, 200)",
              rotation: "random(-20, 20)",
              opacity: 0,
              ease: "back.out(1.2)",
              scrollTrigger: {
                trigger: char,
                containerAnimation: animation,
                start: "left 100%",
                end: "left 35%",
                scrub: 1,
              },
            });
          });
        }

        // GSAP ScrollTrigger clip-path text reveal animation for description paragraphs in stories page
        const descParagraphs = track.querySelectorAll(
          ".legacy-p, .craft-p, .gallery-p, .feature-p"
        );
        descParagraphs.forEach((p) => {
          gsap.fromTo(
            p,
            {
              clipPath: "inset(0% 0% 100% 0%)",
              y: 35,
              opacity: 0,
            },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              y: 0,
              opacity: 1,
              duration: 1.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: p,
                containerAnimation: animation,
                start: "left 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });

        // Horizontal Scroll Left-to-Right Clip-Path Wipe Entrance ONLY for section right before panel end (Panel 6 Collage)
        const entranceImgs = track.querySelectorAll(
          ".panel-collage img, .collage-img"
        );

        entranceImgs.forEach((img) => {
          gsap.fromTo(
            img,
            {
              clipPath: "inset(0% 100% 0% 0%)",
              opacity: 0,
            },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              opacity: 1,
              duration: 1.3,
              ease: "power3.inOut",
              scrollTrigger: {
                trigger: img.parentElement || img,
                containerAnimation: animation,
                start: "left 90%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });

        // Horizontal Scroll Parallax on all panel images (including hero-img)
        const panelImgs = track.querySelectorAll(
          ".hero-img, .legacy-img-col img, .chair-img, .feature-img, .collage-img, .end-bg-img"
        );

        panelImgs.forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -10, scale: 1.12 },
            {
              xPercent: 10,
              scale: 1.12,
              ease: "none",
              scrollTrigger: {
                trigger: img.parentElement || img,
                containerAnimation: animation,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        });
      }
    });

    mm.add("(max-width: 768px)", () => {
      const track = trackRef.value;
      if (track) {
        gsap.set(track, { clearProps: "transform,x" });
      }
      if (heroPanelRef.value) {
        gsap.set(heroPanelRef.value, { clearProps: "all" });
      }

      // Per-character reveal motion specifically on mobile for Fine Forms, — Refined. in Panel 3
      if (craftTitleRef.value) {
        const chars = craftTitleRef.value.querySelectorAll(".char-span");
        if (chars.length > 0) {
          gsap.fromTo(
            chars,
            { y: 35, opacity: 0, rotateX: -25 },
            {
              y: 0,
              opacity: 1,
              rotateX: 0,
              duration: 0.85,
              stagger: 0.035,
              ease: "power3.out",
              scrollTrigger: {
                trigger: craftTitleRef.value,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      }

      const descParagraphs = document.querySelectorAll(
        ".legacy-p, .craft-p, .gallery-p, .feature-p"
      );
      descParagraphs.forEach((p) => {
        gsap.fromTo(
          p,
          { opacity: 0, y: 30, clipPath: "inset(0% 0% 0% 0%)" },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: p,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // GSAP ScrollTrigger clip-path reveal motion (bottom to top) specifically for images on mobile
      const mobileImgs = document.querySelectorAll(
        ".hero-img, .panel-legacy img, .gallery-resp-img, .feature-img, .collage-img"
      );
      mobileImgs.forEach((img) => {
        gsap.fromTo(
          img,
          {
            clipPath: "inset(100% 0% 0% 0%)",
            opacity: 0,
            y: 35,
            scale: 1.05,
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: (img as HTMLElement).parentElement || img,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    });
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
      <!-- Panel 1: Hero Cover (Fixed Backdrop sitting behind moving track) -->
      <div ref="heroPanelRef" class="story-panel panel-hero">
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
          <h1 ref="heroTitleRef" class="hero-title">
            Eames Moulded<br />Plywood
          </h1>
        </div>
      </div>

      <!-- Moving Track for Panels 2 -> 7 -->
      <div ref="trackRef" class="horizontal-track">
        <!-- Panel 2: Fine - Forms (Legacy Panel) -->
        <div class="story-panel panel-legacy">
          <div class="panel-inner">
            <div class="legacy-text-col">
              <h2 class="legacy-title">Fine - Forms</h2>
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
                <span class="quote-line">“Recognising the need</span>
                <span class="quote-line">is the primary</span>
                <span class="quote-line">condition for design.”</span>
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
                  <span class="quote-line">“Recognising the need</span>
                  <span class="quote-line">is the primary</span>
                  <span class="quote-line">condition for design.”</span>
                </div>
              </div>
            </div>

            <!-- Single Replacement Image for Mobile Responsive -->
            <div class="gallery-resp-card">
              <img
                src="/images/stories-chair-orange-resp.png"
                alt="Eames Chair Responsive Highlight"
                class="gallery-resp-img"
              />
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
                <h2 ref="hermanQuoteRef" class="herman-quote">
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
              <h2 ref="endTitleRef" class="end-giant-title">
                <span class="end-title-line line-1">
                  <span
                    v-for="(char, i) in 'Fine forms,'"
                    :key="'e1-' + i"
                    class="char-span"
                  >
                    {{ char === " " ? "\u00A0" : char }}
                  </span>
                </span>
                <span class="end-title-line line-2">
                  <span
                    v-for="(char, i) in '— Refined'"
                    :key="'e2-' + i"
                    class="char-span"
                  >
                    {{ char === " " ? "\u00A0" : char }}
                  </span>
                  <span class="char-span orange-dot">.</span>
                </span>
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
  position: relative;
  z-index: 2;
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

/* ================= PANEL 1: HERO (FIXED BACKDROP) ================= */
.panel-hero {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  background-color: #000000;
  will-change: transform, opacity, filter;
  transform-origin: center center;
}

.hero-bg-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
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
  bottom: clamp(32px, 4.5vw, 70px);
  left: calc(var(--section-px) + 6.4667vw + 25.0833vw);
  width: 62.5333vw;
  max-width: calc(100vw - var(--section-px) - 2.6667vw);
  z-index: 2;
  text-align: left;
}

.hero-tag {
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-weight: 500;
  font-size: clamp(12px, 0.9333vw, 15px);
  line-height: 1.2;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #e0e0e0;
  margin-bottom: 1.6vw;
  display: block;
}

.hero-title {
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-weight: 500;
  font-size: clamp(2.5rem, 8.5333vw, 128px);
  line-height: 1.05;
  letter-spacing: -0.04em; /* -4% letter spacing */
  color: #ffffff;
  margin: 0;
  perspective: 1000px;
}

/* ================= PANEL 2: LEGACY (FINE - FORMS OVERLAY) ================= */
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
  margin-left: 100vw; /* Offsets Panel 2 so Panel 1 is initially visible on full screen */
  position: relative;
  z-index: 2;
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
  font-size: clamp(2.5rem, 8.5333vw, 128px);
  line-height: 1.05;
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
  font-size: clamp(14px, 1.3333vw, 20px);
  line-height: 1.6;
  letter-spacing: -0.005em;
  color: #cccccc;
  margin: 0;
  text-align: left;
  text-indent: 3.2vw;
}

.legacy-img-col {
  width: 50.9333vw;
  height: 56.4vw;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.legacy-img-col .img-card {
  width: 50.9333vw;
  height: 100%;
  overflow: hidden;
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
  font-size: clamp(11px, 0.8vw, 14px);
  line-height: 1.2;
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
  z-index: 3;
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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: fit-content;
  max-width: 54.9102vw;
  color: #ffffff;
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-weight: 500;
  font-size: clamp(1.4rem, 5.3973vw, 80px);
  line-height: 1.08;
  letter-spacing: -0.02em;
  box-sizing: border-box;
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
  font-size: clamp(14px, 1.3333vw, 20px);
  line-height: 1.6;
  letter-spacing: -0.005em;
  color: #666666;
  margin: 0;
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
  font-size: clamp(3rem, 23.8667vw, 350px);
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
  overflow: visible;
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

.gallery-resp-card {
  display: none;
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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: fit-content;
  max-width: 54.9102vw;
  color: #ffffff;
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-weight: 500;
  font-size: clamp(1.4rem, 5.3973vw, 80px);
  line-height: 1.08;
  letter-spacing: -0.02em;
  box-sizing: border-box;
  z-index: 3;
}

.quote-line {
  background-color: #191919;
  padding: 0.12em 0.32em;
  display: inline-block;
  white-space: nowrap;
}

.quote-line:first-child {
  padding-left: 0.55em;
  padding-right: 0.55em;
  margin-left: -0.23em;
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
  overflow: hidden;
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
  font-size: clamp(1.8rem, 5.4667vw, 82px);
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: #000000;
  margin: 0;
  text-align: left;
  width: 51.8294vw;
  margin-left: -10.9vw;
  margin-top: 4.5vw;
  position: relative;
  z-index: 2;
  perspective: 1000px;
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
  font-size: clamp(2.5rem, 6.4vw, 96px);
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: #f05a24;
  display: block;
}

.gallery-p {
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-weight: 500;
  font-size: clamp(14px, 1.3333vw, 20px);
  line-height: 1.6;
  letter-spacing: -0.005em;
  color: #777777;
  margin: 0;
  width: 25vw;
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
  gap: 2.133vw;
}

.feature-num {
  width: clamp(36px, 4.8vw, 72px);
  height: clamp(36px, 4.8vw, 72px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-weight: 500;
  font-size: clamp(1rem, 2vw, 30px);
  line-height: 1;
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
  font-size: clamp(1.8rem, 4vw, 60px);
  line-height: 1.05;
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
  font-size: clamp(14px, 1.3333vw, 20px);
  line-height: 1.6;
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
  z-index: 6;
  box-sizing: border-box;
}

.collage-card {
  position: absolute;
  box-sizing: border-box;
  overflow: hidden;
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
  z-index: 7;
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
  font-size: clamp(3rem, 21.3333vw, 320px);
  line-height: 0.88;
  letter-spacing: -0.04em;
  color: #ffffff;
  margin: auto 0;
  text-align: left;
  white-space: nowrap;
  perspective: 1000px;
}

.end-title-line {
  display: block;
  overflow: visible;
  line-height: 0.88;
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
  font-size: clamp(12px, 0.9333vw, 16px);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #888888;
}

.cta-btn {
  display: inline-block;
  font-family: "PP Neue Montreal", var(--font-family-base);
  font-weight: 500;
  font-size: clamp(13px, 1vw, 16px);
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
  .hero-content {
    left: var(--section-px);
    width: 100%;
    max-width: 100%;
  }
  .hero-title {
    font-size: clamp(2.5rem, 9vw, 8.5333vw);
    line-height: 1.05;
  }
  .legacy-title {
    font-size: clamp(2.5rem, 9vw, 8.5333vw);
    line-height: 1.05;
  }
}

@media (max-width: 768px) {
  .stories-page-root {
    width: 100%;
    overflow-x: hidden;
  }

  .horizontal-scroll-container {
    width: 100% !important;
    height: auto !important;
    overflow: visible !important;
    position: relative !important;
  }

  .horizontal-track {
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
    height: auto !important;
    transform: none !important;
    position: relative !important;
    z-index: 1 !important;
  }

  .story-panel {
    width: 100% !important;
    min-width: 100% !important;
    height: auto !important;
    min-height: auto !important;
    padding: 12vw 5vw !important;
    flex-direction: column !important;
    justify-content: flex-start !important;
    align-items: stretch !important;
    box-sizing: border-box !important;
  }

  /* PANEL 1: HERO */
  .panel-hero {
    position: relative !important;
    top: auto !important;
    left: auto !important;
    width: 100% !important;
    height: 85vh !important;
    min-height: 480px !important;
    z-index: 1 !important;
    margin-left: 0 !important;
    background-color: #000000 !important;
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }

  .hero-content {
    left: 5vw !important;
    width: 90vw !important;
    max-width: 90vw !important;
    bottom: 10vw !important;
  }

  .hero-title {
    font-size: clamp(2.2rem, 10vw, 44px) !important;
    line-height: 1.1 !important;
  }

  /* PANEL 2: LEGACY */
  .panel-legacy {
    margin-left: 0 !important;
    width: 100% !important;
    min-width: 100% !important;
    height: auto !important;
    padding: 14vw 6vw !important;
    background-color: #191919 !important;
  }

  .panel-legacy .panel-inner {
    flex-direction: column !important;
    gap: 8vw !important;
    align-items: flex-start !important;
  }

  .legacy-text-col {
    width: 100% !important;
  }

  .legacy-title {
    font-size: clamp(2.2rem, 9vw, 44px) !important;
    margin-bottom: 6vw !important;
  }

  .legacy-p {
    font-size: 15px !important;
    text-indent: 0 !important;
    margin-bottom: 4vw !important;
  }

  .legacy-img-col {
    width: 100% !important;
    height: 65vw !important;
  }

  .legacy-img-col .img-card,
  .legacy-img-col .img-card img {
    width: 100% !important;
    height: 100% !important;
  }

  /* PANEL 3: CRAFT */
  .panel-craft {
    width: 100% !important;
    min-width: 100% !important;
    height: auto !important;
    padding: 14vw 6vw !important;
  }

  .craft-bg-illustration {
    display: none !important;
  }

  .craft-inner {
    flex-direction: column !important;
    gap: 8vw !important;
  }

  .craft-left-col {
    width: 100% !important;
    gap: 6vw !important;
  }

  .quote-badge {
    font-size: clamp(1.3rem, 6vw, 28px) !important;
    max-width: 100% !important;
  }

  .craft-paragraphs {
    flex-direction: column !important;
    gap: 4vw !important;
    width: 100% !important;
  }

  .craft-p {
    width: 100% !important;
    font-size: 15px !important;
  }

  .craft-right-col {
    width: 100% !important;
    justify-content: flex-start !important;
    margin-top: 4vw !important;
  }

  .craft-giant-title {
    font-size: clamp(3rem, 14vw, 76px) !important;
    line-height: 0.95 !important;
    white-space: normal !important;
  }

  /* PANEL 4: GALLERY */
  .panel-gallery {
    width: 100% !important;
    min-width: 100% !important;
    height: auto !important;
    padding: 14vw 6vw !important;
  }

  .gallery-inner {
    flex-direction: column !important;
    gap: 6vw !important;
    padding-right: 0 !important;
  }

  /* Hide desktop left column (portrait & quote badge above image) and chair card on mobile */
  .gallery-left-col,
  .chair-card {
    display: none !important;
  }

  /* Show single replacement image on mobile */
  .gallery-resp-card {
    display: block !important;
    width: 100% !important;
    height: auto !important;
    margin: 0 0 6vw 0 !important;
    border-radius: 12px;
    overflow: hidden;
  }

  .gallery-resp-img {
    width: 100% !important;
    height: auto !important;
    max-height: 80vh !important;
    object-fit: cover !important;
    display: block !important;
  }

  .gallery-right-col {
    width: 100% !important;
    height: auto !important;
    flex-direction: column !important;
    gap: 6vw !important;
  }

  .gallery-text-block {
    width: 100% !important;
    height: auto !important;
    padding: 0 !important;
  }

  .herman-quote {
    width: 100% !important;
    margin: 0 0 6vw 0 !important;
    font-size: clamp(1.4rem, 6vw, 28px) !important;
  }

  .gallery-year-block {
    padding-left: 0 !important;
    gap: 3vw !important;
  }

  .gallery-year {
    font-size: clamp(2rem, 8vw, 40px) !important;
  }

  .gallery-p {
    width: 100% !important;
    font-size: 15px !important;
  }

  /* PANEL 5: FEATURES */
  .panel-features {
    width: 100% !important;
    min-width: 100% !important;
    height: auto !important;
    flex-direction: column !important;
  }

  .feature-col {
    width: 100% !important;
    height: auto !important;
    padding: 12vw 6vw !important;
    gap: 6vw !important;
  }

  .feature-img-box {
    height: 55vw !important;
    margin: 4vw 0 !important;
  }

  .feature-title {
    font-size: clamp(1.6rem, 7vw, 32px) !important;
  }

  .feature-p {
    font-size: 15px !important;
  }

  /* PANEL 6: COLLAGE */
  .panel-collage {
    width: 100% !important;
    min-width: 100% !important;
    height: auto !important;
    padding: 14vw 6vw !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 6vw !important;
  }

  .collage-card {
    position: relative !important;
    left: auto !important;
    right: auto !important;
    top: auto !important;
    bottom: auto !important;
    width: 100% !important;
  }

  .collage-card.card-1 {
    height: 65vw !important;
  }

  .collage-card.card-2 {
    height: 75vw !important;
  }

  .collage-card.card-3 {
    height: 75vw !important;
  }

  /* PANEL 7: END */
  .panel-end {
    width: 100% !important;
    min-width: 100% !important;
    height: auto !important;
    min-height: 70vh !important;
    padding: 14vw 6vw !important;
  }

  .end-inner {
    padding: 0 !important;
  }

  .end-giant-title {
    font-size: clamp(2.2rem, 11vw, 56px) !important;
    white-space: normal !important;
  }

  .end-title-line.line-2 {
    padding-left: 0 !important;
  }

  .end-action {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 4vw !important;
  }
}
</style>
