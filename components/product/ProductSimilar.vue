<template>
  <section
    v-if="similarProducts?.length"
    class="mt-16 lg:mt-24 pt-10 border-t border-concrete"
  >
    <div class="flex items-center gap-3 mb-8">
      <div class="w-0.5 h-4 bg-amber flex-shrink-0" />
      <h2 class="text-xs font-display font-bold tracking-[0.25em] uppercase text-midnight">
        {{ $t('product.similar') }}
      </h2>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <NuxtLink
        v-for="p in similarProducts"
        :key="p.id"
        :to="`/produit/${p.id}`"
        class="group block border border-transparent hover:border-amber transition-colors duration-300"
      >
        <div
          class="relative aspect-[4/3] overflow-hidden"
          :class="placeholderBg(p.id)"
        >
          <div class="absolute inset-0 flex items-center justify-center">
            <ImageIcon :size="32" class="text-midnight/10" />
          </div>
          <div class="absolute inset-0 bg-midnight/0 group-hover:bg-midnight/8 transition-colors duration-300" />
          <span
            v-if="p.badge"
            class="absolute top-2 left-2 px-2 py-0.5 text-[9px] font-display font-semibold tracking-[0.18em] uppercase"
            :style="badgeStyle(p.badge)"
          >
            {{ badgeLabel(p.badge) }}
          </span>
        </div>

        <div class="p-3 bg-white">
          <p class="text-[9px] font-body tracking-[0.18em] uppercase text-midnight/35 mb-1">
            {{ $t('catalog.categories.' + p.category_id) }}
          </p>
          <h3 class="font-display font-medium text-midnight text-xs leading-snug mb-2 line-clamp-2">
            {{ p.name }}
          </h3>
          <p class="font-body font-medium text-midnight text-sm tabular-nums">
            {{ formatPrice(p.price) }}
          </p>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ImageIcon } from 'lucide-vue-next'
import { MOCK_PRODUCTS, type MockProduct } from '~/data/products'
import { BADGES } from '~/composables/useBadges'

const props = defineProps<{ product: MockProduct }>()

const { locale } = useI18n()
const supabase = useSupabaseClient()
const { isDemoMode } = useDemoMode()

const { data: similarProducts } = await useAsyncData(
  `similar-${props.product.id}`,
  async () => {
    if (isDemoMode.value) {
      return MOCK_PRODUCTS
        .filter(p => p.category_id === props.product.category_id && p.id !== props.product.id)
        .slice(0, 3)
    }
    const { data, error } = await supabase
      .from('products')
      .select('id, name, price, badge, category_id, images')
      .eq('category_id', props.product.category_id)
      .neq('id', props.product.id)
      .limit(3)
    if (error || !data) return []
    return data
  }
)

function badgeLabel(value: string): string {
  return BADGES.find(b => b.value === value)?.labelFr ?? value
}

function badgeStyle(value: string) {
  const b = BADGES.find(b => b.value === value)
  return { backgroundColor: b?.bg ?? '#F5F3F0', color: b?.text ?? '#1A1D2E' }
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat(locale.value === 'fr' ? 'fr-FR' : 'en-GB', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

const placeholderBgs = [
  'bg-[#ECEDEF]',
  'bg-[#EDE9E4]',
  'bg-[#EAECEC]',
  'bg-[#EFEcE8]',
  'bg-concrete',
  'bg-[#EBEBED]',
]

function placeholderBg(id: string): string {
  const base = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return placeholderBgs[base % placeholderBgs.length]!
}
</script>
