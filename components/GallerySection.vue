<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const sectionRef = ref<HTMLElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const trackRef = ref<HTMLElement | null>(null);
const progressBarTrackRef = ref<HTMLElement | null>(null);

// Scroll progress from 0 (start) to 1 (end)
const progressRatio = ref(0);
const thumbWidthPercent = ref(25); // Thumb width is 25% of track width

let galleryDraggable: Draggable[] = [];
let minX = 0;
let resizeObserver: ResizeObserver | null = null;

const galleryItems = [
  {
    id: 1,
    img: "/images/gallery-1.jpg",
    title: "EAMES MOULDED PLASTIC SIDE CHAIR",
    type: "square",
  },
  {
    id: 2,
    img: "/images/gallery-2.jpg",
    title: "EAMES SOFA COMPACT",
    type: "landscape",
  },
  {
    id: 3,
    img: "/images/gallery-3.jpg",
    title: "EAMES MOULDED PLASTIC ARMCHAIR",
    type: "portrait",
  },
  {
    id: 4,
    img: "/images/hero-banner-original.jpg",
    title: "MARÉCHAL VERCHETTI LOUNGE CHAIR",
    type: "landscape",
  },
  {
    id: 5,
    img: "/images/gallery-1.jpg",
    title: "FRANKLINÉ JEREMY EXECUTIVE DESK CHAIR",
    type: "square",
  },
  {
    id: 6,
    img: "/images/gallery-3.jpg",
    title: "VERCHETTI EDITORIAL ACCENT STOOL",
    type: "portrait",
  },
];

function calculateBounds() {
  if (!containerRef.value || !trackRef.value) return 0;
  const viewportWidth = containerRef.value.clientWidth;
  const trackWidth = trackRef.value.scrollWidth;
  const computedStyle = window.getComputedStyle(containerRef.value);
  const paddingLeft = parseFloat(computedStyle.paddingLeft) || 58.75;
  const paddingRight = parseFloat(computedStyle.paddingRight) || 58.75;

  const visibleWidth = viewportWidth - paddingLeft - paddingRight;
  const maxScroll = trackWidth - visibleWidth;
  return -Math.max(0, maxScroll);
}

function updateProgress(this: Draggable | void) {
  if (!trackRef.value) return;
  const currentX =
    this && typeof this.x === "number"
      ? this.x
      : (gsap.getProperty(trackRef.value, "x") as number) || 0;

  if (minX < 0) {
    const ratio = Math.max(0, Math.min(1, Math.abs(currentX) / Math.abs(minX)));
    progressRatio.value = isNaN(ratio) ? 0 : ratio;
  } else {
    progressRatio.value = 0;
  }
}

function refreshBounds() {
  minX = calculateBounds();
  if (galleryDraggable[0]) {
    galleryDraggable[0].applyBounds({ minX: minX, maxX: 0 });
    updateProgress();
  }
}

// When clicking anywhere on the progress bar track
function onProgressBarClick(e: MouseEvent) {
  if (!progressBarTrackRef.value || !trackRef.value || minX >= 0) return;
  const rect = progressBarTrackRef.value.getBoundingClientRect();
  const clickX = e.clientX - rect.left;

  // Offset by half thumb width so click centers the thumb under cursor
  const thumbPx = (thumbWidthPercent.value / 100) * rect.width;
  const maxThumbTravel = rect.width - thumbPx;
  const targetThumbX = Math.max(
    0,
    Math.min(maxThumbTravel, clickX - thumbPx / 2),
  );
  const ratio = maxThumbTravel > 0 ? targetThumbX / maxThumbTravel : 0;

  const targetGalleryX = -ratio * Math.abs(minX);

  gsap.to(trackRef.value, {
    x: targetGalleryX,
    duration: 0.5,
    ease: "power2.out",
    onUpdate: () => {
      updateProgress();
      if (galleryDraggable[0]) {
        galleryDraggable[0].update();
      }
    },
  });
}

onMounted(() => {
  if (import.meta.client) {
    gsap.registerPlugin(Draggable, ScrollTrigger);

    const init = () => {
      if (containerRef.value && trackRef.value) {
        minX = calculateBounds();

        galleryDraggable = Draggable.create(trackRef.value, {
          type: "x",
          bounds: { minX: minX, maxX: 0 },
          edgeResistance: 0.75,
          inertia: true,
          cursor: "grab",
          activeCursor: "grabbing",
          onDrag: updateProgress,
          onThrowUpdate: updateProgress,
          onUpdate: updateProgress,
        });

        updateProgress();

        // Observe element size changes (e.g. image loads or screen resize)
        if (typeof ResizeObserver !== "undefined") {
          resizeObserver = new ResizeObserver(() => {
            refreshBounds();
          });
          resizeObserver.observe(trackRef.value);
        }

        window.addEventListener("resize", refreshBounds);

        // Attach image load listeners to ensure exact bounds after image downloads
        const imgs = trackRef.value.querySelectorAll("img");
        imgs.forEach((img) => {
          if (!img.complete) {
            img.addEventListener("load", refreshBounds, { once: true });
          }
        });

        // ScrollTrigger Entrance Reveal
        if (sectionRef.value) {
          gsap.fromTo(
            trackRef.value.children,
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.2,
              stagger: 0.15,
              ease: "power3.out",
              scrollTrigger: {
                trigger: sectionRef.value,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            },
          );
        }
      }
    };

    // Run init immediately and after tick
    init();
    setTimeout(refreshBounds, 300);
  }
});

