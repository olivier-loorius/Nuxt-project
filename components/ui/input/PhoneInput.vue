<template>
  <div class="flex gap-2 w-full min-w-0">
    <select
      v-model="selectedCountry"
      @change="updateFullNumber"
      :disabled="disabled"
      :class="[
        'btn-beveled flex-shrink-0 border-2 border-concrete px-3 py-3 focus:outline-none',
        disabled
          ? 'bg-concrete/20 text-midnight/50 cursor-not-allowed'
          : 'bg-white text-midnight focus:ring-2 focus:ring-amber',
      ]"
    >
      <option value="+33">🇫🇷 +33</option>
      <option value="+44">🇬🇧 +44</option>
      <option value="+32">🇧🇪 +32</option>
      <option value="+41">🇨🇭 +41</option>
      <option value="+49">🇩🇪 +49</option>
    </select>

    <input
      ref="phoneInput"
      v-model="displayNumber"
      @input="handleInput"
      @keypress="onlyNumbers"
      type="text"
      inputmode="numeric"
      maxlength="14"
      :disabled="disabled"
      :class="[
        'btn-beveled flex-1 min-w-0 border-2 border-concrete placeholder:text-midnight/40 px-4 py-3 focus:outline-none',
        disabled
          ? 'bg-concrete/20 text-midnight/50 cursor-not-allowed'
          : 'bg-white text-midnight focus:ring-2 focus:ring-amber',
      ]"
      placeholder="0 6 12 34 56 78"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const phoneInput = ref<HTMLInputElement>();
const selectedCountry = ref("+33");
const displayNumber = ref("");
const isUserTyping = ref(false);

const onlyNumbers = (e: KeyboardEvent) => {
  const char = String.fromCharCode(e.keyCode || e.which);
  if (!/^[0-9]$/.test(char)) {
    e.preventDefault();
  }
};

const formatNumber = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";

  // Format pour 10 chiffres: 0X XX XX XX XX
  const match = digits.match(/(\d{1})(\d{1})(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})/);
  if (!match) return digits;

  let formatted = match[1] + match[2];
  if (match[3]) formatted += " " + match[3];
  if (match[4]) formatted += " " + match[4];
  if (match[5]) formatted += " " + match[5];
  if (match[6]) formatted += " " + match[6];

  return formatted;
};

const handleInput = () => {
  isUserTyping.value = true;
  const rawValue = displayNumber.value;
  const digits = rawValue.replace(/\D/g, "").slice(0, 10);

  displayNumber.value = formatNumber(digits);
  updateFullNumber();

  nextTick(() => {
    isUserTyping.value = false;
  });
};

const updateFullNumber = () => {
  const digits = displayNumber.value.replace(/\D/g, "");
  const fullNumber = digits ? `${selectedCountry.value}${digits}` : "";
  emit("update:modelValue", fullNumber);
};

watch(
  () => props.modelValue,
  (newValue) => {
    if (isUserTyping.value) return;

    if (!newValue) {
      displayNumber.value = "";
      selectedCountry.value = "+33";
      return;
    }

    // Détection précise par pays
    let match = null;
    let indicator = "";

    if (newValue.startsWith("+33")) {
      // France: +33 avec 9 ou 10 chiffres
      match = newValue.match(/^(\+33)(\d+)$/);
      indicator = "+33";
    } else if (newValue.startsWith("+44")) {
      // Royaume-Uni: +44 avec ses chiffres
      match = newValue.match(/^(\+44)(\d+)$/);
      indicator = "+44";
    } else if (newValue.startsWith("+32")) {
      // Belgique: +32 avec ses chiffres
      match = newValue.match(/^(\+32)(\d+)$/);
      indicator = "+32";
    } else if (newValue.startsWith("+41")) {
      // Suisse: +41 avec ses chiffres
      match = newValue.match(/^(\+41)(\d+)$/);
      indicator = "+41";
    } else if (newValue.startsWith("+49")) {
      // Allemagne: +49 avec ses chiffres
      match = newValue.match(/^(\+49)(\d+)$/);
      indicator = "+49";
    } else {
      // Fallback pour autres indicatifs
      match = newValue.match(/^(\+\d{2})(\d+)$/);
    }

    if (match) {
      let digits = match[2];

      // Si c'est un numéro français sans 0 après indicateur, l'ajouter
      if (indicator === "+33" && !digits.startsWith("0")) {
        digits = "0" + digits;
      }

      selectedCountry.value = indicator || match[1];
      displayNumber.value = formatNumber(digits);
    }
  },
  { immediate: true }
);
</script>
