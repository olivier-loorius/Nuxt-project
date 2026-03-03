export interface CartItem {
  product_id: string
  quantity: number
}

export const useCart = () => {
  const client = useSupabaseClient()

  const cart = useState<CartItem[]>('cart', () => [])

  const user = useSupabaseUser()
  watch(user, (newUser) => {
    if (!newUser) {
      cart.value = []
    }
  })

  const fetchCart = async () => {
    try {
      const user = useSupabaseUser()

      const userId = user.value?.sub
      if (!userId) {
        return { data: [], error: 'Utilisateur non authentifié' }
      }

      const { data, error } = await client
        .from('cart_items')
        .select('product_id, quantity')
        .eq('user_id', userId)

      if (error) throw error

      cart.value = data?.map((row: any) => ({
        product_id: row.product_id,
        quantity: row.quantity,
      })) ?? []

      return { data: cart.value, error: null }
    } catch (err) {
      const error = err as Error
      return { data: null, error: error.message }
    }
  }

  const addToCart = async (productId: string, quantity = 1) => {
    try {
      const user = useSupabaseUser()

      const userId = user.value?.sub
      if (!userId) {
        return { error: 'Utilisateur non authentifié' }
      }

      const existing = cart.value.find(item => item.product_id === productId)
      const previous = cart.value.map(item => ({ ...item }))

      if (existing) {
        cart.value = cart.value.map(item =>
          item.product_id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      } else {
        cart.value = [...cart.value, { product_id: productId, quantity }]
      }

      try {
        if (existing) {
          const { error } = await client
            .from('cart_items')
            .update({ quantity: existing.quantity + quantity })
            .eq('user_id', userId)
            .eq('product_id', productId)

          if (error) throw error
        } else {
          const { error } = await client
            .from('cart_items')
            .insert({ user_id: userId, product_id: productId, quantity })

          if (error) throw error
        }

        return { error: null }
      } catch (err) {
        cart.value = previous
        const error = err as Error
        return { error: error.message }
      }
    } catch (err) {
      const error = err as Error
      return { error: error.message }
    }
  }

  const removeFromCart = async (productId: string) => {
    try {
      const user = useSupabaseUser()

      const userId = user.value?.sub
      if (!userId) {
        return { error: 'Utilisateur non authentifié' }
      }

      const previous = cart.value.map(item => ({ ...item }))
      cart.value = cart.value.filter(item => item.product_id !== productId)

      try {
        const { error } = await client
          .from('cart_items')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', productId)

        if (error) throw error

        return { error: null }
      } catch (err) {
        cart.value = previous
        const error = err as Error
        return { error: error.message }
      }
    } catch (err) {
      const error = err as Error
      return { error: error.message }
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      const user = useSupabaseUser()

      const userId = user.value?.sub
      if (!userId) {
        return { error: 'Utilisateur non authentifié' }
      }

      if (quantity <= 0) {
        return removeFromCart(productId)
      }

      const previous = cart.value.map(item => ({ ...item }))
      cart.value = cart.value.map(item =>
        item.product_id === productId ? { ...item, quantity } : item,
      )

      try {
        const { error } = await client
          .from('cart_items')
          .update({ quantity })
          .eq('user_id', userId)
          .eq('product_id', productId)

        if (error) throw error

        return { error: null }
      } catch (err) {
        cart.value = previous
        const error = err as Error
        return { error: error.message }
      }
    } catch (err) {
      const error = err as Error
      return { error: error.message }
    }
  }

  const clearCart = async () => {
    try {
      const user = useSupabaseUser()

      const userId = user.value?.sub
      if (!userId) {
        return { error: 'Utilisateur non authentifié' }
      }

      const { error } = await client
        .from('cart_items')
        .delete()
        .eq('user_id', userId)

      if (error) throw error

      cart.value = []
      return { error: null }
    } catch (err) {
      const error = err as Error
      return { error: error.message }
    }
  }

  const cartCount = computed(() =>
    cart.value.reduce((sum, item) => sum + item.quantity, 0),
  )

  const isInCart = (productId: string) =>
    computed(() => cart.value.some(item => item.product_id === productId))

  return {
    cart,
    fetchCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    isInCart,
  }
}
