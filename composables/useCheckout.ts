export interface ShippingInfo {
  firstName: string
  lastName: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
  saveToProfile: boolean
}

export interface SaveResult {
  success: boolean
  error: string | null
  addressId?: string
}

export function useCheckout() {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const saveShippingInfo = async (shippingInfo: ShippingInfo): Promise<SaveResult> => {
    try {
      if (!user.value) {
        return {
          success: false,
          error: 'Utilisateur non authentifié'
        }
      }

      const userId = user.value.sub

      if (shippingInfo.saveToProfile) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: shippingInfo.firstName,
            last_name: shippingInfo.lastName,
            phone: shippingInfo.phone
          })
          .eq('id', userId)

        if (profileError) {
          return {
            success: false,
            error: `Erreur lors de la mise à jour du profil: ${profileError.message}`
          }
        }
      }

      const { data: addressData, error: addressError } = await supabase
        .from('addresses')
        .insert({
          user_id: userId,
          type: 'shipping',
          first_name: shippingInfo.firstName,
          last_name: shippingInfo.lastName,
          phone: shippingInfo.phone,
          address: shippingInfo.address,
          city: shippingInfo.city,
          postal_code: shippingInfo.postalCode,
          country: shippingInfo.country,
          is_default: true
        })
        .select('id')
        .single()

      if (addressError) {
        return {
          success: false,
          error: `Erreur lors de l'enregistrement de l'adresse: ${addressError.message}`
        }
      }

      return {
        success: true,
        error: null,
        addressId: addressData.id
      }
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Une erreur inattendue est survenue'
      }
    }
  }

  return {
    saveShippingInfo
  }
}
