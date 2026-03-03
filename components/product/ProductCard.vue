<template>
  <NuxtLink :to="localePath('/produit/' + product.id)" class="cursor-pointer block">
    <div class="group bg-white border border-transparent hover:border-amber transition-all duration-300">

      <div class="relative aspect-[3/4] bg-concrete overflow-hidden">
        <NuxtImg
          :src="product.images[0] || ''"
          :alt="t(product.nameKey)"
          width="400"
          height="533"
          sizes="xs:100vw sm:50vw lg:25vw"
          format="webp"
          loading="lazy"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        <span
          v-if="product.badge"
          class="absolute top-3 right-3 bg-amber text-midnight text-xs font-bold px-3 py-1 uppercase tracking-wide"
        >
          {{ product.badge }}
        </span>
      </div>

      <div class="p-4">
        <h3 class="font-display font-semibold text-midnight mb-2 text-base">
          {{ t(product.nameKey) }}
        </h3>

        <p class="font-bold text-midnight mb-4 text-lg">
          {{ formatPrice(product.price) }}
        </p>

        <button
          @click.stop.prevent="handleCart(product.id)"
          class="btn-beveled w-full border-2 border-midnight text-midnight hover:bg-midnight hover:text-white px-4 py-3 font-display font-semibold uppercase text-xs transition-all duration-300"
        >
          {{ $t('bestsellers.addToCart') }}
        </button>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { MockProduct } from '~/data/products'

const props = defineProps<{
  product: MockProduct
}>()

const { t, locale } = useI18n()
const localePath = useLocalePath()
const { addToCart } = useCart()
const { showAuthModal, authModalMessage } = useAuthModal()

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat(locale.value === 'fr' ? 'fr-FR' : 'en-GB', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

function handleCart(productId: string) {
  const user = useSupabaseUser()
  if (!user.value) {
    authModalMessage.value = 'Connectez-vous pour ajouter au panier'
    showAuthModal.value = true
    return
  }
  addToCart(productId)
}
</script>
