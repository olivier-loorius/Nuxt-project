<template>
  <div
    class="text-center"
    :class="{ 'lg:border-b lg:border-concrete/50 lg:pb-8': showBorder }"
  >
    <component
      :is="icon"
      class="w-8 h-8 text-amber mx-auto mb-3"
    />
    <h3 class="text-xs font-sora font-semibold text-midnight uppercase tracking-wide">
      {{ $t(titleKey) }}
    </h3>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon: Component
  titleKey: string
  showBorder?: boolean
}>()
</script>
