<template>
  <section class="bg-white py-12 md:py-20">
    <div class="max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
      <h2 class="text-2xl md:text-3xl font-display font-bold text-midnight mb-3 md:mb-4 text-center">{{ t('bestsellers.title') }}</h2>
      <div class="text-center mb-8 md:mb-16">
        <NuxtLink to="/best-sellers" class="text-sm text-amber hover:text-midnight transition-colors duration-300">
          {{ t('bestsellers.viewAll') }} →
        </NuxtLink>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { MOCK_PRODUCTS } from '~/data/products'

const { t } = useI18n()

const products = MOCK_PRODUCTS.slice(0, 4)
</script>
