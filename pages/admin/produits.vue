<template>
  <div>
    <h1 class="text-2xl font-display font-bold text-midnight mb-6">Produits</h1>

    <div class="border-b border-concrete mb-6 flex gap-6">
      <button
        class="pb-3 text-sm font-body transition-colors duration-150"
        :class="activeTab === 'liste' ? 'border-b-2 border-midnight text-midnight font-semibold' : 'text-midnight/40 hover:text-midnight'"
        @click="activeTab = 'liste'"
      >
        Liste
      </button>
      <button
        class="pb-3 text-sm font-body transition-colors duration-150"
        :class="activeTab === 'ajouter' ? 'border-b-2 border-midnight text-midnight font-semibold' : 'text-midnight/40 hover:text-midnight'"
        @click="activeTab = 'ajouter'"
      >
        Ajouter un produit
      </button>
    </div>

    <template v-if="activeTab === 'liste'">
    <div class="flex flex-wrap gap-2 mb-4">
      <button
        class="text-xs font-body px-3 py-1.5 transition-colors duration-150"
        :class="selectedCategory === 'all' ? 'bg-midnight text-chalk' : 'border border-concrete text-midnight/60 hover:border-midnight'"
        @click="selectedCategory = 'all'"
      >
        Tous
      </button>
      <button
        v-for="cat in categories"
        :key="cat"
        class="text-xs font-body px-3 py-1.5 transition-colors duration-150"
        :class="selectedCategory === cat ? 'bg-midnight text-chalk' : 'border border-concrete text-midnight/60 hover:border-midnight'"
        @click="selectedCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <div class="mb-4">
      <input
        v-model="search"
        type="text"
        placeholder="Rechercher par nom ou catégorie…"
        class="w-full max-w-sm px-4 py-2 text-sm font-body border border-concrete rounded-sm bg-white text-midnight placeholder:text-midnight/30 focus:outline-none focus:border-midnight transition-colors duration-150"
      >
    </div>

    <div class="bg-white border border-concrete rounded-sm overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-concrete">
            <th class="text-left px-4 py-3 text-xs font-body tracking-widest uppercase text-midnight/40 font-normal">Nom</th>
            <th class="text-left px-4 py-3 text-xs font-body tracking-widest uppercase text-midnight/40 font-normal">Catégorie</th>
            <th class="text-left px-4 py-3 text-xs font-body tracking-widest uppercase text-midnight/40 font-normal">Prix</th>
            <th class="text-left px-4 py-3 text-xs font-body tracking-widest uppercase text-midnight/40 font-normal">Stock</th>
            <th class="text-left px-4 py-3 text-xs font-body tracking-widest uppercase text-midnight/40 font-normal">Badge</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="loading">
            <tr v-for="i in 5" :key="i" class="border-b border-concrete last:border-0">
              <td v-for="col in 5" :key="col" class="px-4 py-4">
                <div class="h-4 bg-concrete animate-pulse rounded-sm" :class="col === 5 ? 'w-16' : 'w-full'" />
              </td>
            </tr>
          </template>
          <template v-else>
            <tr
              v-for="product in paginatedProducts"
              :key="product.id"
              class="border-b border-concrete last:border-0 hover:bg-chalk/50 transition-colors duration-150 cursor-pointer"
              @click="openPanel(product)"
            >
              <td class="px-4 py-4 font-body text-midnight">{{ product.name }}</td>
              <td class="px-4 py-4 font-body text-midnight/60 text-xs">{{ product.category_id }}</td>
              <td class="px-4 py-4 font-body text-midnight tabular-nums">{{ formatPrice(product.price) }}</td>
              <td class="px-4 py-4">
                <span
                  class="inline-block text-xs font-body tabular-nums"
                  :class="product.stock > 3 ? 'text-midnight' : product.stock > 0 ? 'text-amber' : 'text-red-400'"
                >
                  {{ product.stock }}
                </span>
              </td>
              <td class="px-4 py-4">
                <span
                  v-if="product.badge"
                  class="inline-block px-2 py-0.5 text-[10px] font-display font-semibold tracking-[0.15em] uppercase"
                  :style="{ backgroundColor: BADGES.find(b => b.value === product.badge)?.bg ?? '#F5F3F0', color: BADGES.find(b => b.value === product.badge)?.text ?? '#1A1D2E' }"
                >
                  {{ product.badge }}
                </span>
                <span v-else class="text-midnight/20 text-xs">—</span>
              </td>
            </tr>
            <tr v-if="!filteredProducts.length">
              <td colspan="5" class="px-4 py-12 text-center text-sm font-body text-midnight/30">
                Aucun produit trouvé
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <AdminProductPanel v-model="panelOpen" :product="selectedProduct" @saved="onProductSaved" @deleted="onProductDeleted" />

    <div v-if="totalPages > 1" class="flex items-center justify-between mt-4">
      <button
        class="text-xs font-body border border-concrete px-4 py-2 text-midnight/60 hover:border-midnight hover:text-midnight transition-colors duration-150 disabled:opacity-30 disabled:pointer-events-none"
        :disabled="page === 1"
        @click="page--"
      >
        Précédent
      </button>
      <span class="text-xs font-body text-midnight/40">Page {{ page }} sur {{ totalPages }}</span>
      <button
        class="text-xs font-body border border-concrete px-4 py-2 text-midnight/60 hover:border-midnight hover:text-midnight transition-colors duration-150 disabled:opacity-30 disabled:pointer-events-none"
        :disabled="page === totalPages"
        @click="page++"
      >
        Suivant
      </button>
    </div>
    </template>

    <AdminProductForm
      v-else
      :product="null"
      @saved="onProductCreated"
      @cancelled="activeTab = 'liste'"
    />
  </div>
