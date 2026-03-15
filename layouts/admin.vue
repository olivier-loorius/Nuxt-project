<template>
  <div v-if="authorized" class="bg-chalk min-h-screen">
    <aside class="bg-midnight text-chalk w-64 fixed top-0 left-0 h-full flex flex-col">
      <div class="px-6 py-6 border-b border-chalk/10">
        <NuxtLink to="/admin" class="text-xl font-display font-bold text-chalk hover:text-amber transition-colors duration-200">
          Boys & Toys
        </NuxtLink>
        <p class="text-[10px] font-body tracking-[0.18em] uppercase text-chalk/30 mt-1">Administration</p>
      </div>

      <nav class="flex-1 px-3 py-4 space-y-1">
        <NuxtLink
          to="/admin"
          class="flex items-center gap-3 px-3 py-2.5 text-xs font-body tracking-wide rounded-sm transition-colors duration-200"
          :class="route.path === '/admin' ? 'bg-amber text-midnight font-semibold' : 'text-chalk/70 hover:bg-chalk/10 hover:text-chalk'"
        >
          <LayoutDashboard :size="16" />
          Dashboard
        </NuxtLink>
        <NuxtLink
          to="/admin/produits"
          class="flex items-center gap-3 px-3 py-2.5 text-xs font-body tracking-wide rounded-sm transition-colors duration-200"
          :class="route.path.startsWith('/admin/produits') ? 'bg-amber text-midnight font-semibold' : 'text-chalk/70 hover:bg-chalk/10 hover:text-chalk'"
        >
          <Package :size="16" />
          Produits
        </NuxtLink>
        <NuxtLink
          to="/admin/utilisateurs"
          class="flex items-center gap-3 px-3 py-2.5 text-xs font-body tracking-wide rounded-sm transition-colors duration-200"
          :class="route.path.startsWith('/admin/utilisateurs') ? 'bg-amber text-midnight font-semibold' : 'text-chalk/70 hover:bg-chalk/10 hover:text-chalk'"
        >
          <Users :size="16" />
          Utilisateurs
        </NuxtLink>
      </nav>

      <div v-if="isSuperAdmin" class="px-3 py-2">
        <button
          class="text-xs font-body px-3 py-2 w-full text-left rounded-sm transition-colors duration-150"
          :class="isDemoMode ? 'bg-yellow-50 border border-yellow-400 text-yellow-700' : 'bg-green-50 border border-green-400 text-green-700'"
          @click="toggleDemoMode"
        >
          <span
            class="inline-block w-2 h-2 rounded-full mr-2 align-middle"
            :class="isDemoMode ? 'bg-yellow-400' : 'bg-green-400'"
          />
          {{ isDemoMode ? 'Mock Data actif' : 'Live Supabase' }}
        </button>
      </div>

      <div class="px-3 py-4 border-t border-chalk/10 space-y-1">
        <NuxtLink
          to="/"
          class="flex items-center gap-3 w-full px-3 py-2.5 text-xs font-body tracking-wide rounded-sm transition-colors duration-200 text-amber/80 hover:bg-amber/10 hover:text-amber border border-chalk/10 hover:border-amber/30"
        >
          <Globe :size="16" />
          ← Retour au site
        </NuxtLink>
        <button
          class="flex items-center gap-3 w-full px-3 py-2.5 text-xs font-body tracking-wide text-[#EF4444] hover:bg-[#EF4444]/10 rounded-sm transition-colors duration-200"
          @click="showLogoutModal = true"
        >
          <LogOut :size="16" />
          Déconnexion
        </button>
      </div>
    </aside>

    <AdminModal
      v-if="showLogoutModal"
      title="Déconnexion"
      message="Tu vas être déconnecté du dashboard. Continuer ?"
      confirm-label="Se déconnecter"
      confirm-variant="danger"
      @confirm="handleLogout"
      @cancel="showLogoutModal = false"
    />

    <main class="ml-64 p-8">
      <slot />
    </main>
  </div>

  <div v-else class="bg-chalk min-h-screen flex items-center justify-center">
    <p class="text-sm font-body text-midnight/40">Chargement…</p>
  </div>
</template>

<script setup lang="ts">
import { LayoutDashboard, Package, Users, LogOut, Globe } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'
import { useDemoMode, SUPER_ADMIN_ID } from '~/composables/useDemoMode'

const route = useRoute()
const { signOut } = useAuth()
const { isDemoMode, toggleDemoMode } = useDemoMode()

const authorized = ref(false)
const showLogoutModal = ref(false)
const userId = ref<string | null>(null)

const isSuperAdmin = computed(() => userId.value === SUPER_ADMIN_ID)

onMounted(async () => {
  const client = useSupabaseClient()
  const { data: { session } } = await client.auth.getSession()

  if (!session?.user?.id) {
    await navigateTo('/')
    return
  }

  userId.value = session.user.id

  const { data } = await client
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (data?.role !== 'admin') {
    await navigateTo('/')
    return
  }

  authorized.value = true
})

const handleLogout = async () => {
  await signOut()
  await navigateTo('/')
}
</script>
