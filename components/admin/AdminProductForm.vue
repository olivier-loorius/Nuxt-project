<template>
  <div>
    <AdminProductPreview
      v-if="showPreview"
      :form="form"
      :image-previews="imagePreviews"
      @back="showPreview = false"
      @confirm="save"
    />
    <template v-else>
    <h2 class="text-base font-display font-bold text-midnight mb-8">
      {{ props.product ? props.product.name : 'Nouveau produit' }}
    </h2>

    <div class="border-b border-concrete pb-6 mb-6">
      <p class="text-xs font-body font-semibold tracking-widest uppercase text-midnight/40 mb-4">Images</p>
      <div class="grid grid-cols-4 gap-3" :class="{ 'ring-1 ring-red-400 rounded-sm': errors.images }">
        <div v-for="slot in 4" :key="slot">
          <label
            :for="`img-slot-${slot}`"
            class="aspect-square w-full relative group overflow-hidden bg-concrete cursor-pointer flex flex-col items-center justify-center"
          >
            <img
              v-if="imagePreviews[slot - 1]"
              :src="imagePreviews[slot - 1]!"
              class="w-full h-full object-cover absolute inset-0"
            >
            <template v-else>
              <svg class="w-6 h-6 text-midnight/30" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 16V8m0 0-3 3m3-3 3 3" />
              </svg>
              <span class="text-[10px] font-body text-midnight/30 mt-1">{{ slot === 1 ? 'Principale' : `Photo ${slot}` }}</span>
            </template>
            <div class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <span class="text-white text-xs font-body">Ajouter</span>
            </div>
          </label>
          <input
            :id="`img-slot-${slot}`"
            type="file"
            class="hidden"
            accept="image/*"
            @change="handleSlotChange(slot - 1, $event)"
          >
        </div>
      </div>
      <p v-if="errors.images" class="text-[11px] text-red-400 font-body mt-2">{{ errors.images }}</p>
    </div>

    <div class="border-b border-concrete pb-6 mb-6">
      <p class="text-xs font-body font-semibold tracking-widest uppercase text-midnight/40 mb-4">Contenu</p>

      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div class="flex items-center justify-between mb-1">
            <p class="text-xs font-body font-semibold tracking-widest uppercase text-midnight/40">Nom FR</p>
            <span class="text-[10px] font-body text-midnight/30">{{ form.name.length }}/80</span>
          </div>
          <input
            v-model="form.name"
            type="text"
            maxlength="80"
            class="border border-concrete text-sm font-body px-2 py-1 w-full focus:outline-none focus:border-midnight"
            :class="{ 'border-red-400': errors.name }"
          >
          <p v-if="errors.name" class="text-[11px] text-red-400 font-body mt-1">{{ errors.name }}</p>
        </div>
        <div>
          <div class="flex items-center justify-between mb-1">
            <p class="text-xs font-body font-semibold tracking-widest uppercase text-midnight/40">Nom EN</p>
            <span class="text-[10px] font-body text-midnight/30">{{ form.name_en.length }}/80</span>
          </div>
          <input
            v-model="form.name_en"
            type="text"
            maxlength="80"
            class="border border-concrete text-sm font-body px-2 py-1 w-full focus:outline-none focus:border-midnight"
            :class="{ 'border-red-400': errors.name_en }"
          >
          <p v-if="errors.name_en" class="text-[11px] text-red-400 font-body mt-1">{{ errors.name_en }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <div class="flex items-center justify-between mb-1">
            <p class="text-xs font-body font-semibold tracking-widest uppercase text-midnight/40">Description FR</p>
            <span class="text-[10px] font-body text-midnight/30">{{ form.description.length }}/500</span>
          </div>
          <textarea
            v-model="form.description"
            rows="4"
            maxlength="500"
            class="border border-concrete text-sm font-body px-2 py-1 w-full focus:outline-none focus:border-midnight resize-none"
          />
        </div>
        <div>
          <div class="flex items-center justify-between mb-1">
            <p class="text-xs font-body font-semibold tracking-widest uppercase text-midnight/40">Description EN</p>
            <span class="text-[10px] font-body text-midnight/30">{{ form.description_en.length }}/500</span>
          </div>
          <textarea
            v-model="form.description_en"
            rows="4"
            maxlength="500"
            class="border border-concrete text-sm font-body px-2 py-1 w-full focus:outline-none focus:border-midnight resize-none"
          />
        </div>
      </div>
    </div>

    <div class="pb-6 mb-6">
      <p class="text-xs font-body font-semibold tracking-widest uppercase text-midnight/40 mb-4">Produit</p>

      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p class="text-xs font-body font-semibold tracking-widest uppercase text-midnight/40 mb-1">Prix</p>
          <input
            v-model.number="form.price"
            type="number"
            class="border border-concrete text-sm font-body px-2 py-1 w-full focus:outline-none focus:border-midnight"
            :class="{ 'border-red-400': errors.price }"
          >
          <p v-if="errors.price" class="text-[11px] text-red-400 font-body mt-1">{{ errors.price }}</p>
        </div>
        <div>
          <p class="text-xs font-body font-semibold tracking-widest uppercase text-midnight/40 mb-1">Stock</p>
          <input
            v-model.number="form.stock"
            type="number"
            class="border border-concrete text-sm font-body px-2 py-1 w-full focus:outline-none focus:border-midnight"
            :class="{ 'border-red-400': errors.stock }"
          >
          <p v-if="errors.stock" class="text-[11px] text-red-400 font-body mt-1">{{ errors.stock }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-xs font-body font-semibold tracking-widest uppercase text-midnight/40 mb-1">Catégorie</p>
          <select
            v-model="form.category_id"
            class="border border-concrete text-sm font-body px-2 py-1 w-full focus:outline-none focus:border-midnight bg-white"
            :class="{ 'border-red-400': errors.category_id }"
          >
            <option value="">—</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.label }}</option>
          </select>
          <p v-if="errors.category_id" class="text-[11px] text-red-400 font-body mt-1">{{ errors.category_id }}</p>
        </div>
        <div>
          <p class="text-xs font-body font-semibold tracking-widest uppercase text-midnight/40 mb-1">Sous-catégorie</p>
          <select
            v-model="form.subcategory_id"
            :disabled="!form.category_id"
            class="border border-concrete text-sm font-body px-2 py-1 w-full focus:outline-none focus:border-midnight bg-white disabled:opacity-40"
            :class="{ 'border-red-400': errors.subcategory_id }"
          >
            <option value="">—</option>
            <option v-for="sub in subcategoriesFiltered" :key="sub.id" :value="sub.id">{{ sub.label }}</option>
            <option value="autre">Autre (nouvelle sous-catégorie)</option>
          </select>
          <input
            v-if="form.subcategory_id === 'autre'"
            v-model="form.new_subcategory"
            type="text"
            placeholder="Nom de la nouvelle sous-catégorie"
            class="border border-concrete text-sm font-body px-2 py-1 w-full focus:outline-none focus:border-midnight mt-2"
          >
          <input
            v-if="form.subcategory_id === 'autre'"
            v-model="form.new_subcategory_en"
            type="text"
            placeholder="Subcategory name (English)"
            class="border border-concrete text-sm font-body px-2 py-1 w-full focus:outline-none focus:border-midnight mt-2"
          >
          <p v-if="errors.subcategory_id" class="text-[11px] text-red-400 font-body mt-1">{{ errors.subcategory_id }}</p>
        </div>
      </div>

      <div class="mt-4">
        <p class="text-xs font-body font-semibold tracking-widest uppercase text-midnight/40 mb-1">Marque</p>
        <select
          v-model="form.brand_id"
          class="border border-concrete text-sm font-body px-2 py-1 w-full focus:outline-none focus:border-midnight bg-white"
        >
          <option :value="null">—</option>
          <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
          <option value="autre">Autre (nouvelle marque)</option>
        </select>
        <input
          v-if="form.brand_id === 'autre'"
          v-model="form.new_brand"
          type="text"
          placeholder="Nom de la nouvelle marque"
          class="border border-concrete text-sm font-body px-2 py-1 w-full focus:outline-none focus:border-midnight mt-2"
        >
      </div>

      <div class="mt-4">
        <p class="text-xs font-body font-semibold tracking-widest uppercase text-midnight/40 mb-1">Origine</p>
        <select
          v-model="form.origin"
          class="border border-concrete text-sm font-body px-2 py-1 w-full focus:outline-none focus:border-midnight bg-white"
        >
          <option value="">—</option>
          <option value="fr">France</option>
          <option value="eu">Europe</option>
          <option value="us">États-Unis</option>
          <option value="jp">Japon</option>
          <option value="cn">Chine</option>
        </select>
      </div>

      <div class="mt-4">
        <p class="text-xs font-body font-semibold tracking-widest uppercase text-midnight/40 mb-1">Page</p>
        <select
          v-model="form.page"
          class="border border-concrete text-sm font-body px-2 py-1 w-full focus:outline-none focus:border-midnight bg-white"
        >
          <option :value="null">—</option>
          <option value="nouveautes">Nouveautés</option>
          <option value="best-sellers">Best Sellers</option>
          <option value="categories">Catégories</option>
          <option value="lingerie">Lingerie</option>
          <option value="accessoires">Accessoires</option>
          <option value="idees-cadeaux">Idées cadeaux</option>
          <option value="promotions">Promotions</option>
        </select>
      </div>

      <div class="mt-4">
        <p class="text-xs font-body font-semibold tracking-widest uppercase text-midnight/40 mb-1">Badge</p>
        <div class="flex flex-wrap gap-2 mt-1">
          <button
            v-for="badge in BADGES"
            :key="String(badge.value)"
            type="button"
            class="text-xs font-body px-3 py-1 transition-all duration-150"
            :style="{ backgroundColor: badge.bg, color: badge.text }"
            :class="form.badge === badge.value ? 'ring-2 ring-midnight' : 'ring-1 ring-concrete'"
            @click="form.badge = badge.value"
          >
            {{ badgeLabel(badge) }}
          </button>
        </div>
      </div>
    </div>

    <div class="flex gap-3">
      <button
        class="bg-midnight text-chalk text-xs font-body px-4 py-2 transition-colors duration-150"
        @click="preview"
      >
        Prévisualiser
      </button>
      <button
        class="border border-concrete text-midnight/60 text-xs font-body px-4 py-2 hover:border-midnight hover:text-midnight transition-colors duration-150"
        @click="cancel"
      >
        Annuler
      </button>
    </div>
    </template>
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
    v-if="confirmLeave"
    title="Quitter sans enregistrer ?"
    message="Vos modifications seront perdues."
    confirm-label="Quitter"
    confirm-variant="danger"
    @confirm="confirmLeaveAndClear"
    @cancel="confirmLeave = false"
  />
  <AdminModal
    v-if="draftModal"
    title="Reprendre le brouillon ?"
    message="Un brouillon a été trouvé. Les champs texte seront restaurés — les images devront être re-uploadées."
    confirm-label="Reprendre"
    cancel-label="Ignorer"
    @confirm="resumeDraft"
    @cancel="discardDraft"
  />
