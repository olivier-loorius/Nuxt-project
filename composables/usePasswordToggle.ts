export const usePasswordToggle = () => {
  const showPassword = ref(false)

  const togglePassword = () => {
    showPassword.value = !showPassword.value
  }

  return {
    showPassword,
    togglePassword
  }
}