</template>

<script setup lang="ts">
import { BADGES } from '~/composables/useBadges'

definePageMeta({
  layout: 'admin',
})

interface Product {
  id: string
  name: string
  price: number
  badge: string | null
  stock: number
  category_id: string
  subcategory_id: string
  images: string[]
}

const client = useSupabaseClient()

const PAGE_SIZE = 20

const products = ref<Product[]>([])
const loading = ref(true)
const search = ref('')
const selectedCategory = ref('all')
const page = ref(1)
const activeTab = ref<'liste' | 'ajouter'>('liste')
const panelOpen = ref(false)
const selectedProduct = ref<Product | null>(null)

const categories = computed(() => [...new Set(products.value.map(p => p.category_id))])

const filteredProducts = computed(() => {
  const q = search.value.trim().toLowerCase()
  return products.value.filter(p => {
    if (selectedCategory.value !== 'all' && p.category_id !== selectedCategory.value) return false
    if (q && ![p.name, p.category_id].some(v => v.toLowerCase().includes(q))) return false
    return true
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredProducts.value.length / PAGE_SIZE)))

const paginatedProducts = computed(() => {
  const start = (page.value - 1) * PAGE_SIZE
  return filteredProducts.value.slice(start, start + PAGE_SIZE)
})

watch([search, selectedCategory], () => { page.value = 1 })

onMounted(async () => {
  const { data } = await client
    .from('products')
    .select('id, name, price, badge, stock, category_id, subcategory_id, images')
    .order('category_id')
    .order('name')

  products.value = data ?? []
  loading.value = false
})

async function onProductCreated() {
  activeTab.value = 'liste'
  loading.value = true
  const { data } = await client
    .from('products')
    .select('id, name, price, badge, stock, category_id, subcategory_id, images')
    .order('category_id')
    .order('name')
  products.value = data ?? []
  loading.value = false
}

function openPanel(product: Product) {
  selectedProduct.value = product
  panelOpen.value = true
}

function onProductSaved(updated: Product) {
  const target = products.value.find(p => p.id === updated.id)
  if (target) Object.assign(target, updated)
}

function onProductDeleted() {
  if (selectedProduct.value) {
    products.value = products.value.filter(p => p.id !== selectedProduct.value!.id)
  }
  panelOpen.value = false
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)
}
</script>
