<template>
  <section class="bg-chalk py-12 md:py-16">
    <div class="max-w-4xl mx-auto px-8 text-center">
      <!-- Border top -->
      <div class="border-t-2 border-amber w-24 mx-auto mb-8" />

      <!-- Titre -->
      <h2 class="text-2xl md:text-3xl font-sora font-bold text-midnight mb-4">
        {{ $t('transition.title') }}
      </h2>

      <!-- Description -->
      <p class="text-base font-manrope text-midnight/70 leading-relaxed">
        {{ $t('transition.description') }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * SECTION HOME TRANSITION
 *
 * Section de transition textuelle entre HomeCategories et HomeVisionTrust.
 * Crée une pause visuelle et introduit l'engagement de la marque.
 *
 * STRUCTURE:
 * - Section: bg-chalk py-12 (mobile) / py-16 (desktop)
 * - Container: max-w-4xl mx-auto text-center px-8
 * - Border top: border-t-2 border-amber w-24 mx-auto mb-8
 * - Titre: text-2xl (mobile) / text-3xl (desktop) Sora bold text-midnight mb-4
 * - Description: text-base Manrope text-midnight/70 leading-relaxed
 *
 * DESIGN DA STRICT:
 * - Typographie: Sora (titres) + Manrope (texte)
 * - Couleurs: midnight/amber/chalk uniquement
 * - Espacement: py-12 (mobile) / py-16 (desktop)
 * - Responsive: text-2xl → text-3xl
 * - Transitions: smooth (cohérent avec homepage)
 */
</script>
