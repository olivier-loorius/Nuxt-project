<template>
  <div class="bg-white border-2 border-concrete p-8 md:p-10">
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
          class="btn-beveled border-2 border-amber bg-amber text-midnight hover:bg-copper px-6 py-3 font-sora font-semibold uppercase tracking-wide text-sm transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber flex-shrink-0"
        >
          {{ $t('compte.adresses.add_address') }}
        </button>
      </div>
    </div>

    <!-- Addresses List -->
    <div v-if="addresses.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="address in addresses"
        :key="address.id"
        class="btn-beveled border-2 border-concrete p-6 hover:border-amber transition-colors relative"
      >
        <!-- Default Badge -->
        <div
          v-if="address.isDefault"
          class="absolute top-4 right-4 px-3 py-1 bg-amber/20 text-amber text-xs font-medium rounded-full"
        >
          {{ $t('compte.adresses.default') }}
        </div>

        <!-- Address Info -->
        <div class="mb-4 pr-20">
          <h3 class="font-bold text-midnight mb-2">
            {{ address.firstName }} {{ address.lastName }}
          </h3>
          <p class="text-midnight/80 text-sm leading-relaxed">
            {{ address.street }}<br>
            {{ address.zipCode }} {{ address.city }}<br>
            {{ address.country }}
          </p>
          <p v-if="address.phone" class="text-midnight/60 text-sm mt-2">
            {{ address.phone }}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <button
            @click="editAddress(address.id)"
            class="btn-beveled flex-1 border-2 border-amber text-amber hover:bg-amber hover:text-midnight px-4 py-2 font-medium transition-all focus-visible:ring-2 focus-visible:ring-amber"
          >
            {{ $t('compte.adresses.edit') }}
          </button>
          <button
            v-if="!address.isDefault"
            @click="deleteAddress(address.id)"
            class="btn-beveled border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 font-medium transition-all focus-visible:ring-2 focus-visible:ring-red-500"
          >
            {{ $t('compte.adresses.delete') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!showAddForm" class="text-center py-12">
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
          {{ $t('compte.adresses.add_address') }}
        </h2>

        <p class="text-xs text-midnight/60 mb-4">
          {{ $t('compte.adresses.required_fields') }}
        </p>

        <form @submit.prevent="handleSubmitAddress" class="space-y-6">
          <!-- Nom de l'adresse -->
          <div>
            <label class="block font-sora font-semibold text-sm text-midnight mb-2">
              {{ $t('compte.adresses.address_name') }} <span class="text-alert">*</span>
            </label>
            <input
              v-model="formData.addressName"
              type="text"
              required
              placeholder="ex: Maison, Bureau, Appartement"
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
                v-model="formData.firstName"
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
                v-model="formData.lastName"
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
                placeholder="ex: 123 Rue de la Paix"
                class="btn-beveled w-full px-4 py-3 border-2 border-concrete focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
              />
            </div>
            <div class="md:col-span-1">
              <label class="block font-sora font-semibold text-sm text-midnight mb-2">
                {{ $t('compte.adresses.complement') }}
              </label>
              <input
                v-model="formData.complement"
                type="text"
                placeholder="Bât, Étage, Apt, Boîte postale..."
                class="btn-beveled w-full px-4 py-3 border-2 border-concrete focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block font-sora font-semibold text-sm text-midnight mb-2">{{ $t('compte.adresses.zip') }} <span class="text-alert">*</span></label>
              <input
                v-model="formData.zipCode"
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
              class="btn-beveled flex-1 border-2 border-amber bg-amber text-midnight hover:bg-copper px-6 py-3 font-sora font-semibold uppercase tracking-wide text-sm transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber"
            >
              {{ $t('compte.adresses.save') }}
            </button>
            <button
              type="button"
              @click="showAddForm = false"
              class="btn-beveled border-2 border-concrete bg-white text-midnight hover:bg-concrete/20 px-6 py-3 font-sora font-semibold uppercase tracking-wide text-sm transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber"
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
definePageMeta({
  layout: 'compte',
  middleware: 'auth'
})

interface Address {
  id: string
  addressName: string
  firstName: string
  lastName: string
  street: string
  complement?: string
  zipCode: string
  city: string
  country: string
  phone?: string
  isDefault: boolean
}

const addresses = ref<Address[]>([])

const showAddForm = ref(false)
const formData = ref({
  addressName: '',
  firstName: '',
  lastName: '',
  street: '',
  complement: '',
  zipCode: '',
  city: '',
  country: 'France',
  phone: ''
})

const handleSubmitAddress = () => {
  const newAddress: Address = {
    id: Date.now().toString(),
    ...formData.value,
    isDefault: addresses.value.length === 0
  }

  addresses.value.push(newAddress)
  showAddForm.value = false

  formData.value = {
    addressName: '',
    firstName: '',
    lastName: '',
    street: '',
    complement: '',
    zipCode: '',
    city: '',
    country: 'France',
    phone: ''
  }
}

const editAddress = (addressId: string) => {
}

const deleteAddress = (addressId: string) => {
  addresses.value = addresses.value.filter(a => a.id !== addressId)
}
</script>
