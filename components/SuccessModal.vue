<template>
  <Dialog :open="modelValue" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-sm !rounded-none border border-midnight/10">
      <div class="flex flex-col items-center text-center space-y-4 py-4">
        <div class="w-12 h-12 bg-green-500 flex items-center justify-center">
          <svg
            class="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            stroke-width="3"
          >
            <path
              stroke-linecap="square"
              stroke-linejoin="miter"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <DialogTitle class="text-xl font-sora font-semibold text-midnight">
          {{ title }}
        </DialogTitle>

        <DialogDescription class="text-sm text-midnight/60 font-manrope">
          {{ message }}
        </DialogDescription>
      </div>

      <DialogFooter>
        <button
          @click="close"
          class="w-full btn-beveled border-2 border-amber bg-amber text-midnight hover:bg-copper px-6 py-3 font-sora font-semibold uppercase tracking-wide text-sm transition-all duration-300"
        >
          Fermer
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '~/components/ui/dialog'

const props = defineProps<{
  modelValue: boolean
  title: string
  message: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

let autoCloseTimer: NodeJS.Timeout | null = null

const handleOpenChange = (open: boolean) => {
  emit('update:modelValue', open)
  if (!open && autoCloseTimer) {
    clearTimeout(autoCloseTimer)
    autoCloseTimer = null
  }
}

const close = () => {
  emit('update:modelValue', false)
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
    autoCloseTimer = null
  }
}

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer)
    }
    autoCloseTimer = setTimeout(() => {
      close()
    }, 3000)
  }
})

onUnmounted(() => {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
  }
})
</script>
