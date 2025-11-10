export default defineNuxtPlugin(() => {
  const { setLocale } = useI18n()

  if (process.client) {
    // Restaurer la langue sauvegardée au démarrage
    const savedLocale = localStorage.getItem('user_locale')

    if (savedLocale) {
      setLocale(savedLocale as 'fr' | 'en')
    }
  }
})
