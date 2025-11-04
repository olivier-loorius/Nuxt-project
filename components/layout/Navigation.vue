<template>
  <header
    class="sticky top-0 z-50 bg-chalk backdrop-blur-md transition-shadow"
    :class="{ 'shadow-md': isScrolled }"
  >
    <div class="h-[60px] border-b border-concrete">
      <div class="container mx-auto px-6 h-full">
        <div class="flex items-center justify-between h-full">
          <NuxtLink to="/" class="text-2xl font-bold font-display text-midnight hover:scale-105 transition-transform duration-200 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
            Boys & Toys
          </NuxtLink>
          <div class="hidden lg:flex items-center gap-2">
            <button class="icon-btn" :aria-label="$t('aria.searchButton')" @click="showSearch = true">
              <Search :size="20" />
            </button>
          </div>

          <div class="flex items-center gap-4 ml-auto">
            <div class="flex items-center gap-2 lg:hidden">
              <button class="icon-btn" :aria-label="$t('aria.searchButton')" @click="showSearch = true">
                <Search :size="20" />
              </button>
              <button class="icon-btn relative" :aria-label="$t('aria.cartButton')">
                <ShoppingCart :size="20" />
                <span v-if="cartItems > 0" class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-copper text-white text-xs flex items-center justify-center">
                  {{ cartItems }}
                </span>
              </button>
            </div>

            <button class="hidden lg:inline-flex icon-btn relative" :aria-label="$t('aria.cartButton')">
              <ShoppingCart :size="20" />
              <span v-if="cartItems > 0" class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-copper text-white text-xs flex items-center justify-center">
                {{ cartItems }}
              </span>
            </button>

            <button class="hidden lg:inline-flex icon-btn" :aria-label="$t('aria.favoritesButton')">
              <Heart :size="20" />
            </button>
            <div v-if="!user" class="hidden lg:block">
              <button
                class="icon-btn"
                :aria-label="$t('nav.login')"
                @click="handleAuthClick"
              >
                <User :size="20" />
              </button>
            </div>
            <div v-else class="hidden lg:block relative">
              <button
                @click="showUserDropdown = !showUserDropdown"
                class="icon-btn relative"
                :aria-label="$t('nav.account')"
              >
                <!-- Bordure copper coins coupés -->
                <div class="absolute inset-0 border-2 border-[var(--copper)]" style="clip-path: polygon(0 6px, 6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)"></div>
                <!-- Icône User -->
                <User :size="20" class="text-amber" />
                <!-- Point vert de statut -->
                <span class="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full shadow-md"></span>
              </button>

              <div
                v-if="showUserDropdown"
                class="absolute right-0 mt-2 w-56 bg-white border-2 border-concrete shadow-lg z-[60] animate-fade-in"
              >
                <button
                  @click="handleNavigateToAccount"
                  class="flex items-center gap-3 w-full text-left px-5 py-4 text-xs font-bold tracking-widest uppercase text-midnight hover:bg-amber hover:text-white transition-all duration-200 group border-l-4 border-transparent hover:border-amber"
                >
                  <LayoutDashboard :size="16" class="text-amber group-hover:text-white transition-colors" />
                  <span>{{ $t('compte.menu.dashboard') }}</span>
                </button>
                <button
                  @click="handleNavigateToProfil"
                  class="flex items-center gap-3 w-full text-left px-5 py-4 text-xs font-bold tracking-widest uppercase text-midnight hover:bg-amber hover:text-white transition-all duration-200 group border-l-4 border-transparent hover:border-amber"
                >
                  <UserCircle :size="16" class="text-amber group-hover:text-white transition-colors" />
                  <span>{{ $t('compte.menu.profil') }}</span>
                </button>
                <div class="border-t-2 border-concrete"></div>
                <button
                  @click="handleLogout"
                  class="flex items-center gap-3 w-full text-left px-5 py-4 text-xs font-bold tracking-widest uppercase text-red-600 hover:bg-red-50 transition-all duration-200 group border-l-4 border-transparent hover:border-red-500"
                >
                  <LogOut :size="16" class="text-red-500 group-hover:text-red-600 transition-colors" />
                  <span>{{ $t('compte.menu.logout') }}</span>
                </button>
              </div>
            </div>
            <div class="relative hidden lg:block">
              <button
                class="icon-btn flex items-center gap-1"
                @click="toggleLangDropdown"
                :aria-label="$t('aria.languageSelector')"
              >
                <Globe :size="20" />
                <span class="text-sm font-medium">{{ locale.toUpperCase() }}</span>
              </button>
              <div
                v-if="showLangDropdown"
                class="absolute right-0 mt-2 bg-white rounded-md shadow-lg overflow-hidden z-[60] animate-fade-in"
              >
                <button
                  @click="switchLocale('fr')"
                  class="block w-full px-4 py-2 text-left text-sm hover:bg-amber hover:text-white transition-colors duration-200"
                >
                  FR
                </button>
                <button
                  @click="switchLocale('en')"
                  class="block w-full px-4 py-2 text-left text-sm hover:bg-amber hover:text-white transition-colors duration-200"
                >
                  EN
                </button>
              </div>
            </div>
            <button class="lg:hidden icon-btn" :aria-label="$t('aria.menuButton')" @click="toggleMobileMenu">
              <Menu :size="24" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <nav class="hidden lg:block border-b border-concrete">
      <div class="container mx-auto px-8">
        <div class="flex flex-wrap items-center justify-center h-12 gap-x-6 text-sm tracking-wide">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            :class="['nav-link group flex items-center gap-1.5 whitespace-nowrap', { 'text-amber border-b-2 border-amber no-hover-underline': activeRoute === link.to }]"
          >
            <span>{{ $t(link.label) }}</span>
            <ChevronDown :size="14" class="flex-shrink-0 transition-transform duration-200 group-hover:rotate-180" />
          </NuxtLink>
        </div>
      </div>
    </nav>
    <div v-if="mobileMenuOpen" class="lg:hidden bg-chalk border-b border-concrete animate-slide-down">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center gap-4 pb-4 border-b border-concrete mb-4">
          <button class="icon-btn" :aria-label="$t('aria.favoritesButton')">
            <Heart :size="20" />
          </button>
          <button v-if="!user" class="icon-btn" :aria-label="$t('aria.accountButton')" @click="handleAuthClick">
            <User :size="20" />
          </button>
          <button v-else class="icon-btn relative" :aria-label="$t('nav.account')" @click="navigateTo('/compte')">
            <!-- Bordure copper coins coupés -->
            <div class="absolute inset-0 border-2 border-[var(--copper)]" style="clip-path: polygon(0 6px, 6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)"></div>
            <!-- Icône User -->
            <User :size="20" class="text-amber" />
            <!-- Point vert de statut -->
            <span class="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full shadow-md"></span>
          </button>
          <div class="flex-1"></div>
          <button
            @click="switchLocale(locale === 'fr' ? 'en' : 'fr')"
            class="px-3 py-1 rounded bg-midnight/5 hover:bg-amber hover:text-white text-sm font-medium transition-colors duration-200"
          >
            {{ locale === 'fr' ? 'EN' : 'FR' }}
          </button>
        </div>
        <nav class="flex flex-col gap-3">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            :class="['mobile-link', { 'text-amber': activeRoute === link.to }]"
            @click="closeMobileMenu"
          >
            {{ $t(link.label) }}
          </NuxtLink>
        </nav>
      </div>
    </div>

    <FeaturesSearchOverlay v-model="showSearch" />
    <AuthModal v-model="showAuthModal" />
  </header>
