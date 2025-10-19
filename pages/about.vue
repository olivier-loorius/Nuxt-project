<template>
  <div class="container mx-auto px-6 py-12">
    <h1 class="text-4xl font-display font-bold text-midnight mb-6">
      {{ $t('pages.about') }}
    </h1>
    <div class="prose prose-lg max-w-none">
      <p class="text-lg text-midnight/70 mb-4">
        Page à propos en construction...
      </p>
      <p class="text-midnight/60">
        Cette page contiendra les informations sur Boys & Toys, notre histoire, nos valeurs et notre équipe.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
</script>
