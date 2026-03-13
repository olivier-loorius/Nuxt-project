<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('cancel')" />

      <div class="relative bg-[#1A1D2E] border border-white/10 rounded-sm w-full max-w-sm shadow-2xl">
        <div class="px-6 pt-6 pb-2">
          <h2 class="text-sm font-display font-bold text-chalk tracking-wide">
            {{ title }}
          </h2>
        </div>

        <div class="px-6 py-4">
          <p class="text-xs font-body text-chalk/60 leading-relaxed">
            {{ message }}
          </p>
        </div>

        <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10">
          <button
            class="text-xs font-body px-4 py-2 text-chalk/50 hover:text-chalk transition-colors duration-150"
            @click="$emit('cancel')"
          >
            Annuler
          </button>
          <button
            class="text-xs font-body font-semibold px-4 py-2 rounded-sm transition-colors duration-150"
            :class="confirmClass"
            @click="$emit('confirm')"
          >
            {{ confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  message: string
  confirmLabel: string
  confirmVariant: 'danger' | 'warning' | 'success'
}>()

defineEmits<{
  confirm: []
  cancel: []
}>()

const confirmClass = computed(() => {
  if (props.confirmVariant === 'danger')  return 'bg-red-600 text-white hover:bg-red-700'
  if (props.confirmVariant === 'warning') return 'bg-amber text-midnight hover:bg-amber/80'
  return 'bg-green-600 text-white hover:bg-green-700'
})
</script>
