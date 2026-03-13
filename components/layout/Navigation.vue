<template>
  <header
    class="sticky top-0 z-50 bg-chalk backdrop-blur-md transition-shadow"
    :class="{ 'shadow-md': isScrolled }"
  >
    <div class="h-[60px] border-b border-concrete">
      <div class="container mx-auto px-6 h-full">
        <div class="flex items-center justify-between h-full">
          <NuxtLink :to="localePath('/')" class="text-2xl font-bold font-display text-midnight hover:scale-105 transition-transform duration-200 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
            Boys & Toys
          </NuxtLink>
          <div class="hidden lg:flex items-center gap-2">
            <button class="icon-btn" :aria-label="$t('aria.searchButton')" @click="showSearch = true">
              <Search :size="20" />
            </button>
          </div>

          <div class="flex items-center gap-4 ml-auto">
            <div class="flex items-center gap-1 lg:hidden">
              <button v-if="showBackToMenu && !mobileMenuOpen" class="icon-btn" @click="mobileMenuOpen = true; clearBackToMenu()">
                <ArrowLeft :size="22" />
              </button>
              <button class="icon-btn relative" :aria-label="$t('aria.cartButton')" @click="showCartDrawer = true">
                <ShoppingCart :size="20" :class="cartCount > 0 ? 'stroke-amber' : 'stroke-midnight/55'" />
                <span v-if="cartCount > 0" class="absolute -top-1 -right-1 w-[15px] h-[15px] rounded-full bg-amber text-midnight text-[10px] flex items-center justify-center">
                  {{ cartCount }}
                </span>
              </button>
              <div v-if="!user">
                <button class="icon-btn" :aria-label="$t('nav.login')" @click="handleAuthClick">
                  <User :size="20" />
                </button>
              </div>
              <div v-else class="relative">
                <button class="icon-btn relative" :aria-label="$t('nav.account')" @click="showUserDropdown = !showUserDropdown">
                  <span class="absolute inset-[3px] border border-amber rounded-full" />
                  <User :size="20" class="text-amber" />
                  <span class="absolute top-[2px] right-[2px] w-[9px] h-[9px] bg-green-500 rounded-full" />
                </button>
                <div v-if="showUserDropdown" class="absolute right-0 mt-2 w-56 bg-white border-2 border-concrete shadow-lg z-[60] animate-fade-in">
                  <button @click="handleNavigateToAccount" class="flex items-center gap-3 w-full text-left px-5 py-4 text-xs font-bold tracking-widest uppercase text-midnight hover:bg-amber hover:text-white transition-all duration-200 group border-l-4 border-transparent hover:border-amber">
                    <LayoutDashboard :size="16" class="text-amber group-hover:text-white transition-colors" />
                    <span>{{ $t('compte.menu.dashboard') }}</span>
                  </button>
                  <button @click="handleNavigateToProfil" class="flex items-center gap-3 w-full text-left px-5 py-4 text-xs font-bold tracking-widest uppercase text-midnight hover:bg-amber hover:text-white transition-all duration-200 group border-l-4 border-transparent hover:border-amber">
                    <UserCircle :size="16" class="text-amber group-hover:text-white transition-colors" />
                    <span>{{ $t('compte.menu.profil') }}</span>
                  </button>
                  <div class="border-t-2 border-concrete"></div>
                  <button v-if="!isAdmin" @click="handleLogout" class="flex items-center gap-3 w-full text-left px-5 py-4 text-xs font-bold tracking-widest uppercase text-red-600 hover:bg-red-50 transition-all duration-200 group border-l-4 border-transparent hover:border-red-500">
                    <LogOut :size="16" class="text-red-500 group-hover:text-red-600 transition-colors" />
                    <span>{{ $t('compte.menu.logout') }}</span>
                  </button>
                </div>
              </div>
              <button class="icon-btn" :aria-label="$t('aria.menuButton')" @click="toggleMobileMenu">
                <component :is="mobileMenuOpen ? X : Menu" :size="24" class="transition-all duration-200" />
              </button>
            </div>

            <button class="hidden lg:inline-flex icon-btn relative" :aria-label="$t('aria.cartButton')" @click="showCartDrawer = true">
              <ShoppingCart :size="20" :class="cartCount > 0 ? 'stroke-amber' : 'stroke-midnight/55'" />
              <span v-if="cartCount > 0" class="absolute -top-1 -right-1 w-[15px] h-[15px] rounded-full bg-amber text-midnight text-[10px] flex items-center justify-center">
                {{ cartCount }}
              </span>
            </button>

            <span class="hidden lg:block w-px h-4 bg-concrete flex-shrink-0" />

            <button class="hidden lg:inline-flex icon-btn relative" :aria-label="$t('aria.favoritesButton')" @click="showFavoritesDrawer = true">
              <Heart :size="20" :class="favorites.length > 0 ? 'stroke-amber fill-none' : 'stroke-midnight/55'" />
              <span v-if="favorites.length > 0" class="absolute -top-1 -right-1 w-[15px] h-[15px] rounded-full bg-amber text-midnight text-[10px] flex items-center justify-center">
                {{ favorites.length }}
              </span>
            </button>

            <span class="hidden lg:block w-px h-4 bg-concrete flex-shrink-0" />

            <NuxtLink
              v-if="isAdmin"
              to="/admin"
              class="hidden lg:inline-flex items-center gap-2 bg-amber text-midnight px-3 py-1.5 rounded text-xs font-bold tracking-wide hover:bg-amber/90 transition-colors duration-200 flex-shrink-0"
            >
              <LayoutDashboard :size="15" />
              Admin
            </NuxtLink>
            <span v-if="isAdmin" class="hidden lg:block w-px h-4 bg-concrete flex-shrink-0" />

            <div v-if="!user" class="hidden lg:block">
              <button class="icon-btn" :aria-label="$t('nav.login')" @click="handleAuthClick">
                <User :size="20" />
              </button>
            </div>
            <div v-else class="hidden lg:block relative">
              <button
                @click="showUserDropdown = !showUserDropdown"
                class="icon-btn relative"
                :aria-label="$t('nav.account')"
              >
                <span class="absolute inset-[3px] border border-amber rounded-full" />
                <User :size="20" class="text-amber" />
                <span class="absolute top-[2px] right-[2px] w-[9px] h-[9px] bg-green-500 rounded-full" />
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
                  v-if="!isAdmin"
                  @click="handleLogout"
                  class="flex items-center gap-3 w-full text-left px-5 py-4 text-xs font-bold tracking-widest uppercase text-red-600 hover:bg-red-50 transition-all duration-200 group border-l-4 border-transparent hover:border-red-500"
                >
                  <LogOut :size="16" class="text-red-500 group-hover:text-red-600 transition-colors" />
                  <span>{{ $t('compte.menu.logout') }}</span>
                </button>
              </div>
            </div>
            <span class="hidden lg:block w-px h-4 bg-concrete flex-shrink-0" />
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
            :to="localePath(link.to)"
            :class="['nav-link group flex items-center gap-1.5 whitespace-nowrap', { 'text-amber border-b-2 border-amber no-hover-underline': activeRoute === localePath(link.to) }]"
          >
            <span>{{ $t(link.label) }}</span>
            <ChevronDown :size="14" class="flex-shrink-0 transition-transform duration-200 group-hover:rotate-180" />
          </NuxtLink>
        </div>
      </div>
    </nav>
    <div v-if="mobileMenuOpen" class="lg:hidden bg-chalk border-b border-concrete animate-slide-down min-h-[calc(100vh-61px)]">
      <div class="container mx-auto px-4 py-4">
        <div class="flex border-b border-concrete mb-4">
          <button
            class="flex-1 flex items-center justify-center gap-2 py-4 bg-midnight/5 hover:bg-midnight/10 transition-colors duration-200 text-sm font-medium text-midnight"
            :aria-label="$t('aria.searchButton')"
            @click="showSearch = true; closeMobileMenu()"
          >
            <Search :size="20" />
            <span>{{ $t('aria.searchButton') }}</span>
          </button>
          <span class="w-px bg-concrete flex-shrink-0" />
          <button
            class="w-14 flex items-center justify-center py-4 bg-midnight/5 hover:bg-midnight/10 transition-colors duration-200 relative"
            :class="favorites.length > 0 ? 'text-amber' : 'text-midnight/55'"
            :aria-label="$t('aria.favoritesButton')"
            @click="showFavoritesDrawer = true; closeMobileMenu()"
          >
            <Heart :size="20" :class="favorites.length > 0 ? 'stroke-amber fill-none' : 'stroke-midnight/55'" />
            <span v-if="favorites.length > 0" class="absolute top-1 right-1 w-[15px] h-[15px] rounded-full bg-amber text-midnight text-[10px] flex items-center justify-center">
              {{ favorites.length }}
            </span>
          </button>
          <span class="w-px bg-concrete flex-shrink-0" />
          <button
            class="w-14 flex items-center justify-center py-4 bg-midnight/5 hover:bg-midnight/10 transition-colors duration-200 text-sm font-medium text-midnight"
            :aria-label="$t('aria.languageSelector')"
            @click="switchLocale((locale === 'fr' ? 'en' : 'fr') as 'fr' | 'en')"
          >
            {{ locale.toUpperCase() }}
          </button>
        </div>
        <nav class="flex flex-col gap-3">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="localePath(link.to)"
            :class="['mobile-link justify-between', { 'text-amber': activeRoute === localePath(link.to) }]"
            @click="closeMobileMenu"
          >
            {{ $t(link.label) }}
            <ChevronRight :size="16" class="text-midnight/30" />
          </NuxtLink>
          <NuxtLink
            v-if="isAdmin"
            to="/admin"
            class="flex items-center justify-between w-full px-4 py-3.5 bg-amber text-midnight font-bold text-xs tracking-wide rounded-sm hover:bg-amber/90 transition-colors duration-200 mt-2"
            @click="closeMobileMenu"
          >
            <span class="flex items-center gap-3">
              <LayoutDashboard :size="16" />
              Administration
            </span>
            <ChevronRight :size="16" />
          </NuxtLink>
          <p v-if="isAdmin" class="text-center text-[10px] font-body text-midnight/35 mt-1.5 px-2">
            Gestion recommandée sur ordinateur
          </p>
        </nav>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="mobileMenuOpen" class="lg:hidden fixed inset-0 bg-midnight/40 z-[45]" @click="toggleMobileMenu" />
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showFavoritesDrawer"
          class="fixed inset-0 bg-midnight/50 z-[70]"
          @click="showFavoritesDrawer = false"
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
          v-if="showFavoritesDrawer"
          class="fixed top-0 right-0 h-full w-full sm:w-80 bg-chalk z-[80] flex flex-col shadow-2xl"
        >
          <div class="flex items-center justify-between px-5 py-4 border-b border-concrete flex-shrink-0">
            <div>
              <p class="font-display font-bold text-midnight text-sm tracking-tight">
                {{ user?.user_metadata?.firstName ? $t('favorites.title') + ' · ' + user.user_metadata.firstName : $t('favorites.title') }}
              </p>
              <p class="text-[10px] font-body text-midnight/40 mt-0.5 tabular-nums">
                {{ favorites.length }}
                {{ favorites.length > 1 ? $t('catalog.product_other') : $t('catalog.product_one') }}
              </p>
            </div>
            <button
              class="icon-btn"
              :aria-label="$t('aria.close')"
              @click="showFavoritesDrawer = false"
            >
              <X :size="18" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto py-3">
            <div
              v-if="!favoriteProducts.length"
              class="flex flex-col items-center justify-center gap-3 h-full py-16 text-center px-6"
            >
              <Heart :size="32" class="text-concrete" />
              <p class="text-xs font-display font-medium uppercase tracking-[0.18em] text-midnight/35">
                {{ $t('favorites.empty') }}
              </p>
            </div>

            <ul v-else class="divide-y divide-concrete">
              <li
                v-for="product in favoriteProducts"
                :key="product.id"
                class="flex items-center gap-3 px-4 py-3 hover:bg-midnight/3 transition-colors duration-150"
              >
                <div
                  class="flex-shrink-0 w-14 h-14 flex items-center justify-center"
                  :class="drawerBg(product.id)"
                >
                  <ImageIcon :size="18" class="text-midnight/15" />
                </div>

                <div class="flex-1 min-w-0">
                  <NuxtLink
                    :to="localePath(`/produit/${product.id}`)"
                    class="block font-display font-medium text-midnight text-xs leading-snug line-clamp-2 hover:text-amber transition-colors duration-200"
                    @click="showFavoritesDrawer = false"
                  >
                    {{ t(product.nameKey) }}
                  </NuxtLink>
                  <p class="font-body text-xs text-midnight/50 mt-1 tabular-nums">
                    {{ formatPrice(product.price) }}
                  </p>
                </div>

                <button
                  class="flex-shrink-0 p-1.5 text-midnight/30 hover:text-[#EF4444] transition-colors duration-200"
                  :aria-label="$t('favorites.remove')"
                  @click="toggleFavorite(product.id)"
                >
                  <Trash2 :size="14" />
                </button>
              </li>
            </ul>
          </div>

          <div v-if="favoriteProducts.length" class="flex-shrink-0 px-4 py-4 border-t border-concrete">
            <button
              class="w-full py-2.5 text-[10px] font-body tracking-[0.18em] uppercase text-midnight/40 hover:text-[#EF4444] transition-colors duration-200"
              @click="clearFavorites"
            >
              {{ $t('favorites.clear_all') }}
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <CartDrawer v-model="showCartDrawer" />
    <FeaturesSearchOverlay v-model="showSearch" />
    <AuthModal v-model="showAuthModal" />
  </header>
