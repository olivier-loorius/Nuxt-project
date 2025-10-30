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

export interface PhoneValidation {
  isValid: boolean
  message?: string
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

export const validatePhone = (phone: string): PhoneValidation => {
  if (!phone || phone.trim() === '') {
    return {
      isValid: false,
      message: 'auth.phone_required'
    }
  }

  const phoneRegex = /^(?:(?:\+|00)33|0)[1-9](?:[0-9]{8})$/
  const cleanPhone = phone.replace(/[\s.-]/g, '')
  const isValid = phoneRegex.test(cleanPhone)

  return {
    isValid,
    message: isValid ? undefined : 'auth.phone_invalid'
  }
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
