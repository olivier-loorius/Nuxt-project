<template>
  <NuxtLink to="#" @click.prevent class="cursor-pointer block">
    <div class="group bg-white border border-transparent hover:border-amber transition-all duration-300">

      <!-- Image avec NuxtImg optimisé -->
      <div class="relative aspect-[3/4] bg-concrete overflow-hidden">
        <NuxtImg
          :src="product.image"
          :alt="product.name"
          width="400"
          height="533"
          sizes="xs:100vw sm:50vw lg:25vw"
          format="webp"
          loading="lazy"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        <!-- Badge -->
        <span
          v-if="product.badge"
          class="absolute top-3 right-3 bg-amber text-midnight text-xs font-bold px-3 py-1 uppercase tracking-wide"
        >
          {{ product.badge }}
        </span>
      </div>

      <!-- Contenu -->
      <div class="p-4">
        <h3 class="font-display font-semibold text-midnight mb-2 text-base">
          {{ product.name }}
        </h3>

        <p class="font-bold text-midnight mb-4 text-lg">
          {{ formatPrice(product.price) }}
        </p>

        <button
          @click.prevent="handleAddToCart"
          class="btn-beveled w-full border-2 border-midnight text-midnight hover:bg-midnight hover:text-white px-4 py-3 font-display font-semibold uppercase text-xs transition-all duration-300"
        >
          {{ $t('bestsellers.addToCart') }}
        </button>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'

/**
 * ProductCard - Carte produit réutilisable
 *
 * PROPS:
 * - product: objet Product avec name, price, badge, image, slug
 *
 * FEATURES:
 * - Image optimisée avec NuxtImg (WebP, lazy-loading, responsive)
 * - Hover: zoom image + bordure amber
 * - Badge personnalisable
 * - Bouton CTA "Ajouter au panier"
 * - Navigation vers page produit
 *
 * DESIGN:
 * - Polices: Sora (titres), Manrope (prix)
 * - Couleurs: --amber, --midnight, --concrete
 * - Aspect ratio: 3:4 (portrait)
 */

const props = defineProps<{
  product: Product
}>()

/**
 * Formater le prix en euros
 */
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

/**
 * Ajouter au panier
 * TODO: Intégrer avec Pinia store - useCartStore().addItem(props.product)
 */
const handleAddToCart = () => {
  // TODO: Implémenter l'ajout au panier
}
</script>