</template>

<script setup lang="ts">
import { Search, Heart, ShoppingCart, User, Menu, Globe, ChevronDown, ChevronRight, LayoutDashboard, UserCircle, LogOut, Trash2, X, ImageIcon, ArrowLeft } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'
import { useNavHistory } from '~/composables/useNavHistory'
import { MOCK_PRODUCTS } from '~/data/products'

const { t, locale } = useI18n()

const { favorites, fetchFavorites, toggleFavorite, clearFavorites } = useFavorites()

const showFavoritesDrawer = ref(false)

const favoriteProducts = computed(() =>
  MOCK_PRODUCTS.filter(p => favorites.value.includes(p.id))
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
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()

const user = useSupabaseUser()
const { signOut } = useAuth()

const isScrolled = ref(false)
const showLangDropdown = ref(false)
const mobileMenuOpen = ref(false)
const { showAuthModal, authModalMessage } = useAuthModal()
const { showBackToMenu } = useNavHistory()
const showUserDropdown = ref(false)
const { cartCount, fetchCart, cart } = useCart()
const isAdmin = ref(false)

async function checkAdminRole() {
  const client = useSupabaseClient()
  const { data: { session } } = await client.auth.getSession()
  if (!session) { isAdmin.value = false; return }
  const { data } = await client.from('profiles').select('role').eq('id', session.user.id).single()
  isAdmin.value = data?.role === 'admin'
}
const showCartDrawer = ref(false)
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
  clearBackToMenu()
  document.body.style.overflow = mobileMenuOpen.value ? 'hidden' : ''
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
  showBackToMenu.value = true
  document.body.style.overflow = ''
}

const clearBackToMenu = () => {
  showBackToMenu.value = false
}

const switchLocale = async (newLocale: 'fr' | 'en') => {
  localStorage.setItem('user_locale', newLocale)
  await navigateTo(switchLocalePath(newLocale))
  showLangDropdown.value = false
}

const handleLogout = async () => {
  try {
    await signOut()
    showUserDropdown.value = false
  } catch {}
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
  authModalMessage.value = ''
  showAuthModal.value = true
  if (mobileMenuOpen.value) {
    closeMobileMenu()
  }
}

watch(user, (newUser) => {
  if (newUser) {
    fetchFavorites()
    fetchCart()
    checkAdminRole()
  } else {
    favorites.value = []
    cart.value = []
    isAdmin.value = false
  }
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  fetchFavorites()
  fetchCart()
  checkAdminRole()
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
    transform: translateX(2rem);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-down {
  animation: slide-down 300ms ease-out;
}
</style>
