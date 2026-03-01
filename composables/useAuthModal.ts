export const useAuthModal = () => {
  const showAuthModal = useState<boolean>('showAuthModal', () => false)
  const authModalMessage = useState<string>('authModalMessage', () => '')

  return { showAuthModal, authModalMessage }
}