</template>

<script setup lang="ts">
import { BADGES } from '~/composables/useBadges'

interface Category {
  id: string
  label: string
}

interface Subcategory {
  id: string
  label: string
  category_id: string
}

interface Brand {
  id: string
  name: string
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  badge: string | null
  stock: number
  category_id: string
  subcategory_id: string
  images: string[]
}

const props = defineProps<{
  product: Product | null
}>()

const emit = defineEmits<{
  saved: []
  cancelled: []
}>()

const client = useSupabaseClient()
const isCreating = computed(() => props.product === null)

const categories = ref<Category[]>([])
const subcategories = ref<Subcategory[]>([])
const brands = ref<Brand[]>([])

const subcategoriesFiltered = computed(() =>
  subcategories.value.filter(s => s.category_id === form.value.category_id)
)

onMounted(async () => {
  const [catsRes, subsRes, brandsRes] = await Promise.all([
    client.from('categories').select('id, label'),
    client.from('subcategories').select('id, label, category_id'),
    client.from('brands').select('id, name').order('name'),
  ])
  categories.value = catsRes.data ?? []
  subcategories.value = subsRes.data ?? []
  brands.value = brandsRes.data ?? []

  const raw = localStorage.getItem(DRAFT_KEY)
  if (raw) {
    try {
      JSON.parse(raw)
      draftModal.value = true
    } catch {
      localStorage.removeItem(DRAFT_KEY)
    }
  }
})

