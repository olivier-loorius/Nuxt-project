<template>
  <div
    v-if="!isDismissed"
    class="h-[36px] bg-midnight/5 border-b border-concrete flex items-center justify-center relative transition-opacity duration-300"
    :class="{ 'opacity-0': isClosing }"
  >
    <p class="text-sm italic text-midnight/70 font-body">
      {{ $t('banner.adultsOnly') }}
    </p>
    <button
      @click="closeBanner"
      class="absolute right-4 p-1 hover:bg-midnight/10 rounded transition-colors duration-200"
      aria-label="Fermer"
    >
      <X :size="16" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { X } from 'lucide-vue-next'

const isDismissed = ref(false)
const isClosing = ref(false)

const closeBanner = () => {
  isClosing.value = true

  setTimeout(() => {
    isDismissed.value = true
    // Stocker dans un cookie (expire après 30 jours)
    document.cookie = 'infoBannerDismissed=true; max-age=' + (30 * 24 * 60 * 60) + '; path=/'
  }, 300)
}

onMounted(() => {
  // Vérifier si le cookie existe
  const cookies = document.cookie.split(';')
  const dismissed = cookies.some(cookie => cookie.trim().startsWith('infoBannerDismissed='))
  isDismissed.value = dismissed
})
</script>
