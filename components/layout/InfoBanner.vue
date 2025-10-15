<template>
  <div class="h-[36px] bg-midnight/5 border-b border-concrete flex items-center justify-center relative overflow-hidden">
    <transition name="fade" mode="out-in">
      <div :key="currentIndex" class="flex items-center gap-2">
        <component :is="messages[currentIndex].icon" :size="16" class="text-midnight/50" />
        <p class="text-sm italic text-midnight/70 font-body">
          {{ t(messages[currentIndex].text) }}
        </p>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { ShieldCheck, Package, Lock, RotateCcw } from 'lucide-vue-next'

const { t, locale } = useI18n()

const currentIndex = ref(0)
const messages = [
  { icon: ShieldCheck, text: 'banner.adultsOnly' },
  { icon: Package, text: 'banner.delivery' },
  { icon: Lock, text: 'banner.payment' },
  { icon: RotateCcw, text: 'banner.returns' }
]

let interval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  interval = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % messages.length
  }, 4000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})

watch(locale, () => {
  currentIndex.value = 0
  if (interval) clearInterval(interval)
  interval = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % messages.length
  }, 4000)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
