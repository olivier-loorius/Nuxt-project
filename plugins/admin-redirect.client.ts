export default defineNuxtPlugin(() => {
  const client = useSupabaseClient()

  client.auth.onAuthStateChange(async (event, session) => {
    if (event !== 'SIGNED_IN' || !session?.user?.id) return

    const { data } = await client
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (data?.role === 'admin') {
      await navigateTo('/admin')
    }
  })
})
