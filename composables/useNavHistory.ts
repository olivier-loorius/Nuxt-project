export const useNavHistory = () => {
  const showBackToMenu = useState('showBackToMenu', () => false)
  return { showBackToMenu }
}
