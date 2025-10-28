<template>
  <div class="flex gap-2">
    <select
      v-model="selectedCountry"
      @change="updateFullNumber"
      :disabled="disabled"
      :class="[
        'btn-beveled w-32 border-2 border-concrete px-3 py-3 focus:outline-none',
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
        'btn-beveled flex-1 border-2 border-concrete placeholder:text-midnight/40 px-4 py-3 focus:outline-none',
        disabled
          ? 'bg-concrete/20 text-midnight/50 cursor-not-allowed'
          : 'bg-white text-midnight focus:ring-2 focus:ring-amber',
      ]"
      placeholder="6 12 34 56 78"
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

  const match = digits.match(/(\d{1})(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})/);
  if (!match) return digits;

  let formatted = match[1];
  if (match[2]) formatted += " " + match[2];
  if (match[3]) formatted += " " + match[3];
  if (match[4]) formatted += " " + match[4];
  if (match[5]) formatted += " " + match[5];

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

    const match = newValue.match(/^(\+\d{2,3})(\d+)$/);
    if (match) {
      selectedCountry.value = match[1];
      displayNumber.value = formatNumber(match[2]);
    }
  },
  { immediate: true }
);
</script>
