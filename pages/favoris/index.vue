<template>
  <div class="min-h-screen bg-chalk">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14">

      <div class="mb-10 lg:mb-12">
        <div class="flex items-end gap-4 mb-2">
          <h1 class="font-display font-bold text-midnight text-2xl sm:text-3xl tracking-tight">
            {{ $t('favorites.title') }}
          </h1>
          <span
            v-if="favoriteProducts.length"
            class="mb-0.5 text-xs font-body text-midnight/35 tabular-nums"
          >
            {{ favoriteProducts.length }}
            {{ favoriteProducts.length > 1 ? $t('catalog.product_other') : $t('catalog.product_one') }}
          </span>
        </div>
        <div class="w-10 h-[1.5px] bg-amber" />
      </div>

      <div
        v-if="!favoriteProducts.length"
        class="flex flex-col items-center justify-center gap-5 py-28 text-center"
      >
        <Heart :size="40" class="text-concrete" />
        <p class="text-sm font-display font-medium uppercase tracking-[0.2em] text-midnight/40">
          {{ $t('favorites.empty') }}
        </p>
        <NuxtLink
          :to="localePath('/nouveautes')"
          class="mt-2 inline-flex items-center gap-2 text-xs font-body tracking-[0.12em] uppercase text-midnight/50 hover:text-amber transition-colors duration-200"
        >
          <ArrowRight :size="13" />
          {{ $t('favorites.browse') }}
        </NuxtLink>
      </div>

      <CatalogGrid
        v-else
        :products="favoriteProducts"
      />

    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight, Heart } from 'lucide-vue-next'
import { MOCK_PRODUCTS } from '~/data/products'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { t } = useI18n()
const localePath = useLocalePath()

const { favorites, fetchFavorites } = useFavorites()

onMounted(() => fetchFavorites())

const favoriteProducts = computed(() =>
  MOCK_PRODUCTS.filter(p => favorites.value.includes(p.id))
)

useSeoMeta({
  title: () => `${t('favorites.title')} — Boys & Toys`,
})
</script>