</template>

<script setup lang="ts">
import { Search, Heart, ShoppingCart, User, Menu, Globe, ChevronDown, LayoutDashboard, UserCircle, LogOut } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'

const { t, locale, setLocale } = useI18n()
const route = useRoute()

const user = useSupabaseUser()
const { signOut } = useAuth()

const isScrolled = ref(false)
const showLangDropdown = ref(false)
const mobileMenuOpen = ref(false)
const showAuthModal = ref(false)
const showUserDropdown = ref(false)
const cartItems = ref(2)
const showSearch = ref(false)

const navLinks = [
  { label: 'pages.nouveautes', to: '/nouveautes' },
  { label: 'pages.best-sellers', to: '/best-sellers' },
  { label: 'pages.categories', to: '/categories' },
  { label: 'pages.lingerie', to: '/lingerie' },
  { label: 'pages.accessoires', to: '/accessoires' },
  { label: 'pages.idees-cadeaux', to: '/idees-cadeaux' },
  { label: 'pages.promotions', to: '/promotions' }
]

const activeRoute = computed(() => route.path)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const toggleLangDropdown = () => {
  showLangDropdown.value = !showLangDropdown.value
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const switchLocale = (newLocale: 'fr' | 'en') => {
  setLocale(newLocale)
  showLangDropdown.value = false
}

const handleLogout = async () => {
  try {
    await signOut()
    showUserDropdown.value = false
  } catch (error: any) {
    console.error('Logout error:', error)
  }
}

const handleNavigateToAccount = async () => {
  showUserDropdown.value = false
  await navigateTo('/compte')
}

const handleNavigateToProfil = async () => {
  showUserDropdown.value = false
  await navigateTo('/compte/profil')
}

const handleAuthClick = () => {
  showAuthModal.value = true
  if (mobileMenuOpen.value) {
    closeMobileMenu()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
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

.nav-link {
  padding: 0.5rem 0.25rem;
  color: var(--midnight);
  text-decoration: none;
  transition: color 300ms ease;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0.25rem;
  width: 0;
  height: 2px;
  background-color: var(--amber);
  transition: width 300ms ease;
}

.nav-link:hover {
  color: var(--amber);
}

.nav-link:hover::after {
  width: calc(100% - 0.5rem);
}

.no-hover-underline::after {
  content: none !important;
}

.mobile-link {
  padding: 0.75rem 0;
  min-height: 48px;
  display: flex;
  align-items: center;
  color: var(--midnight);
  text-decoration: none;
  font-size: var(--text-lg);
  transition: all var(--transition-base);
  border-bottom: 1px solid var(--concrete);
}

.mobile-link:hover {
  color: var(--amber);
  padding-left: 0.5rem;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 200ms ease-out;
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-down {
  animation: slide-down 300ms ease-out;
}
</style>
