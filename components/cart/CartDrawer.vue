<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 bg-midnight/50 z-[70]"
        @click="$emit('update:modelValue', false)"
      />
    </Transition>

    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="modelValue"
        class="fixed top-0 right-0 h-full w-full sm:w-80 bg-chalk z-[80] flex flex-col shadow-2xl"
      >
        <div class="flex items-center justify-between px-5 py-4 border-b border-concrete flex-shrink-0">
          <div>
            <p class="font-display font-bold text-midnight text-sm tracking-tight">
              Mon panier
            </p>
            <p class="text-[10px] font-body text-midnight/40 mt-0.5 tabular-nums">
              {{ cartCount }} {{ cartCount > 1 ? 'articles' : 'article' }}
            </p>
          </div>
          <button
            class="icon-btn"
            aria-label="Fermer le panier"
            @click="$emit('update:modelValue', false)"
          >
            <X :size="18" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto py-3">
          <div
            v-if="!cartProducts.length"
            class="flex flex-col items-center justify-center gap-3 h-full py-16 text-center px-6"
          >
            <ShoppingCart :size="32" class="text-concrete" />
            <p class="text-xs font-display font-medium uppercase tracking-[0.18em] text-midnight/35">
              Votre panier est vide
            </p>
          </div>

          <ul v-else class="divide-y divide-concrete">
            <li
              v-for="item in cartProducts"
              :key="item.product_id"
              class="flex items-center gap-3 px-4 py-3 hover:bg-midnight/3 transition-colors duration-150"
            >
              <div
                class="flex-shrink-0 w-14 h-14 flex items-center justify-center"
                :class="drawerBg(item.product_id)"
              >
                <ImageIcon :size="18" class="text-midnight/15" />
              </div>

              <div class="flex-1 min-w-0">
                <p class="font-display font-medium text-midnight text-xs leading-snug line-clamp-2">
                  {{ item.product?.name ?? item.product_id }}
                </p>
                <p class="font-body text-xs text-midnight/50 mt-0.5 tabular-nums">
                  {{ formatPrice(item.product?.price ?? 0) }} / unité
                </p>
                <div class="flex items-center gap-2 mt-2">
                  <button
                    class="w-5 h-5 flex items-center justify-center border border-concrete text-midnight/50 hover:border-amber hover:text-amber transition-colors duration-200"
                    aria-label="Diminuer la quantité"
                    @click="updateQuantity(item.product_id, item.quantity - 1)"
                  >
                    <Minus :size="10" />
                  </button>
                  <span class="font-body text-xs text-midnight tabular-nums w-4 text-center">
                    {{ item.quantity }}
                  </span>
                  <button
                    class="w-5 h-5 flex items-center justify-center border border-concrete text-midnight/50 hover:border-amber hover:text-amber transition-colors duration-200"
                    aria-label="Augmenter la quantité"
                    @click="updateQuantity(item.product_id, item.quantity + 1)"
                  >
                    <Plus :size="10" />
                  </button>
                  <span class="ml-auto font-display font-semibold text-xs text-amber tabular-nums">
                    {{ formatPrice((item.product?.price ?? 0) * item.quantity) }}
                  </span>
                </div>
              </div>

              <button
                class="flex-shrink-0 p-1.5 text-midnight/30 hover:text-[#EF4444] transition-colors duration-200"
                aria-label="Supprimer l'article"
                @click="removeFromCart(item.product_id)"
              >
                <Trash2 :size="14" />
              </button>
            </li>
          </ul>
        </div>

        <div v-if="cartProducts.length" class="flex-shrink-0 px-4 py-4 border-t border-concrete space-y-3">
          <div class="flex items-center justify-between py-1">
            <span class="text-[10px] font-body tracking-[0.18em] uppercase text-midnight/50">Total</span>
            <span class="font-display font-bold text-midnight tabular-nums">
              {{ formatPrice(total) }}
            </span>
          </div>
          <button
            class="w-full py-2.5 bg-midnight text-chalk text-[10px] font-body tracking-[0.18em] uppercase hover:bg-amber transition-colors duration-200"
          >
            Commander
          </button>
          <button
            class="w-full py-2 text-[10px] font-body tracking-[0.18em] uppercase text-midnight/40 hover:text-[#EF4444] transition-colors duration-200"
            @click="clearCart"
          >
            Vider le panier
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ShoppingCart, X, Trash2, ImageIcon, Minus, Plus } from 'lucide-vue-next'
import { MOCK_PRODUCTS } from '~/data/products'

defineProps<{ modelValue: boolean }>()
defineEmits<{ 'update:modelValue': [value: boolean] }>()

const { locale } = useI18n()
const { cart, cartCount, removeFromCart, updateQuantity, clearCart } = useCart()

const cartProducts = computed(() =>
  cart.value.map(item => ({
    ...item,
    product: MOCK_PRODUCTS.find(p => p.id === item.product_id) ?? null,
  }))
)

const total = computed(() =>
  cartProducts.value.reduce((sum, item) => sum + (item.product?.price ?? 0) * item.quantity, 0)
)

function formatPrice(price: number): string {
  return new Intl.NumberFormat(locale.value === 'fr' ? 'fr-FR' : 'en-GB', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

const placeholderBgs = ['bg-[#ECEDEF]', 'bg-[#EDE9E4]', 'bg-[#EAECEC]', 'bg-[#EFEcE8]', 'bg-concrete', 'bg-[#EBEBED]']
function drawerBg(id: string): string {
  const index = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return placeholderBgs[index % placeholderBgs.length] || 'bg-concrete'
}
</script>

<style scoped>
.icon-btn {
  padding: 0.5rem;
  border-radius: var(--radius-md);
  color: var(--midnight);
  transition: color 200ms ease;
}

.icon-btn:hover {
  background-color: rgba(26, 29, 46, 0.05);
  color: var(--amber);
}
</style>
