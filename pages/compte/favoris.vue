<template>
  <div class="bg-white rounded-lg shadow-sm p-6 md:p-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-midnight mb-2">
        {{ $t('compte.favoris.title') }}
      </h1>
      <p class="text-midnight/60">
        {{ $t('compte.favoris.subtitle') }}
      </p>
    </div>

    <!-- Favorites Grid -->
    <div v-if="favorites.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="product in favorites"
        :key="product.id"
        class="border border-concrete rounded-lg overflow-hidden hover:border-amber transition-colors group"
      >
        <!-- Product Image -->
        <div class="relative aspect-square bg-concrete/30">
          <img
            v-if="product.image"
            :src="product.image"
            :alt="product.name"
            class="w-full h-full object-cover"
          />
          <button
            @click="removeFavorite(product.id)"
            class="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
            :title="$t('compte.favoris.remove')"
          >
            <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>

        <!-- Product Info -->
        <div class="p-4">
          <h3 class="font-bold text-midnight mb-2 line-clamp-2">
            {{ product.name }}
          </h3>
          <p class="text-amber font-bold text-lg mb-4">
            {{ formatPrice(product.price) }}
          </p>
          <button
            @click="addToCart(product.id)"
            class="w-full px-4 py-2 bg-amber text-white rounded-lg font-medium hover:bg-amber/90 transition-colors"
          >
            {{ $t('compte.favoris.add_to_cart') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <svg
        class="w-24 h-24 mx-auto text-midnight/20 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <h3 class="text-xl font-bold text-midnight mb-2">
        {{ $t('compte.favoris.no_favorites') }}
      </h3>
      <p class="text-midnight/60 mb-6">
        Ajoutez vos produits préférés à vos favoris pour les retrouver facilement
      </p>
      <NuxtLink
        to="/nouveautes"
        class="inline-block px-6 py-3 bg-amber text-white rounded-lg font-medium hover:bg-amber/90 transition-colors"
      >
        Découvrir nos produits
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'compte',
  middleware: 'auth'
})

interface Product {
  id: string
  name: string
  price: number
  image?: string
}

const favorites = ref<Product[]>([])

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const removeFavorite = (productId: string) => {
  favorites.value = favorites.value.filter(p => p.id !== productId)
}

const addToCart = (productId: string) => {
}
</script>
