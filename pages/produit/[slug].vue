<template>
  <div class="min-h-screen bg-chalk">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14">

      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-5">
        <ol class="flex items-center gap-1 text-[11px] font-body flex-wrap">
          <li>
            <NuxtLink
              :to="localePath('/')"
              class="text-midnight/50 hover:text-amber transition-colors duration-200"
            >
              {{ $t('breadcrumb.home') }}
            </NuxtLink>
          </li>
          <li aria-hidden="true">
            <ChevronRight :size="10" class="text-midnight/25 mx-0.5" />
          </li>
          <li>
            <NuxtLink
              :to="localePath('/nouveautes')"
              class="text-midnight/50 hover:text-amber transition-colors duration-200"
            >
              {{ $t('catalog.categories.' + product.category_id) }}
            </NuxtLink>
          </li>
          <li aria-hidden="true">
            <ChevronRight :size="10" class="text-midnight/25 mx-0.5" />
          </li>
          <li class="text-midnight/35 truncate max-w-[220px]" aria-current="page">
            {{ product.name }}
          </li>
        </ol>
      </nav>

      <!-- Retour -->
      <NuxtLink
        :to="localePath('/nouveautes')"
        class="inline-flex items-center gap-2 mb-8 lg:mb-10 text-xs font-body text-midnight/50 hover:text-amber transition-colors duration-200"
      >
        <ArrowLeft :size="13" />
        <span class="tracking-[0.12em] uppercase">{{ $t('breadcrumb.back') }}</span>
      </NuxtLink>

      <!-- Layout 2 colonnes -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 lg:items-start">
        <ProductGallery :product="product" />
        <ProductInfo :product="product" />
      </div>

      <!-- Avis & garanties -->
      <ProductReviews />

      <!-- Produits similaires -->
      <ProductSimilar :product="product" />

    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, ChevronRight } from 'lucide-vue-next'
import { MOCK_PRODUCTS } from '~/data/products'

definePageMeta({ layout: 'default' })

const localePath = useLocalePath()
const route = useRoute()
const slug = route.params.slug as string
const supabase = useSupabaseClient()
const { isDemoMode } = useDemoMode()

const { data: product } = await useAsyncData(`product-${slug}`, async () => {
  if (isDemoMode.value) {
    return MOCK_PRODUCTS.find(p => p.id === slug) ?? null
  }
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', slug)
    .single()
  if (error || !data) return null
  return data
})

if (!product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Product not found' })
}

useSeoMeta({
  title: () => `${product.value!.name} — Boys & Toys`,
  description: () => product.value!.description,
})
</script>
