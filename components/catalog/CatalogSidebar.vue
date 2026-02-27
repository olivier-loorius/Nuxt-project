<template>
  <div class="catalog-sidebar">
    <div class="flex items-center gap-3 mb-6 pb-5 border-b border-concrete">
      <div class="w-0.5 h-4 bg-amber flex-shrink-0"></div>
      <h2 class="text-xs font-display font-bold tracking-[0.25em] uppercase text-midnight">
        {{ $t('catalog.sidebar_title') }}
      </h2>
    </div>
    <button
      class="w-full flex items-center justify-between mb-5 py-2 text-left transition-colors duration-200"
      :class="!activeFilter.categoryId
        ? 'text-amber'
        : 'text-midnight/55 hover:text-midnight'"
      @click="catalogFilter?.setFilter(null, null)"
    >
      <span class="flex items-center gap-2.5">
        <span
          class="w-1 h-1 rounded-full flex-shrink-0 transition-colors duration-200"
          :class="!activeFilter.categoryId ? 'bg-amber' : 'bg-concrete'"
        ></span>
        <span class="text-xs font-display font-bold tracking-[0.08em] uppercase">
          {{ $t('catalog.all_products') }}
        </span>
      </span>
      <span
        class="text-xs font-body tabular-nums transition-colors duration-200"
        :class="!activeFilter.categoryId ? 'text-amber' : 'text-midnight/25'"
      >
        {{ totalProducts }}
      </span>
    </button>
    <AccordionRoot
      type="multiple"
      :default-value="['masturbateurs']"
    >
      <AccordionItem
        v-for="category in categories"
        :key="category.id"
        :value="category.id"
        class="border-b border-concrete last:border-b-0"
      >
        <AccordionHeader class="flex">
          <AccordionTrigger
            class="group flex items-center justify-between w-full py-3.5 text-left focus-visible:outline-none"
            @click="handleCategoryClick(category.id)"
          >
            <span
              class="text-xs font-display font-bold tracking-[0.08em] uppercase transition-colors duration-200 overflow-hidden"
              :class="activeFilter.categoryId === category.id
                ? 'text-amber'
                : 'text-midnight group-hover:text-amber'"
            >
              {{ category.label }}
            </span>
            <span class="flex items-center gap-1.5 flex-shrink-0 ml-2">
              <span
                class="text-xs font-body tabular-nums transition-colors duration-200"
                :class="activeFilter.categoryId === category.id ? 'text-amber' : 'text-midnight/30'"
              >
                {{ category.total }}
              </span>
              <ChevronDown
                :size="13"
                class="transition-transform duration-300 group-data-[state=open]:rotate-180"
                :class="activeFilter.categoryId === category.id
                  ? 'text-amber'
                  : 'text-midnight/40 group-hover:text-amber'"
              />
            </span>
          </AccordionTrigger>
        </AccordionHeader>
        <AccordionContent class="accordion-content overflow-hidden">
          <ul class="pb-4 pt-0.5 space-y-px">
            <li v-for="sub in category.children" :key="sub.id">
              <button
                class="group/item w-full flex items-center justify-between py-2 pl-3 pr-1 text-sm font-body transition-colors duration-200"
                :class="activeFilter.subcategoryId === sub.id
                  ? 'text-amber'
                  : 'text-midnight/55 hover:text-midnight'"
                @click="handleSubcategoryClick(category.id, sub.id)"
              >
                <span class="flex items-center gap-2.5 min-w-0">
                  <span
                    class="w-1 h-1 rounded-full flex-shrink-0 transition-colors duration-200"
                    :class="activeFilter.subcategoryId === sub.id ? 'bg-amber' : 'bg-concrete group-hover/item:bg-midnight/40'"
                  ></span>
                  <span class="truncate">{{ sub.label }}</span>
                </span>
                <span
                  class="text-xs tabular-nums flex-shrink-0 ml-2 transition-colors duration-200"
                  :class="activeFilter.subcategoryId === sub.id ? 'text-amber' : 'text-midnight/25'"
                >
                  {{ sub.count }}
                </span>
              </button>
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </AccordionRoot>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'
import {
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from 'reka-ui'
import { CATALOG_CATEGORIES } from '~/data/categories'
import { MOCK_PRODUCTS } from '~/data/products'
import type { Ref } from 'vue'

const { t } = useI18n()

const totalProducts = MOCK_PRODUCTS.length

const categories = computed(() =>
  CATALOG_CATEGORIES.map(cat => ({
    ...cat,
    label: t(cat.labelKey),
    children: cat.children.map(sub => ({
      ...sub,
      label: t(sub.labelKey),
    })),
  }))
)

interface CatalogFilterInjection {
  activeFilter: Ref<{ categoryId: string | null; subcategoryId: string | null }>
  setFilter: (categoryId: string | null, subcategoryId?: string | null) => void
}

const catalogFilter = inject<CatalogFilterInjection | null>('catalogFilter', null)

const activeFilter = computed(() =>
  catalogFilter?.activeFilter.value ?? { categoryId: null, subcategoryId: null }
)

function handleCategoryClick(categoryId: string) {
  if (!catalogFilter) return
  const { categoryId: activeCat, subcategoryId: activeSub } = catalogFilter.activeFilter.value
  if (activeCat === categoryId && !activeSub) {
    catalogFilter.setFilter(null, null)
  } else {
    catalogFilter.setFilter(categoryId, null)
  }
}

function handleSubcategoryClick(categoryId: string, subcategoryId: string) {
  if (!catalogFilter) return
  const { subcategoryId: activeSub } = catalogFilter.activeFilter.value
  if (activeSub === subcategoryId) {
    catalogFilter.setFilter(categoryId, null)
  } else {
    catalogFilter.setFilter(categoryId, subcategoryId)
  }
}
</script>

<style scoped>
.accordion-content[data-state='open'] {
  animation: accordion-down 280ms cubic-bezier(0.4, 0, 0.2, 1);
}

.accordion-content[data-state='closed'] {
  animation: accordion-up 280ms cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes accordion-down {
  from { height: 0; }
  to   { height: var(--reka-accordion-content-height); }
}

@keyframes accordion-up {
  from { height: var(--reka-accordion-content-height); }
  to   { height: 0; }
}
</style>
