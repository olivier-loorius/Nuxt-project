<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-40">
      <div
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
        @click="$emit('update:modelValue', false)"
      />

      <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white w-full max-w-3xl">
        <div class="p-6 border-b border-concrete flex items-center justify-between">
          <h2 class="text-base font-display font-bold text-midnight">
            {{ isCreating ? 'Nouveau produit' : (product?.name ?? '—') }}
          </h2>
          <button
            class="text-midnight/40 hover:text-midnight transition-colors duration-150 text-xl leading-none"
            @click="$emit('update:modelValue', false)"
          >
            ×
          </button>
        </div>

        <div v-if="product" class="flex gap-6 p-6">
          <div class="w-72 flex-shrink-0">
            <div class="grid grid-cols-2 gap-2">
              <div v-for="slot in 4" :key="slot">
                <label
                  :for="`img-slot-${slot}`"
                  class="aspect-square w-full relative group overflow-hidden block"
                  :class="[imagePreviews[slot-1] ? '' : placeholderBg(product.id), editing ? 'cursor-pointer' : 'cursor-default']"
                >
                  <img
                    v-if="imagePreviews[slot-1]"
                    :src="imagePreviews[slot-1]!"
                    class="w-full h-full object-cover absolute inset-0"
                  >
                  <span v-else class="absolute inset-0 flex items-center justify-center text-lg font-display text-white/60">
                    {{ initials(product.name) }}
                  </span>
                  <div v-if="editing" class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <span class="text-white text-xs font-body">Changer</span>
                  </div>
                </label>
                <input
                  v-if="editing"
                  :id="`img-slot-${slot}`"
                  type="file"
                  class="hidden"
                  accept="image/*"
                  @change="handleSlotChange(slot - 1, $event)"
                >
                <p v-if="slot === 1" class="text-[10px] font-body text-midnight/40 text-center mt-1">Principale</p>
              </div>
            </div>
          </div>

          <div class="flex-1 py-2 flex flex-col justify-between">
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs font-body font-semibold tracking-widest uppercase text-midnight/40 mb-1">Prix</p>
                  <template v-if="editing">
                    <input v-model.number="form.price" type="number" class="border border-concrete text-sm font-body px-2 py-1 w-full focus:outline-none focus:border-midnight">
                  </template>
                  <p v-else class="text-sm font-body text-midnight tabular-nums">{{ formatPrice(product.price) }}</p>
                </div>
                <div>
                  <p class="text-xs font-body font-semibold tracking-widest uppercase text-midnight/40 mb-1">Stock</p>
                  <template v-if="editing">
                    <input v-model.number="form.stock" type="number" class="border border-concrete text-sm font-body px-2 py-1 w-full focus:outline-none focus:border-midnight">
                  </template>
                  <p
                    v-else
                    class="text-sm font-body tabular-nums"
                    :class="product.stock > 3 ? 'text-midnight' : product.stock > 0 ? 'text-amber' : 'text-red-400'"
                  >
                    {{ product.stock }}
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs font-body font-semibold tracking-widest uppercase text-midnight/40 mb-1">Catégorie</p>
                  <template v-if="editing">
                    <input v-model="form.category_id" type="text" class="border border-concrete text-sm font-body px-2 py-1 w-full focus:outline-none focus:border-midnight">
                  </template>
                  <p v-else class="text-sm font-body text-midnight">{{ $t('catalog.categories.' + product.category_id) }}</p>
                </div>
                <div>
                  <p class="text-xs font-body font-semibold tracking-widest uppercase text-midnight/40 mb-1">Badge</p>
                  <template v-if="editing">
                    <select v-model="form.badge" class="border border-concrete text-sm font-body px-2 py-1 w-full focus:outline-none focus:border-midnight bg-white">
                      <option v-for="badge in BADGES" :key="String(badge.value)" :value="badge.value">{{ badge.labelFr }}</option>
                    </select>
                  </template>
                  <template v-else>
                    <span
                      v-if="product.badge"
                      class="inline-block px-2 py-0.5 text-[10px] font-display font-semibold tracking-[0.15em] uppercase"
                      :style="badgeStyle(product.badge)"
                    >
                      {{ badgeLabel(product.badge) }}
                    </span>
                    <span v-else class="text-midnight/20 text-xs">—</span>
                  </template>
                </div>
              </div>

              <div>
                <p class="text-xs font-body font-semibold tracking-widest uppercase text-midnight/40 mb-1">Nom</p>
                <template v-if="editing">
                  <input v-model="form.name" type="text" class="border border-concrete text-sm font-body px-2 py-1 w-full focus:outline-none focus:border-midnight">
                </template>
                <p v-else class="text-sm font-body text-midnight">{{ product.name }}</p>
              </div>

              <div>
                <p class="text-xs font-body font-semibold tracking-widest uppercase text-midnight/40 mb-1">Sous-catégorie</p>
                <template v-if="editing">
                  <input v-model="form.subcategory_id" type="text" class="border border-concrete text-sm font-body px-2 py-1 w-full focus:outline-none focus:border-midnight">
                </template>
                <p v-else class="text-sm font-body text-midnight">{{ subcategoryLabel }}</p>
              </div>

              <div>
                <p class="text-xs font-body font-semibold tracking-widest uppercase text-midnight/40 mb-1">Page</p>
                <template v-if="editing">
                  <select v-model="form.page" class="border border-concrete text-sm font-body px-2 py-1 w-full focus:outline-none focus:border-midnight bg-white">
                    <option :value="null">—</option>
                    <option value="nouveautes">Nouveautés</option>
                    <option value="best-sellers">Best Sellers</option>
                    <option value="categories">Catégories</option>
                    <option value="lingerie">Lingerie</option>
                    <option value="accessoires">Accessoires</option>
                    <option value="idees-cadeaux">Idées cadeaux</option>
                    <option value="promotions">Promotions</option>
                  </select>
                </template>
                <p v-else class="text-sm font-body text-midnight">{{ product.page ?? '—' }}</p>
              </div>
            </div>

            <div class="flex gap-3 mt-6">
              <template v-if="editing">
                <button
                  class="flex-1 bg-midnight text-chalk text-xs font-body px-4 py-2 transition-colors duration-150"
                  @click="confirmSave = true"
                >
                  Enregistrer
                </button>
                <button
                  class="border border-concrete text-midnight/60 text-xs font-body px-4 py-2 transition-colors duration-150 hover:border-midnight hover:text-midnight"
                  @click="cancelEdit"
                >
                  Annuler les modifications
                </button>
              </template>
              <template v-else>
                <button
                  class="flex-1 bg-midnight text-chalk text-xs font-body px-4 py-2 transition-colors duration-150"
                  @click="startEdit"
                >
                  Modifier
                </button>
                <button
                  v-if="!isCreating"
                  class="border border-red-200 text-red-400 hover:border-red-500 hover:text-red-600 text-xs font-body px-4 py-2 transition-colors duration-150"
                  @click="confirmDelete = true"
                >
                  Supprimer
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    <AdminModal
      v-if="validationError"
      title="Image invalide"
      :message="validationError"
      confirm-label="OK"
      confirm-variant="warning"
      @confirm="validationError = ''"
      @cancel="validationError = ''"
    />
    <AdminModal
      v-if="confirmSave"
      :title="`Confirmer les modifications`"
      :message="`Modifier ${props.product?.name} ?`"
      confirm-label="Enregistrer"
      confirm-variant="success"
      @confirm="save"
      @cancel="confirmSave = false"
    />
    <AdminModal
      v-if="confirmDelete"
      title="Supprimer le produit"
      message="Cette action est irréversible."
      confirm-label="Supprimer"
      confirm-variant="danger"
      @confirm="deleteProduct"
      @cancel="confirmDelete = false"
    />
  </div>
  </Teleport>
