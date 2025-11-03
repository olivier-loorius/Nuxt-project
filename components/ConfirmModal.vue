<template>
  <Dialog :open="modelValue" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-sm !rounded-none border border-midnight/10">
      <div class="flex flex-col items-center text-center space-y-4 py-4">
        <div class="w-12 h-12 bg-red-600 flex items-center justify-center">
          <AlertCircle class="w-7 h-7 text-white" stroke-width="3" />
        </div>

        <DialogTitle class="text-xl font-sora font-semibold text-midnight">
          {{ title }}
        </DialogTitle>

        <DialogDescription class="text-sm text-midnight/60 font-manrope">
          {{ message }}
        </DialogDescription>
      </div>

      <div class="space-y-2 pb-4">
        <label for="password" class="block font-sora font-semibold text-sm text-midnight">
          {{ $t('modals.confirm.password_label') }} <span class="text-red-600">*</span>
        </label>
        <div class="relative">
          <input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="$t('modals.confirm.password_placeholder')"
            required
            class="btn-beveled w-full border-2 border-concrete px-4 py-3 pr-12 focus:outline-none bg-white text-midnight focus:ring-2 focus:ring-amber focus-visible:ring-2 focus-visible:ring-amber"
            @keyup.enter="handleConfirm"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-midnight/50 hover:text-midnight transition-colors focus-visible:ring-2 focus-visible:ring-amber rounded"
            :aria-label="$t('modals.confirm.password_aria')"
          >
            <Eye v-if="!showPassword" class="w-5 h-5" />
            <EyeOff v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <DialogFooter class="gap-3 sm:gap-3">
        <button
          type="button"
          @click="handleCancel"
          class="flex-1 btn-beveled border-2 border-midnight bg-white text-midnight hover:bg-concrete px-6 py-3 font-sora font-semibold uppercase tracking-wide text-sm transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber"
        >
          {{ $t('modals.confirm.cancel') }}
        </button>
        <button
          type="button"
          @click="handleConfirm"
          :disabled="!password.trim()"
          class="flex-1 btn-beveled border-2 border-red-600 bg-red-600 text-white hover:bg-red-700 hover:border-red-700 px-6 py-3 font-sora font-semibold uppercase tracking-wide text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-amber"
        >
          {{ $t('modals.confirm.delete') }}
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { AlertCircle, Eye, EyeOff } from 'lucide-vue-next'
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
  'confirm': [password: string]
}>()

const password = ref('')
const showPassword = ref(false)

const handleOpenChange = (open: boolean) => {
  emit('update:modelValue', open)
  if (!open) {
    password.value = ''
  }
}

const handleCancel = () => {
  password.value = ''
  emit('update:modelValue', false)
}

const handleConfirm = () => {
  if (password.value.trim()) {
    emit('confirm', password.value)
    password.value = ''
  }
}

watch(() => props.modelValue, (isOpen) => {
  if (!isOpen) {
    password.value = ''
  }
})
</script>
