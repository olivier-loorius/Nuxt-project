<template>
  <div class="h-[36px] bg-midnight overflow-hidden flex items-center">
    <div class="flex items-center whitespace-nowrap animate-marquee">
      <span class="px-8 text-chalk text-[11px] font-semibold tracking-[0.08em] uppercase">{{ $t('banner.adultsOnly') }}</span>
      <span class="w-[5px] h-[5px] bg-amber rounded-full inline-block mx-10 flex-shrink-0" />
      <span class="px-8 text-chalk text-[11px] font-semibold tracking-[0.08em] uppercase">{{ $t('banner.delivery') }}</span>
      <span class="w-[5px] h-[5px] bg-amber rounded-full inline-block mx-10 flex-shrink-0" />
      <span class="px-8 text-chalk text-[11px] font-semibold tracking-[0.08em] uppercase">{{ $t('banner.payment') }}</span>
      <span class="w-[5px] h-[5px] bg-amber rounded-full inline-block mx-10 flex-shrink-0" />
      <span class="px-8 text-chalk text-[11px] font-semibold tracking-[0.08em] uppercase">{{ $t('banner.returns') }}</span>
      <span class="w-[5px] h-[5px] bg-amber rounded-full inline-block mx-10 flex-shrink-0" />
      <span class="px-8 text-chalk text-[11px] font-semibold tracking-[0.08em] uppercase">{{ $t('banner.adultsOnly') }}</span>
      <span class="w-[5px] h-[5px] bg-amber rounded-full inline-block mx-10 flex-shrink-0" />
      <span class="px-8 text-chalk text-[11px] font-semibold tracking-[0.08em] uppercase">{{ $t('banner.delivery') }}</span>
      <span class="w-[5px] h-[5px] bg-amber rounded-full inline-block mx-10 flex-shrink-0" />
      <span class="px-8 text-chalk text-[11px] font-semibold tracking-[0.08em] uppercase">{{ $t('banner.payment') }}</span>
      <span class="w-[5px] h-[5px] bg-amber rounded-full inline-block mx-10 flex-shrink-0" />
      <span class="px-8 text-chalk text-[11px] font-semibold tracking-[0.08em] uppercase">{{ $t('banner.returns') }}</span>
      <span class="w-[5px] h-[5px] bg-amber rounded-full inline-block mx-10 flex-shrink-0" />
      <span class="px-8 text-chalk text-[11px] font-semibold tracking-[0.08em] uppercase">{{ $t('banner.adultsOnly') }}</span>
      <span class="w-[5px] h-[5px] bg-amber rounded-full inline-block mx-10 flex-shrink-0" />
      <span class="px-8 text-chalk text-[11px] font-semibold tracking-[0.08em] uppercase">{{ $t('banner.delivery') }}</span>
      <span class="w-[5px] h-[5px] bg-amber rounded-full inline-block mx-10 flex-shrink-0" />
      <span class="px-8 text-chalk text-[11px] font-semibold tracking-[0.08em] uppercase">{{ $t('banner.payment') }}</span>
      <span class="w-[5px] h-[5px] bg-amber rounded-full inline-block mx-10 flex-shrink-0" />
      <span class="px-8 text-chalk text-[11px] font-semibold tracking-[0.08em] uppercase">{{ $t('banner.returns') }}</span>
      <span class="w-[5px] h-[5px] bg-amber rounded-full inline-block mx-10 flex-shrink-0" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>

<style scoped>
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-33.333%); }
}

.animate-marquee {
  animation: marquee 32s linear infinite;
}
</style>
