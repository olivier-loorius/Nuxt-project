<template>
  <div class="container mx-auto px-6 py-12">
    <h1 class="text-4xl font-display font-bold text-midnight mb-6">
      {{ categoryTitle }}
    </h1>
    <p class="text-lg text-midnight/70 mb-4">
      Page catégorie dynamique en construction...
    </p>
    <p class="text-sm text-midnight/50">
      Slug: <code class="px-2 py-1 bg-midnight/5 rounded">{{ route.params.slug }}</code>
    </p>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const categoryTitle = computed(() => {
  const slug = route.params.slug as string
  return slug.charAt(0).toUpperCase() + slug.slice(1)
})

definePageMeta({
  layout: 'default'
})
</script>
