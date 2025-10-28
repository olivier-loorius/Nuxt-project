<template>
  <div class="bg-white rounded-lg shadow-sm p-6 md:p-8">
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-midnight mb-2">
          {{ $t('compte.adresses.title') }}
        </h1>
        <p class="text-midnight/60">
          {{ $t('compte.adresses.subtitle') }}
        </p>
      </div>
      <button
        @click="showAddForm = true"
        class="px-4 py-2 bg-amber text-white rounded-lg font-medium hover:bg-amber/90 transition-colors"
      >
        {{ $t('compte.adresses.add_address') }}
      </button>
    </div>

    <!-- Addresses List -->
    <div v-if="addresses.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="address in addresses"
        :key="address.id"
        class="border border-concrete rounded-lg p-6 hover:border-amber transition-colors relative"
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
            {{ address.street }}<br />
            {{ address.zipCode }} {{ address.city }}<br />
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
            class="flex-1 px-4 py-2 border border-amber text-amber rounded-lg font-medium hover:bg-amber hover:text-white transition-all"
          >
            {{ $t('compte.adresses.edit') }}
          </button>
          <button
            v-if="!address.isDefault"
            @click="deleteAddress(address.id)"
            class="px-4 py-2 border border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-500 hover:text-white transition-all"
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
        Ajoutez une adresse pour faciliter vos futures commandes
      </p>
      <button
        @click="showAddForm = true"
        class="inline-block px-6 py-3 bg-amber text-white rounded-lg font-medium hover:bg-amber/90 transition-colors"
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
      <div class="bg-white rounded-lg p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 class="text-2xl font-bold text-midnight mb-6">
          {{ $t('compte.adresses.add_address') }}
        </h2>

        <form @submit.prevent="handleSubmitAddress" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-midnight mb-2">
                {{ $t('compte.profil.first_name') }}
              </label>
              <input
                v-model="formData.firstName"
                type="text"
                required
                class="w-full px-4 py-3 border border-concrete rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-midnight mb-2">
                {{ $t('compte.profil.last_name') }}
              </label>
              <input
                v-model="formData.lastName"
                type="text"
                required
                class="w-full px-4 py-3 border border-concrete rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-midnight mb-2">Rue</label>
            <input
              v-model="formData.street"
              type="text"
              required
              class="w-full px-4 py-3 border border-concrete rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-midnight mb-2">Code postal</label>
              <input
                v-model="formData.zipCode"
                type="text"
                required
                class="w-full px-4 py-3 border border-concrete rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-midnight mb-2">Ville</label>
              <input
                v-model="formData.city"
                type="text"
                required
                class="w-full px-4 py-3 border border-concrete rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-midnight mb-2">Pays</label>
            <input
              v-model="formData.country"
              type="text"
              required
              class="w-full px-4 py-3 border border-concrete rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-midnight mb-2">
              {{ $t('compte.profil.phone') }}
            </label>
            <input
              v-model="formData.phone"
              type="tel"
              class="w-full px-4 py-3 border border-concrete rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
            />
          </div>

          <div class="flex gap-4 pt-4">
            <button
              type="submit"
              class="flex-1 px-6 py-3 bg-amber text-white rounded-lg font-medium hover:bg-amber/90 transition-colors"
            >
              {{ $t('compte.profil.save') }}
            </button>
            <button
              type="button"
              @click="showAddForm = false"
              class="px-6 py-3 border border-concrete text-midnight rounded-lg font-medium hover:bg-concrete/30 transition-colors"
            >
              {{ $t('compte.profil.cancel') }}
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
  firstName: string
  lastName: string
  street: string
  zipCode: string
  city: string
  country: string
  phone?: string
  isDefault: boolean
}

// Mock data - à remplacer par des vraies données depuis Supabase
const addresses = ref<Address[]>([
  // Exemple d'adresse - décommenter pour tester l'affichage
  // {
  //   id: '1',
  //   firstName: 'Jean',
  //   lastName: 'Dupont',
  //   street: '123 Rue de la Paix',
  //   zipCode: '75001',
  //   city: 'Paris',
  //   country: 'France',
  //   phone: '+33 6 12 34 56 78',
  //   isDefault: true
  // }
])

const showAddForm = ref(false)
const formData = ref({
  firstName: '',
  lastName: '',
  street: '',
  zipCode: '',
  city: '',
  country: 'France',
  phone: ''
})

const handleSubmitAddress = () => {
  // TODO: Sauvegarder dans Supabase
  const newAddress: Address = {
    id: Date.now().toString(),
    ...formData.value,
    isDefault: addresses.value.length === 0
  }

  addresses.value.push(newAddress)
  showAddForm.value = false

  // Reset form
  formData.value = {
    firstName: '',
    lastName: '',
    street: '',
    zipCode: '',
    city: '',
    country: 'France',
    phone: ''
  }
}

const editAddress = (addressId: string) => {
  // TODO: Implémenter l'édition
  console.log('Edit address:', addressId)
}

const deleteAddress = (addressId: string) => {
  addresses.value = addresses.value.filter(a => a.id !== addressId)
  // TODO: Supprimer de Supabase
}
</script>
