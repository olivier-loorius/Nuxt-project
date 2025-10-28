<template>
  <div class="bg-white rounded-lg shadow-sm p-6 md:p-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-midnight mb-2">
        {{ $t('compte.commandes.title') }}
      </h1>
      <p class="text-midnight/60">
        {{ $t('compte.commandes.subtitle') }}
      </p>
    </div>

    <!-- Orders List -->
    <div v-if="orders.length > 0" class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="border border-concrete rounded-lg p-6 hover:border-amber transition-colors"
      >
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="font-bold text-midnight">
                {{ $t('compte.commandes.order_number') }}{{ order.number }}
              </h3>
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-medium',
                  getStatusClass(order.status)
                ]"
              >
                {{ getStatusLabel(order.status) }}
              </span>
            </div>
            <p class="text-sm text-midnight/60">
              {{ $t('compte.commandes.order_date') }}: {{ formatDate(order.date) }}
            </p>
          </div>

          <div class="flex items-center gap-4">
            <div class="text-right">
              <p class="text-sm text-midnight/60 mb-1">
                {{ $t('compte.commandes.total') }}
              </p>
              <p class="text-xl font-bold text-amber">
                {{ formatPrice(order.total) }}
              </p>
            </div>
            <button
              class="px-4 py-2 border border-amber text-amber rounded-lg font-medium hover:bg-amber hover:text-white transition-all"
            >
              {{ $t('compte.commandes.view_details') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
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
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
      <h3 class="text-xl font-bold text-midnight mb-2">
        {{ $t('compte.commandes.no_orders') }}
      </h3>
      <p class="text-midnight/60 mb-6">
        Découvrez notre collection et passez votre première commande
      </p>
      <NuxtLink
        to="/nouveautes"
        class="inline-block px-6 py-3 bg-amber text-white rounded-lg font-medium hover:bg-amber/90 transition-colors"
      >
        Découvrir nos produits
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'compte',
  middleware: 'auth'
})

interface Order {
  id: string
  number: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
}

// Mock data - à remplacer par des vraies données depuis Supabase
const orders = ref<Order[]>([
  // Exemple de commande - décommenter pour tester l'affichage
  // {
  //   id: '1',
  //   number: 'BT2025-001',
  //   date: '2025-01-15',
  //   status: 'delivered',
  //   total: 89.99
  // }
])

const getStatusClass = (status: Order['status']) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status]
}

const getStatusLabel = (status: Order['status']) => {
  const labels = {
    pending: 'En attente',
    processing: 'En préparation',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée'
  }
  return labels[status]
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}
</script>
