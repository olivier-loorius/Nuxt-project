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

/**
 * TrustItem - Item de confiance réutilisable
 *
 * Composant générique pour afficher un élément de confiance
 * avec icône Lucide et titre i18n.
 *
 * PROPS:
 * - icon: Component Lucide (Truck, ShieldCheck, Award, Lock, etc.)
 * - titleKey: Clé i18n pour le titre
 * - showBorder: Afficher bordure bottom (désactivé sur dernier item)
 *
 * USAGE:
 * <TrustItem
 *   :icon="Truck"
 *   title-key="trust.delivery.short"
 *   :show-border="true"
 * />
 */

defineProps<{
  icon: Component
  titleKey: string
  showBorder?: boolean
}>()
</script>
