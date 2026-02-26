<template>
  <CatalogLayout>

    <template #sidebar>
      <CatalogSidebar />
    </template>

    <template #content>
      <CatalogHeader
        :title="t('pages.nouveautes')"
        :count="filteredProducts.length"
        :sort="currentSort"
        class="mb-8"
        @update:sort="currentSort = $event"
      />
      <CatalogGrid :products="paginatedProducts" />

      <!-- Pagination -->
      <nav
        v-if="totalPages > 1"
        class="mt-14 flex items-center justify-center gap-6"
        aria-label="Pagination"
      >
        <!-- Précédent -->
        <button
          :disabled="currentPage === 1"
          class="font-body text-sm transition-opacity duration-200"
          :class="currentPage === 1 ? 'opacity-20 cursor-not-allowed' : 'opacity-60 hover:opacity-100'"
          @click="goTo(currentPage - 1)"
        >
          ←
        </button>

        <!-- Numéros (desktop uniquement) -->
        <div class="hidden sm:flex items-center gap-5">
          <template v-for="page in pageNumbers" :key="page">
            <span
              v-if="page === '...'"
              class="text-sm font-body text-midnight/30"
            >…</span>
            <button
              v-else
              class="relative pb-1 font-body transition-all duration-200"
              :class="page === currentPage
                ? 'text-base font-bold text-midnight'
                : 'text-sm text-midnight/40 hover:text-midnight/70'"
              @click="goTo(page as number)"
            >
              {{ page }}
              <span
                v-if="page === currentPage"
                class="absolute bottom-0 left-0 right-0 h-[1.5px] bg-amber"
              />
            </button>
          </template>
        </div>

        <!-- Page actuelle / total (mobile uniquement) -->
        <span class="sm:hidden text-sm font-body text-midnight/60 tabular-nums">
          {{ currentPage }} / {{ totalPages }}
        </span>

        <!-- Suivant -->
        <button
          :disabled="currentPage === totalPages"
          class="font-body text-sm transition-opacity duration-200"
          :class="currentPage === totalPages ? 'opacity-20 cursor-not-allowed' : 'opacity-60 hover:opacity-100'"
          @click="goTo(currentPage + 1)"
        >
          →
        </button>
      </nav>
    </template>

  </CatalogLayout>
</template>

<script setup lang="ts">
import { MOCK_PRODUCTS, type MockProduct } from '~/data/products'

const { t } = useI18n()

useSeoMeta({
  title: () => `${t('pages.nouveautes')} — Boys & Toys`,
  description: () => t('pages.nouveautes_description'),
})

// ─── État ─────────────────────────────────────────────────────────────────────

const currentPage = ref(1)
const currentSort = ref('default')

const activeFilter = ref<{ categoryId: string | null; subcategoryId: string | null }>({
  categoryId: null,
  subcategoryId: null,
})

function setFilter(categoryId: string | null, subcategoryId: string | null = null) {
  activeFilter.value = { categoryId, subcategoryId }
  currentPage.value = 1
}

provide('catalogFilter', { activeFilter, setFilter })

watch(currentSort, () => { currentPage.value = 1 })

// ─── Produits filtrés (pour le compteur du header) ────────────────────────────

const filteredProducts = computed<MockProduct[]>(() => {
  const { categoryId, subcategoryId } = activeFilter.value
  if (subcategoryId) return MOCK_PRODUCTS.filter(p => p.subcategoryId === subcategoryId)
  if (categoryId)    return MOCK_PRODUCTS.filter(p => p.categoryId === categoryId)
  return MOCK_PRODUCTS
})

// ─── Pagination ───────────────────────────────────────────────────────────────

const PRODUCTS_PER_PAGE = 15

const totalPages = computed(() =>
  Math.ceil(filteredProducts.value.length / PRODUCTS_PER_PAGE),
)

const paginatedProducts = computed<MockProduct[]>(() => {
  // 1. Filtrer
  const sorted = [...filteredProducts.value]

  // 2. Trier
  switch (currentSort.value) {
    case 'price-asc':  sorted.sort((a, b) => a.price - b.price); break
    case 'price-desc': sorted.sort((a, b) => b.price - a.price); break
    case 'newest':     sorted.sort((a, b) => (b.badge === 'new' ? 1 : 0) - (a.badge === 'new' ? 1 : 0)); break
  }

  // 3. Paginer
  const start = (currentPage.value - 1) * PRODUCTS_PER_PAGE
  return sorted.slice(start, start + PRODUCTS_PER_PAGE)
})

function goTo(page: number) {
  currentPage.value = Math.min(Math.max(1, page), totalPages.value)
}

const pageNumbers = computed<(number | '...')[]>(() => {
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | '...')[] = [1]

  if (current > 3) pages.push('...')

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)

  if (current < total - 2) pages.push('...')

  pages.push(total)
  return pages
})
</script>
