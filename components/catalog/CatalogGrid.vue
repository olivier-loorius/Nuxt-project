<template>
  <div
    v-if="!products.length"
    class="flex flex-col items-center justify-center gap-4 py-24 text-center"
  >
    <PackageOpen :size="40" class="text-concrete" />
    <p class="text-sm font-display font-medium uppercase tracking-[0.2em] text-midnight/40">
      {{ $t('catalog.empty') }}
    </p>
  </div>

  <div
    v-else
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
  >
    <NuxtLink
      v-for="product in products"
      :key="product.id"
      :to="localePath(`/produit/${product.id}`)"
      class="group block border border-transparent hover:border-amber transition-colors duration-300"
    >
      <div class="relative aspect-[3/4] overflow-hidden" :class="placeholderBg(product.id)">
        <div class="absolute inset-0 flex items-center justify-center">
          <ImageIcon :size="44" class="text-midnight/10" />
        </div>
        <div
          class="absolute inset-0 bg-midnight/0 group-hover:bg-midnight/8 transition-colors duration-300"
        />
        <button
          class="absolute top-3 right-3 flex items-center justify-center w-9 h-9 bg-chalk/80 hover:bg-chalk transition-colors duration-200"
          :aria-label="$t('catalog.toggle_favorite')"
          @click.stop.prevent="handleFavorite(product.id)"
        >
          <Heart
            :size="18"
            :class="isFavorite(product.id).value
              ? 'fill-[#EF4444] text-[#EF4444]'
              : 'fill-none text-midnight/50'"
          />
        </button>
        <span
          v-if="product.badge"
          class="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-display font-semibold tracking-[0.18em] uppercase"
          :class="badgeClass(product.badge!)"
        >
          {{ $t('catalog.badge_' + product.badge) }}
        </span>
        <span
          v-if="isInCart(product.id).value"
          class="absolute bottom-3 right-3 px-2.5 py-1 bg-amber text-midnight text-[10px] font-display font-semibold tracking-[0.18em] uppercase flex items-center gap-1.5"
        >
          <ShoppingCart :size="10" />{{ $t('catalog.in_cart') }}
        </span>
        <span
          v-if="product.stock <= 3 && product.stock > 0"
          class="absolute bottom-3 left-3 px-2.5 py-1 bg-chalk/90 text-midnight text-[10px] font-display font-medium tracking-wide uppercase"
        >
          {{ product.stock }} {{ product.stock > 1 ? $t('catalog.stock_other') : $t('catalog.stock_one') }}
        </span>
      </div>
      <div class="p-4 bg-white">
        <p class="text-[10px] font-body font-normal tracking-[0.18em] uppercase text-midnight/35 mb-1.5">
          {{ $t('catalog.categories.' + product.categoryId) }}
        </p>
        <h3 class="font-display font-medium text-midnight text-sm leading-snug mb-3 line-clamp-2">
          {{ t(product.nameKey) }}
        </h3>
        <div class="flex items-center justify-between gap-2">
          <p class="font-body font-medium text-midnight text-base tabular-nums">
            {{ formatPrice(product.price) }}
          </p>
          <template v-if="isInCart(product.id).value">
            <div class="add-to-cart flex items-center border border-amber text-midnight transition-all duration-200">
              <button
                class="flex items-center justify-center w-7 h-8 hover:bg-amber hover:text-chalk transition-colors duration-200"
                :aria-label="$t('catalog.decrease_quantity')"
                @click.stop.prevent="updateQuantity(product.id, getQuantity(product.id) - 1)"
              >
                <Minus :size="10" />
              </button>
              <span class="w-6 text-center text-[11px] font-body tabular-nums select-none">
                {{ getQuantity(product.id) }}
              </span>
              <button
                class="flex items-center justify-center w-7 h-8 hover:bg-amber hover:text-chalk transition-colors duration-200"
                :aria-label="$t('catalog.increase_quantity')"
                @click.stop.prevent="updateQuantity(product.id, getQuantity(product.id) + 1)"
              >
                <Plus :size="10" />
              </button>
            </div>
          </template>
          <template v-else>
            <button
              class="add-to-cart flex-shrink-0 flex items-center justify-center gap-1.5 px-2.5 h-8 border border-midnight text-midnight
                     opacity-0 group-hover:opacity-100 transition-all duration-200
                     hover:bg-midnight hover:text-white"
              :aria-label="$t('catalog.add_to_cart')"
              @click.stop.prevent="handleCart(product.id)"
            >
              <ShoppingCart :size="13" />
              <span class="text-[10px] font-body tracking-wide whitespace-nowrap">Ajouter</span>
            </button>
          </template>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { Heart, ImageIcon, PackageOpen, ShoppingCart, Minus, Plus } from 'lucide-vue-next'
import { MOCK_PRODUCTS, type MockProduct } from '~/data/products'

const props = defineProps<{ products?: MockProduct[] }>()

const products = computed(() => props.products ?? MOCK_PRODUCTS)

const { locale, t } = useI18n()
const localePath = useLocalePath()

const { fetchFavorites, toggleFavorite, isFavorite } = useFavorites()
const { showAuthModal, authModalMessage } = useAuthModal()

const { addToCart, updateQuantity, isInCart, cart } = useCart()

function getQuantity(productId: string): number {
  return cart.value.find(item => item.product_id === productId)?.quantity ?? 0
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

onMounted(() => fetchFavorites())

function formatPrice(price: number): string {
  return new Intl.NumberFormat(locale.value === 'fr' ? 'fr-FR' : 'en-GB', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

function badgeClass(badge: string): string {
  if (badge === 'promo' || badge.startsWith('-')) return 'bg-midnight text-chalk'
  return 'bg-amber text-midnight'
}

const placeholderBgs = [
  'bg-[#ECEDEF]', 
  'bg-[#EDE9E4]', 
  'bg-[#EAECEC]',
  'bg-[#EFEcE8]',
  'bg-concrete',
  'bg-[#EBEBED]',
]

function handleFavorite(productId: string) {
  const user = useSupabaseUser()
  if (!user.value) {
    authModalMessage.value = 'Connectez-vous pour ajouter des favoris'
    showAuthModal.value = true
    return
  }
  toggleFavorite(productId)
}

function placeholderBg(id: string): string {
  const index = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return placeholderBgs[index % placeholderBgs.length] ?? 'bg-concrete'
}
</script>

<style scoped>
.add-to-cart {
  clip-path: polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%);
}
</style>
