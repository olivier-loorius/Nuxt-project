<template>
  <div>
    <h1 class="text-2xl font-display font-bold text-midnight mb-8">Utilisateurs</h1>

    <div class="mb-4">
      <input
        v-model="search"
        type="text"
        placeholder="Rechercher par prénom, nom ou email…"
        class="w-full max-w-sm px-4 py-2 text-sm font-body border border-concrete rounded-sm bg-white text-midnight placeholder:text-midnight/30 focus:outline-none focus:border-midnight transition-colors duration-150"
      >
    </div>

    <div class="bg-white border border-concrete rounded-sm overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-concrete">
            <th class="text-left px-4 py-3 text-xs font-body tracking-widest uppercase text-midnight/40 font-normal">Identité</th>
            <th class="text-left px-4 py-3 text-xs font-body tracking-widest uppercase text-midnight/40 font-normal">Email</th>
            <th class="text-left px-4 py-3 text-xs font-body tracking-widest uppercase text-midnight/40 font-normal">Rôle</th>
            <th class="text-left px-4 py-3 text-xs font-body tracking-widest uppercase text-midnight/40 font-normal">Inscription</th>
            <th class="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          <template v-if="loading">
            <tr v-for="i in 5" :key="i" class="border-b border-concrete last:border-0">
              <td v-for="col in 5" :key="col" class="px-4 py-4">
                <div class="h-4 bg-concrete animate-pulse rounded-sm" :class="col === 5 ? 'w-20' : 'w-full'" />
              </td>
            </tr>
          </template>
          <template v-else>
            <tr
              v-for="user in paginatedProfiles"
              :key="user.id"
              class="border-b border-concrete last:border-0 hover:bg-chalk/50 transition-colors duration-150"
            >
              <td class="px-4 py-4 font-body text-midnight">
                {{ (user.first_name || user.last_name) ? [user.first_name, user.last_name].filter(Boolean).join(' ') : '—' }}
              </td>
              <td class="px-4 py-4 font-mono text-xs text-midnight/60">{{ user.email ? maskEmail(user.email) : '—' }}</td>
              <td class="px-4 py-4">
                <span
                  class="inline-block px-2.5 py-1 text-[10px] font-display font-semibold tracking-[0.15em] uppercase"
                  :class="user.role === 'admin'
                    ? 'bg-amber text-midnight'
                    : 'bg-concrete text-midnight/50'"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="px-4 py-4 font-body text-midnight/50 text-xs">{{ formatDate(user.created_at) }}</td>
              <td class="px-4 py-4 text-right">
                <span
                  v-if="user.id === currentUserId"
                  class="inline-block bg-midnight text-amber text-[10px] font-bold tracking-widest px-2 py-1"
                >
                  SUPER ADMIN
                </span>
                <div v-else class="flex items-center justify-end gap-2">
                  <button
                    class="text-[11px] font-body border border-concrete px-3 py-1.5 text-midnight/60 hover:border-midnight hover:text-midnight transition-colors duration-150"
                    @click="modalUser = user"
                  >
                    {{ user.role === 'admin' ? 'Rétrograder' : 'Promouvoir' }}
                  </button>
                  <button
                    class="text-[11px] font-body border border-red-200 px-3 py-1.5 text-red-400 hover:border-red-500 hover:text-red-600 transition-colors duration-150"
                    @click="deleteUser = user"
                  >
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!filteredProfiles.length">
              <td colspan="5" class="px-4 py-12 text-center text-sm font-body text-midnight/30">
                Aucun utilisateur trouvé
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

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

    <AdminModal
      v-if="modalUser"
      :title="modalUser.role === 'admin' ? 'Rétrograder un admin' : 'Promouvoir en admin'"
      :message="modalUser.role === 'admin'
        ? `Rétrograder ${modalUser.first_name || modalUser.id.slice(0, 8)} en user ?`
        : `Promouvoir ${modalUser.first_name || modalUser.id.slice(0, 8)} en admin ?`"
      :confirm-label="modalUser.role === 'admin' ? 'Rétrograder' : 'Promouvoir'"
      :confirm-variant="modalUser.role === 'admin' ? 'danger' : 'warning'"
      @confirm="toggleRole"
      @cancel="modalUser = null"
    />

    <AdminModal
      v-if="deleteUser"
      title="Supprimer le compte"
      :message="`Supprimer définitivement ${deleteUser.first_name || deleteUser.id.slice(0, 8)} ? Cette action est irréversible.`"
      confirm-label="Supprimer"
      confirm-variant="danger"
      @confirm="deleteProfile"
      @cancel="deleteUser = null"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  role: string
  created_at: string
}

const PAGE_SIZE = 20

const client = useSupabaseClient()
const currentUserId = ref<string | undefined>(undefined)

const profiles = ref<Profile[]>([])
const loading = ref(true)
const modalUser = ref<Profile | null>(null)
const deleteUser = ref<Profile | null>(null)
const search = ref('')
const page = ref(1)

const sortedProfiles = computed(() => {
  return [...profiles.value].sort((a, b) => {
    if (a.id === currentUserId.value) return -1
    if (b.id === currentUserId.value) return 1
    if (a.role === 'admin' && b.role !== 'admin') return -1
    if (b.role === 'admin' && a.role !== 'admin') return 1
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
})

const filteredProfiles = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return sortedProfiles.value
  return sortedProfiles.value.filter(p =>
    [p.first_name, p.last_name, p.email].some(v => v?.toLowerCase().includes(q))
  )
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredProfiles.value.length / PAGE_SIZE)))

const paginatedProfiles = computed(() => {
  const start = (page.value - 1) * PAGE_SIZE
  return filteredProfiles.value.slice(start, start + PAGE_SIZE)
})

watch(search, () => { page.value = 1 })

onMounted(async () => {
  const { data: { session } } = await client.auth.getSession()
  currentUserId.value = session?.user?.id

  const { data } = await client
    .from('profiles')
    .select('id, first_name, last_name, email, role, created_at')

  profiles.value = data ?? []
  loading.value = false
})

function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!domain) return email
  const visible = local.slice(0, 2)
  const masked = '*'.repeat(Math.max(local.length - 2, 1))
  return `${visible}${masked}@${domain}`
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(iso))
}

async function toggleRole() {
  if (!modalUser.value) return

  const newRole = modalUser.value.role === 'admin' ? 'user' : 'admin'
  const targetId = modalUser.value.id

  const { error } = await client
    .from('profiles')
    .update({ role: newRole })
    .eq('id', targetId)

  if (!error) {
    const target = profiles.value.find(p => p.id === targetId)
    if (target) target.role = newRole
  }

  modalUser.value = null
}

async function deleteProfile() {
  if (!deleteUser.value) return

  const targetId = deleteUser.value.id

  const { error } = await client.rpc('delete_user', { user_id: targetId })

  if (!error) {
    profiles.value = profiles.value.filter(p => p.id !== targetId)
  }

  deleteUser.value = null
}
</script>