</template>

<script setup lang="ts">
import { BADGES } from '~/composables/useBadges'

interface Product {
  id: string
  name: string
  price: number
  badge: string | null
  stock: number
  category_id: string
  subcategory_id: string
  page: string | null
  images: string[]
}

const props = defineProps<{
  modelValue: boolean
  product: Product | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  saved: [product: Product]
  deleted: []
}>()

const client = useSupabaseClient()

const subcategories = ref<{ id: string; label: string }[]>([])

onMounted(async () => {
  const { data } = await client.from('subcategories').select('id, label')
  subcategories.value = data ?? []
})

const subcategoryLabel = computed(() =>
  subcategories.value.find(s => s.id === props.product?.subcategory_id)?.label
    ?? props.product?.subcategory_id
    ?? '—'
)

const validationError = ref('')

const isCreating = computed(() => props.product === null)
const editing = ref(false)
const confirmSave = ref(false)
const confirmDelete = ref(false)

const imagePreviews = ref<(string | null)[]>(
  Array.from({ length: 4 }, (_, i) => props.product?.images?.[i] ?? null)
)
const pendingFiles = ref<(File | null)[]>(Array.from({ length: 4 }, () => null))

function handleSlotChange(index: number, event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    validationError.value = 'Format non supporté. Utilisez JPEG, PNG ou WebP.'
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    validationError.value = 'Image trop lourde. 5 Mo maximum.'
    return
  }
  pendingFiles.value[index] = file
  imagePreviews.value[index] = URL.createObjectURL(file)
}

