<template>
  <!-- Section Newsletter Inline -->
  <section class="bg-midnight py-12">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid lg:grid-cols-5 gap-6 lg:gap-8 items-center">
        <!-- Gauche : Textes -->
        <div class="lg:col-span-2">
          <h2 class="text-2xl font-display font-semibold text-white mb-2">
            {{ t('newsletter.title') }}
          </h2>
          <p class="text-sm font-body text-chalk/80">
            {{ t('newsletter.subtitle') }}
          </p>
        </div>

        <!-- Droite : Form -->
        <div class="lg:col-span-3">
          <form @submit.prevent="handleSubmit">
            <div class="flex flex-col sm:flex-row gap-2 mb-3">
              <input
                v-model="email"
                type="email"
                :placeholder="t('newsletter.placeholder')"
                required
                class="btn-beveled flex-1 bg-white/10 border-2 border-amber text-white placeholder:text-white/70 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber"
              />
              <button
                type="submit"
                class="btn-beveled border-2 border-amber bg-amber text-midnight hover:bg-transparent hover:text-amber px-8 py-4 font-display font-semibold uppercase tracking-wide text-sm transition-all duration-300 text-center whitespace-nowrap"
              >
                {{ t('newsletter.button') }}
              </button>
            </div>

            <!-- Checkbox RGPD -->
            <div class="flex gap-2 mb-2">
              <input
                v-model="acceptNewsletter"
                type="checkbox"
                id="accept-newsletter"
                required
                class="mt-0.5 accent-amber"
              />
              <label for="accept-newsletter" class="text-xs text-white font-body cursor-pointer">
                {{ t('newsletter.accept') }}
              </label>
            </div>

            <!-- Texte légal -->
            <p class="text-xs text-white/70 font-body">
              {{ t('newsletter.legalText') }} <NuxtLink to="/confidentialite" class="text-amber underline hover:text-copper transition-colors duration-300">{{ t('newsletter.privacyPolicy') }}</NuxtLink>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * HomeNewsletter - Inline Grid Layout
 *
 * DESIGN:
 * - Section: bg-midnight py-12
 * - Grid: lg:grid-cols-5 gap-8 items-center max-w-7xl mx-auto px-6
 * - Gauche (col-span-2): h2 text-2xl Sora semibold text-white mb-2, p text-sm text-chalk/80
 * - Droite (col-span-3): form flex gap-2 mb-3
 * - Input: bg-white/10 border border-white/20 text-white placeholder-white/50 px-4 py-3 rounded-md flex-1
 * - Button: bg-amber text-midnight px-6 py-3 rounded-md font-semibold hover:bg-copper
 * - Legal: text-xs text-chalk/60
 * - Mobile: stack gap-6
 */

const { t } = useI18n()

const email = ref('')
const acceptNewsletter = ref(false)

const handleSubmit = () => {
  if (email.value && acceptNewsletter.value) {
    console.warn('Newsletter API not yet implemented')
    email.value = ''
    acceptNewsletter.value = false
  }
}
</script>
