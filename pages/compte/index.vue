<template>
  <div class="bg-white border-2 border-concrete p-8 md:p-10">
    <!-- Header - Design masculin -->
    <div class="mb-10 border-l-4 border-amber pl-6">
      <h1 class="text-4xl font-bold text-midnight tracking-tight mb-2 uppercase">
        {{ $t('compte.dashboard.title') }}
      </h1>
      <p class="text-midnight/60 text-lg">
        {{ $t('compte.dashboard.welcome') }}, <span class="text-amber font-bold">{{ userDisplayName }}</span>
      </p>
    </div>

    <!-- Quick Stats - Cartes carrées et masculines -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
      <div class="bg-amber/5 border-2 border-amber/40 p-6 relative overflow-hidden group hover:border-amber transition-all">
        <div class="absolute top-0 right-0 w-20 h-20 bg-amber/10 transform rotate-45 translate-x-10 -translate-y-10"></div>
        <h3 class="text-xs font-bold text-amber/80 mb-3 tracking-widest uppercase">
          {{ $t('compte.commandes.title') }}
        </h3>
        <p class="text-5xl font-black text-amber">{{ orderCount }}</p>
      </div>

      <div class="bg-copper/5 border-2 border-copper/40 p-6 relative overflow-hidden group hover:border-copper transition-all">
        <div class="absolute top-0 right-0 w-20 h-20 bg-copper/10 transform rotate-45 translate-x-10 -translate-y-10"></div>
        <h3 class="text-xs font-bold text-copper/80 mb-3 tracking-widest uppercase">
          {{ $t('compte.favoris.title') }}
        </h3>
        <p class="text-5xl font-black text-copper">{{ favoritesCount }}</p>
      </div>

      <div class="bg-midnight/5 border-2 border-midnight/40 p-6 relative overflow-hidden group hover:border-midnight transition-all">
        <div class="absolute top-0 right-0 w-20 h-20 bg-midnight/10 transform rotate-45 translate-x-10 -translate-y-10"></div>
        <h3 class="text-xs font-bold text-midnight/80 mb-3 tracking-widest uppercase">
          {{ $t('compte.adresses.title') }}
        </h3>
        <p class="text-5xl font-black text-midnight">{{ addressCount }}</p>
      </div>
    </div>

    <!-- Quick Links - Design carré et viril -->
    <div>
      <h2 class="text-xl font-bold text-midnight mb-6 tracking-wide uppercase border-b-2 border-concrete pb-3">
        {{ $t('compte.dashboard.quick_links') }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <NuxtLink
          v-for="link in quickLinks"
          :key="link.to"
          :to="link.to"
          class="group flex items-center justify-between p-5 border-2 border-concrete hover:border-amber bg-white hover:bg-amber/5 transition-all duration-200"
        >
          <span class="font-bold text-midnight/80 group-hover:text-amber tracking-wide uppercase text-sm">
            {{ $t(link.label) }}
          </span>
          <svg
            class="w-5 h-5 text-midnight/40 group-hover:text-amber group-hover:translate-x-2 transition-all duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            stroke-width="3"
          >
            <path
              stroke-linecap="square"
              stroke-linejoin="miter"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'compte',
  middleware: 'auth'
})

const user = useSupabaseUser()

const userDisplayName = computed(() => {
  if (user.value?.user_metadata?.firstName) {
    return user.value.user_metadata.firstName
  }
  if (user.value?.email) {
    return user.value.email.split('@')[0]
  }
  return 'Utilisateur'
})

// Mock data - à remplacer par des vraies données
const orderCount = ref(0)
const favoritesCount = ref(0)
const addressCount = ref(0)

const quickLinks = [
  { label: 'compte.menu.profil', to: '/compte/profil' },
  { label: 'compte.menu.commandes', to: '/compte/commandes' },
  { label: 'compte.menu.favoris', to: '/compte/favoris' },
  { label: 'compte.menu.adresses', to: '/compte/adresses' }
]
</script>
