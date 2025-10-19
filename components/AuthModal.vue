<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-midnight/80 backdrop-blur-md animate-fade-in"
      @click.self="closeModal"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="mode === 'login' ? 'modal-title-login' : 'modal-title-register'"
    >
      <div class="relative w-full max-w-[95vw] md:max-w-lg max-h-[90vh] md:max-h-[95vh] overflow-y-auto bg-chalk rounded-lg shadow-2xl p-6 md:p-8 animate-scale-in z-[201]">
        <button
          type="button"
          @click="closeModal"
          class="absolute top-4 right-4 p-2 hover:bg-midnight/5 rounded-lg transition-colors duration-300 z-10"
          :aria-label="$t('auth.close')"
        >
          <X class="h-4 w-4 text-midnight/60 hover:text-midnight" stroke-width="1.5" />
        </button>

        <div class="mb-6 text-center">
          <h2 :id="mode === 'login' ? 'modal-title-login' : 'modal-title-register'" class="text-2xl font-sora font-bold text-midnight mb-2">
            {{ mode === 'login' ? $t('auth.login') : $t('auth.register') }}
          </h2>
          <p class="text-sm text-midnight/60 font-manrope">
            {{ mode === 'login' ? $t('auth.login_subtitle') : $t('auth.register_subtitle') }}
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="auth-email" class="block text-sm font-sora font-semibold mb-2 text-midnight">
              <Mail class="inline h-4 w-4 mr-2 text-amber" stroke-width="1.5" />
              {{ $t('auth.email') }}
            </label>
            <input
              id="auth-email"
              v-model="email"
              type="email"
              required
              :placeholder="$t('auth.email_placeholder')"
              class="btn-beveled w-full px-4 py-3 border-2 border-concrete bg-white focus:border-amber focus:ring-2 focus:ring-amber/20 font-manrope text-midnight placeholder:text-midnight/40 transition-all duration-300 outline-none"
              :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500/20': emailTouched && !emailValid }"
              @blur="emailTouched = true"
            />
            <p v-if="emailTouched && !emailValid" class="mt-2 text-xs text-red-600 font-manrope">
              {{ $t('auth.email_invalid') }}
            </p>
          </div>

          <div>
            <label for="auth-password" class="block text-sm font-sora font-semibold mb-2 text-midnight">
              <Lock class="inline h-4 w-4 mr-2 text-amber" stroke-width="1.5" />
              {{ $t('auth.password') }}
            </label>
            <div class="relative">
              <input
                id="auth-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                :placeholder="mode === 'login' ? $t('auth.password_placeholder') : $t('auth.password_create_placeholder')"
                class="btn-beveled w-full px-4 py-3 pr-12 border-2 border-concrete bg-white focus:border-amber focus:ring-2 focus:ring-amber/20 font-manrope text-midnight placeholder:text-midnight/40 transition-all duration-300 outline-none"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-midnight/5 rounded transition-colors duration-300"
                :aria-label="showPassword ? $t('auth.hide_password') : $t('auth.show_password')"
              >
                <Eye v-if="!showPassword" class="h-4 w-4 text-midnight/40" stroke-width="1.5" />
                <EyeOff v-else class="h-4 w-4 text-amber" stroke-width="1.5" />
              </button>
            </div>

            <div v-if="mode === 'register' && password" class="mt-2 space-y-2">
              <div class="flex gap-1">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="h-1 flex-1 rounded-full transition-all duration-300"
                  :class="i <= passwordValidation.strength ? 'bg-amber' : 'bg-concrete'"
                ></div>
              </div>

              <p class="text-xs text-midnight/60 font-manrope">
                {{ $t('auth.password_strength.label') }}: <span class="font-semibold">{{ $t(getStrengthLabel(passwordValidation.strength)) }}</span>
              </p>

              <ul class="text-xs space-y-1 font-manrope">
                <li class="flex items-center gap-1.5">
                  <Check v-if="passwordValidation.checks.minLength" class="h-3.5 w-3.5 text-green-600" />
                  <X v-else class="h-3.5 w-3.5 text-midnight/40" />
                  <span :class="passwordValidation.checks.minLength ? 'text-green-600' : 'text-midnight/60'">
                    {{ $t('auth.password_check.min_length') }}
                  </span>
                </li>
                <li class="flex items-center gap-1.5">
                  <Check v-if="passwordValidation.checks.hasUppercase" class="h-3.5 w-3.5 text-green-600" />
                  <X v-else class="h-3.5 w-3.5 text-midnight/40" />
                  <span :class="passwordValidation.checks.hasUppercase ? 'text-green-600' : 'text-midnight/60'">
                    {{ $t('auth.password_check.uppercase') }}
                  </span>
                </li>
                <li class="flex items-center gap-1.5">
                  <Check v-if="passwordValidation.checks.hasLowercase" class="h-3.5 w-3.5 text-green-600" />
                  <X v-else class="h-3.5 w-3.5 text-midnight/40" />
                  <span :class="passwordValidation.checks.hasLowercase ? 'text-green-600' : 'text-midnight/60'">
                    {{ $t('auth.password_check.lowercase') }}
                  </span>
                </li>
                <li class="flex items-center gap-1.5">
                  <Check v-if="passwordValidation.checks.hasNumber" class="h-3.5 w-3.5 text-green-600" />
                  <X v-else class="h-3.5 w-3.5 text-midnight/40" />
                  <span :class="passwordValidation.checks.hasNumber ? 'text-green-600' : 'text-midnight/60'">
                    {{ $t('auth.password_check.number') }}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div v-if="mode === 'register'">
            <label for="auth-password-confirm" class="block text-sm font-sora font-semibold mb-2 text-midnight">
              <Lock class="inline h-4 w-4 mr-2 text-amber" stroke-width="1.5" />
              {{ $t('auth.password_confirm') }}
            </label>
            <div class="relative">
              <input
                id="auth-password-confirm"
                v-model="passwordConfirm"
                :type="showPassword ? 'text' : 'password'"
                required
                :placeholder="$t('auth.password_confirm_placeholder')"
                class="btn-beveled w-full px-4 py-3 pr-12 border-2 border-concrete bg-white focus:border-amber focus:ring-2 focus:ring-amber/20 font-manrope text-midnight placeholder:text-midnight/40 transition-all duration-300 outline-none"
                :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500/20': passwordConfirmTouched && !passwordMatch }"
                @blur="passwordConfirmTouched = true"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-midnight/5 rounded transition-colors duration-300"
                :aria-label="showPassword ? $t('auth.hide_password') : $t('auth.show_password')"
              >
                <Eye v-if="!showPassword" class="h-4 w-4 text-midnight/40" stroke-width="1.5" />
                <EyeOff v-else class="h-4 w-4 text-amber" stroke-width="1.5" />
              </button>
            </div>

            <p v-if="passwordConfirmTouched && !passwordMatch" class="mt-2 text-xs text-red-600 font-manrope">
              {{ $t('auth.password_mismatch') }}
            </p>
          </div>

          <label v-if="mode === 'register'" for="auth-18plus" class="btn-beveled flex items-start gap-3 p-3 border-2 border-amber/20 bg-amber/5 cursor-pointer hover:bg-amber/10 transition-colors duration-300">
            <input
              id="auth-18plus"
              v-model="confirm18Plus"
              type="checkbox"
              required
              class="w-4 h-4 mt-0.5 accent-amber cursor-pointer"
            />
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span class="text-sm font-sora font-semibold text-midnight">
                  {{ $t('auth.confirm_18plus') }}
                </span>
                <ShieldCheck class="h-4 w-4 text-amber" stroke-width="1.5" />
              </div>
              <p class="text-xs text-midnight/60 font-manrope mt-1">
                {{ $t('auth.adults_only') }}
              </p>
            </div>
          </label>

          <label v-if="mode === 'register'" for="auth-newsletter" class="flex items-center gap-2 cursor-pointer group">
            <input
              id="auth-newsletter"
              v-model="newsletter"
              type="checkbox"
              class="w-4 h-4 accent-amber cursor-pointer"
            />
            <span class="text-sm font-manrope text-midnight/70 group-hover:text-midnight transition-colors duration-300">
              {{ $t('auth.newsletter_text') }}
            </span>
          </label>

          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600 font-manrope">{{ error }}</p>
          </div>

          <button
            type="submit"
            :disabled="loading || !canSubmit"
            class="btn-beveled w-full px-6 py-3 border-2 border-amber bg-amber text-midnight font-sora font-semibold hover:bg-copper disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Loader2 v-if="loading" class="h-4 w-4 animate-spin" stroke-width="1.5" />
            <template v-else>
              <span>{{ mode === 'login' ? $t('auth.login_button') : $t('auth.register_button') }}</span>
              <ArrowRight class="h-4 w-4" stroke-width="1.5" />
            </template>
          </button>

          <div class="mt-6 text-center">
            <p class="text-sm text-midnight/70 font-manrope">
              {{ mode === 'login' ? $t('auth.no_account') : $t('auth.have_account') }}
              <button
                type="button"
                @click="toggleMode"
                class="text-amber font-semibold hover:underline transition-all duration-300 ml-1"
              >
                {{ mode === 'login' ? $t('auth.register') : $t('auth.login') }}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { Mail, Lock, Eye, EyeOff, Check, X, ShieldCheck, Loader2, ArrowRight } from 'lucide-vue-next'
