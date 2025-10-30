export default defineNuxtRouteMiddleware((to, from) => {
  // 1) Ignorer les pages publiques (non /compte)
  if (!to.path.startsWith('/compte')) return

  // 2) Récupérer l'utilisateur Supabase
  const user = useSupabaseUser()

  // 3) Rediriger vers / si déconnecté
  if (!user.value) {
    console.log('🚫 Middleware auth: utilisateur non connecté, redirection vers /')
    return navigateTo('/')
  }

  console.log('✅ Middleware auth: utilisateur connecté, accès autorisé')
})
