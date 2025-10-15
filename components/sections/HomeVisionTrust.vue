<template>
  <section class="bg-white py-0 pb-16">
    <div class="grid grid-cols-1 lg:grid-cols-10 gap-0 min-h-[600px]">
      <!-- Col1: Image + Texte -->
      <div class="col-span-1 lg:col-span-7 relative overflow-hidden h-96 lg:h-auto">
        <!-- Image de fond -->
        <img
          src="/images/pars-sahin-p4t2qWPQ6VM-unsplash.jpg"
          alt="Innovation scientifique"
          class="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />

        <!-- Overlay gradient -->
        <div class="absolute inset-0 bg-gradient-to-r from-midnight/90 via-midnight/70 to-transparent" />

        <!-- Content -->
        <div class="absolute inset-0 flex flex-col justify-center px-12 lg:px-16 max-w-2xl">
          <blockquote class="text-3xl lg:text-4xl font-sora font-bold text-white mb-6">
            {{ $t('home.visionTrust.quote') }}
          </blockquote>

          <p class="text-lg font-manrope text-white/90 mb-8">
            {{ $t('home.visionTrust.description') }}
          </p>

          <NuxtLink
            :to="localePath('/about')"
            class="btn-beveled border-2 border-amber bg-amber text-midnight hover:bg-transparent hover:text-amber px-8 py-3 font-sora font-semibold uppercase inline-flex items-center justify-center w-fit transition-colors duration-300"
          >
            {{ $t('home.visionTrust.cta') }}
          </NuxtLink>
        </div>
      </div>

      <!-- Col2: Trust Items -->
      <div class="col-span-1 lg:col-span-3 bg-chalk grid grid-cols-2 lg:flex lg:flex-col lg:justify-center gap-6 lg:gap-10 px-4 lg:px-8 py-8 lg:py-12">
        <CommonTrustItem
          v-for="(item, idx) in trustItems"
          :key="idx"
          :icon="item.icon"
          :title-key="item.titleKey"
          :show-border="idx < 3"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Truck, ShieldCheck, Award, Lock } from 'lucide-vue-next'

/**
 * SECTION HOME VISION + TRUST - Refactorisée
 *
 * REFACTO:
 * - Utilise TrustItem.vue réutilisable
 * - Data-driven avec array trustItems
 * - Avant: 108 lignes → Après: 86 lignes
 * - Économie: -22 lignes (-20%)
 *
 * STRUCTURE:
 * - Grid responsive: 1 colonne (mobile) / 10 colonnes (desktop)
 * - Col1 (7 colonnes desktop): Image + texte superposé
 * - Col2 (3 colonnes desktop): 4 items trust avec TrustItem component
 *
 * COL1 - IMAGE + TEXTE:
 * - Image de fond couvrant toute la zone
 * - Overlay gradient midnight
 * - Contenu texte superposé (citation + description + CTA)
 * - Mobile: h-96 (hauteur fixe)
 *
 * COL2 - TRUST ITEMS:
 * - Background chalk
 * - 4 TrustItem avec gap-10
 * - Icônes Lucide 32px text-amber
 * - Titres text-xs Sora semibold uppercase
 * - Border-b entre items (sauf dernier via showBorder)
 */

const localePath = useLocalePath()

const trustItems = [
  { icon: Truck, titleKey: 'trust.delivery.short' },
  { icon: ShieldCheck, titleKey: 'trust.discretion.short' },
  { icon: Award, titleKey: 'trust.certified.short' },
  { icon: Lock, titleKey: 'trust.payment.short' }
]
</script>
