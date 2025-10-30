export default defineNuxtRouteMiddleware((to, from) => {
  if (!to.path.startsWith('/compte')) return

  const user = useSupabaseUser()

  if (!user.value) {
    return navigateTo('/')
  }
})
