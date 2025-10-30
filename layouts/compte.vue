<template>
  <div>
    <LayoutInfoBanner />
    <LayoutNavigation />
    <main class="bg-chalk min-h-screen">
      <div class="container mx-auto px-6 py-12">
        <div class="flex flex-col lg:flex-row gap-6">
          <!-- Sidebar Navigation (Desktop) - Design masculin carré -->
          <aside class="hidden lg:block w-72 flex-shrink-0">
            <nav class="bg-white border-2 border-concrete sticky top-24">
              <NuxtLink
                v-for="link in accountLinks"
                :key="link.to"
                :to="link.to"
                :class="[
                  'block px-6 py-4 text-sm font-medium tracking-wide uppercase transition-all duration-200 border-l-4',
                  isActive(link.to)
                    ? 'bg-amber/10 text-amber border-amber'
                    : 'text-midnight/70 border-transparent hover:bg-midnight/5 hover:text-midnight hover:border-concrete'
                ]"
              >
                {{ $t(link.label) }}
              </NuxtLink>
            </nav>
          </aside>

          <!-- Mobile Navigation (Tabs) - Design carré -->
          <div class="lg:hidden">
            <div class="bg-white border-2 border-concrete p-2 flex gap-2 overflow-x-auto">
              <NuxtLink
                v-for="link in accountLinks"
                :key="link.to"
                :to="link.to"
                :class="[
                  'px-4 py-3 text-xs font-medium tracking-wider uppercase whitespace-nowrap transition-all duration-200 border-b-2',
                  isActive(link.to)
                    ? 'text-amber border-amber'
                    : 'text-midnight/70 border-transparent hover:text-midnight'
                ]"
              >
                {{ $t(link.label) }}
              </NuxtLink>
            </div>
          </div>

          <!-- Main Content -->
          <div class="flex-1">
            <slot />
          </div>
        </div>
      </div>
    </main>
    <LayoutFooter />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const accountLinks = [
  { label: 'compte.menu.dashboard', to: '/compte' },
  { label: 'compte.menu.profil', to: '/compte/profil' },
  { label: 'compte.menu.commandes', to: '/compte/commandes' },
  { label: 'compte.menu.favoris', to: '/compte/favoris' },
  { label: 'compte.menu.adresses', to: '/compte/adresses' }
]

const isActive = (path: string) => {
  if (path === '/compte') {
    return route.path === '/compte'
  }
  return route.path.startsWith(path)
}
</script>

<style scoped>

.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: var(--concrete);
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: var(--amber);
  border-radius: 4px;
}
</style>
