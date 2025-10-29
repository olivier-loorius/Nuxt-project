// Import des fonctions de validation depuis le composable dédié
import {
  validateEmail,
  validatePassword,
  validatePhone,
  getStrengthLabel,
  type EmailValidation,
  type PasswordValidation,
  type PhoneValidation
} from './useFormValidation'

// ============================================
// BACKUP - Définitions originales commentées
// ============================================
/*
export interface EmailValidation {
  isValid: boolean
  message?: string
}

export interface PasswordValidation {
  isValid: boolean
  strength: number
  checks: {
    minLength: boolean
    hasUppercase: boolean
    hasLowercase: boolean
    hasNumber: boolean
    hasSpecial: boolean
  }
}

export const validateEmail = (email: string): EmailValidation => {
  if (!email || email.trim() === '') {
    return {
      isValid: false,
      message: 'auth.email_required'
    }
  }

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  const isValid = emailRegex.test(email.trim())

  return {
    isValid,
    message: isValid ? undefined : 'auth.email_invalid'
  }
}

export const validatePassword = (password: string): PasswordValidation => {
  const checks = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  }

  let strength = 0
  if (checks.minLength) strength++
  if (checks.hasUppercase) strength++
  if (checks.hasLowercase) strength++
  if (checks.hasNumber) strength++
  if (checks.hasSpecial) strength++

  const isValid = checks.minLength && checks.hasUppercase && checks.hasLowercase && checks.hasNumber

  return { isValid, strength, checks }
}

export const getStrengthLabel = (strength: number): string => {
  const labels: Record<number, string> = {
    1: 'auth.password_strength.very_weak',
    2: 'auth.password_strength.weak',
    3: 'auth.password_strength.medium',
    4: 'auth.password_strength.strong',
    5: 'auth.password_strength.very_strong'
  }
  return labels[strength] || 'auth.password_strength.very_weak'
}
*/
// ============================================

export interface UserMetadata {
  firstName?: string
  lastName?: string
  [key: string]: any
}

// Ré-export des types et fonctions pour compatibilité
export type { EmailValidation, PasswordValidation, PhoneValidation }
export { validateEmail, validatePassword, validatePhone, getStrengthLabel }

import { toast } from 'vue-sonner'

export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const signIn = async (email: string, password: string) => {
    console.log('🔍 AUDIT useAuth signIn - Email:', email)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    console.log('🔍 AUDIT useAuth signIn - Data:', data)
    console.log('🔍 AUDIT useAuth signIn - Error:', error)
    console.log('🔍 AUDIT useAuth signIn - User:', data?.user)
    console.log('🔍 AUDIT useAuth signIn - Session:', data?.session)

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
    console.log('🔵 signUp CALLED')
    console.log('🔵 signUp email:', email)
    console.log('🔵 signUp password length:', password?.length)
    console.log('🔵 signUp metadata:', metadata)

    console.log('🔵 BEFORE supabase.auth.signUp call')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata || {}
      }
    })
    console.log('🔵 AFTER supabase.auth.signUp call')

    console.log('🔵 signUp data:', data)
    console.log('🔵 signUp error:', error)
    console.log('🔵 signUp data.user:', data?.user)
    console.log('🔵 signUp data.user.id:', data?.user?.id)
    console.log('🔵 signUp data.user.email:', data?.user?.email)
    console.log('🔵 signUp data.user.user_metadata:', data?.user?.user_metadata)
    console.log('🔵 signUp data.session:', data?.session)

    if (error) {
      console.log('🔴 signUp ERROR:', error.message)
      console.log('🔴 signUp ERROR code:', error.status)
      toast.error('Inscription échouée', {
        description: error.message
      })
      throw error
    }

    console.log('🟢 signUp SUCCESS')

    if (data?.user) {
      console.log('🔵 BEFORE profile creation')
      console.log('🔵 User created with ID:', data.user.id)
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
