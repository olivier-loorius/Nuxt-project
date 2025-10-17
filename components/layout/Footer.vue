<template>
  <section role="contentinfo" class="bg-midnight text-white/60 pt-16 pb-6 border-t border-white/10">
    <div class="max-w-7xl mx-auto px-8">
      <!-- Grid principale -->
      <div class="grid grid-cols-10 md:grid-cols-12 gap-6 md:gap-8 mb-12">
        <!-- Col 1: Branding -->
        <div class="col-span-10 md:col-span-4 text-center md:text-left mb-8 md:mb-0">
          <NuxtLink to="/" class="inline-block mb-3">
            <NuxtImg
              src="/Logo.png"
              alt="Boys & Toys Logo"
              width="32"
              height="32"
              class="mx-auto md:mx-0"
            />
          </NuxtLink>
          <h2 class="text-xl font-display font-bold text-white mb-2">
            Boys & Toys
          </h2>
          <p class="text-sm font-body text-white/50 leading-relaxed">
            {{ $t('footer.tagline') }}
          </p>
        </div>

        <!-- Col 2: Légal (40% mobile, 2/12 desktop) -->
        <div class="col-span-4 md:col-span-2">
          <h3 class="text-sm font-display font-bold uppercase text-white/90 tracking-wide mb-4">
            {{ $t('footer.legal.title') }}
          </h3>
          <nav>
            <ul class="space-y-2">
              <li>
                <NuxtLink to="/legal/cgv" class="text-sm font-body hover:text-amber transition-colors duration-300">
                  {{ $t('footer.legal.cgv') }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/legal/cgu" class="text-sm font-body hover:text-amber transition-colors duration-300">
                  {{ $t('footer.legal.cgu') }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/legal/mentions-legales" class="text-sm font-body hover:text-amber transition-colors duration-300">
                  {{ $t('footer.legal.mentions') }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/legal/confidentialite" class="text-sm font-body hover:text-amber transition-colors duration-300">
                  {{ $t('footer.legal.privacy') }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/legal/faq" class="text-sm font-body hover:text-amber transition-colors duration-300">
                  {{ $t('footer.legal.faq') }}
                </NuxtLink>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Col 3: Réseaux (60% mobile stacked with Contact, 3/12 desktop) -->
        <div class="col-span-6 md:col-span-3">
          <h3 class="text-sm font-display font-bold uppercase text-white/90 tracking-wide mb-4">
            {{ $t('footer.follow') }}
          </h3>
          <div class="space-y-2">
            <a href="https://instagram.com/boysandtoys" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 text-sm font-body hover:text-amber transition-colors duration-300">
              <Instagram class="h-4 w-4 text-amber/60 group-hover:text-amber transition-colors duration-300" />
              <span>Instagram</span>
            </a>
            <a href="https://x.com/boysandtoys_x" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 text-sm font-body hover:text-amber transition-colors duration-300">
              <Twitter class="h-4 w-4 text-amber/60 group-hover:text-amber transition-colors duration-300" />
              <span>Twitter/X</span>
            </a>
          </div>

          <!-- Contact (Mobile only - inside Réseaux column) -->
          <div class="md:hidden mt-6">
            <h3 class="text-sm font-display font-bold uppercase text-white/90 tracking-wide mb-4">
              {{ $t('footer.contact.title') }}
            </h3>
            <div class="space-y-2">
              <a href="mailto:contact@boysandtoys.fr" class="flex items-center gap-2 text-sm font-body hover:text-amber transition-colors duration-300">
                <Mail class="h-4 w-4 text-amber/60 hover:text-amber transition-colors duration-300" />
                <span>{{ $t('footer.contact.email') }}</span>
              </a>
              <a href="tel:+33123456789" class="flex items-center gap-2 text-sm font-body hover:text-amber transition-colors duration-300">
                <Phone class="h-4 w-4 text-amber/60 hover:text-amber transition-colors duration-300" />
                <span>{{ $t('footer.contact.phone') }}</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Col 4: Contact (Desktop only - separate column 3/12) -->
        <div class="hidden md:block md:col-span-3">
          <h3 class="text-sm font-display font-bold uppercase text-white/90 tracking-wide mb-4">
            {{ $t('footer.contact.title') }}
          </h3>
          <div class="space-y-2">
            <a href="mailto:contact@boysandtoys.fr" class="flex items-center gap-2 text-sm font-body hover:text-amber transition-colors duration-300">
              <Mail class="h-4 w-4 text-amber/60 hover:text-amber transition-colors duration-300" />
              <span>{{ $t('footer.contact.email') }}</span>
            </a>
            <a href="tel:+33123456789" class="flex items-center gap-2 text-sm font-body hover:text-amber transition-colors duration-300">
              <Phone class="h-4 w-4 text-amber/60 hover:text-amber transition-colors duration-300" />
              <span>{{ $t('footer.contact.phone') }}</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Trust Badge 18+ -->
      <div class="py-8 border-t border-white/5 text-center">
        <div class="inline-flex items-center gap-2 px-6 py-3 border-2 border-amber bg-transparent btn-beveled">
          <ShieldCheck class="h-5 w-5 text-amber" />
          <span class="text-sm font-display font-semibold text-white">
            {{ $t('footer.trust.secure') }}
          </span>
        </div>
      </div>

      <!-- Paiements acceptés -->
      <div class="py-8 border-t border-white/5">
        <h3 class="text-sm font-display font-bold uppercase text-white/90 text-center mb-6">
          {{ $t('footer.payments.title') }}
        </h3>
        <div class="flex justify-center gap-4 flex-wrap">
          <!-- Visa -->
          <div class="w-12 h-8 bg-white rounded-md border border-white/10 flex items-center justify-center p-1.5 shadow-sm">
            <NuxtImg
              src="/images/visa.png"
              alt="Visa"
              width="32"
              height="auto"
              class="object-contain"
            />
          </div>
          <!-- Mastercard -->
          <div class="w-12 h-8 bg-white rounded-md border border-white/10 flex items-center justify-center p-1.5 shadow-sm">
            <NuxtImg
              src="/images/mastercard.png"
              alt="Mastercard"
              width="32"
              height="auto"
              class="object-contain"
            />
          </div>
          <!-- Amex -->
          <div class="w-12 h-8 bg-white rounded-md border border-white/10 flex items-center justify-center p-1.5 shadow-sm">
            <NuxtImg
              src="/images/amex.png"
              alt="Amex"
              width="32"
              height="auto"
              class="object-contain"
            />
          </div>
          <!-- PayPal -->
          <div class="w-12 h-8 bg-white rounded-md border border-white/10 flex items-center justify-center p-1.5 shadow-sm">
            <NuxtImg
              src="/images/paypal.png"
              alt="PayPal"
              width="32"
              height="auto"
              class="object-contain"
            />
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="relative py-3 pb-4 mt-4 border-t border-white/5 flex flex-col md:flex-row items-center md:items-start text-center gap-3">
        <p class="text-xs text-white/30 mb-2 md:mb-0 md:flex-1 md:text-center">
          © {{ currentYear }} Boys & Toys. {{ $t('footer.copyright') }}
        </p>
        <button
          @click="openCookieSettings"
          class="md:absolute md:right-0 md:top-3 mx-auto md:mx-0 inline-flex items-center gap-2 text-xs text-white/50 hover:text-amber transition-colors duration-300"
          :aria-label="$t('footer.cookies.aria')"
        >
          <Cookie class="h-3.5 w-3.5" />
          <span>{{ $t('footer.cookies.label') }}</span>
        </button>
      </div>
    </div>

    <!-- Bouton paramètres fixe -->
    <button
      @click="openGeneralSettings"
      class="fixed bottom-6 left-6 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-white/95 backdrop-blur-md border border-midnight/10 shadow-lg hover:shadow-xl hover:border-amber transition-all duration-300 group"
      :aria-label="$t('footer.settings.aria')"
    >
      <Settings class="h-4 w-4 text-amber group-hover:rotate-90 transition-transform duration-700" />
    </button>

    <!-- Bouton ScrollToTop fixe -->
    <button
      v-show="showScrollTop"
      @click="scrollToTop"
      class="fixed bottom-20 left-6 z-50 w-10 h-10 rounded-full bg-white/95 backdrop-blur-md border border-midnight/10 shadow-lg hover:shadow-xl hover:border-amber transition-all duration-300 group flex items-center justify-center"
      :aria-label="$t('footer.scrollTop.aria')"
    >
      <ArrowUp class="h-4 w-4 text-amber group-hover:-translate-y-0.5 transition-transform duration-300" />
    </button>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Instagram, Twitter, ShieldCheck, Mail, Phone, Settings, Cookie, ArrowUp } from 'lucide-vue-next'

/**
 * Footer - Structure grid responsive mobile/desktop
 *
 * STRUCTURE:
 * - Grid responsive: Mobile grid-cols-10 / Desktop md:grid-cols-12
 * - Colonnes: Branding (4) / Légal (2) / Réseaux (3) / Contact (3)
 * - Trust Badge 18+ centré avec bordure
 * - Paiements acceptés avec icônes brand
 * - Copyright + Cookies inline responsive
 * - Boutons fixes bottom-left
 *
 * DESIGN SYSTEM:
 * - Section: bg-midnight text-white/60 pt-16 pb-6 border-t border-white/10
 * - Container: max-w-7xl mx-auto px-8
 * - Grid: grid-cols-10 md:grid-cols-12 gap-6 md:gap-8 mb-12
 * - Titles: text-sm Sora bold uppercase tracking-wide
 * - Links: text-sm hover:text-amber transition-colors
 * - Icons: Lucide h-4 w-4 text-amber/60
 */

interface FooterLabels {
  tagline: string
  follow: string
  legal: {
    title: string
    cgv: string
    cgu: string
    mentions: string
    privacy: string
    faq: string
  }
  contact: {
    title: string
    email: string
    phone: string
  }
  trust: {
    secure: string
  }
  payments: {
    title: string
  }
  copyright: string
  cookies: {
    aria: string
    label: string
    buttonLabel: string
  }
  settings: {
    aria: string
    label: string
  }
}

const currentYear = new Date().getFullYear()
const showScrollTop = ref(false)

const openCookieSettings = () => {
  console.warn('Cookie settings modal not yet implemented')
}

const openGeneralSettings = () => {
  console.warn('General settings modal not yet implemented (V2)')
}

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
