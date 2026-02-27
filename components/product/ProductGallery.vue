<template>
  <div class="flex flex-col gap-3">

    <!-- Image principale -->
    <div
      class="relative aspect-[4/3] max-h-[420px] overflow-hidden"
      :class="placeholderBg(product.id, 0)"
    >
      <div class="absolute inset-0 flex items-center justify-center">
        <ImageIcon :size="64" class="text-midnight/10" />
      </div>
      <span
        v-if="product.badge"
        class="absolute top-4 left-4 px-2.5 py-1 text-[10px] font-display font-semibold tracking-[0.18em] uppercase"
        :class="product.badge === 'promo' ? 'bg-midnight text-chalk' : 'bg-amber text-midnight'"
      >
        {{ $t('catalog.badge_' + product.badge) }}
      </span>
    </div>

    <!-- Miniatures -->
    <div class="grid grid-cols-3 gap-3">
      <div
        v-for="n in 3"
        :key="n"
        class="relative aspect-square overflow-hidden cursor-pointer border-2 border-transparent hover:border-amber transition-colors duration-200"
        :class="placeholderBg(product.id, n)"
      >
        <div class="absolute inset-0 flex items-center justify-center">
          <ImageIcon :size="24" class="text-midnight/10" />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ImageIcon } from 'lucide-vue-next'
import type { MockProduct } from '~/data/products'

defineProps<{ product: MockProduct }>()

const placeholderBgs = [
  'bg-[#ECEDEF]',
  'bg-[#EDE9E4]',
  'bg-[#EAECEC]',
  'bg-[#EFEcE8]',
  'bg-concrete',
  'bg-[#EBEBED]',
]

function placeholderBg(id: string, offset: number): string {
  const base = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return placeholderBgs[(base + offset) % placeholderBgs.length]
}
</script>
