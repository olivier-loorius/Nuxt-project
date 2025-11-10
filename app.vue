<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { locale } = useI18n()

onMounted(() => {
  const savedLocale = localStorage.getItem('user_locale')
  if (savedLocale && (savedLocale === 'fr' || savedLocale === 'en')) {
    locale.value = savedLocale
  }
})

provide('setAndSaveLocale', (newLocale: 'fr' | 'en') => {
  locale.value = newLocale
  localStorage.setItem('user_locale', newLocale)
})
</script>