const imagePreviews = ref<(string | null)[]>(
  Array.from({ length: 4 }, (_, i) => props.product?.images?.[i] ?? null)
)
const pendingFiles = ref<(File | null)[]>(Array.from({ length: 4 }, () => null))
const validationError = ref('')

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
  name_en: '',
  description: '',
  description_en: '',
  price: 0,
  stock: 0,
  badge: null as string | null,
  category_id: '',
  subcategory_id: '',
  new_subcategory: '',
  new_subcategory_en: '',
  brand_id: null as string | null,
  new_brand: '',
  page: null as string | null,
  origin: '',
})

watch(() => form.value.category_id, () => {
  form.value.subcategory_id = ''
})

const DRAFT_KEY = 'admin_form_draft'
const draftModal = ref(false)

watch(form, (val) => {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(val))
}, { deep: true })

function resumeDraft() {
  const raw = localStorage.getItem(DRAFT_KEY)
  if (!raw) return
  try { form.value = JSON.parse(raw) } catch {}
  draftModal.value = false
}

function discardDraft() {
  localStorage.removeItem(DRAFT_KEY)
  draftModal.value = false
}

function clearDraft() {
  localStorage.removeItem(DRAFT_KEY)
}

const { locale } = useI18n()
const badgeLabel = (badge: typeof BADGES[0]) => locale.value === 'fr' ? badge.labelFr : badge.labelEn