onUnmounted(() => {
  if (galleryDraggable.length) {
    galleryDraggable[0].kill();
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  if (import.meta.client) {
    window.removeEventListener("resize", refreshBounds);
  }
});
</script>

<template>
  <section ref="sectionRef" class="gallery-section">
    <!-- Draggable Viewport Container -->
    <div ref="containerRef" class="gallery-viewport">
      <div ref="trackRef" class="gallery-track">
        <!-- Gallery Items matching reference image layout -->
        <div
          v-for="item in galleryItems"
          :key="item.id"
          :class="['gallery-item', `type-${item.type}`]"
        >
          <div class="image-wrapper">
            <img
              :src="item.img"
              :alt="item.title"
              class="gallery-img"
              draggable="false"
            />
          </div>
          <div class="item-meta">
            <span class="label item-title">{{ item.title }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Sliding Scrollbar Track & Thumb Indicator at bottom right -->
    <div class="progress-bar-container">
      <div
        ref="progressBarTrackRef"
        class="progress-bar-track"
        @click="onProgressBarClick"
        title="Klik untuk berpindah posisi gallery"
      >
        <!-- The black thumb indicator line that slides horizontally along the gray track line -->
        <div
          class="progress-bar-thumb"
          :style="{
            width: `${thumbWidthPercent}%`,
            left: `${progressRatio * (100 - thumbWidthPercent)}%`,
          }"
        ></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.gallery-section {
  width: 100%;
  padding-top: 2.6667vw;
  padding-bottom: 5.5235vw;
  background-color: #ffffff;
  position: relative;
  overflow: hidden;
}

.gallery-viewport {
  width: 100%;
  padding-left: var(--section-px);
  padding-right: var(--section-px);
  overflow: visible;
  user-select: none;
  -webkit-user-select: none;
}

.gallery-track {
  display: flex;
  align-items: flex-start;
  gap: 2vw;
  width: max-content;
  will-change: transform;
}

.gallery-item {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

/* Item Type Dimensions matching reference image */
.type-square {
  width: 29.2667vw;
}

.type-square .image-wrapper {
  width: 100%;
  height: 31.0667vw;
}

.type-landscape {
  width: 23.8392vw;
}

.type-landscape .image-wrapper {
  width: 100%;
  height: 17.2799vw;
}

.type-portrait {
  width: 61.8224vw;
}

.type-portrait .image-wrapper {
  width: 100%;
  height: 38.639vw;
}

.image-wrapper {
  position: relative;
  overflow: hidden;
  background-color: #f5f5f5;
  margin-bottom: 2.613vw;
}

.gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  pointer-events: none;
}

.item-meta {
  width: 100%;
}

.item-title {
  font-family: var(--font-family-base);
  font-weight: 500;
  font-size: 1.0711vw;
  line-height: 1.0711vw;
  letter-spacing: -0.005em;
  text-transform: uppercase;
  color: #000000;
}

/* Bottom Right Progress Bar Container */
.progress-bar-container {
  width: 100%;
  padding-left: var(--section-px);
  padding-right: var(--section-px);
  display: flex;
  justify-content: flex-end;
  margin-top: 13.625vw;
}

/* Light Gray Line Track matching reference screenshot */
.progress-bar-track {
  width: 33.7999vw;
  height: 1.3333vw;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
}

/* Visible crisp gray track line */
.progress-bar-track::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 1px;
  background-color: #d1d1d1;
  pointer-events: none;
}

/* Black Sliding Indicator Thumb matching reference screenshot */
.progress-bar-thumb {
  height: 2px;
  background-color: #000000;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  will-change: left;
}

@media (max-width: 900px) {
  .gallery-track {
    gap: 32px;
  }

  .type-square {
    width: 320px;
  }
  .type-square .image-wrapper {
    height: 300px;
  }

  .type-landscape {
    width: 280px;
  }
  .type-landscape .image-wrapper {
    height: 180px;
  }

  .type-portrait {
    width: 340px;
  }
  .type-portrait .image-wrapper {
    height: 380px;
  }

  .progress-bar-track {
    width: 200px;
  }
}

@media (max-width: 768px) {
  .gallery-section {
    padding-bottom: 60px;
  }
}
</style>
