<template>
  <div class="flex flex-col gap-3">

    <div
      class="relative aspect-[4/3] max-h-[420px] overflow-hidden"
      :class="!product.images?.[displayOrder[0]] ? placeholderBg(product.id, displayOrder[0]) : ''"
    >
      <img
        v-if="product.images?.[displayOrder[0]]"
        :src="product.images[displayOrder[0]]"
        class="w-full h-full object-cover absolute inset-0"
      >
      <div v-else class="absolute inset-0 flex items-center justify-center">
        <ImageIcon :size="64" class="text-midnight/10" />
      </div>
      <span
        v-if="product.badge"
        class="absolute top-4 left-4 px-2.5 py-1 text-[10px] font-display font-semibold tracking-[0.18em] uppercase"
        :style="badgeStyle(product.badge)"
      >
        {{ badgeLabel(product.badge) }}
      </span>
    </div>

    <div class="grid grid-cols-3 gap-3">
      <div
        v-for="n in 3"
        :key="n"
        class="relative aspect-square overflow-hidden cursor-pointer border-2 hover:border-amber transition-colors duration-200"
        :class="[!product.images?.[displayOrder[n]] ? placeholderBg(product.id, displayOrder[n]) : '', 'border-transparent']"
        @click="swapMain(n)"
      >
        <img
          v-if="product.images?.[displayOrder[n]]"
          :src="product.images[displayOrder[n]]"
          class="w-full h-full object-cover absolute inset-0"
        >
        <div v-else class="absolute inset-0 flex items-center justify-center">
          <ImageIcon :size="24" class="text-midnight/10" />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ImageIcon } from 'lucide-vue-next'
import type { MockProduct } from '~/data/products'
import { BADGES } from '~/composables/useBadges'

defineProps<{ product: MockProduct }>()

const displayOrder = ref([0, 1, 2, 3])

function swapMain(n: number) {
  const tmp = displayOrder.value[0]
  displayOrder.value[0] = displayOrder.value[n]
  displayOrder.value[n] = tmp
}

const placeholderBgs = [
  'bg-[#ECEDEF]',
  'bg-[#EDE9E4]',
  'bg-[#EAECEC]',
  'bg-[#EFEcE8]',
  'bg-concrete',
  'bg-[#EBEBED]',
]

function badgeLabel(value: string): string {
  return BADGES.find(b => b.value === value)?.labelFr ?? value
}

function badgeStyle(value: string) {
  const b = BADGES.find(b => b.value === value)
  return { backgroundColor: b?.bg ?? '#F5F3F0', color: b?.text ?? '#1A1D2E' }
}

function placeholderBg(id: string, offset: number): string {
  const base = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return placeholderBgs[(base + offset) % placeholderBgs.length] ?? placeholderBgs[0]!
}
</script>
