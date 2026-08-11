<template>
  <section class="bg-chalk py-12 md:py-20">
    <div class="max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
      <div class="mb-8 flex justify-between items-end">
        <div>
          <div class="w-8 h-[2px] bg-amber mb-2" />
          <h2 class="text-2xl sm:text-3xl lg:text-5xl font-display font-bold text-midnight">{{ t('bestsellers.title') }}</h2>
          <p class="text-base font-body font-medium text-midnight/70 mt-2">{{ t('bestsellers.subtitle') }}</p>
        </div>
        <NuxtLink
          :to="localePath('/best-sellers')"
          class="hidden sm:inline-flex items-center gap-2 btn-beveled border border-midnight text-midnight text-xs font-display tracking-widest uppercase px-4 py-2 hover:bg-midnight hover:text-chalk transition-colors duration-200"
        >
          {{ t('bestsellers.viewAll') }}
          <ArrowRight :size="12" class="ml-1" />
        </NuxtLink>
      </div>
      <NuxtLink
        :to="localePath('/best-sellers')"
        class="block mt-4 mb-6 sm:hidden text-center text-xs font-body tracking-widest uppercase border-b border-amber text-midnight pb-0.5 w-fit mx-auto"
      >
        {{ t('bestsellers.viewAll') }}
      </NuxtLink>

      <div class="relative overflow-hidden after:absolute after:right-0 after:top-0 after:bottom-0 after:w-24 after:bg-gradient-to-l after:from-white after:to-transparent after:pointer-events-none after:z-10">
      <div class="flex gap-4 overflow-x-scroll [-ms-overflow-style:none] [scrollbar-width:none] scrollbar-hide pb-4 px-8">
        <template v-if="loading">
          <div v-for="i in 4" :key="i" class="flex-shrink-0 w-40 sm:w-52">
            <div class="aspect-square w-full bg-concrete animate-pulse rounded-sm" />
            <div class="h-3 bg-concrete animate-pulse rounded-sm mt-2" />
            <div class="h-3 bg-concrete animate-pulse rounded-sm mt-1 w-2/3" />
          </div>
        </template>
        <template v-else>
          <NuxtLink
            v-for="product in products"
            :key="product.id"
            :to="localePath('/produit/' + product.id + '?from=best-sellers')"
            class="group flex-shrink-0 w-40 sm:w-52 block"
          >
            <div
              class="relative aspect-[3/4] w-full overflow-hidden"
              :class="product.images?.[0] ? 'bg-white' : 'bg-concrete'"
            >
              <img
                v-if="product.images?.[0]"
                :src="product.images[0]"
                class="object-cover w-full h-full"
              />
              <div v-else class="absolute inset-0 flex items-center justify-center">
                <ImageIcon :size="24" class="text-midnight/20" />
              </div>
              <span
                v-if="product.badge"
                class="absolute top-2 left-2 px-2 py-0.5 text-[9px] font-display font-semibold tracking-[0.18em] uppercase"
                :style="badgeStyle(product.badge)"
              >
                {{ badgeLabel(product.badge) }}
              </span>
            </div>
            <div class="py-3 px-1">
              <p class="text-xs font-display font-semibold text-midnight line-clamp-1 mb-1">
                {{ locale === 'en' ? (product.name_en || product.name) : product.name }}
              </p>
              <p class="text-amber text-sm font-bold">{{ formatPrice(product.price) }}</p>
              <button
                v-if="isInCart(product.id).value"
                disabled
                class="mt-2 w-full flex items-center justify-center gap-2 btn-beveled bg-midnight text-chalk text-[10px] font-display tracking-widest uppercase py-1.5"
              >
                <ShoppingCart :size="10" />
                {{ t('cart.in_cart') }}
              </button>
              <button
                v-else
                class="mt-2 w-full flex items-center justify-center gap-2 btn-beveled border border-midnight text-midnight text-[10px] font-display tracking-widest uppercase py-1.5"
                @click.stop.prevent="addToCart(product.id)"
              >
                <ShoppingCart :size="10" />
                {{ t('cart.add') }}
              </button>
            </div>
          </NuxtLink>
        </template>
      </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { MOCK_PRODUCTS } from '~/data/products'
import { ShoppingCart, ImageIcon, ArrowRight } from 'lucide-vue-next'
import { BADGES } from '~/composables/useBadges'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const supabase = useSupabaseClient()
const { isDemoMode } = useDemoMode()
const { addToCart, isInCart } = useCart()

const loading = ref(true)
const products = ref<any[]>([])

function badgeLabel(value: string): string {
  return BADGES.find(b => b.value === value)?.labelFr ?? value
}

function badgeStyle(value: string) {
  const b = BADGES.find(b => b.value === value)
  return { backgroundColor: b?.bg ?? '#F5F3F0', color: b?.text ?? '#1A1D2E' }
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat(locale.value === 'fr' ? 'fr-FR' : 'en-GB', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

onMounted(async () => {
  if (isDemoMode.value) {
    products.value = MOCK_PRODUCTS.slice(0, 5).map(p => ({ ...p, name: p.nameKey, name_en: p.nameKey }))
    loading.value = false
    return
  }
  const { data } = await supabase
    .from('products')
    .select('id, name, name_en, price, badge, stock, images, category_id, brand_id')
    .eq('page', 'best-sellers')
    .limit(5)
  products.value = data ?? []
  loading.value = false
})
</script>
