<template>
  <div class="bg-chalk min-h-screen">
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

      <div class="px-3 py-4 border-t border-chalk/10">
        <button
          class="flex items-center gap-3 w-full px-3 py-2.5 text-xs font-body tracking-wide text-chalk/70 hover:bg-chalk/10 hover:text-[#EF4444] rounded-sm transition-colors duration-200"
          @click="handleLogout"
        >
          <LogOut :size="16" />
          Déconnexion
        </button>
      </div>
    </aside>

    <main class="ml-64 p-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { LayoutDashboard, Package, Users, LogOut } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'

const route = useRoute()
const { signOut } = useAuth()

const handleLogout = async () => {
  await signOut()
  await navigateTo('/')
}
</script>
