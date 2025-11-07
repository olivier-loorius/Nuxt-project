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

  /**
   * Récupère toutes les adresses de l'utilisateur
   */
  const fetchAddresses = async () => {
    try {
      const user = useSupabaseUser()
      console.log('[fetchAddresses] user.value:', user.value)
      console.log('[fetchAddresses] user.value?.sub:', user.value?.sub)

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

      // Map database columns to Vue property names
      const mappedData = data?.map((addr: any) => ({
        id: addr.id,
        user_id: addr.user_id,
        type: addr.type,
        first_name: '', // Database doesn't store first_name/last_name, but Vue expects them
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
      console.error('Erreur lors de la récupération des adresses:', error.message)
      return { data: null, error: error.message }
    }
  }

  /**
   * Crée une nouvelle adresse
   * La première adresse créée est automatiquement définie comme adresse par défaut (is_default = true)
   * Les adresses suivantes ont is_default = false par défaut
   */
  const createAddress = async (addressData: AddressInput) => {
    try {
      const user = useSupabaseUser()
      console.log('[createAddress] user.value:', user.value)
      console.log('[createAddress] user.value?.sub:', user.value?.sub)

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

      console.log('[createAddress] Payload envoyé à Supabase:', addressPayload)

      const { data, error } = await client
        .from('addresses')
        .insert([addressPayload])
        .select()

      if (error) throw error

      console.log('[createAddress] Réponse Supabase:', data)

      // Map database columns back to Vue property names
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
      console.error('Erreur lors de la création de l\'adresse:', error.message)
      return { data: null, error: error.message }
    }
  }

  /**
   * Met à jour une adresse existante
   */
  const updateAddress = async (addressId: string, addressData: Partial<AddressInput>) => {
    try {
      const user = useSupabaseUser()
      console.log('[updateAddress] user.value:', user.value)
      console.log('[updateAddress] user.value?.sub:', user.value?.sub)

      const userId = user.value?.sub
      if (!userId) {
        return { data: null, error: 'Utilisateur non authentifié' }
      }

      // Map Vue field names to database columns
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

      // Map database columns back to Vue property names
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
      console.error('Erreur lors de la mise à jour de l\'adresse:', error.message)
      return { data: null, error: error.message }
    }
  }

  /**
   * Supprime une adresse
   */
  const deleteAddress = async (addressId: string) => {
    try {
      const user = useSupabaseUser()
      console.log('[deleteAddress] user.value:', user.value)
      console.log('[deleteAddress] user.value?.sub:', user.value?.sub)

      const userId = user.value?.sub
      if (!userId) {
        return { error: 'Utilisateur non authentifié' }
      }

      // Récupère l'adresse avant suppression pour vérifier si c'est la défaut
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

      // Si c'était l'adresse par défaut, définit la première existante comme défaut
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
      console.error('Erreur lors de la suppression de l\'adresse:', error.message)
      return { error: error.message }
    }
  }

  /**
   * Définit une adresse comme adresse par défaut
   */
  const setDefaultAddress = async (addressId: string) => {
    try {
      const user = useSupabaseUser()
      console.log('[setDefaultAddress] user.value:', user.value)
      console.log('[setDefaultAddress] user.value?.sub:', user.value?.sub)

      const userId = user.value?.sub
      if (!userId) {
        return { data: null, error: 'Utilisateur non authentifié' }
      }

      // Récupère toutes les adresses de l'utilisateur
      const { data: allAddresses } = await client
        .from('addresses')
        .select('id')
        .eq('user_id', userId)

      if (!allAddresses) {
        return { data: null, error: 'Aucune adresse trouvée' }
      }

      // Mets à jour toutes les adresses à is_default = false
      const { error: updateAllError } = await client
        .from('addresses')
        .update({ is_default: false, updated_at: new Date().toISOString() })
        .eq('user_id', userId)

      if (updateAllError) throw updateAllError

      // Mets à jour l'adresse sélectionnée à is_default = true
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
      console.error('Erreur lors de la définition de l\'adresse par défaut:', error.message)
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
