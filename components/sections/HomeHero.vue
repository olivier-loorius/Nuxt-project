<template>
  <!-- Hero Section avec carrousel -->
  <section class="relative h-[70vh] overflow-hidden">
    <div
      v-for="(slide, index) in products"
      :key="index"
      class="transition-opacity duration-800 absolute inset-0"
      :class="currentSlide === index ? 'opacity-100' : 'opacity-0'"
    >
      <div class="absolute inset-0">
        <img
          :src="slide.image"
          :alt="t(slide.titleKey)"
          :loading="index === 0 ? 'eager' : 'lazy'"
          class="w-full h-full object-cover"
        />
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-midnight/80 via-midnight/40 to-transparent z-10"></div>

      <div class="absolute bottom-0 left-0 right-0 p-6 lg:p-12 z-20">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-3xl lg:text-5xl font-display font-bold text-white mb-4">
            {{ t(slide.titleKey) }}
          </h2>

          <p class="text-base lg:text-lg text-white/90 font-body mb-6 max-w-xl">
            {{ t(slide.descKey) }}
          </p>

          <div class="flex flex-col lg:flex-row gap-6">
            <NuxtLink
              :to="slide.linkTo"
              class="btn-beveled border-2 border-white text-white hover:bg-white hover:text-midnight px-8 py-4 font-display font-semibold uppercase tracking-wide text-sm transition-all duration-300 text-center"
            >
              {{ t(slide.ctaKey) }}
            </NuxtLink>

            <NuxtLink
              :to="slide.linkTo"
              class="btn-beveled border-2 border-amber bg-amber text-midnight hover:bg-transparent hover:text-amber px-8 py-4 font-display font-semibold uppercase tracking-wide text-sm transition-all duration-300 text-center"
            >
              {{ t(slide.buyKey) }}
            </NuxtLink>
          </div>

          <div class="flex gap-3 lg:gap-6 justify-center mt-8 lg:mt-12 text-xs lg:text-sm">
            <button
              v-for="(product, idx) in products"
              :key="idx"
              @click="currentSlide = idx"
              :class="currentSlide === idx ? 'font-bold text-white' : 'font-normal text-white/50'"
              class="transition-all duration-300"
            >
              {{ product.name }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">

const { t } = useI18n()

const currentSlide = ref(0)

const products = [
  {
    name: 'Lingerie',
    image: '/images/stephen-andrews-Dp9u1FbGgPA-unsplash.webp',
    titleKey: 'hero.slide1.title',
    descKey: 'hero.slide1.description',
    ctaKey: 'hero.slide1.cta',
    buyKey: 'hero.buy',
    linkTo: '/lingerie'
  },
  {
    name: 'Accessoires',
    image: '/images/andrey-matveev-SPG0SznDi8c-unsplash.webp',
    titleKey: 'hero.slide2.title',
    descKey: 'hero.slide2.description',
    ctaKey: 'hero.slide2.cta',
    buyKey: 'hero.buy',
    linkTo: '/accessoires'
  },
  {
    name: 'Nouveautés',
    image: '/images/stephen-andrews-Dp9u1FbGgPA-unsplash.webp',
    titleKey: 'hero.slide3.title',
    descKey: 'hero.slide3.description',
    ctaKey: 'hero.slide3.cta',
    buyKey: 'hero.buy',
    linkTo: '/nouveautes'
  }
]

let intervalId: NodeJS.Timeout | null = null

onMounted(() => {
  intervalId = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % 3
  }, 7000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>