import { useAuth, validateEmail, validatePassword, getStrengthLabel } from '~/composables/useAuth'

const modelValue = defineModel<boolean>({ default: false })

const closeModal = () => {
  modelValue.value = false
}

const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const showPassword = ref(false)
const confirm18Plus = ref(false)
const newsletter = ref(false)
const loading = ref(false)
const error = ref('')
const mode = ref<'login' | 'register'>('login')

const emailTouched = ref(false)
const passwordConfirmTouched = ref(false)

const emailValidation = computed(() => validateEmail(email.value))
const emailValid = computed(() => emailValidation.value.isValid)

const passwordValidation = computed(() => validatePassword(password.value))
const passwordValid = computed(() => passwordValidation.value.isValid)

const passwordMatch = computed(() => {
  if (!passwordConfirm.value) return true
  return password.value === passwordConfirm.value
})

const canSubmit = computed(() => {
  if (mode.value === 'login') {
    return emailValid.value && password.value.length > 0
  } else {
    return emailValid.value && passwordValid.value && passwordMatch.value && confirm18Plus.value
  }
})

const { signIn, signUp } = useAuth()

const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  try {
    if (!canSubmit.value) {
      throw new Error('Veuillez remplir tous les champs requis')
    }

    if (mode.value === 'register') {
      if (!passwordMatch.value) {
        throw new Error('Les mots de passe ne correspondent pas')
      }

      if (!confirm18Plus.value) {
        throw new Error('Vous devez confirmer avoir 18 ans ou plus')
      }

      await signUp(email.value, password.value, {
        newsletter: newsletter.value,
        age_verified: confirm18Plus.value
      })

      closeModal()
    } else {
      await signIn(email.value, password.value)
      closeModal()
    }
  } catch (err: any) {
    error.value = err.message || 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}

const toggleMode = () => {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  error.value = ''
  password.value = ''
  passwordConfirm.value = ''
  confirm18Plus.value = false
  newsletter.value = false
  emailTouched.value = false
  passwordConfirmTouched.value = false
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 200ms ease-out;
}

.animate-scale-in {
  animation: scale-in 200ms ease-out;
}
</style>
