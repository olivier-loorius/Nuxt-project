<template>
  <!-- Section Best-sellers -->
  <section class="bg-white py-12 md:py-20">
    <div class="max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
      <!-- Titre -->
      <h2 class="text-2xl md:text-3xl font-display font-bold text-midnight mb-3 md:mb-4 text-center">{{ t('bestsellers.title') }}</h2>
      <div class="text-center mb-8 md:mb-16">
        <NuxtLink to="/produits" class="text-sm text-amber hover:text-midnight transition-colors duration-300">
          {{ t('bestsellers.viewAll') }} →
        </NuxtLink>
      </div>

      <!-- Grid produits -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        <!-- Card 1 -->
        <div class="group bg-white border border-concrete hover:border-amber hover:shadow-xl transition-all duration-500 flex flex-col h-full">
          <div class="aspect-[4/5] flex-shrink-0 overflow-hidden relative">
            <NuxtImg src="/images/sac1.png" alt="Sac Midnight" loading="lazy" class="absolute inset-0 w-full h-full object-contain p-2 md:p-4 group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div class="flex-1 flex flex-col p-3 md:p-6 lg:p-8">
            <h3 class="text-xs md:text-base lg:text-lg font-display font-semibold text-midnight mb-1 md:mb-2 line-clamp-2 flex-shrink-0">Sac Midnight</h3>
            <p class="text-sm md:text-xl lg:text-2xl font-display font-bold text-midnight mb-2 md:mb-4 flex-shrink-0">49,90 €</p>
            <button class="btn-beveled border-2 border-midnight bg-midnight text-white hover:bg-transparent hover:text-midnight px-3 py-1.5 md:px-6 md:py-3 text-xs md:text-sm font-display font-semibold uppercase w-full transition-all duration-300 mt-auto">
              {{ t('bestsellers.addToCart') }}
            </button>
          </div>
        </div>

        <!-- Card 2 -->
        <div class="group bg-white border border-concrete hover:border-amber hover:shadow-xl transition-all duration-500 flex flex-col h-full">
          <div class="aspect-[4/5] flex-shrink-0 overflow-hidden relative">
            <NuxtImg src="/images/sac2.png" alt="Sac Essentiel" loading="lazy" class="absolute inset-0 w-full h-full object-contain p-2 md:p-4 group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div class="flex-1 flex flex-col p-3 md:p-6 lg:p-8">
            <h3 class="text-xs md:text-base lg:text-lg font-display font-semibold text-midnight mb-1 md:mb-2 line-clamp-2 flex-shrink-0">Sac Essentiel</h3>
            <p class="text-sm md:text-xl lg:text-2xl font-display font-bold text-midnight mb-2 md:mb-4 flex-shrink-0">39,90 €</p>
            <button class="btn-beveled border-2 border-midnight bg-midnight text-white hover:bg-transparent hover:text-midnight px-3 py-1.5 md:px-6 md:py-3 text-xs md:text-sm font-display font-semibold uppercase w-full transition-all duration-300 mt-auto">
              {{ t('bestsellers.addToCart') }}
            </button>
          </div>
        </div>

        <!-- Card 3 -->
        <div class="group bg-white border border-concrete hover:border-amber hover:shadow-xl transition-all duration-500 flex flex-col h-full">
          <div class="aspect-[4/5] flex-shrink-0 overflow-hidden relative">
            <NuxtImg src="/images/sac3.png" alt="Sac Performance" loading="lazy" class="absolute inset-0 w-full h-full object-contain p-2 md:p-4 group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div class="flex-1 flex flex-col p-3 md:p-6 lg:p-8">
            <h3 class="text-xs md:text-base lg:text-lg font-display font-semibold text-midnight mb-1 md:mb-2 line-clamp-2 flex-shrink-0">Sac Performance</h3>
            <p class="text-sm md:text-xl lg:text-2xl font-display font-bold text-midnight mb-2 md:mb-4 flex-shrink-0">59,90 €</p>
            <button class="btn-beveled border-2 border-midnight bg-midnight text-white hover:bg-transparent hover:text-midnight px-3 py-1.5 md:px-6 md:py-3 text-xs md:text-sm font-display font-semibold uppercase w-full transition-all duration-300 mt-auto">
              {{ t('bestsellers.addToCart') }}
            </button>
          </div>
        </div>

        <!-- Card 4 -->
        <div class="group bg-white border border-concrete hover:border-amber hover:shadow-xl transition-all duration-500 flex flex-col h-full">
          <div class="aspect-[4/5] flex-shrink-0 overflow-hidden relative">
            <NuxtImg src="/images/sac4.png" alt="Sac Premium" loading="lazy" class="absolute inset-0 w-full h-full object-contain p-2 md:p-4 group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div class="flex-1 flex flex-col p-3 md:p-6 lg:p-8">
            <h3 class="text-xs md:text-base lg:text-lg font-display font-semibold text-midnight mb-1 md:mb-2 line-clamp-2 flex-shrink-0">Sac Premium</h3>
            <p class="text-sm md:text-xl lg:text-2xl font-display font-bold text-midnight mb-2 md:mb-4 flex-shrink-0">29,90 €</p>
            <button class="btn-beveled border-2 border-midnight bg-midnight text-white hover:bg-transparent hover:text-midnight px-3 py-1.5 md:px-6 md:py-3 text-xs md:text-sm font-display font-semibold uppercase w-full transition-all duration-300 mt-auto">
              {{ t('bestsellers.addToCart') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * HomeBestSellers - Section Best-sellers Luxe PNG Responsive
 *
 * RESPONSIVE MOBILE (< 768px):
 * - Section: px-4 py-12 (marges réduites)
 * - Titre: text-2xl mb-3 (compact)
 * - Grid: grid-cols-2 gap-3 (2x2 serré pour 4 produits)
 * - Cards: flex flex-col h-full (uniform height automatique)
 * - Image container: aspect-[4/5] flex-shrink-0 overflow-hidden relative
 * - Image: absolute inset-0 object-contain p-2
 * - Content div: flex-1 flex flex-col p-3
 * - Titres: text-xs line-clamp-2 mb-1 flex-shrink-0
 * - Prix: text-sm mb-2 flex-shrink-0
 * - Button: text-xs px-3 py-1.5 w-full mt-auto
 *
 * RESPONSIVE TABLET (768px - 1024px):
 * - Grid: grid-cols-3 gap-6 (3 colonnes)
 * - Content: p-6 (padding intermédiaire)
 * - Titres: text-base
 * - Prix: text-xl
 * - Button: text-sm px-6 py-3
 *
 * RESPONSIVE DESKTOP (>= 1024px):
 * - Grid: grid-cols-4 gap-6 (layout original)
 * - Content: p-8 (padding complet)
 * - Titres: text-lg
 * - Prix: text-2xl
 */

const { t } = useI18n()
</script>
