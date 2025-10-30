export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()
  const { auth } = useSupabaseClient()

  // Vérifie la session en cours
  const { data: { session }, error } = await auth.getSession()

  // Si l'utilisateur n'est pas connecté et que la page nécessite une authentification
  if (!session && !user.value) {
    return navigateTo({
      path: '/',
      query: {
        redirect: to.fullPath
      }
    })
  }
})
