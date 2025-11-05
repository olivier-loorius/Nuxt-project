<template>
  <div class="bg-white border-2 border-concrete p-8 md:p-10">
    <div class="mb-10 border-l-4 border-amber pl-6">
      <h1 class="text-3xl font-bold text-midnight tracking-tight mb-2 uppercase">
        {{ $t('compte.profil.title') }}
      </h1>
    </div>

    <div v-if="loading" class="bg-chalk p-6 md:p-8">
      <div class="space-y-6 animate-pulse">
        <div>
          <div class="h-4 bg-concrete/50 w-20 mb-2"></div>
          <div class="h-12 bg-concrete/30"></div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <div class="h-4 bg-concrete/50 w-16 mb-2"></div>
            <div class="h-12 bg-concrete/30"></div>
          </div>
          <div>
            <div class="h-4 bg-concrete/50 w-16 mb-2"></div>
            <div class="h-12 bg-concrete/30"></div>
          </div>
        </div>
        <div class="h-12 bg-concrete/30 w-32"></div>
      </div>
    </div>

    <div v-else class="bg-chalk p-6 md:p-8">
      <form @submit.prevent="handleSubmit">
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label for="email" class="block font-sora font-semibold text-sm text-midnight mb-2">
                {{ $t('compte.profil.email') }}
              </label>
              <input
                id="email"
                :value="user?.email"
                type="email"
                readonly
                disabled
                class="btn-beveled w-full bg-concrete/20 border-2 border-concrete text-midnight/50 px-4 py-3 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber focus-visible:ring-2 focus-visible:ring-amber focus-visible:border-amber"
              />
              <p class="text-xs text-midnight/50 mt-1">
                {{ $t('compte.profil.email_readonly') }}
              </p>
            </div>

            <div class="md:col-span-2">
              <label for="password" class="block font-sora font-semibold text-sm text-midnight mb-2">
                {{ $t('compte.profil.password') }}
              </label>
              <div class="relative">
                <input
                  id="password"
                  value="••••••••••••"
                  :type="showPassword ? 'text' : 'password'"
                  readonly
                  disabled
                  class="btn-beveled w-full bg-concrete/20 border-2 border-concrete text-midnight/50 px-4 py-3 pr-12 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber focus-visible:ring-2 focus-visible:ring-amber focus-visible:border-amber"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-midnight/50 hover:text-midnight transition-colors focus-visible:ring-2 focus-visible:ring-amber rounded"
                  :aria-label="$t('compte.profil.password_aria')"
                >
                  <Eye v-if="!showPassword" class="w-5 h-5" />
                  <EyeOff v-else class="w-5 h-5" />
                </button>
              </div>
              <p class="text-xs text-midnight/50 mt-1">
                {{ $t('compte.profil.password_readonly') }}
              </p>
            </div>
          </div>

          <div class="border-t-2 border-concrete pt-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- FirstName avec Label Flottant -->
              <div>
                <label
                  for="firstName"
                  class="block font-sora font-semibold text-sm text-midnight mb-2"
                >
                  {{ $t('compte.profil.first_name') }} <span class="text-alert">*</span>
                </label>
                <input
                  id="firstName"
                  v-model="formData.first_name"
                  type="text"
                  required
                  :disabled="!isEditing"
                  @focus="focusedField = 'firstName'"
                  @blur="focusedField = null"
                  :placeholder="$t('compte.profil.first_name_placeholder')"
                  :class="[
                    'btn-beveled w-full border-2 px-4 py-3 focus:outline-none transition-all duration-200',
                    isEditing
                      ? 'bg-white text-midnight border-concrete focus:ring-2 focus:ring-amber focus:border-amber focus-visible:ring-2 focus-visible:ring-amber'
                      : 'bg-concrete/20 text-midnight/50 border-concrete cursor-not-allowed'
                  ]"
                />
              </div>

              <!-- LastName avec Label Flottant -->
              <div>
                <label
                  for="lastName"
                  class="block font-sora font-semibold text-sm text-midnight mb-2"
                >
                  {{ $t('compte.profil.last_name') }} <span class="text-alert">*</span>
                </label>
                <input
                  id="lastName"
                  v-model="formData.last_name"
                  type="text"
                  required
                  :disabled="!isEditing"
                  @focus="focusedField = 'lastName'"
                  @blur="focusedField = null"
                  :placeholder="$t('compte.profil.last_name_placeholder')"
                  :class="[
                    'btn-beveled w-full border-2 px-4 py-3 focus:outline-none transition-all duration-200',
                    isEditing
                      ? 'bg-white text-midnight border-concrete focus:ring-2 focus:ring-amber focus:border-amber focus-visible:ring-2 focus-visible:ring-amber'
                      : 'bg-concrete/20 text-midnight/50 border-concrete cursor-not-allowed'
                  ]"
                />
              </div>

              <!-- BirthDate avec Label Flottant -->
              <div class="md:col-span-2">
                <label
                  for="birthDate"
                  class="block font-sora font-semibold text-sm text-midnight mb-2"
                >
                  {{ $t('compte.profil.birth_date') }}
                </label>
                <input
                  id="birthDate"
                  v-model="formData.birth_date"
                  type="date"
                  :disabled="!isEditing"
                  @focus="focusedField = 'birthDate'"
                  @blur="focusedField = null"
                  :class="[
                    'btn-beveled w-full border-2 px-4 py-3 focus:outline-none transition-all duration-200',
                    isEditing
                      ? 'bg-white text-midnight border-concrete focus:ring-2 focus:ring-amber focus:border-amber focus-visible:ring-2 focus-visible:ring-amber'
                      : 'bg-concrete/20 text-midnight/50 border-concrete cursor-not-allowed'
                  ]"
                />
              </div>

              <!-- Phone avec Label Flottant (custom component) -->
              <div class="md:col-span-2">
                <label
                  for="phone"
                  class="block font-sora font-semibold text-sm text-midnight mb-2"
                >
                  {{ $t('compte.profil.phone') }}
                </label>
                <PhoneInput
                  id="phone"
                  v-model="formData.phone"
                  :disabled="!isEditing"
                  @focus="focusedField = 'phone'"
                  @blur="focusedField = null"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- MODE LECTURE : Bouton Modifier + Supprimer mon compte -->
        <div v-if="!isEditing" class="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <button
            type="button"
            @click="enterEditMode"
            class="btn-beveled border-2 border-amber bg-amber text-midnight hover:bg-copper px-6 py-3 font-sora font-semibold uppercase tracking-wide text-sm transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber"
          >
            {{ $t('compte.profil.edit_button') }}
          </button>
          <button
            type="button"
            @click="showDeleteModal = true"
            class="inline-flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 hover:underline font-manrope transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-amber rounded"
          >
            <Trash2 class="h-4 w-4" />
            {{ $t('compte.profil.delete_account') }}
          </button>
        </div>

        <!-- MODE ÉDITION : Enregistrer + Annuler + Supprimer mon compte -->
        <div v-else class="mt-6">
          <div class="flex flex-col sm:flex-row gap-4 mb-4">
            <button
              type="submit"
              :disabled="saving"
              class="btn-beveled border-2 border-amber bg-amber text-midnight hover:bg-copper px-6 py-3 font-sora font-semibold uppercase tracking-wide text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-amber"
            >
              {{ saving ? $t('compte.profil.saving_button') : $t('compte.profil.save_button') }}
            </button>
            <button
              type="button"
              @click="cancelEdit"
              :disabled="saving"
              class="btn-beveled border-2 border-concrete bg-white text-midnight hover:bg-concrete/20 px-6 py-3 font-sora font-semibold uppercase tracking-wide text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-amber"
            >
              {{ $t('compte.profil.cancel_button') }}
            </button>
          </div>
          <button
            type="button"
            @click="showDeleteModal = true"
            class="inline-flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 hover:underline font-manrope transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-amber rounded"
          >
            <Trash2 class="h-4 w-4" />
            {{ $t('compte.profil.delete_account') }}
          </button>
        </div>
      </form>
    </div>

    <SuccessModal
      v-model="showSuccessModal"
      :title="$t('compte.profil.success_title')"
      :message="$t('compte.profil.success_message')"
    />

    <SuccessModal
      v-model="showDeleteSuccessModal"
      :title="$t('compte.profil.delete_success_title')"
      :message="$t('compte.profil.delete_success_message')"
    />

    <ConfirmModal
      v-model="showDeleteModal"
      :title="$t('compte.profil.delete_confirm_title')"
      :message="$t('compte.profil.delete_confirm_message')"
      @confirm="handleDeleteAccount"
    />
  </div>
