export const useFavorites = () => {
  const client = useSupabaseClient()

  const favorites = ref<string[]>([])

  const fetchFavorites = async () => {
    try {
      const user = useSupabaseUser()

      const userId = user.value?.sub
      if (!userId) {
        return { data: [], error: 'Utilisateur non authentifié' }
      }

      const { data, error } = await client
        .from('favorites')
        .select('product_id')
        .eq('user_id', userId)

      if (error) throw error

      favorites.value = data?.map((row: any) => row.product_id) ?? []

      return { data: favorites.value, error: null }
    } catch (err) {
      const error = err as Error
      return { data: null, error: error.message }
    }
  }

  const toggleFavorite = async (productId: string) => {
    try {
      const user = useSupabaseUser()

      const userId = user.value?.sub
      if (!userId) {
        return { error: 'Utilisateur non authentifié' }
      }

      const alreadyFavorite = favorites.value.includes(productId)
      const previous = [...favorites.value]

      if (alreadyFavorite) {
        favorites.value = favorites.value.filter(id => id !== productId)
      } else {
        favorites.value = [...favorites.value, productId]
      }

      try {
        if (alreadyFavorite) {
          const { error } = await client
            .from('favorites')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId)

          if (error) throw error
        } else {
          const { error } = await client
            .from('favorites')
            .insert({ user_id: userId, product_id: productId })

          if (error) throw error
        }

        return { error: null }
      } catch (err) {
        favorites.value = previous
        const error = err as Error
        return { error: error.message }
      }
    } catch (err) {
      const error = err as Error
      return { error: error.message }
    }
  }

  const isFavorite = (productId: string) =>
    computed(() => favorites.value.includes(productId))

  const clearFavorites = async () => {
    try {
      const user = useSupabaseUser()

      const userId = user.value?.sub
      if (!userId) {
        return { error: 'Utilisateur non authentifié' }
      }

      const { error } = await client
        .from('favorites')
        .delete()
        .eq('user_id', userId)

      if (error) throw error

      favorites.value = []
      return { error: null }
    } catch (err) {
      const error = err as Error
      return { error: error.message }
    }
  }

  return {
    favorites,
    fetchFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  }
}
