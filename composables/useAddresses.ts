interface Address {
  id: string
  user_id: string
  type: string
  first_name: string
  last_name: string
  street: string
  street_complement?: string
  postal_code: string
  city: string
  country: string
  phone?: string
  is_default: boolean
  created_at: string
  updated_at: string
}

interface AddressInput {
  type: string
  first_name: string
  last_name: string
  street: string
  street_complement?: string
  postal_code: string
  city: string
  country: string
  phone?: string
}

export const useAddresses = () => {
  const client = useSupabaseClient()

  const fetchAddresses = async () => {
    try {
      const user = useSupabaseUser()

      const userId = user.value?.sub
      if (!userId) {
        return { data: [], error: 'Utilisateur non authentifié' }
      }

      const { data, error } = await client
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error

      const mappedData = data?.map((addr: any) => ({
        id: addr.id,
        user_id: addr.user_id,
        type: addr.type,
        first_name: '',
        last_name: '',
        street: addr.address_line1,
        street_complement: addr.address_line2,
        postal_code: addr.postal_code,
        city: addr.city,
        country: addr.country,
        phone: addr.phone,
        is_default: addr.is_default,
        created_at: addr.created_at,
        updated_at: addr.updated_at
      })) || []

      return { data: mappedData as Address[], error: null }
    } catch (err) {
      const error = err as Error
      return { data: null, error: error.message }
    }
  }

  const createAddress = async (addressData: AddressInput) => {
    try {
      const user = useSupabaseUser()

      const userId = user.value?.sub
      if (!userId) {
        return { data: null, error: 'Utilisateur non authentifié' }
      }

      // Récupère le nombre d'adresses existantes
      const { count } = await client
        .from('addresses')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      const isFirstAddress = count === 0

      const addressPayload = {
        user_id: userId,
        type: addressData.type,
        address_line1: addressData.street,
        address_line2: addressData.street_complement || null,
        postal_code: addressData.postal_code,
        city: addressData.city,
        country: addressData.country,
        phone: addressData.phone || null,
        is_default: isFirstAddress,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await client
        .from('addresses')
        .insert([addressPayload])
        .select()

      if (error) throw error

      if (data && data.length > 0) {
        const addr = data[0]
        const mappedResult: Address = {
          id: addr.id,
          user_id: addr.user_id,
          type: addr.type,
          first_name: '',
          last_name: '',
          street: addr.address_line1,
          street_complement: addr.address_line2,
          postal_code: addr.postal_code,
          city: addr.city,
          country: addr.country,
          phone: addr.phone,
          is_default: addr.is_default,
          created_at: addr.created_at,
          updated_at: addr.updated_at
        }
        return { data: mappedResult, error: null }
      }

      return { data: null, error: null }
    } catch (err) {
      const error = err as Error
      return { data: null, error: error.message }
    }
  }

  const updateAddress = async (addressId: string, addressData: Partial<AddressInput>) => {
    try {
      const user = useSupabaseUser()

      const userId = user.value?.sub
      if (!userId) {
        return { data: null, error: 'Utilisateur non authentifié' }
      }

      const updatePayload: any = {
        updated_at: new Date().toISOString()
      }

      if (addressData.type !== undefined) updatePayload.type = addressData.type
      if (addressData.street !== undefined) updatePayload.address_line1 = addressData.street
      if (addressData.street_complement !== undefined) updatePayload.address_line2 = addressData.street_complement || null
      if (addressData.postal_code !== undefined) updatePayload.postal_code = addressData.postal_code
      if (addressData.city !== undefined) updatePayload.city = addressData.city
      if (addressData.country !== undefined) updatePayload.country = addressData.country
      if (addressData.phone !== undefined) updatePayload.phone = addressData.phone || null

      const { data, error } = await client
        .from('addresses')
        .update(updatePayload)
        .eq('id', addressId)
        .eq('user_id', userId)
        .select()

      if (error) throw error

      if (!data || data.length === 0) {
        return { data: null, error: 'Adresse non trouvée' }
      }

      const addr = data[0]
      const mappedResult: Address = {
        id: addr.id,
        user_id: addr.user_id,
        type: addr.type,
        first_name: '',
        last_name: '',
        street: addr.address_line1,
        street_complement: addr.address_line2,
        postal_code: addr.postal_code,
        city: addr.city,
        country: addr.country,
        phone: addr.phone,
        is_default: addr.is_default,
        created_at: addr.created_at,
        updated_at: addr.updated_at
      }

      return { data: mappedResult, error: null }
    } catch (err) {
      const error = err as Error
      return { data: null, error: error.message }
    }
  }

  const deleteAddress = async (addressId: string) => {
    try {
      const user = useSupabaseUser()

      const userId = user.value?.sub
      if (!userId) {
        return { error: 'Utilisateur non authentifié' }
      }

      const { data: addressToDelete } = await client
        .from('addresses')
        .select('is_default')
        .eq('id', addressId)
        .eq('user_id', userId)
        .single()

      const { error: deleteError } = await client
        .from('addresses')
        .delete()
        .eq('id', addressId)
        .eq('user_id', userId)

      if (deleteError) throw deleteError

      if (addressToDelete?.is_default) {
        const { data: nextAddress } = await client
          .from('addresses')
          .select('id')
          .eq('user_id', userId)
          .order('created_at', { ascending: true })
          .limit(1)
          .single()

        if (nextAddress?.id) {
          await setDefaultAddress(nextAddress.id)
        }
      }

      return { error: null }
    } catch (err) {
      const error = err as Error
      return { error: error.message }
    }
  }

  const setDefaultAddress = async (addressId: string) => {
    try {
      const user = useSupabaseUser()

      const userId = user.value?.sub
      if (!userId) {
        return { data: null, error: 'Utilisateur non authentifié' }
      }

      const { data: allAddresses } = await client
        .from('addresses')
        .select('id')
        .eq('user_id', userId)

      if (!allAddresses) {
        return { data: null, error: 'Aucune adresse trouvée' }
      }

      const { error: updateAllError } = await client
        .from('addresses')
        .update({ is_default: false, updated_at: new Date().toISOString() })
        .eq('user_id', userId)

      if (updateAllError) throw updateAllError

      const { data, error: updateOneError } = await client
        .from('addresses')
        .update({ is_default: true, updated_at: new Date().toISOString() })
        .eq('id', addressId)
        .eq('user_id', userId)
        .select()

      if (updateOneError) throw updateOneError

      if (!data || data.length === 0) {
        return { data: null, error: 'Adresse non trouvée' }
      }

      return { data: data[0] as Address, error: null }
    } catch (err) {
      const error = err as Error
      return { data: null, error: error.message }
    }
  }

  return {
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
  }
}
