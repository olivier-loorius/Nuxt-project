export const SUPER_ADMIN_ID = '31292056-c0fe-46ab-afa7-905349d7ac86'

const isDemoMode = ref(
  typeof localStorage !== 'undefined' && localStorage.getItem('demoMode') === 'true'
)

export function useDemoMode() {

  function toggleDemoMode() {
    isDemoMode.value = !isDemoMode.value
    localStorage.setItem('demoMode', String(isDemoMode.value))
  }

  return { isDemoMode, toggleDemoMode }
}
