<template>
  <header
    class="sticky top-0 z-50 bg-chalk/90 backdrop-blur-md transition-shadow"
    :class="{ 'shadow-md': scrolled }"
  >
    <!-- Top Bar -->
    <div class="h-[60px] border-b border-concrete">
      <div class="container mx-auto px-6 lg:px-8 h-full">
        <div class="flex items-center justify-between h-full lg:grid lg:grid-cols-3">
          <!-- Logo (Left on Mobile, Centered on Desktop) -->
          <NuxtLink to="/" class="text-2xl font-bold font-display text-midnight lg:justify-self-center hover:scale-105 transition-transform duration-200 lg:order-2">
            Boys & Toys
          </NuxtLink>

          <!-- Left Icons (Mobile + Desktop) -->
          <div class="flex items-center gap-2 lg:order-1">
            <button class="icon-btn" :aria-label="$t('aria.searchButton')" @click="showSearch = true">
              <Search :size="20" />
            </button>
          </div>

          <!-- Right Icons (Mobile + Desktop) -->
          <div class="flex items-center gap-2 lg:order-3 lg:justify-self-end">
            <button class="icon-btn relative" :aria-label="$t('aria.cartButton')">
              <ShoppingCart :size="20" />
              <span v-if="cartItems > 0" class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-copper text-white text-xs flex items-center justify-center">
                {{ cartItems }}
              </span>
            </button>

            <!-- Desktop Only Icons -->
            <button class="icon-btn hidden lg:inline-flex" :aria-label="$t('aria.favoritesButton')">
              <Heart :size="20" />
            </button>
            <button class="icon-btn hidden lg:inline-flex" :aria-label="$t('aria.accountButton')">
              <User :size="20" />
            </button>

            <!-- Language Selector (Desktop Only) -->
            <div class="relative hidden lg:block">
              <button
                class="icon-btn flex items-center gap-1"
                @click="toggleLangDropdown"
                aria-label="Language"
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

            <!-- Mobile Burger -->
            <button class="lg:hidden icon-btn" aria-label="Menu" @click="toggleMobileMenu">
              <Menu :size="24" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Sub Nav (Desktop) -->
    <nav class="hidden lg:block border-b border-concrete">
      <div class="container mx-auto px-8">
        <div class="flex items-center h-12 gap-x-8 text-sm tracking-wide">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            :class="['nav-link group', { 'text-amber border-b-2 border-amber no-hover-underline': activeRoute === link.to }]"
          >
            {{ $t(link.label) }}
            <ChevronDown :size="16" class="inline-block ml-1 transition-transform duration-200 group-hover:rotate-180" />
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <div v-if="mobileMenuOpen" class="lg:hidden bg-chalk border-b border-concrete animate-slide-down">
      <div class="container mx-auto px-4 py-4">
        <!-- Mobile Actions -->
        <div class="flex items-center gap-4 pb-4 border-b border-concrete mb-4">
          <button class="icon-btn" :aria-label="$t('aria.favoritesButton')">
            <Heart :size="20" />
          </button>
          <button class="icon-btn" :aria-label="$t('aria.accountButton')">
            <User :size="20" />
          </button>
          <div class="flex-1"></div>
          <button
            @click="switchLocale(locale === 'fr' ? 'en' : 'fr')"
            class="px-3 py-1 rounded bg-midnight/5 hover:bg-amber hover:text-white text-sm font-medium transition-colors duration-200"
          >
            {{ locale === 'fr' ? 'EN' : 'FR' }}
          </button>
        </div>

        <!-- Mobile Navigation Links -->
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

    <!-- Search Overlay -->
    <SearchOverlay v-model="showSearch" />
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Search, Heart, ShoppingCart, User, Menu, Globe, ChevronDown } from 'lucide-vue-next'
import SearchOverlay from '~/components/SearchOverlay.vue'

const { locale, setLocale } = useI18n()
const route = useRoute()
const scrolled = ref(false)
const showLangDropdown = ref(false)
const mobileMenuOpen = ref(false)
const cartItems = ref(2) // Mock pour test
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
  scrolled.value = window.scrollY > 10
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
