<template>
  <section class="bg-white py-12 md:py-20">
    <div class="max-w-screen-2xl mx-auto px-4 md:px-8">
      <div class="text-center mb-8 md:mb-16">
        <h2 class="text-3xl md:text-4xl font-display font-bold text-midnight mb-4 md:mb-6">
          {{ t('categories.title') }}
        </h2>
        <div class="border-t-2 border-amber w-24 md:w-32 mx-auto" />
      </div>

      <div class="block md:hidden max-w-full text-center mb-8 px-2">
        <h2 class="text-xl font-display font-bold text-midnight mb-3">
          {{ t('categories.textBlock.title') }}
        </h2>
        <p class="text-sm font-body text-midnight/70 mb-6">
          {{ t('categories.textBlock.description') }}
        </p>
        <NuxtLink
          to="/categories"
          class="inline-block btn-beveled border-2 border-amber bg-amber text-midnight hover:bg-midnight hover:text-white hover:border-midnight px-6 py-2 text-xs font-display font-semibold uppercase tracking-wide transition-all duration-300"
        >
          {{ t('categories.discover') }}
        </NuxtLink>
      </div>

      <div ref="categoriesGrid">
        <div class="flex flex-col gap-4 md:hidden">
          <CategoryCard
            v-for="(category, index) in categories"
            :key="category.slug"
            :category="category"
            :index="index"
            :is-visible="isVisible"
            variant="mobile"
          />
        </div>

        <div class="hidden md:grid lg:hidden grid-cols-6 gap-6">
          <CategoryCard
            v-for="(category, index) in categories.slice(0, 3)"
            :key="category.slug"
            :category="category"
            :index="index"
            :is-visible="isVisible"
            variant="tablet"
          />

          <div
            class="col-span-6 bg-white border border-concrete hover:border-amber p-8 flex flex-col items-center justify-center text-center transition-all duration-500 opacity-0 translate-y-4 rounded-none min-h-[200px]"
            :class="{ 'opacity-100 translate-y-0': isVisible }"
            :style="{ transitionDelay: isVisible ? `${3 * 100}ms` : '0ms' }"
          >
            <h2 class="text-xl font-display font-bold text-midnight mb-3">
              {{ t('categories.textBlock.title') }}
            </h2>
            <p class="text-sm font-body text-midnight/70 mb-4">
              {{ t('categories.textBlock.description') }}
            </p>
            <NuxtLink
              to="/categories"
              class="btn-beveled border-2 border-amber bg-amber text-midnight hover:bg-midnight hover:text-white hover:border-midnight px-6 py-2 text-xs font-display font-semibold uppercase tracking-wide transition-all duration-300"
            >
              {{ t('categories.discover') }}
            </NuxtLink>
          </div>

          <CategoryCard
            v-for="(category, index) in categories.slice(3)"
            :key="category.slug"
            :category="category"
            :index="index + 4"
            :is-visible="isVisible"
            variant="tablet"
          />
        </div>

        <div class="hidden lg:grid grid-cols-12 gap-10">
          <CategoryCard
            v-for="(category, index) in categories.slice(0, 3)"
            :key="category.slug"
            :category="category"
            :index="index"
            :is-visible="isVisible"
            variant="desktop"
          />

          <CategoryCard
            v-if="categories[3]"
            :category="categories[3]"
            :index="3"
            :is-visible="isVisible"
            variant="desktop"
          />

          <div class="col-span-5 bg-white border border-concrete hover:border-amber p-10 flex flex-col items-center justify-center text-center transition-all duration-500 opacity-0 translate-y-4 rounded-none min-h-[280px]" :class="{ 'opacity-100 translate-y-0': isVisible }" :style="{ transitionDelay: isVisible ? `${4 * 100}ms` : '0ms' }">
            <h2 class="text-2xl font-display font-bold text-midnight mb-4">{{ t('categories.textBlock.title') }}</h2>
            <p class="text-sm font-body text-midnight/70 mb-6">{{ t('categories.textBlock.description') }}</p>
            <NuxtLink to="/categories" class="btn-beveled border-2 border-amber bg-amber text-midnight hover:bg-midnight hover:text-white hover:border-midnight px-6 py-2 text-xs font-display font-semibold uppercase tracking-wide transition-all duration-300">{{ t('categories.discover') }}</NuxtLink>
          </div>

          <CategoryCard
            v-if="categories[4]"
            :category="categories[4]"
            :index="4"
            :is-visible="isVisible"
            variant="desktop"
          />

          <CategoryCard
            v-for="(category, index) in categories.slice(5, 7)"
            :key="category.slug"
            :category="category"
            :index="index + 5"
            :is-visible="isVisible"
            variant="desktop"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

interface Category {
  slug: string
  image: string
  titleKey: string
}

const { t } = useI18n()

const categoriesGrid = ref<HTMLElement | null>(null)
const isVisible = ref(false)

const categories: Category[] = [
  { slug: 'stimulateurs', image: '/images/jouet1.webp', titleKey: 'categories.cat1' },
  { slug: 'masturbateurs', image: '/images/jouet2.webp', titleKey: 'categories.cat2' },
  { slug: 'anneaux', image: '/images/jouet3.webp', titleKey: 'categories.cat3' },
  { slug: 'lubrifiants', image: '/images/jouet4.webp', titleKey: 'categories.cat4' },
  { slug: 'accessoires', image: '/images/jouet5.webp', titleKey: 'categories.cat5' },
  { slug: 'nettoyants', image: '/images/jouet6.webp', titleKey: 'categories.cat6' },
  { slug: 'nouveautes', image: '/images/jouet7.webp', titleKey: 'categories.cat7' }
]

useIntersectionObserver(
  categoriesGrid,
  ([entry]) => {
    if (entry?.isIntersecting) {
      isVisible.value = true
    }
  },
  { threshold: 0.2 }
)
</script>
