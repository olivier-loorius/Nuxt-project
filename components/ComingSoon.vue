<template>
  <div class="relative min-h-[80vh] bg-chalk flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
    <div
      class="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      aria-hidden="true"
    >
      <span class="text-[clamp(60px,18vw,220px)] font-display font-black text-concrete leading-none tracking-tighter whitespace-nowrap">
        {{ $t('coming_soon.ghost') }}
      </span>
    </div>

    <div class="relative z-10 max-w-lg w-full text-center">  
      <h1 class="text-4xl sm:text-5xl font-display font-black text-midnight mb-5 leading-tight">
        {{ $t(pageKey) }}
      </h1>
      <div class="w-12 h-[3px] bg-amber mx-auto mb-8"></div>
      <p class="text-lg sm:text-xl font-sora font-semibold text-midnight mb-4 leading-snug">
        {{ $t('coming_soon.subtitle') }}
      </p>
      <p class="text-sm font-manrope text-midnight/60 mb-12 leading-relaxed max-w-sm mx-auto">
        {{ $t('coming_soon.description') }}
      </p>
      <NuxtLink
        :to="localePath('/nouveautes')"
        class="coming-soon-btn group inline-flex items-center gap-3 bg-midnight text-chalk px-8 py-4 text-xs font-sora font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-amber"
      >
        {{ $t('coming_soon.cta') }}
        <ArrowRight :size="14" class="transition-transform duration-300 group-hover:translate-x-1" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight, Sparkles, Tag, Heart, Package, Gift, Percent, LayoutGrid } from 'lucide-vue-next'

const localePath = useLocalePath()

const props = defineProps<{
  pageKey: string
}>()

const iconMap: Record<string, Component> = {
  'pages.best-sellers': Sparkles,
  'pages.categories':   LayoutGrid,
  'pages.lingerie':     Heart,
  'pages.accessoires':  Package,
  'pages.idees-cadeaux': Gift,
  'pages.promotions':   Percent,
}

const icon = computed(() => iconMap[props.pageKey] ?? Tag)
</script>

<style scoped>
.coming-soon-icon {
  clip-path: polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%);
}

.coming-soon-btn {
  clip-path: polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%);
}
</style>
