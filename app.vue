<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()

onMounted(() => {
  const savedLocale = localStorage.getItem('user_locale') as 'fr' | 'en' | null
  if (savedLocale && savedLocale !== locale.value) {
    navigateTo(switchLocalePath(savedLocale))
  }
})
</script>
