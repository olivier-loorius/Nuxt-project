<template>
  <!-- MOBILE: Bandeau horizontal -->
  <NuxtLink
    v-if="variant === 'mobile'"
    :to="`/categories/${category.slug}`"
    class="flex h-24 border border-concrete hover:border-amber overflow-hidden transition-all duration-500 opacity-0 translate-y-4 rounded-none"
    :class="{ 'opacity-100 translate-y-0': isVisible }"
    :style="{ transitionDelay: isVisible ? `${index * 100}ms` : '0ms' }"
  >
    <!-- Image gauche -->
    <div class="w-2/5 h-full relative overflow-hidden">
      <NuxtImg
        :src="category.image"
        :alt="$t(category.titleKey)"
        loading="lazy"
        class="absolute inset-0 w-full h-full object-cover"
      />
    </div>
    <!-- Content droite -->
    <div class="w-3/5 flex items-center justify-between px-4">
      <h3 class="text-sm font-display font-semibold uppercase text-midnight">
        {{ $t(category.titleKey) }}
      </h3>
      <span class="text-amber text-xs font-display font-semibold">→</span>
    </div>
  </NuxtLink>

  <!-- TABLET: Card avec overlay gradient -->
  <NuxtLink
    v-else-if="variant === 'tablet'"
    :to="`/categories/${category.slug}`"
    class="relative group overflow-hidden bg-white border border-concrete hover:border-amber transition-all duration-500 opacity-0 translate-y-4 rounded-none min-h-[240px]"
    :class="[{ 'opacity-100 translate-y-0': isVisible }, tabletColSpan]"
    :style="{ transitionDelay: isVisible ? `${index * 100}ms` : '0ms' }"
  >
    <NuxtImg
      :src="category.image"
      :alt="$t(category.titleKey)"
      loading="lazy"
      class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-midnight/95 via-midnight/70 to-transparent" />
    <div class="absolute bottom-0 p-4 w-full">
      <h3 class="text-base font-display font-semibold uppercase text-white mb-2 tracking-wide">
        {{ $t(category.titleKey) }}
      </h3>
      <button class="btn-beveled border-2 border-amber bg-amber text-midnight hover:bg-transparent hover:text-amber px-4 py-1.5 text-xs font-display font-semibold uppercase tracking-wide transition-all duration-300">
        {{ $t('categories.discover') }}
      </button>
    </div>
  </NuxtLink>

  <!-- DESKTOP: Card avec overlay gradient et col-span dynamique -->
  <NuxtLink
    v-else
    :to="`/categories/${category.slug}`"
    class="relative group overflow-hidden bg-white border-2 border-concrete hover:border-amber transition-all duration-500 opacity-0 translate-y-4 rounded-none min-h-[280px]"
    :class="[{ 'opacity-100 translate-y-0': isVisible }, desktopColSpan]"
    :style="{ transitionDelay: isVisible ? `${index * 100}ms` : '0ms' }"
  >
    <NuxtImg
      :src="category.image"
      :alt="$t(category.titleKey)"
      loading="lazy"
      class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/60 to-transparent" />
    <div class="absolute bottom-0 p-6 w-full">
      <h3 class="text-lg font-display font-semibold uppercase text-white mb-3 text-shadow-2xl tracking-wide">
        {{ $t(category.titleKey) }}
      </h3>
      <button class="btn-beveled border-2 border-amber bg-amber text-midnight hover:bg-midnight hover:text-white hover:border-midnight px-6 py-2 text-xs font-display font-semibold uppercase tracking-wide transition-all duration-300">
        {{ $t('categories.discover') }}
      </button>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">

interface Category {
  slug: string
  image: string
  titleKey: string
}

const props = defineProps<{
  category: Category
  index: number
  isVisible: boolean
  variant: 'mobile' | 'tablet' | 'desktop'
}>()

const tabletColSpan = computed(() => {
  const tabletSpans = {
    0: 'col-span-3',
    1: 'col-span-3',
    2: 'col-span-6',
    3: 'col-span-3',
    4: 'col-span-3',
    5: 'col-span-3',
    6: 'col-span-3'
  }
  return tabletSpans[props.index as keyof typeof tabletSpans] || 'col-span-3'
})

const desktopColSpan = computed(() => {
  const desktopSpans = {
    0: 'col-span-4',
    1: 'col-span-3',
    2: 'col-span-5',
    3: 'col-span-3',
    4: 'col-span-4',
    5: 'col-span-5',
    6: 'col-span-7'
  }
  return desktopSpans[props.index as keyof typeof desktopSpans] || 'col-span-4'
})
</script>
