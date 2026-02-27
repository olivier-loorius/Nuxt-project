<template>
  <section class="mt-16 lg:mt-20 pt-10 border-t border-concrete">

    <!-- ── Avis clients ─────────────────────────────────────────────────────── -->
    <div class="flex items-center gap-3 mb-8">
      <div class="w-0.5 h-4 bg-amber flex-shrink-0" />
      <h2 class="text-xs font-display font-bold tracking-[0.25em] uppercase text-midnight">
        {{ $t('product.reviews.title') }}
      </h2>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
      <div
        v-for="review in reviews"
        :key="review.pseudo"
        class="bg-white p-5 flex flex-col"
      >
        <!-- Étoiles -->
        <div class="flex items-center gap-0.5 mb-3">
          <span
            v-for="i in 5"
            :key="i"
            class="text-base leading-none"
            :class="i <= review.rating ? 'text-amber' : 'text-concrete'"
          >★</span>
        </div>

        <!-- Pseudo + date -->
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-display font-semibold text-midnight">
            {{ review.pseudo }}
          </span>
          <span class="text-[10px] font-body text-midnight/35 tabular-nums">
            {{ review.date }}
          </span>
        </div>

        <!-- Texte -->
        <p class="text-xs font-body text-midnight/65 leading-relaxed flex-1">
          {{ $t(review.textKey) }}
        </p>

        <!-- Badge vérifié -->
        <span class="inline-block mt-4 text-[9px] font-body tracking-[0.18em] uppercase text-amber">
          {{ $t('product.reviews.verified') }}
        </span>
      </div>
    </div>

    <!-- ── Garantie & livraison ──────────────────────────────────────────────── -->
    <div class="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-concrete border border-concrete">
      <div class="flex items-start gap-4 px-6 py-5">
        <Truck
          :size="17"
          class="text-amber flex-shrink-0 mt-0.5"
          stroke-width="1.75"
        />
        <div>
          <p class="text-xs font-display font-semibold text-midnight mb-1">
            {{ $t('product.reviews.delivery_label') }}
          </p>
          <p class="text-[11px] font-body text-midnight/55 leading-relaxed">
            {{ $t('product.reviews.delivery_text') }}
          </p>
        </div>
      </div>

      <div class="flex items-start gap-4 px-6 py-5">
        <Shield
          :size="17"
          class="text-amber flex-shrink-0 mt-0.5"
          stroke-width="1.75"
        />
        <div>
          <p class="text-xs font-display font-semibold text-midnight mb-1">
            {{ $t('product.reviews.warranty_label') }}
          </p>
          <p class="text-[11px] font-body text-midnight/55 leading-relaxed">
            {{ $t('product.reviews.warranty_text') }}
          </p>
        </div>
      </div>

      <div class="flex items-start gap-4 px-6 py-5">
        <RotateCcw
          :size="17"
          class="text-amber flex-shrink-0 mt-0.5"
          stroke-width="1.75"
        />
        <div>
          <p class="text-xs font-display font-semibold text-midnight mb-1">
            {{ $t('product.reviews.returns_label') }}
          </p>
          <p class="text-[11px] font-body text-midnight/55 leading-relaxed">
            {{ $t('product.reviews.returns_text') }}
          </p>
        </div>
      </div>
    </div>

    <!-- ── Paiements acceptés ───────────────────────────────────────────────── -->
    <div class="mt-10 pt-8 border-t border-concrete text-center">
      <p class="text-[10px] font-body tracking-[0.22em] uppercase text-midnight/45 mb-5">
        {{ $t('product.payments.title') }}
      </p>
      <div class="flex items-center justify-center gap-3 flex-wrap">

        <!-- Visa -->
        <div class="w-12 h-8 border border-concrete rounded-sm bg-white flex items-center justify-center">
          <svg viewBox="0 0 50 22" xmlns="http://www.w3.org/2000/svg" class="w-10 h-auto" aria-label="Visa">
            <text x="25" y="16" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="900" font-style="italic" fill="#1434CB" letter-spacing="1.5">VISA</text>
          </svg>
        </div>

        <!-- Mastercard -->
        <div class="w-12 h-8 border border-concrete rounded-sm bg-white flex items-center justify-center">
          <svg viewBox="0 0 40 26" xmlns="http://www.w3.org/2000/svg" class="w-10 h-auto" aria-label="Mastercard">
            <circle cx="15" cy="13" r="11" fill="#EB001B"/>
            <circle cx="25" cy="13" r="11" fill="#F79E1B"/>
            <!-- Intersection lens -->
            <path d="M20,3.56 A11,11,0,0,1,20,22.44 A11,11,0,0,1,20,3.56 Z" fill="#FF5F00"/>
          </svg>
        </div>

        <!-- Amex -->
        <div class="w-12 h-8 border border-concrete rounded-sm bg-[#006FCF] flex items-center justify-center overflow-hidden">
          <svg viewBox="0 0 48 16" xmlns="http://www.w3.org/2000/svg" class="w-11 h-auto" aria-label="American Express">
            <text x="24" y="12" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="700" fill="white" letter-spacing="0.8">AMEX</text>
          </svg>
        </div>

        <!-- CB -->
        <div class="w-12 h-8 border border-concrete rounded-sm bg-white flex items-center justify-center">
          <svg viewBox="0 0 36 22" xmlns="http://www.w3.org/2000/svg" class="w-9 h-auto" aria-label="Carte Bancaire">
            <!-- Puce -->
            <rect x="3" y="7" width="9" height="7" rx="1.5" fill="#003B8E" opacity="0.25"/>
            <!-- cb -->
            <text x="22" y="16" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" font-weight="800" fill="#003B8E" letter-spacing="-0.3">cb</text>
          </svg>
        </div>

      </div>
    </div>

  </section>
</template>

<script setup lang="ts">
import { Truck, Shield, RotateCcw } from 'lucide-vue-next'

const reviews = [
  { pseudo: 'Alexis M.', date: '14/01/2025', rating: 5, textKey: 'product.reviews.review1' },
  { pseudo: 'Jordan R.', date: '02/02/2025', rating: 4, textKey: 'product.reviews.review2' },
  { pseudo: 'Thomas K.', date: '19/02/2025', rating: 5, textKey: 'product.reviews.review3' },
]
</script>