const showPreview = ref(false)
const errors = ref<Record<string, string>>({})

function validate(): boolean {
  const e: Record<string, string> = {}
  if (imagePreviews.value.filter(Boolean).length < 4) e.images        = 'Les 4 images sont requises'
  if (!form.value.name.trim())                        e.name          = 'Le nom FR est requis'
  if (!form.value.name_en.trim())                     e.name_en       = 'Le nom EN est requis'
  if (form.value.price <= 0)                          e.price         = 'Le prix doit être supérieur à 0'
  if (form.value.stock < 0)                           e.stock         = 'Le stock ne peut pas être négatif'
  if (!form.value.category_id)                        e.category_id   = 'La catégorie est requise'
  if (!form.value.subcategory_id)                     e.subcategory_id = 'La sous-catégorie est requise'
  errors.value = e
  return Object.keys(e).length === 0
}

function generateId(name: string): string {
  return name
    .replace(/œ/g, 'oe').replace(/æ/g, 'ae').replace(/ø/g, 'o')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

function preview() {
  if (validate()) showPreview.value = true
}

async function save() {
  if (!validate()) return

  const images: (string | null)[] = [...imagePreviews.value]

  for (let i = 0; i < 4; i++) {
    const preview = imagePreviews.value[i]
    const file = pendingFiles.value[i]
    if (!preview?.startsWith('blob:') || !file) continue

    const ext = file.name.split('.').pop()
    const path = `img_${i}_${Date.now()}.${ext}`

    const { error: uploadError } = await client.storage
      .from('products')
      .upload(path, file)

    if (uploadError) {
      return
    }

    const { data: { publicUrl } } = client.storage
      .from('products')
      .getPublicUrl(path)

    images[i] = publicUrl
  }

  let subcategory_id = form.value.subcategory_id
  if (form.value.subcategory_id === 'autre' && form.value.new_subcategory.trim()) {
    const newSubId = generateId(form.value.new_subcategory)
    const { error: subError } = await client.from('subcategories').upsert({
      id: newSubId,
      label: form.value.new_subcategory,
      label_en: form.value.new_subcategory_en,
      slug: newSubId,
      category_id: form.value.category_id,
    }, { onConflict: 'id' })
    if (subError) return
    subcategory_id = newSubId
  }

  let resolvedBrandId = form.value.brand_id === 'autre' ? null : form.value.brand_id
  if (form.value.brand_id === 'autre' && form.value.new_brand.trim()) {
    const newBrandId = generateId(form.value.new_brand)
    const { error: brandError } = await client.from('brands').insert({
      id: newBrandId,
      name: form.value.new_brand,
    })
    if (brandError) return
    resolvedBrandId = newBrandId
  }

  const slug = generateId(form.value.name)
  const { name, name_en, description, description_en, price, stock, badge, category_id, page, origin } = form.value
  const payload = {
    name, name_en, description, description_en, price, stock, badge, category_id,
    subcategory_id,
    brand_id: resolvedBrandId,
    page,
    origin: origin || null,
    images: images.filter(Boolean) as string[],
  }

  if (isCreating.value) {
    const { error } = await client.from('products').insert({ ...payload, id: slug })
    if (error) return
  } else {
    const { error } = await client.from('products').update(payload).eq('id', props.product!.id)
    if (error) return
  }

  clearDraft()
  emit('saved')
}

const confirmLeave = ref(false)

function cancel() {
  const isDirty = form.value.name || form.value.description || imagePreviews.value.some(Boolean)
  if (isDirty) {
    confirmLeave.value = true
  } else {
    clearDraft()
    emit('cancelled')
  }
}

function confirmLeaveAndClear() {
  clearDraft()
  emit('cancelled')
}
</script>
