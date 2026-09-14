<script setup lang="ts">
import ProductHeaderSection from '~/components/ProductHeaderSection.vue'
import ProductOverviewGallery from '~/components/ProductOverviewGallery.vue'
import CollectiveSection from '~/components/CollectiveSection.vue'
</script>

<template>
  <div class="product-page">
    <!-- 1. Header Section (18 + Eames Moulded Plywood + Subnav Tabs) -->
    <ProductHeaderSection />

    <!-- 2. Overview Staggered Gallery Section requested in media_1789413521211.png -->
    <ProductOverviewGallery />

    <!-- 3. Another Collective Showcase Section -->
    <!-- <CollectiveSection /> -->
  </div>
</template>

<style scoped>
.product-page {
  min-height: 100vh;
  background-color: #ffffff;
  color: #000000;
}
</style>
