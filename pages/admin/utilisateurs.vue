<template>
  <div>
    <h1 class="text-2xl font-display font-bold text-midnight mb-8">Utilisateurs</h1>

    <div class="bg-white border border-concrete rounded-sm overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-concrete">
            <th class="text-left px-4 py-3 text-xs font-body tracking-widest uppercase text-midnight/40 font-normal">ID</th>
            <th class="text-left px-4 py-3 text-xs font-body tracking-widest uppercase text-midnight/40 font-normal">Prénom</th>
            <th class="text-left px-4 py-3 text-xs font-body tracking-widest uppercase text-midnight/40 font-normal">Nom</th>
            <th class="text-left px-4 py-3 text-xs font-body tracking-widest uppercase text-midnight/40 font-normal">Rôle</th>
            <th class="text-left px-4 py-3 text-xs font-body tracking-widest uppercase text-midnight/40 font-normal">Inscription</th>
            <th class="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          <template v-if="loading">
            <tr v-for="i in 5" :key="i" class="border-b border-concrete last:border-0">
              <td v-for="col in 6" :key="col" class="px-4 py-4">
                <div class="h-4 bg-concrete animate-pulse rounded-sm" :class="col === 6 ? 'w-20' : 'w-full'" />
              </td>
            </tr>
          </template>
          <template v-else>
            <tr
              v-for="user in profiles"
              :key="user.id"
              class="border-b border-concrete last:border-0 hover:bg-chalk/50 transition-colors duration-150"
            >
              <td class="px-4 py-4 font-mono text-xs text-midnight/40">{{ user.id.slice(0, 8) }}</td>
              <td class="px-4 py-4 font-body text-midnight">{{ user.first_name || '—' }}</td>
              <td class="px-4 py-4 font-body text-midnight">{{ user.last_name || '—' }}</td>
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
                <button
                  v-else
                  class="text-[11px] font-body border border-concrete px-3 py-1.5 text-midnight/60 hover:border-midnight hover:text-midnight transition-colors duration-150"
                  @click="openModal(user)"
                >
                  {{ user.role === 'admin' ? 'Rétrograder' : 'Promouvoir' }}
                </button>
              </td>
            </tr>
            <tr v-if="!profiles.length">
              <td colspan="6" class="px-4 py-12 text-center text-sm font-body text-midnight/30">
                Aucun utilisateur trouvé
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <Teleport to="body">
      <div
        v-if="modalUser"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="modalUser = null"
      >
        <div class="absolute inset-0 bg-midnight/40 backdrop-blur-sm" @click="modalUser = null" />
        <div class="relative bg-white border border-concrete rounded-sm p-8 w-full max-w-sm shadow-xl">
          <h2 class="text-base font-display font-bold text-midnight mb-2">Confirmer l'action</h2>
          <p class="text-sm font-body text-midnight/60 mb-6">
            <template v-if="modalUser.role === 'admin'">
              Rétrograder <span class="font-semibold text-midnight">{{ modalUser.first_name || modalUser.id.slice(0, 8) }}</span> en <span class="font-semibold">user</span> ?
            </template>
            <template v-else>
              Promouvoir <span class="font-semibold text-midnight">{{ modalUser.first_name || modalUser.id.slice(0, 8) }}</span> en <span class="font-semibold">admin</span> ?
            </template>
          </p>
          <div class="flex gap-3 justify-end">
            <button
              class="text-xs font-body px-4 py-2 border border-concrete text-midnight/60 hover:border-midnight hover:text-midnight transition-colors duration-150"
              :disabled="toggling"
              @click="modalUser = null"
            >
              Annuler
            </button>
            <button
              class="text-xs font-body px-4 py-2 bg-midnight text-white hover:bg-midnight/80 transition-colors duration-150 disabled:opacity-50"
              :disabled="toggling"
              @click="toggleRole"
            >
              {{ toggling ? 'En cours…' : 'Confirmer' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
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
  role: string
  created_at: string
}

const client = useSupabaseClient()
const currentUserId = ref<string | undefined>(undefined)

const profiles = ref<Profile[]>([])
const loading = ref(true)
const modalUser = ref<Profile | null>(null)
const toggling = ref(false)

onMounted(async () => {
  const { data: { session } } = await client.auth.getSession()
  currentUserId.value = session?.user?.id

  const { data } = await client
    .from('profiles')
    .select('id, first_name, last_name, role, created_at')
    .order('created_at', { ascending: false })

  profiles.value = (data ?? []).map(p => ({ ...p }))
  loading.value = false
})

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(iso))
}

function openModal(user: Profile) {
  modalUser.value = user
}

async function toggleRole() {
  if (!modalUser.value) return
  toggling.value = true

  const newRole = modalUser.value.role === 'admin' ? 'user' : 'admin'

  await client
    .from('profiles')
    .update({ role: newRole })
    .eq('id', modalUser.value.id)

  const target = profiles.value.find(p => p.id === modalUser.value!.id)
  if (target) target.role = newRole

  toggling.value = false
  modalUser.value = null
}
</script>
