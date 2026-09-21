<script setup lang="ts">
import ProductHeaderSection from '~/components/ProductHeaderSection.vue'
import ProductOverviewGallery from '~/components/ProductOverviewGallery.vue'
import CollectiveSection from '~/components/CollectiveSection.vue'
</script>

<template>
  <div class="product-page">
    <!-- Background Image Decoration placed at top: 1922px, left: 0, width: 877px -->
    <div class="product-bg-decoration">
      <img src="/images/bg-product.png" alt="Product Background" class="bg-product-img" />
    </div>

    <!-- 1. Header Section (18 + Eames Moulded Plywood + Subnav Tabs) -->
    <ProductHeaderSection class="product-section-relative" />

    <!-- 2. Overview Staggered Gallery Section requested in media_1789413521211.png -->
    <ProductOverviewGallery class="product-section-relative" />

    <!-- 3. Another Collective Showcase Section -->
    <!-- <CollectiveSection /> -->
  </div>
</template>

<style scoped>
.product-page {
  position: relative;
  min-height: 100vh;
  background-color: #ffffff;
  color: #000000;
  overflow-x: hidden;
}

.product-bg-decoration {
  position: absolute;
  top: 2000.8px;
  left: 0;
  width: 877px;
  max-width: 100vw;
  pointer-events: none;
  z-index: 0;
}

.bg-product-img {
  width: 877px;
  max-width: 100%;
  height: auto;
  display: block;
}

.product-section-relative {
  position: relative;
  z-index: 1;
}
</style>
