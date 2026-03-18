<template>
  <div>
    <h1 class="text-2xl font-display font-bold text-midnight mb-8">Dashboard</h1>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="bg-white border border-concrete rounded-sm p-6">
        <p class="text-xs font-body tracking-widest uppercase text-midnight/40 mb-2">Produits</p>
        <p class="text-3xl font-display font-bold text-midnight">
          <span v-if="loading" class="inline-block w-12 h-8 bg-concrete animate-pulse rounded-sm" />
          <template v-else>{{ countProducts ?? '—' }}</template>
        </p>
      </div>

      <div class="bg-white border border-concrete rounded-sm p-6">
        <p class="text-xs font-body tracking-widest uppercase text-midnight/40 mb-2">Utilisateurs</p>
        <p class="text-3xl font-display font-bold text-midnight">
          <span v-if="loading" class="inline-block w-12 h-8 bg-concrete animate-pulse rounded-sm" />
          <template v-else>{{ countUsers ?? '—' }}</template>
        </p>
      </div>

      <div class="bg-white border border-concrete rounded-sm p-6">
        <p class="text-xs font-body tracking-widest uppercase text-midnight/40 mb-2">Commandes</p>
        <p class="text-3xl font-display font-bold text-midnight">
          <span v-if="loading" class="inline-block w-12 h-8 bg-concrete animate-pulse rounded-sm" />
          <template v-else>{{ countOrders ?? '—' }}</template>
        </p>
      </div>
    </div>

    <div class="bg-white border border-concrete rounded-sm p-6 mt-6">
      <div class="flex justify-between items-center mb-4">
        <p class="text-xs font-body tracking-widest uppercase text-midnight/40">Inscriptions</p>
        <select
          v-model="period"
          class="text-xs font-body border border-concrete rounded-sm px-2 py-1 text-midnight/60 focus:outline-none bg-white"
        >
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
          <option value="year">Cette année</option>
        </select>
      </div>
      <div class="flex justify-between items-center gap-6">
        <div class="flex gap-8">
          <div>
            <p class="text-2xl font-display font-bold text-emerald-500">+{{ newInPeriod }}</p>
            <p class="text-xs font-body text-midnight/40 mt-0.5">{{ periodLabel }}</p>
          </div>
          <div>
            <p class="text-2xl font-display font-bold text-red-400">0</p>
            <p class="text-xs font-body text-midnight/40 mt-0.5">supprimés</p>
          </div>
        </div>
        <div class="w-64 h-20 flex-shrink-0">
          <AdminUsersChart :profiles="profiles" class="h-full" />
        </div>
      </div>
    </div>

    <div class="bg-white border border-concrete rounded-sm p-6 mt-6">
      <div class="flex justify-between items-center mb-4">
        <p class="text-xs font-body tracking-widest uppercase text-midnight/40">⚠ Stock critique — 5 unités ou moins</p>
        <NuxtLink to="/admin/produits" class="text-xs font-body text-midnight/40 hover:text-midnight transition-colors duration-150">Voir tous</NuxtLink>
      </div>
      <div v-if="loading">
        <div v-for="i in 3" :key="i" class="flex items-center gap-4 bg-chalk rounded-sm p-3 mb-2">
          <div class="w-12 h-12 bg-concrete animate-pulse rounded-sm flex-shrink-0" />
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-concrete animate-pulse rounded-sm" />
            <div class="h-3 bg-concrete animate-pulse rounded-sm w-1/2" />
          </div>
          <div class="w-8 h-8 bg-concrete animate-pulse rounded-sm" />
        </div>
      </div>
      <div v-else-if="!criticalProducts.length" class="py-6 text-center text-xs font-body text-midnight/30">
        Aucun produit en stock critique
      </div>
      <div v-else class="grid grid-cols-2 gap-3">
        <div
          v-for="product in criticalProducts"
          :key="product.id"
          class="flex items-center gap-4 bg-chalk rounded-sm p-3"
        >
          <div class="w-12 h-12 flex-shrink-0 bg-concrete rounded-sm overflow-hidden">
            <img
              v-if="product.images?.[0]"
              :src="product.images[0]"
              class="w-full h-full object-cover"
            >
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-body font-semibold text-midnight truncate">{{ product.name }}</p>
            <p class="text-xs font-body text-midnight/40">{{ $t('catalog.categories.' + product.category_id) }}</p>
          </div>
          <span
            class="text-2xl font-display font-bold tabular-nums flex-shrink-0"
            :class="product.stock === 0 ? 'text-red-400' : 'text-amber'"
          >
            {{ product.stock }}
          </span>
          <NuxtLink
            :to="`/admin/produits?open=${product.id}`"
            class="text-xs font-body border border-concrete px-2 py-1 text-midnight/60 hover:border-midnight hover:text-midnight transition-colors duration-150 flex-shrink-0"
          >
            Modifier
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="bg-white border border-concrete rounded-sm p-6 mt-6">
      <p class="text-xs font-body tracking-widest uppercase text-midnight/40 mb-4">Derniers ajouts</p>
      <div class="grid grid-cols-4 gap-4">
        <template v-if="loading">
          <div v-for="i in 4" :key="i">
            <div class="aspect-square w-full bg-concrete animate-pulse rounded-sm" />
            <div class="h-3 bg-concrete animate-pulse rounded-sm mt-2" />
            <div class="h-3 bg-concrete animate-pulse rounded-sm mt-1 w-2/3" />
          </div>
        </template>
        <template v-else>
          <div v-for="product in latestProducts" :key="product.id">
            <div class="aspect-square w-full bg-concrete rounded-sm overflow-hidden">
              <img
                v-if="product.images?.[0]"
                :src="product.images[0]"
                class="w-full h-full object-cover"
              >
            </div>
            <p class="text-xs font-body text-midnight truncate mt-2">{{ product.name }}</p>
            <p class="text-xs font-body text-midnight/60">{{ formatPrice(product.price) }}</p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  keepalive: true,
})

