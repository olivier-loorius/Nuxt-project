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

export interface UserMetadata {
  firstName?: string
  lastName?: string
  [key: string]: any
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

export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
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

    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    await navigateTo('/')
  }

  return {
    user,
    signIn,
    signUp,
    signOut
  }
}