</template>

<script setup lang="ts">
import type { Tables } from '~/types/database.types'
import { Eye, EyeOff, Trash2 } from 'lucide-vue-next'

definePageMeta({
  layout: "compte",
  middleware: "auth",
})

const PhoneInput = defineAsyncComponent(() => import('~/components/ui/input/PhoneInput.vue'))

const user = useSupabaseUser()
const { fetchProfile, updateProfile, deleteAccount } = useProfile()

const loading = ref(true)
const saving = ref(false)
const isEditing = ref(false)
const showSuccessModal = ref(false)
const showDeleteModal = ref(false)
const showDeleteSuccessModal = ref(false)
const showPassword = ref(false)
const focusedField = ref<string | null>(null)

const formData = reactive({
  first_name: '',
  last_name: '',
  birth_date: '',
  phone: ''
})

const originalData = ref({
  first_name: '',
  last_name: '',
  birth_date: '',
  phone: ''
})

const canSubmit = computed(() => {
  return (
    formData.first_name.trim().length > 0 &&
    formData.last_name.trim().length > 0 &&
    !saving.value
  )
})

const loadProfile = async () => {
  const profile = await fetchProfile()

  if (profile) {
    formData.first_name = profile.first_name || ''
    formData.last_name = profile.last_name || ''
    formData.birth_date = profile.birth_date || ''
    formData.phone = profile.phone || ''

    originalData.value = {
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      birth_date: profile.birth_date || '',
      phone: profile.phone || ''
    }
  }
}

const enterEditMode = () => {
  isEditing.value = true
}

const cancelEdit = () => {
  formData.first_name = originalData.value.first_name
  formData.last_name = originalData.value.last_name
  formData.birth_date = originalData.value.birth_date
  formData.phone = originalData.value.phone
  isEditing.value = false
}

const handleSubmit = async () => {
  saving.value = true

  try {
    const success = await updateProfile({
      first_name: formData.first_name,
      last_name: formData.last_name,
      birth_date: formData.birth_date || null,
      phone: formData.phone || null
    })

    if (success) {
      originalData.value = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        birth_date: formData.birth_date,
        phone: formData.phone
      }
      isEditing.value = false
      showSuccessModal.value = true
    }
  } catch (error) {
    console.error('Profile update error:', error)
  } finally {
    saving.value = false
  }
}

const handleDeleteAccount = async (password: string) => {
  showDeleteModal.value = false
  const success = await deleteAccount()
  if (success) {
    showDeleteSuccessModal.value = true
  }
}

watch(showDeleteSuccessModal, (newValue, oldValue) => {
  if (oldValue === true && newValue === false) {
    navigateTo('/')
  }
})

onMounted(async () => {
  await loadProfile()
  loading.value = false
})
</script>
