<template>
  <!-- Section Categories - Grille Masonry Moderne Responsive -->
  <section class="bg-white py-12 md:py-20">
    <div class="max-w-screen-2xl mx-auto px-4 md:px-8">
      <!-- Titre Section -->
      <div class="text-center mb-8 md:mb-16">
        <h2 class="text-3xl md:text-4xl font-display font-bold text-midnight mb-4 md:mb-6">
          {{ t('categories.title') }}
        </h2>
        <div class="border-t-2 border-amber w-24 md:w-32 mx-auto" />
      </div>

      <!-- Bloc Texte en haut sur mobile -->
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

      <!-- Grid Desktop / Bandeaux Mobile -->
      <div ref="categoriesGrid">
        <!-- MOBILE: Flex Column avec bandeaux horizontaux (< 768px) - REFACTORED -->
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

        <!-- TABLET: Grid 6 colonnes (768px - 1024px) - REFACTORED -->
        <div class="hidden md:grid lg:hidden grid-cols-6 gap-6">
          <!-- First 3 categories -->
          <CategoryCard
            v-for="(category, index) in categories.slice(0, 3)"
            :key="category.slug"
            :category="category"
            :index="index"
            :is-visible="isVisible"
            variant="tablet"
          />

          <!-- Bloc Texte Tablet (après Cat3, index 3 pour stagger) -->
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

          <!-- Last 4 categories (Cat4-7, index 4-7 pour stagger) -->
          <CategoryCard
            v-for="(category, index) in categories.slice(3)"
            :key="category.slug"
            :category="category"
            :index="index + 4"
            :is-visible="isVisible"
            variant="tablet"
          />
        </div>

        <!-- DESKTOP: Grid 12 colonnes (>= 1024px) - REFACTORED -->
        <div class="hidden lg:grid grid-cols-12 gap-10">
          <!-- Ligne 1: Cat1(4) + Cat2(3) + Cat3(5) = 12 cols -->
          <CategoryCard
            v-for="(category, index) in categories.slice(0, 3)"
            :key="category.slug"
            :category="category"
            :index="index"
            :is-visible="isVisible"
            variant="desktop"
          />

          <!-- Ligne 2: Cat4(3) + Texte(5) + Cat5(4) = 12 cols -->
          <CategoryCard
            v-if="categories[3]"
            :category="categories[3]"
            :index="3"
            :is-visible="isVisible"
            variant="desktop"
          />

          <!-- Bloc Texte Desktop (index 4 pour stagger) -->
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

          <!-- Ligne 3: Cat6(5) + Cat7(7) = 12 cols -->
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

/**
 * HomeCategories - Grille Masonry Moderne Responsive - FULLY REFACTORED
 *
 * REFACTO COMPLÈTE (Partie 1 + 2):
 * - Créé array categories avec 7 objets TypeScript { slug, image, titleKey }
 * - MOBILE: remplacé 7 cards hardcodées par v-for CategoryCard variant='mobile'
 * - TABLET: remplacé 7 cards hardcodées par v-for CategoryCard variant='tablet'
 * - DESKTOP: remplacé 7 cards hardcodées par v-for CategoryCard variant='desktop'
 * - Blocs texte tablet/desktop conservés au centre avec stagger animation
 * - Économie totale: 283 lignes (476 → 193 lignes, 59% réduction)
 *
 * ARCHITECTURE DATA-DRIVEN:
 * - 1 array categories[] réutilisé pour les 3 breakpoints
 * - CategoryCard component avec 3 variants (mobile/tablet/desktop)
 * - Col-span dynamique géré dans CategoryCard via computed properties
 * - Index stagger ajusté pour chaque section (slice + offset)
 *
 * RESPONSIVE MOBILE (< 768px):
 * - Bloc texte en haut (visible uniquement mobile)
 * - 7 CategoryCard variant='mobile' (bandeaux h-24)
 * - Flex column gap-4
 *
 * RESPONSIVE TABLET (768px - 1024px):
 * - Grid grid-cols-6 gap-6
 * - 3 CategoryCard (Cat1-3) → Bloc texte → 4 CategoryCard (Cat4-7)
 * - Stagger: index 0-2, texte index 3, cards index 4-7
 *
 * RESPONSIVE DESKTOP (>= 1024px):
 * - Grid grid-cols-12 gap-10 (masonry layout 3 lignes)
 * - Ligne 1: Cat1-2-3 (4+3+5=12 cols)
 * - Ligne 2: Cat4 + Texte + Cat5 (3+5+4=12 cols)
 * - Ligne 3: Cat6-7 (5+7=12 cols)
 * - Stagger: Cat1-3 (index 0-2), Cat4 (index 3), Texte (index 4), Cat5 (index 5), Cat6-7 (index 6-7)
 *
 * SCROLL REVEAL:
 * - IntersectionObserver sur categoriesGrid ref
 * - isVisible prop passé à tous CategoryCard
 * - Blocs texte tablet/desktop avec isVisible
 * - Stagger delays: index * 100ms
 */

interface Category {
  slug: string
  image: string
  titleKey: string
}

const { t } = useI18n()

const categoriesGrid = ref<HTMLElement | null>(null)
const isVisible = ref(false)

const categories: Category[] = [
  { slug: 'stimulateurs', image: '/images/jouet1.jpg', titleKey: 'categories.cat1' },
  { slug: 'masturbateurs', image: '/images/jouet2.jpg', titleKey: 'categories.cat2' },
  { slug: 'anneaux', image: '/images/jouet3.jpg', titleKey: 'categories.cat3' },
  { slug: 'lubrifiants', image: '/images/jouet4.jpg', titleKey: 'categories.cat4' },
  { slug: 'accessoires', image: '/images/jouet5.jpg', titleKey: 'categories.cat5' },
  { slug: 'nettoyants', image: '/images/jouet6.jpg', titleKey: 'categories.cat6' },
  { slug: 'nouveautes', image: '/images/jouet7.jpg', titleKey: 'categories.cat7' }
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
