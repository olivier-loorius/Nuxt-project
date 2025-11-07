<template>
  <div class="bg-white border-2 border-concrete p-8 md:p-10">
    <!-- Success Modal -->
    <SuccessModal
      v-model="showSuccessModal"
      :title="successModal.title"
      :message="successModal.message"
    />

    <!-- Error Modal -->
    <AlertModal
      v-model="showErrorModal"
      :title="$t('compte.adresses.error_title')"
      :message="errorModalMessage"
    />

    <!-- Header -->
    <div class="mb-10 border-l-4 border-amber pl-6">
      <div class="flex items-center justify-between gap-6">
        <div>
          <h1 class="text-3xl font-bold text-midnight tracking-tight mb-2 uppercase">
            {{ $t('compte.adresses.title') }}
          </h1>
          <p class="text-midnight/60">
            {{ $t('compte.adresses.subtitle') }}
          </p>
        </div>
        <button
          @click="showAddForm = true"
          :disabled="loading"
          class="btn-beveled border-2 border-amber bg-amber text-midnight hover:bg-copper px-6 py-3 font-sora font-semibold uppercase tracking-wide text-sm transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ $t('compte.adresses.add_address') }}
        </button>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading && addresses.length === 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="i in 2"
        :key="i"
        class="btn-beveled border-2 border-concrete p-6 animate-pulse"
      >
        <div class="mb-4">
          <div class="h-4 bg-concrete/30 rounded w-32 mb-3"></div>
          <div class="space-y-2">
            <div class="h-3 bg-concrete/30 rounded w-full"></div>
            <div class="h-3 bg-concrete/30 rounded w-3/4"></div>
          </div>
        </div>
        <div class="flex gap-3">
          <div class="h-10 bg-concrete/30 rounded flex-1"></div>
          <div class="h-10 bg-concrete/30 rounded flex-1"></div>
        </div>
      </div>
    </div>

    <!-- Addresses List -->
    <div v-else-if="addresses.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="address in addresses"
        :key="address.id"
        class="btn-beveled border-2 border-concrete p-6 hover:border-amber transition-colors relative"
      >
        <!-- Default Badge -->
        <div
          v-if="address.is_default"
          class="absolute top-4 right-4 px-3 py-1 bg-amber/20 text-amber text-xs font-medium rounded-full"
        >
          {{ $t('compte.adresses.default') }}
        </div>

        <!-- Address Info -->
        <div class="mb-4 pr-20">
          <h3 class="font-bold text-midnight mb-3">
            {{ address.type }}
          </h3>
          <p class="text-midnight/80 text-sm leading-relaxed">
            {{ address.street }}<br>
            <span v-if="address.street_complement">{{ address.street_complement }}<br></span>
            {{ address.postal_code }} {{ address.city }}<br>
            {{ address.country }}
          </p>
          <p v-if="address.phone" class="text-midnight/60 text-sm mt-2">
            {{ address.phone }}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex flex-col gap-2">
          <button
            @click="editAddress(address.id)"
            :disabled="loading"
            class="btn-beveled border-2 border-amber text-amber hover:bg-amber hover:text-midnight px-4 py-2 font-medium transition-all focus-visible:ring-2 focus-visible:ring-amber disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ $t('compte.adresses.edit') }}
          </button>
          <button
            v-if="!address.is_default"
            type="button"
            @click="deleteAddress(address.id)"
            :disabled="loading"
            class="inline-flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 hover:underline font-manrope transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-amber rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 class="h-4 w-4" />
            {{ $t('compte.adresses.delete') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!showAddForm && !loading" class="text-center py-12">
      <svg
        class="w-24 h-24 mx-auto text-midnight/20 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
      <h3 class="text-xl font-bold text-midnight mb-2">
        {{ $t('compte.adresses.no_addresses') }}
      </h3>
      <p class="text-midnight/60 mb-6">
        {{ $t('compte.adresses.empty_hint') }}
      </p>
      <button
        @click="showAddForm = true"
        class="btn-beveled border-2 border-amber bg-amber text-midnight hover:bg-copper px-6 py-3 font-sora font-semibold uppercase tracking-wide text-sm transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber"
      >
        {{ $t('compte.adresses.add_address') }}
      </button>
    </div>

    <!-- Add/Edit Form (Modal) -->
    <div
      v-if="showAddForm"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="showAddForm = false"
    >
      <div class="bg-white border-2 border-concrete p-8 md:p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          type="button"
          @click="showAddForm = false"
          class="absolute top-4 right-4 text-midnight/50 hover:text-midnight transition-colors focus-visible:ring-2 focus-visible:ring-amber rounded p-1"
          aria-label="Fermer"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 class="text-2xl font-bold text-midnight mb-6 font-sora pr-8">
          {{ isEditing ? 'Modifier l\'adresse' : $t('compte.adresses.add_address') }}
        </h2>

        <p class="text-xs text-midnight/60 mb-4">
          {{ $t('compte.adresses.required_fields') }}
        </p>

        <form @submit.prevent="handleSubmitAddress" class="space-y-6">
          <!-- Type d'adresse (Nom de l'adresse) -->
          <div>
            <label class="block font-sora font-semibold text-sm text-midnight mb-2">
              {{ $t('compte.adresses.address_name') }} <span class="text-alert">*</span>
            </label>
            <input
              v-model="formData.type"
              type="text"
              required
              :placeholder="$t('compte.adresses.placeholder_name')"
              class="btn-beveled w-full px-4 py-3 border-2 border-concrete focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
            />
          </div>

          <!-- Prénom et Nom -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block font-sora font-semibold text-sm text-midnight mb-2">
                {{ $t('compte.profil.first_name') }} <span class="text-alert">*</span>
              </label>
              <input
                v-model="formData.first_name"
                type="text"
                required
                class="btn-beveled w-full px-4 py-3 border-2 border-concrete focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
              />
            </div>
            <div>
              <label class="block font-sora font-semibold text-sm text-midnight mb-2">
                {{ $t('compte.profil.last_name') }} <span class="text-alert">*</span>
              </label>
              <input
                v-model="formData.last_name"
                type="text"
                required
                class="btn-beveled w-full px-4 py-3 border-2 border-concrete focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
              />
            </div>
          </div>

          <!-- Adresse et Complément -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-1">
              <label class="block font-sora font-semibold text-sm text-midnight mb-2">
                {{ $t('compte.adresses.street') }} <span class="text-alert">*</span>
              </label>
              <input
                v-model="formData.street"
                type="text"
                required
                :placeholder="$t('compte.adresses.placeholder_street')"
                class="btn-beveled w-full px-4 py-3 border-2 border-concrete focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
              />
            </div>
            <div class="md:col-span-1">
              <label class="block font-sora font-semibold text-sm text-midnight mb-2">
                {{ $t('compte.adresses.complement') }}
              </label>
              <input
                v-model="formData.street_complement"
                type="text"
                :placeholder="$t('compte.adresses.placeholder_complement')"
                class="btn-beveled w-full px-4 py-3 border-2 border-concrete focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block font-sora font-semibold text-sm text-midnight mb-2">{{ $t('compte.adresses.zip') }} <span class="text-alert">*</span></label>
              <input
                v-model="formData.postal_code"
                type="text"
                required
                class="btn-beveled w-full px-4 py-3 border-2 border-concrete focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
              />
            </div>
            <div>
              <label class="block font-sora font-semibold text-sm text-midnight mb-2">{{ $t('compte.adresses.city') }} <span class="text-alert">*</span></label>
              <input
                v-model="formData.city"
                type="text"
                required
                class="btn-beveled w-full px-4 py-3 border-2 border-concrete focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
              />
            </div>
          </div>

          <div>
            <label class="block font-sora font-semibold text-sm text-midnight mb-2">{{ $t('compte.adresses.country') }} <span class="text-alert">*</span></label>
            <input
              v-model="formData.country"
              type="text"
              required
              class="btn-beveled w-full px-4 py-3 border-2 border-concrete focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
            />
          </div>

          <!-- Téléphone alternatif -->
          <div>
            <label class="block font-sora font-semibold text-sm text-midnight mb-2">
              {{ $t('compte.adresses.alt_phone') }}
            </label>
            <input
              v-model="formData.phone"
              type="tel"
              placeholder="Optionnel"
              class="btn-beveled w-full px-4 py-3 border-2 border-concrete focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
            />
            <p class="text-xs text-midnight/50 mt-1">
              {{ $t('compte.adresses.phone_help') }}
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              :disabled="loading"
              class="btn-beveled flex-1 border-2 border-amber bg-amber text-midnight hover:bg-copper px-6 py-3 font-sora font-semibold uppercase tracking-wide text-sm transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? (isEditing ? 'Mise à jour...' : 'Création...') : $t('compte.adresses.save') }}
            </button>
            <button
              type="button"
              @click="showAddForm = false"
              :disabled="loading"
              class="btn-beveled border-2 border-concrete bg-white text-midnight hover:bg-concrete/20 px-6 py-3 font-sora font-semibold uppercase tracking-wide text-sm transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ $t('compte.adresses.cancel') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Trash2 } from 'lucide-vue-next'
import { useAddresses } from '~/composables/useAddresses'
import SuccessModal from '~/components/SuccessModal.vue'
import AlertModal from '~/components/AlertModal.vue'

definePageMeta({
  layout: 'compte',
  middleware: 'auth'
})

const { t } = useI18n()

interface Address {
  id: string
  user_id: string
  type: string
  first_name?: string // From form, not stored in DB
  last_name?: string // From form, not stored in DB
  street: string
  street_complement?: string
  postal_code: string
  city: string
  country: string
  phone?: string
  is_default: boolean
  created_at: string
  updated_at: string
}

const { fetchAddresses, createAddress, updateAddress, deleteAddress: deleteAddressApi } = useAddresses()

// États
const addresses = ref<Address[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const showAddForm = ref(false)
const isEditing = ref(false)
const editingAddressId = ref<string | null>(null)

// États des modales
const showSuccessModal = ref(false)
const successModal = ref({
  title: '',
  message: ''
})
const showErrorModal = ref(false)
const errorModalMessage = ref('')

const formData = ref({
  type: '',
  first_name: '',
  last_name: '',
  street: '',
  street_complement: '',
  postal_code: '',
  city: '',
  country: 'France',
  phone: ''
})

const resetForm = () => {
  formData.value = {
    type: '',
    first_name: '',
    last_name: '',
    street: '',
    street_complement: '',
    postal_code: '',
    city: '',
    country: 'France',
    phone: ''
  }
  isEditing.value = false
  editingAddressId.value = null
}

/**
 * Affiche la modale de succès
 */
const showSuccess = (titleKey: string, messageKey: string) => {
  successModal.value = {
    title: t(titleKey),
    message: t(messageKey)
  }
  showSuccessModal.value = true
}

/**
 * Affiche la modale d'erreur
 */
const showErrorAlert = (message: string) => {
  errorModalMessage.value = message || t('compte.adresses.error_message')
  showErrorModal.value = true
}

/**
 * Charge les adresses depuis Supabase au montage
 */
const loadAddresses = async () => {
  loading.value = true
  error.value = null
  const { data, error: fetchError } = await fetchAddresses()

  if (fetchError) {
    error.value = fetchError
    console.error('Erreur lors du chargement des adresses:', fetchError)
  } else if (data) {
    addresses.value = data
  }

  loading.value = false
}

onMounted(() => {
  loadAddresses()
})

/**
 * Crée ou met à jour une adresse
 */
const handleSubmitAddress = async () => {
  // Validation basique
  if (!formData.value.type || !formData.value.first_name || !formData.value.last_name || !formData.value.street || !formData.value.postal_code || !formData.value.city || !formData.value.country) {
    showErrorAlert('Veuillez remplir tous les champs obligatoires')
    return
  }

  loading.value = true

  try {
    if (isEditing.value && editingAddressId.value) {
      // Mise à jour
      const { data, error: updateError } = await updateAddress(editingAddressId.value, {
        type: formData.value.type,
        first_name: formData.value.first_name,
        last_name: formData.value.last_name,
        street: formData.value.street,
        street_complement: formData.value.street_complement || undefined,
        postal_code: formData.value.postal_code,
        city: formData.value.city,
        country: formData.value.country,
        phone: formData.value.phone || undefined
      })

      if (updateError) {
        showErrorAlert(updateError)
        console.error('Erreur lors de la mise à jour:', updateError)
      } else if (data) {
        // Remplace l'adresse mise à jour dans la liste
        const index = addresses.value.findIndex(a => a.id === editingAddressId.value)
        if (index !== -1) {
          addresses.value[index] = data
        }
        showAddForm.value = false
        resetForm()
        showSuccess('compte.adresses.success_update_title', 'compte.adresses.success_update_message')
      }
    } else {
      // Création
      const { data, error: createError } = await createAddress({
        type: formData.value.type,
        first_name: formData.value.first_name,
        last_name: formData.value.last_name,
        street: formData.value.street,
        street_complement: formData.value.street_complement || undefined,
        postal_code: formData.value.postal_code,
        city: formData.value.city,
        country: formData.value.country,
        phone: formData.value.phone || undefined
      })

      if (createError) {
        showErrorAlert(createError)
        console.error('Erreur lors de la création:', createError)
      } else if (data) {
        addresses.value.push(data)
        showAddForm.value = false
        resetForm()
        showSuccess('compte.adresses.success_create_title', 'compte.adresses.success_create_message')
      }
    }
  } finally {
    loading.value = false
  }
}

/**
 * Ouvre le formulaire pour éditer une adresse
 */
const editAddress = (addressId: string) => {
  const address = addresses.value.find(a => a.id === addressId)
  if (!address) return

  formData.value = {
    type: address.type,
    first_name: address.first_name,
    last_name: address.last_name,
    street: address.street,
    street_complement: address.street_complement || '',
    postal_code: address.postal_code,
    city: address.city,
    country: address.country,
    phone: address.phone || ''
  }

  isEditing.value = true
  editingAddressId.value = addressId
  showAddForm.value = true
}

/**
 * Supprime une adresse
 */
const deleteAddress = async (addressId: string) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) {
    return
  }

  loading.value = true

  const { error: deleteError } = await deleteAddressApi(addressId)

  if (deleteError) {
    showErrorAlert(deleteError)
    console.error('Erreur lors de la suppression:', deleteError)
  } else {
    addresses.value = addresses.value.filter(a => a.id !== addressId)
    showSuccess('compte.adresses.success_delete_title', 'compte.adresses.success_delete_message')
  }

  loading.value = false
}

</script>
