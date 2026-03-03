<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()

watch(() => route.path, () => {
  window.scrollTo(0, 0)
})

const user = useSupabaseUser()
const { fetchAdminRole, isAdmin } = useAdmin()

watch(user, async (newUser) => {
  if (!newUser) return
  await fetchAdminRole()
  if (isAdmin.value && !route.path.startsWith('/admin')) {
    await navigateTo('/admin')
  }
})

onMounted(() => {
  const savedLocale = localStorage.getItem('user_locale') as 'fr' | 'en' | null
  if (savedLocale && savedLocale !== locale.value) {
    navigateTo(switchLocalePath(savedLocale))
  }
})
</script>
