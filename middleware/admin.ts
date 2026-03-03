export default defineNuxtRouteMiddleware(async () => {
  const user = useSupabaseUser()

  if (!user.value) {
    return navigateTo('/', { replace: true })
  }

  const { isAdmin, fetchAdminRole } = useAdmin()

  await fetchAdminRole()

  if (!isAdmin.value) {
    return navigateTo('/', { replace: true })
  }
})
