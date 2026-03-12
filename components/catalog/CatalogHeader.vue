<template>
  <div class="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 pb-5 border-b border-concrete">
    <div class="min-w-0">
      <slot name="title">
        <h1 class="text-xl sm:text-2xl font-display font-semibold text-midnight leading-tight">
          {{ title }}
        </h1>
      </slot>
      <p class="mt-1 text-xs font-body text-midnight/40 tracking-wide">
        {{ count }}&nbsp;{{ count === 1 ? $t('catalog.product_one') : $t('catalog.product_other') }}
      </p>
    </div>
    <div class="flex items-center gap-2.5 flex-shrink-0">
      <span class="hidden sm:block text-xs font-display font-medium tracking-[0.18em] uppercase text-midnight/35 select-none">
        {{ $t('catalog.sort_label') }}
      </span>

      <SelectRoot v-model="sortValue" @update:model-value="emit('update:sort', $event)">
        <SelectTrigger
          class="sort-trigger group flex items-center gap-2 border border-concrete bg-chalk text-midnight
                 px-3.5 py-2 text-xs font-display font-medium tracking-[0.12em] uppercase
                 transition-colors duration-200 focus-visible:outline-none
                 hover:border-midnight/40 data-[state=open]:border-amber data-[state=open]:text-amber"
        >
          <SelectValue />
          <SelectIcon>
            <ChevronDown
              :size="12"
              class="text-midnight/40 transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[state=open]:text-amber"
            />
          </SelectIcon>
        </SelectTrigger>

        <SelectPortal>
          <SelectContent
            position="popper"
            :side-offset="6"
            class="sort-content z-50 min-w-[var(--reka-select-trigger-width)] bg-chalk border border-concrete shadow-lg
                   data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95
                   data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
                   data-[side=bottom]:slide-in-from-top-1"
          >
            <SelectViewport class="py-1">
              <SelectItem
                v-for="option in sortOptions"
                :key="option.value"
                :value="option.value"
                class="sort-item group relative flex items-center justify-between gap-4
                       px-3.5 py-2.5 text-xs font-display font-medium tracking-[0.12em] uppercase
                       text-midnight cursor-pointer select-none outline-none
                       data-[highlighted]:bg-midnight data-[highlighted]:text-chalk
                       data-[state=checked]:text-amber"
              >
                <SelectItemText>{{ option.label }}</SelectItemText>
                <SelectItemIndicator>
                  <Check :size="11" class="text-amber group-data-[highlighted]:text-chalk" />
                </SelectItemIndicator>
              </SelectItem>
            </SelectViewport>
          </SelectContent>
        </SelectPortal>
      </SelectRoot>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ChevronDown, Check } from 'lucide-vue-next'
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'

const { t } = useI18n()

const props = defineProps<{
  title?: string
  count?: number
  sort?: string
}>()

const emit = defineEmits<{
  'update:sort': [value: string]
}>()

interface SortOption {
  value: string
  label: string
}

const sortOptions = computed<SortOption[]>(() => [
  { value: 'default',    label: t('catalog.sort_default')    },
  { value: 'price-asc',  label: t('catalog.sort_price_asc')  },
  { value: 'price-desc', label: t('catalog.sort_price_desc') },
  { value: 'newest',     label: t('catalog.sort_newest')     },
  { value: 'popular',    label: t('catalog.sort_popular')    },
])

const sortValue = ref(props.sort ?? 'default')

watch(() => props.sort, (val) => {
  if (val) sortValue.value = val
})
</script>

<style scoped>
.sort-trigger {
  clip-path: polygon(0 5px, 5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%);
}

.sort-content {
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%);
}
</style>
