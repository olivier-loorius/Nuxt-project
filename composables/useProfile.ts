import { toast } from 'vue-sonner'
import type { Database, Tables, TablesUpdate } from '~/types/database.types'

type Profile = Tables<'profiles'>
type ProfileUpdate = TablesUpdate<'profiles'>

export const useProfile = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()

  const fetchProfile = async (): Promise<Profile | null> => {
    if (!user.value?.sub) {
      toast.error('Erreur de session', {
        description: 'Utilisateur non connecté'
      })
      return null
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.sub)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null
        }
        throw error
      }

      return data
    } catch (error: any) {
      toast.error('Erreur de chargement', {
        description: error.message || 'Impossible de charger le profil'
      })
      return null
    }
  }

  const updateProfile = async (updates: ProfileUpdate): Promise<boolean> => {
    if (!user.value?.sub) {
      toast.error('Erreur de session', {
        description: 'Utilisateur non connecté'
      })
      return false
    }

    try {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.value.sub)
        .single()

      if (!existingProfile) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.value.sub,
            ...updates
          })

        if (insertError) throw insertError
      } else {
        const { error: updateError } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.value.sub)

        if (updateError) throw updateError
      }

      return true
    } catch (error: any) {
      toast.error('Erreur de mise à jour', {
        description: error.message || 'Impossible de mettre à jour le profil'
      })
      return false
    }
  }

  const deleteAccount = async (): Promise<boolean> => {
    if (!user.value?.sub) {
      toast.error('Erreur de session', {
        description: 'Utilisateur non connecté'
      })
      return false
    }

    try {
      const { error: rpcError } = await supabase.rpc('delete_user')

      if (rpcError) throw rpcError

      const { error: signOutError } = await supabase.auth.signOut()

      if (signOutError) {
        console.error('Error signing out after account deletion:', signOutError)
      }

      return true
    } catch (error: any) {
      toast.error('Erreur de suppression', {
        description: error.message || 'Impossible de supprimer le compte'
      })
      return false
    }
  }

  return {
    fetchProfile,
    updateProfile,
    deleteAccount
  }
}
