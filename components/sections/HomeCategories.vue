<template>
  <section class="bg-chalk py-12 md:py-20">
    <div class="max-w-6xl mx-auto px-4 md:px-8 lg:px-12">

      <div class="mb-10">
        <div class="w-8 h-[2px] bg-amber mb-2" />
        <h2 class="text-2xl sm:text-3xl lg:text-5xl font-display font-bold text-midnight">
          {{ t('categories.title') }}
        </h2>
      </div>

      <div class="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-6">
        <NuxtLink
          v-for="collection in collections"
          :key="collection.slug"
          :to="localePath('/categories/' + collection.slug)"
          class="btn-beveled group relative block aspect-square overflow-hidden"
        >
          <img
            :src="collection.image"
            :alt="locale === 'en' ? collection.titleEn : collection.titleFr"
            class="absolute inset-0 h-full w-full object-cover"
          />

          <div class="absolute inset-0 bg-midnight/60 transition-colors duration-300 group-hover:bg-amber/20" />

          <div class="absolute inset-0 flex items-center justify-center px-4">
            <p class="font-display font-bold text-chalk text-base lg:text-lg uppercase tracking-widest text-center">
              {{ locale === 'en' ? collection.titleEn : collection.titleFr }}
            </p>
          </div>
        </NuxtLink>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
const { t, locale } = useI18n();
const localePath = useLocalePath();

const collections = [
  {
    titleFr: "Masturbateur",
    titleEn: "Masturbator",
    image: "/images/collectionMasturbateur.webp",
    slug: "masturbateurs",
  },
  {
    titleFr: "Stimulateur",
    titleEn: "Stimulator",
    image: "/images/collectionStimulateur.webp",
    slug: "stimulateurs_prostatiques",
  },
  {
    titleFr: "Anneaux",
    titleEn: "Rings",
    image: "/images/collectionAnneaux.webp",
    slug: "anneaux_peniens",
  },
  {
    titleFr: "Lubrifiant",
    titleEn: "Lubricant",
    image: "/images/collectionLubrifiant.webp",
    slug: "lubrifiants",
  },
  {
    titleFr: "Accessoires",
    titleEn: "Accessories",
    image: "/images/collectionAccesoires.webp",
    slug: "accessoires_bdsm",
  },
  {
    titleFr: "Nouveautés",
    titleEn: "New Arrivals",
    image: "/images/collectionNouveaute.webp",
    slug: "nouveautes",
  },
];
</script>
