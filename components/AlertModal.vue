<template>
  <Dialog :open="modelValue" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-sm !rounded-none border border-midnight/10">
      <div class="flex flex-col items-center text-center space-y-4 py-4">
        <div class="w-12 h-12 bg-red-500 flex items-center justify-center">
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
              d="M6 18L18 6M6 6l12 12"
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
          class="w-full btn-beveled border-2 border-red-500 bg-red-500 text-white hover:bg-red-600 px-6 py-3 font-sora font-semibold uppercase tracking-wide text-sm transition-all duration-300"
        >
          {{ $t('modals.alert.close') }}
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from '~/components/ui/dialog/Dialog.vue'
import DialogContent from '~/components/ui/dialog/DialogContent.vue'
import DialogDescription from '~/components/ui/dialog/DialogDescription.vue'
import DialogFooter from '~/components/ui/dialog/DialogFooter.vue'
import DialogTitle from '~/components/ui/dialog/DialogTitle.vue'

const props = defineProps<{
  modelValue: boolean
  title: string
  message: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const handleOpenChange = (open: boolean) => {
  emit('update:modelValue', open)
}

const close = () => {
  emit('update:modelValue', false)
}
</script>