const client = useSupabaseClient()

const loading = ref(true)
const countProducts = ref<number | null>(null)
const countUsers = ref<number | null>(null)
const countOrders = ref<number | null>(null)
const profiles = ref<{ id: string; created_at: string }[]>([])

interface Product {
  id: string
  name: string
  price: number
  stock: number
  images: string[]
  category_id?: string
  badge?: string | null
}

const criticalProducts = ref<Product[]>([])
const latestProducts = ref<Product[]>([])

const period = ref<'week' | 'month' | 'year'>('week')

const periodLabel = computed(() => {
  if (period.value === 'week') return 'cette semaine'
  if (period.value === 'month') return 'ce mois'
  return 'cette année'
})

const newInPeriod = computed(() => {
  const now = new Date()
  let cutoff: number
  if (period.value === 'week') {
    cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000
  } else if (period.value === 'month') {
    cutoff = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
  } else {
    cutoff = new Date(now.getFullYear(), 0, 1).getTime()
  }
  return profiles.value.filter(p => new Date(p.created_at).getTime() >= cutoff).length
})

async function refreshProducts() {
  const [criticalRes, latestRes] = await Promise.all([
    client.from('products').select('id, name, price, stock, images, category_id').lte('stock', 5).order('stock', { ascending: true }),
    client.from('products').select('id, name, price, stock, images, badge').order('created_at', { ascending: false }).limit(4),
  ])
  criticalProducts.value = (criticalRes.data ?? []) as Product[]
  latestProducts.value = (latestRes.data ?? []) as Product[]
}

onMounted(async () => {
  const [productsRes, ordersRes, profilesRes] = await Promise.all([
    client.from('products' as any).select('*', { count: 'exact', head: true }),
    client.from('orders' as any).select('*', { count: 'exact', head: true }),
    client.from('profiles').select('id, created_at'),
  ])

  countProducts.value = productsRes.error ? 0 : (productsRes.count ?? 0)
  countOrders.value = ordersRes.error ? 0 : (ordersRes.count ?? 0)
  profiles.value = profilesRes.data ?? []
  countUsers.value = profilesRes.error ? null : profiles.value.length

  await refreshProducts()

  loading.value = false
})

onActivated(async () => {
  await refreshProducts()
})

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)
}
</script>
