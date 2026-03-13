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
      <p class="text-xs font-body tracking-widest uppercase text-midnight/40 mb-4">Inscriptions</p>
      <div class="flex justify-between items-center gap-6">
        <div class="flex gap-8">
          <div>
            <p class="text-2xl font-display font-bold text-emerald-500">+{{ newThisWeek }}</p>
            <p class="text-xs font-body text-midnight/40 mt-0.5">nouveaux</p>
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
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const client = useSupabaseClient()

const loading = ref(true)
const countProducts = ref<number | null>(null)
const countUsers = ref<number | null>(null)
const countOrders = ref<number | null>(null)
const profiles = ref<{ id: string; created_at: string }[]>([])

const newThisWeek = computed(() => {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000
  return profiles.value.filter(p => new Date(p.created_at).getTime() >= cutoff).length
})

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

  loading.value = false
})
</script>
