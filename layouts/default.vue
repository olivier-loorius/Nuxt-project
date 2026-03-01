<template>
  <div>
    <LayoutInfoBanner />
    <LayoutNavigation />
    <main>
      <slot />
    </main>
    <LayoutFooter />
    <Toaster position="top-right" :duration="4000" rich-colors />
  </div>
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner'
</script>
