<template>
  <Transition name="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[70] bg-midnight/30 backdrop-blur-md flex items-start justify-center pt-24"
      @click.self="close"
    >
      <div class="w-full max-w-2xl mx-4">
        <div class="relative bg-white rounded-lg shadow-lg overflow-hidden">
          <!-- Search Icon -->
          <div class="absolute left-4 top-1/2 -translate-y-1/2 text-midnight/40">
            <Search :size="24" />
          </div>

          <!-- Input -->
          <input
            ref="searchInput"
            type="text"
            :placeholder="$t('nav.search')"
            class="w-full pl-14 pr-14 py-4 text-lg outline-none text-midnight"
            @keydown.esc="close"
          />

          <!-- Close Button -->
          <button
            @click="close"
            class="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-midnight/5 rounded transition-colors duration-200"
            aria-label="Fermer"
          >
            <X :size="24" class="text-midnight/60" />
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Search, X } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const searchInput = ref<HTMLInputElement | null>(null)

const close = () => {
  emit('update:modelValue', false)
}

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    // Focus input when overlay opens
    setTimeout(() => {
      searchInput.value?.focus()
    }, 100)
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
