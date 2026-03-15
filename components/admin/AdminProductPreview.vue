<template>
  <div class="max-w-3xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <p class="text-xs font-body font-semibold tracking-widest uppercase text-midnight/40">Aperçu</p>
      <div class="flex gap-1">
        <button
          class="text-xs font-body px-3 py-1 transition-colors duration-150"
          :class="lang === 'fr' ? 'bg-midnight text-chalk' : 'border border-concrete text-midnight/60'"
          @click="lang = 'fr'"
        >FR</button>
        <button
          class="text-xs font-body px-3 py-1 transition-colors duration-150"
          :class="lang === 'en' ? 'bg-midnight text-chalk' : 'border border-concrete text-midnight/60'"
          @click="lang = 'en'"
        >EN</button>
      </div>
    </div>

    <div class="flex gap-8">
      <div class="w-80 flex-shrink-0">
        <div class="aspect-square w-full overflow-hidden bg-concrete">
          <img
            v-if="imagePreviews[0]"
            :src="imagePreviews[0]"
            class="w-full h-full object-cover"
          >
        </div>

        <div v-if="imagePreviews.slice(1).some(Boolean)" class="grid grid-cols-3 gap-2 mt-2">
          <div
            v-for="i in [1, 2, 3]"
            :key="i"
            class="aspect-square overflow-hidden bg-concrete"
          >
            <img
              v-if="imagePreviews[i]"
              :src="imagePreviews[i]!"
              class="w-full h-full object-cover"
            >
          </div>
        </div>
      </div>

      <div class="flex-1 py-2 flex flex-col">
        <p class="text-xs font-body tracking-widest uppercase text-midnight/40 mb-2">{{ form.category_id }}</p>

        <h2 class="font-display font-bold text-2xl text-midnight mb-3">{{ lang === 'fr' ? form.name : form.name_en }}</h2>

        <div class="flex items-center gap-3 mb-4">
          <p class="text-2xl font-display font-bold text-midnight tabular-nums">{{ formatPrice(form.price) }}</p>
          <span
            v-if="form.badge"
            class="inline-block px-2 py-0.5 text-[10px] font-display font-semibold tracking-[0.15em] uppercase"
            :style="badgeStyle(form.badge)"
          >
            {{ form.badge }}
          </span>
        </div>

        <p v-if="lang === 'fr' ? form.description : form.description_en" class="text-sm font-body text-midnight/60 leading-relaxed mb-4">{{ lang === 'fr' ? form.description : form.description_en }}</p>

        <p class="text-xs font-body mb-8" :class="form.stock > 3 ? 'text-midnight/40' : form.stock > 0 ? 'text-amber' : 'text-red-400'">
          {{ form.stock > 0 ? `${form.stock} en stock` : 'Rupture de stock' }}
        </p>

        <div class="flex gap-3 mt-auto">
          <button
            class="bg-midnight text-chalk text-xs font-body px-4 py-2 transition-colors duration-150"
            @click="$emit('confirm')"
          >
            Confirmer et enregistrer
          </button>
          <button
            class="border border-concrete text-midnight/60 text-xs font-body px-4 py-2 hover:border-midnight hover:text-midnight transition-colors duration-150"
            @click="$emit('back')"
          >
            Retour
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BADGES } from '~/composables/useBadges'

interface Form {
  name: string
  name_en: string
  price: number
  stock: number
  badge: string | null
  category_id: string
  description: string
  description_en: string
}

defineProps<{
  form: Form
  imagePreviews: (string | null)[]
}>()

defineEmits<{
  confirm: []
  back: []
}>()

const lang = ref<'fr' | 'en'>('fr')

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)
}

function badgeStyle(value: string | null) {
  const b = BADGES.find(b => b.value === value)
  return { backgroundColor: b?.bg ?? '#F5F3F0', color: b?.text ?? '#1A1D2E' }
}
</script>
