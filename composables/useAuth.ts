import {
  validateEmail,
  validatePassword,
  validatePhone,
  getStrengthLabel,
  type EmailValidation,
  type PasswordValidation,
  type PhoneValidation
} from './useFormValidation'

export interface UserMetadata {
  firstName?: string
  lastName?: string
  [key: string]: any
}

export type { EmailValidation, PasswordValidation, PhoneValidation }
export { validateEmail, validatePassword, validatePhone, getStrengthLabel }

import { toast } from 'vue-sonner'

export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      toast.error('Connexion échouée', {
        description: error.message
      })
      throw error
    }

    toast.success('Connexion réussie', {
      description: `Bienvenue ${data.user?.email}`
    })
    return data
  }

  const signUp = async (email: string, password: string, metadata?: UserMetadata) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata || {}
      }
    })

    if (error) {
      toast.error('Inscription échouée', {
        description: error.message
      })
      throw error
    }

    toast.success('Compte créé avec succès', {
      description: 'Vérifiez votre email pour confirmer votre compte'
    })
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Erreur de déconnexion', {
        description: error.message
      })
      throw error
    }

    toast.success('Déconnexion réussie', {
      description: 'À bientôt !'
    })
    await navigateTo('/')
  }

  return {
    user,
    signIn,
    signUp,
    signOut
  }
}
