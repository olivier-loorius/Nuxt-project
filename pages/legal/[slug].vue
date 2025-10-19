<template>
  <div class="container mx-auto px-6 py-12">
    <h1 class="text-4xl font-display font-bold text-midnight mb-6">
      {{ legalTitle }}
    </h1>
    <div class="prose prose-lg max-w-none">
      <p class="text-lg text-midnight/70 mb-4">
        Page légale en construction...
      </p>
      <p class="text-midnight/60">
        Cette page contiendra {{ legalDescription }}.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const legalTitles: Record<string, string> = {
  'mentions-legales': 'Mentions légales',
  'cgv': 'Conditions Générales de Vente',
  'cgu': "Conditions Générales d'Utilisation",
  'confidentialite': 'Politique de Confidentialité',
  'cookies': 'Politique des Cookies'
}

const legalDescriptions: Record<string, string> = {
  'mentions-legales': 'les mentions légales du site',
  'cgv': 'les conditions générales de vente',
  'cgu': "les conditions générales d'utilisation",
  'confidentialite': 'notre politique de confidentialité et protection des données',
  'cookies': 'notre politique de gestion des cookies'
}

const legalTitle = computed(() => {
  const slug = route.params.slug as string
  return legalTitles[slug] || slug.charAt(0).toUpperCase() + slug.slice(1)
})

const legalDescription = computed(() => {
  const slug = route.params.slug as string
  return legalDescriptions[slug] || 'les informations légales'
})

definePageMeta({
  layout: 'default'
})
</script>