const form = ref({
  name: '',
  price: 0,
  stock: 0,
  badge: null as string | null,
  category_id: '',
  subcategory_id: '',
  page: null as string | null,
})

function startEdit() {
  if (!props.product) return
  form.value = {
    name: props.product.name,
    price: props.product.price,
    stock: props.product.stock,
    badge: props.product.badge,
    category_id: props.product.category_id,
    subcategory_id: props.product.subcategory_id,
    page: props.product.page,
  }
  editing.value = true
}

function cancelEdit() {
  editing.value = false
}

async function save() {
  confirmSave.value = false
  if (!props.product) return

  for (let i = 0; i < 4; i++) {
    const file = pendingFiles.value[i]
    if (!file) continue
    const publicUrl = await uploadImage(file, i)
    if (publicUrl) imagePreviews.value[i] = publicUrl
  }

  const images = imagePreviews.value.filter((url): url is string => url !== null)

  const { error } = await client
    .from('products')
    .update({ ...form.value, images })
    .eq('id', props.product.id)

  if (!error) {
    emit('saved', { ...props.product, ...form.value, images })
  }

  editing.value = false
}

async function deleteProduct() {
  if (!props.product) return

  const { error } = await client
    .from('products')
    .delete()
    .eq('id', props.product.id)

  if (!error) {
    emit('deleted')
    emit('update:modelValue', false)
  }

  confirmDelete.value = false
}

async function uploadImage(file: File, index: number) {
  if (!props.product) return

  const ext = file.name.split('.').pop()
  const path = `${props.product.id}/img_${index}_${Date.now()}.${ext}`

  const { error: uploadError } = await client.storage
    .from('products')
    .upload(path, file)

  if (uploadError) return null

  const { data: { publicUrl } } = client.storage
    .from('products')
    .getPublicUrl(path)

  return publicUrl
}

const placeholderBgs = [
  'bg-[#ECEDEF]',
  'bg-[#EDE9E4]',
  'bg-[#EAECEC]',
  'bg-[#EFEcE8]',
  'bg-concrete',
  'bg-[#EBEBED]',
]

function placeholderBg(id: string): string {
  const base = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return placeholderBgs[base % placeholderBgs.length] ?? placeholderBgs[0]!
}

function initials(name: string): string {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)
}

function badgeLabel(value: string | null): string {
  return BADGES.find(b => b.value === value)?.labelFr ?? value ?? '—'
}

function badgeStyle(value: string | null) {
  const b = BADGES.find(b => b.value === value)
  return { backgroundColor: b?.bg ?? '#F5F3F0', color: b?.text ?? '#1A1D2E' }
}
</script>
