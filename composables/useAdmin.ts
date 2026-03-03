export const useAdmin = () => {
  const client = useSupabaseClient()

  const adminState = useState<boolean>('isAdmin', () => false)

  const fetchAdminRole = async () => {
    try {
      const userId = useSupabaseUser().value?.sub ?? useSupabaseUser().value?.id
      if (!userId) {
        adminState.value = false
        return { error: 'Utilisateur non authentifié' }
      }

      const { data, error } = await client
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

      if (error) throw error

      adminState.value = data?.role === 'admin'
      return { error: null }
    } catch (err) {
      adminState.value = false
      const error = err as Error
      return { error: error.message }
    }
  }

  const isAdmin = computed(() => {
    const user = useSupabaseUser()
    return !!user.value && adminState.value
  })

  return {
    isAdmin,
    fetchAdminRole,
  }
}
