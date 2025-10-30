<template>
  <!-- Section Best-sellers -->
  <section class="bg-white py-12 md:py-20">
    <div class="max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
      <!-- Titre -->
      <h2 class="text-2xl md:text-3xl font-display font-bold text-midnight mb-3 md:mb-4 text-center">{{ t('bestsellers.title') }}</h2>
      <div class="text-center mb-8 md:mb-16">
        <NuxtLink to="/produits" class="text-sm text-amber hover:text-midnight transition-colors duration-300">
          {{ t('bestsellers.viewAll') }} →
        </NuxtLink>
      </div>

      <!-- Grid produits -->
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
import type { Product } from '~/types/product'

const { t } = useI18n()

const products: Product[] = [
  {
    id: '1',
    slug: 'sac-midnight',
    name: 'Sac Midnight',
    price: 49.90,
    image: '/images/sac1.png',
    category: 'accessoires'
  },
  {
    id: '2',
    slug: 'sac-essentiel',
    name: 'Sac Essentiel',
    price: 39.90,
    image: '/images/sac2.png',
    category: 'accessoires'
  },
  {
    id: '3',
    slug: 'sac-performance',
    name: 'Sac Performance',
    price: 59.90,
    image: '/images/sac3.png',
    category: 'accessoires'
  },
  {
    id: '4',
    slug: 'sac-premium',
    name: 'Sac Premium',
    price: 29.90,
    image: '/images/sac4.png',
    category: 'accessoires'
  }
]
</script>
