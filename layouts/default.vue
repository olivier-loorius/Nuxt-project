<template>
  <div>
    <InfoBanner />
    <Navigation />
    <slot />
  </div>
</template>

<script setup lang="ts">
import InfoBanner from '~/components/InfoBanner.vue'
import Navigation from '~/components/navbar/Navigation.vue'
</script>
