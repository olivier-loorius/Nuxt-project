<template>
  <div class="flex flex-col pt-2 lg:pt-4">

    <p class="text-[10px] font-body tracking-[0.22em] uppercase text-amber mb-3">
      {{ $t('catalog.categories.' + product.categoryId) }}
    </p>

    <h1 class="font-display font-bold text-midnight text-2xl sm:text-3xl leading-tight mb-6">
      {{ t(product.nameKey) }}
    </h1>

    <p class="font-body font-semibold text-midnight text-3xl tabular-nums mb-8">
      {{ formatPrice(product.price) }}
    </p>

    <div class="w-10 h-[1.5px] bg-amber mb-8" />

    <p class="font-body text-sm text-midnight/65 leading-relaxed mb-10">
      {{ $t(product.descriptionKey) }}
    </p>

    <div class="flex items-center gap-2.5 mb-10">
      <span
        class="w-1.5 h-1.5 rounded-full flex-shrink-0"
        :class="
          product.stock > 3 ? 'bg-[#4A7C59]' :
          product.stock > 0 ? 'bg-amber' :
          'bg-alert'
        "
      />
      <span class="text-xs font-body text-midnight/55">
        <template v-if="product.stock > 3">{{ $t('product.in_stock') }}</template>
        <template v-else-if="product.stock > 0">{{ $t('product.low_stock', { n: product.stock }) }}</template>
        <template v-else>{{ $t('product.out_of_stock') }}</template>
      </span>
    </div>

    <div class="flex gap-3">
      <template v-if="isInCart(product.id).value">
        <div class="product-cta flex items-center border border-amber flex-1 transition-colors duration-300">
          <button
            class="flex items-center justify-center w-12 h-12 hover:bg-amber hover:text-chalk transition-colors duration-200 flex-shrink-0"
            :aria-label="$t('catalog.decrease_quantity')"
            @click="updateQuantity(product.id, getQuantity(product.id) - 1)"
          >
            <Minus :size="14" />
          </button>
          <span class="flex-1 text-center font-display font-semibold text-sm tabular-nums select-none">
            {{ getQuantity(product.id) }}
          </span>
          <button
            class="flex items-center justify-center w-12 h-12 hover:bg-amber hover:text-chalk transition-colors duration-200 flex-shrink-0"
            :aria-label="$t('catalog.increase_quantity')"
            @click="updateQuantity(product.id, getQuantity(product.id) + 1)"
          >
            <Plus :size="14" />
          </button>
        </div>
      </template>
      <template v-else>
        <button
          class="product-cta flex-1 flex items-center justify-center gap-3 px-8 py-4 font-display font-semibold text-xs tracking-[0.2em] uppercase transition-colors duration-300"
          :class="product.stock > 0
            ? 'bg-midnight text-chalk hover:bg-amber hover:text-midnight'
            : 'bg-concrete text-midnight/30 cursor-not-allowed'"
          :disabled="product.stock === 0"
          @click="handleCart(product.id)"
        >
          <ShoppingCart :size="15" />
          {{ product.stock > 0 ? $t('catalog.add_to_cart') : $t('product.out_of_stock') }}
        </button>
      </template>

      <button
        class="product-cta w-12 h-12 flex items-center justify-center border transition-colors duration-300 flex-shrink-0"
        :class="isFavorite(product.id).value
          ? 'border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/5'
          : 'border-midnight/30 text-midnight/50 hover:border-[#EF4444] hover:text-[#EF4444]'"
        :aria-label="$t('catalog.toggle_favorite')"
        @click="handleFavorite(product.id)"
      >
        <Heart
          :size="20"
          :class="isFavorite(product.id).value ? 'fill-[#EF4444]' : 'fill-none'"
        />
      </button>
    </div>

    <div class="mt-10 border-t border-midnight/10">
      <p class="text-[10px] font-body tracking-[0.22em] uppercase text-amber mt-8 mb-4">
        {{ $t('product.specs.title') }}
      </p>
      <table class="w-full text-sm font-body border-collapse">
        <tbody>
          <tr
            v-for="spec in specs"
            :key="spec.label"
            class="border-b border-midnight/8 last:border-0"
          >
            <td class="py-2.5 pr-4 text-midnight/45 text-xs whitespace-nowrap w-1/3">
              {{ spec.label }}
            </td>
            <td class="py-2.5 text-midnight font-medium text-xs">
              {{ spec.value }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-6 border-t border-midnight/10">
      <button
        class="w-full flex items-center justify-between py-4 text-left group"
        @click="accordionOpen = !accordionOpen"
      >
        <span class="text-[10px] font-body tracking-[0.22em] uppercase text-midnight/70 group-hover:text-amber transition-colors duration-200">
          {{ $t('product.care.title') }}
        </span>
        <ChevronDown
          :size="14"
          class="text-midnight/40 group-hover:text-amber transition-all duration-300 flex-shrink-0"
          :class="accordionOpen ? 'rotate-180' : 'rotate-0'"
        />
      </button>
      <Transition
        enter-active-class="transition-all duration-300 ease-out overflow-hidden"
        enter-from-class="max-h-0 opacity-0"
        enter-to-class="max-h-96 opacity-100"
        leave-active-class="transition-all duration-200 ease-in overflow-hidden"
        leave-from-class="max-h-96 opacity-100"
        leave-to-class="max-h-0 opacity-0"
      >
        <div v-if="accordionOpen" class="pb-6 space-y-3 overflow-hidden">
          <p class="text-xs font-body text-midnight/60 leading-relaxed">
            <span class="font-semibold text-midnight">{{ $t('product.care.lingerie_label') }} —</span>
            {{ $t('product.care.lingerie_text') }}
          </p>
          <p class="text-xs font-body text-midnight/60 leading-relaxed">
            <span class="font-semibold text-midnight">{{ $t('product.care.accessories_label') }} —</span>
            {{ $t('product.care.accessories_text') }}
          </p>
          <p class="text-xs font-body text-midnight/60 leading-relaxed">
            <span class="font-semibold text-midnight">{{ $t('product.care.lubricants_label') }} —</span>
            {{ $t('product.care.lubricants_text') }}
          </p>
        </div>
      </Transition>
    </div>

  </div>
</template>

<script setup lang="ts">
import { Heart, ShoppingCart, ChevronDown, Minus, Plus } from 'lucide-vue-next'
import type { MockProduct } from '~/data/products'

const props = defineProps<{ product: MockProduct }>()

const { t, locale } = useI18n()
const accordionOpen = ref(false)

const { fetchFavorites, toggleFavorite, isFavorite } = useFavorites()
const { addToCart, updateQuantity, isInCart, cart } = useCart()

function getQuantity(productId: string): number {
  return cart.value.find(item => item.product_id === productId)?.quantity ?? 0
}
const { showAuthModal, authModalMessage } = useAuthModal()

onMounted(() => fetchFavorites())

function handleFavorite(productId: string) {
  const user = useSupabaseUser()
  if (!user.value) {
    authModalMessage.value = 'Connectez-vous pour ajouter aux favoris'
    showAuthModal.value = true
    return
  }
  toggleFavorite(productId)
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

const specs = computed(() => [
  { label: t('product.specs.material_label'),   value: t('product.specs.material_value') },
  { label: t('product.specs.dimensions_label'), value: t('product.specs.dimensions_value') },
  { label: t('product.specs.care_label'),       value: t('product.specs.care_value') },
  { label: t('product.specs.discretion_label'), value: t('product.specs.discretion_value') },
])

function formatPrice(price: number): string {
  return new Intl.NumberFormat(locale.value === 'fr' ? 'fr-FR' : 'en-GB', {
    style: 'currency',
    currency: 'EUR',
  }).format(props.product.price)
}
</script>

<style scoped>
.product-cta {
  clip-path: polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%);
}
</style>
