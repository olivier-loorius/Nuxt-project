<template>
  <div class="min-h-screen bg-chalk py-12">
    <div class="container max-w-4xl mx-auto p-8">
      <h1 class="text-3xl font-sora font-bold text-midnight mb-8">Commande</h1>

      <section class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-2xl font-sora font-semibold text-midnight mb-6">Adresse de livraison</h2>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-sora font-semibold mb-2 text-midnight">
                Prénom
              </label>
              <input
                id="firstName"
                v-model="formData.firstName"
                type="text"
                required
                class="btn-beveled w-full px-4 py-3 border-2 border-concrete bg-white focus:border-amber focus:ring-2 focus:ring-amber/20 font-manrope text-midnight placeholder:text-midnight/40 transition-all duration-300 outline-none"
                placeholder="Jean"
              />
            </div>

            <div>
              <label for="lastName" class="block text-sm font-sora font-semibold mb-2 text-midnight">
                Nom
              </label>
              <input
                id="lastName"
                v-model="formData.lastName"
                type="text"
                required
                class="btn-beveled w-full px-4 py-3 border-2 border-concrete bg-white focus:border-amber focus:ring-2 focus:ring-amber/20 font-manrope text-midnight placeholder:text-midnight/40 transition-all duration-300 outline-none"
                placeholder="Dupont"
              />
            </div>
          </div>

          <div>
            <label for="phone" class="block text-sm font-sora font-semibold mb-2 text-midnight">
              Téléphone
            </label>
            <input
              id="phone"
              v-model="formData.phone"
              type="tel"
              required
              class="btn-beveled w-full px-4 py-3 border-2 border-concrete bg-white focus:border-amber focus:ring-2 focus:ring-amber/20 font-manrope text-midnight placeholder:text-midnight/40 transition-all duration-300 outline-none"
              placeholder="+33 6 12 34 56 78"
            />
          </div>

          <div>
            <label for="address" class="block text-sm font-sora font-semibold mb-2 text-midnight">
              Adresse
            </label>
            <input
              id="address"
              v-model="formData.address"
              type="text"
              required
              class="btn-beveled w-full px-4 py-3 border-2 border-concrete bg-white focus:border-amber focus:ring-2 focus:ring-amber/20 font-manrope text-midnight placeholder:text-midnight/40 transition-all duration-300 outline-none"
              placeholder="123 rue de la Paix"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="city" class="block text-sm font-sora font-semibold mb-2 text-midnight">
                Ville
              </label>
              <input
                id="city"
                v-model="formData.city"
                type="text"
                required
                class="btn-beveled w-full px-4 py-3 border-2 border-concrete bg-white focus:border-amber focus:ring-2 focus:ring-amber/20 font-manrope text-midnight placeholder:text-midnight/40 transition-all duration-300 outline-none"
                placeholder="Paris"
              />
            </div>

            <div>
              <label for="postalCode" class="block text-sm font-sora font-semibold mb-2 text-midnight">
                Code postal
              </label>
              <input
                id="postalCode"
                v-model="formData.postalCode"
                type="text"
                required
                class="btn-beveled w-full px-4 py-3 border-2 border-concrete bg-white focus:border-amber focus:ring-2 focus:ring-amber/20 font-manrope text-midnight placeholder:text-midnight/40 transition-all duration-300 outline-none"
                placeholder="75001"
              />
            </div>
          </div>

          <div>
            <label for="country" class="block text-sm font-sora font-semibold mb-2 text-midnight">
              Pays
            </label>
            <input
              id="country"
              v-model="formData.country"
              type="text"
              required
              class="btn-beveled w-full px-4 py-3 border-2 border-concrete bg-white focus:border-amber focus:ring-2 focus:ring-amber/20 font-manrope text-midnight placeholder:text-midnight/40 transition-all duration-300 outline-none"
              placeholder="France"
            />
          </div>

          <div class="flex items-center gap-2">
            <input
              id="saveToProfile"
              v-model="saveToProfile"
              type="checkbox"
              class="w-4 h-4 accent-amber cursor-pointer"
            />
            <label for="saveToProfile" class="text-sm font-manrope text-midnight cursor-pointer">
              Sauvegarder ces informations dans mon profil
            </label>
          </div>

          <div v-if="error" class="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <p class="text-sm text-red-600 font-manrope">{{ error }}</p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="btn-beveled w-full px-6 py-3 border-2 border-amber bg-amber text-midnight font-sora font-semibold hover:bg-copper disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {{ loading ? 'Enregistrement...' : 'Continuer vers le paiement' }}
          </button>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ShippingInfo } from '~/types/checkout'

definePageMeta({
  middleware: 'auth'
})

const user = useSupabaseUser()
const { saveShippingInfo } = useCheckout()

const formData = reactive<ShippingInfo>({
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  country: 'France'
})

const saveToProfile = ref(false)
const sameAsBilling = ref(true)
const loading = ref(false)
const error = ref<string | null>(null)

const handleSubmit = async () => {
  error.value = null
  loading.value = true

  try {
    const result = await saveShippingInfo({
      ...formData,
      saveToProfile: saveToProfile.value
    })

    if (result.success) {
      
      await navigateTo('/checkout/payment')
    } else {
      error.value = result.error
    }
  } catch (err: any) {
    error.value = err.message || 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}

watchEffect(() => {
  if (!user.value) {
  }
})
</script>
