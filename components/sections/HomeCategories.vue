<template>
  <!-- Section Categories - Grille Masonry Moderne Responsive -->
  <section class="bg-white py-12 md:py-20">
    <div class="max-w-screen-2xl mx-auto px-4 md:px-8">
      <!-- Titre Section -->
      <div class="text-center mb-8 md:mb-16">
        <h2 class="text-3xl md:text-4xl font-display font-bold text-midnight mb-4 md:mb-6">
          {{ t('categories.title') }}
        </h2>
        <div class="border-t-2 border-amber w-24 md:w-32 mx-auto" />
      </div>

      <!-- Bloc Texte en haut sur mobile -->
      <div class="block md:hidden max-w-full text-center mb-8 px-2">
        <h2 class="text-xl font-display font-bold text-midnight mb-3">
          {{ t('categories.textBlock.title') }}
        </h2>
        <p class="text-sm font-body text-midnight/70 mb-6">
          {{ t('categories.textBlock.description') }}
        </p>
        <NuxtLink
          to="/categories"
          class="inline-block btn-beveled border-2 border-amber bg-amber text-midnight hover:bg-midnight hover:text-white hover:border-midnight px-6 py-2 text-xs font-display font-semibold uppercase tracking-wide transition-all duration-300"
        >
          {{ t('categories.discover') }}
        </NuxtLink>
      </div>

      <!-- Grid Desktop / Bandeaux Mobile -->
      <div ref="categoriesGrid">
        <!-- MOBILE: Flex Column avec bandeaux horizontaux (< 768px) -->
        <div class="flex flex-col gap-4 md:hidden">
          <!-- Cat1: Stimulateurs -->
          <NuxtLink
            to="/categories/stimulateurs"
            class="flex h-24 border border-concrete hover:border-amber overflow-hidden transition-all duration-500 opacity-0 translate-y-4 rounded-none"
            :class="{ 'opacity-100 translate-y-0': isVisible }"
            :style="{ transitionDelay: isVisible ? `${0 * 100}ms` : '0ms' }"
          >
            <!-- Image gauche -->
            <div class="w-2/5 h-full relative overflow-hidden">
              <NuxtImg
                src="/images/jouet1.jpg"
                :alt="t('categories.cat1')"
                loading="lazy"
                class="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <!-- Content droite -->
            <div class="w-3/5 flex items-center justify-between px-4">
              <h3 class="text-sm font-display font-semibold uppercase text-midnight">
                {{ t('categories.cat1') }}
              </h3>
              <span class="text-amber text-xs font-display font-semibold">→</span>
            </div>
          </NuxtLink>

          <!-- Cat2: Masturbateurs -->
          <NuxtLink
            to="/categories/masturbateurs"
            class="flex h-24 border border-concrete hover:border-amber overflow-hidden transition-all duration-500 opacity-0 translate-y-4 rounded-none"
            :class="{ 'opacity-100 translate-y-0': isVisible }"
            :style="{ transitionDelay: isVisible ? `${1 * 100}ms` : '0ms' }"
          >
            <div class="w-2/5 h-full relative overflow-hidden">
              <NuxtImg
                src="/images/jouet2.jpg"
                :alt="t('categories.cat2')"
                loading="lazy"
                class="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div class="w-3/5 flex items-center justify-between px-4">
              <h3 class="text-sm font-display font-semibold uppercase text-midnight">
                {{ t('categories.cat2') }}
              </h3>
              <span class="text-amber text-xs font-display font-semibold">→</span>
            </div>
          </NuxtLink>

          <!-- Cat3: Anneaux -->
          <NuxtLink
            to="/categories/anneaux"
            class="flex h-24 border border-concrete hover:border-amber overflow-hidden transition-all duration-500 opacity-0 translate-y-4 rounded-none"
            :class="{ 'opacity-100 translate-y-0': isVisible }"
            :style="{ transitionDelay: isVisible ? `${2 * 100}ms` : '0ms' }"
          >
            <div class="w-2/5 h-full relative overflow-hidden">
              <NuxtImg
                src="/images/jouet3.jpg"
                :alt="t('categories.cat3')"
                loading="lazy"
                class="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div class="w-3/5 flex items-center justify-between px-4">
              <h3 class="text-sm font-display font-semibold uppercase text-midnight">
                {{ t('categories.cat3') }}
              </h3>
              <span class="text-amber text-xs font-display font-semibold">→</span>
            </div>
          </NuxtLink>

          <!-- Cat4: Lubrifiants -->
          <NuxtLink
            to="/categories/lubrifiants"
            class="flex h-24 border border-concrete hover:border-amber overflow-hidden transition-all duration-500 opacity-0 translate-y-4 rounded-none"
            :class="{ 'opacity-100 translate-y-0': isVisible }"
            :style="{ transitionDelay: isVisible ? `${3 * 100}ms` : '0ms' }"
          >
            <div class="w-2/5 h-full relative overflow-hidden">
              <NuxtImg
                src="/images/jouet4.jpg"
                :alt="t('categories.cat4')"
                loading="lazy"
                class="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div class="w-3/5 flex items-center justify-between px-4">
              <h3 class="text-sm font-display font-semibold uppercase text-midnight">
                {{ t('categories.cat4') }}
              </h3>
              <span class="text-amber text-xs font-display font-semibold">→</span>
            </div>
          </NuxtLink>

          <!-- Cat5: Accessoires -->
          <NuxtLink
            to="/categories/accessoires"
            class="flex h-24 border border-concrete hover:border-amber overflow-hidden transition-all duration-500 opacity-0 translate-y-4 rounded-none"
            :class="{ 'opacity-100 translate-y-0': isVisible }"
            :style="{ transitionDelay: isVisible ? `${4 * 100}ms` : '0ms' }"
          >
            <div class="w-2/5 h-full relative overflow-hidden">
              <NuxtImg
                src="/images/jouet5.jpg"
                :alt="t('categories.cat5')"
                loading="lazy"
                class="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div class="w-3/5 flex items-center justify-between px-4">
              <h3 class="text-sm font-display font-semibold uppercase text-midnight">
                {{ t('categories.cat5') }}
              </h3>
              <span class="text-amber text-xs font-display font-semibold">→</span>
            </div>
          </NuxtLink>

          <!-- Cat6: Nettoyants -->
          <NuxtLink
            to="/categories/nettoyants"
            class="flex h-24 border border-concrete hover:border-amber overflow-hidden transition-all duration-500 opacity-0 translate-y-4 rounded-none"
            :class="{ 'opacity-100 translate-y-0': isVisible }"
            :style="{ transitionDelay: isVisible ? `${5 * 100}ms` : '0ms' }"
          >
            <div class="w-2/5 h-full relative overflow-hidden">
              <NuxtImg
                src="/images/jouet6.jpg"
                :alt="t('categories.cat6')"
                loading="lazy"
                class="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div class="w-3/5 flex items-center justify-between px-4">
              <h3 class="text-sm font-display font-semibold uppercase text-midnight">
                {{ t('categories.cat6') }}
              </h3>
              <span class="text-amber text-xs font-display font-semibold">→</span>
            </div>
          </NuxtLink>

          <!-- Cat7: Nouveautés -->
          <NuxtLink
            to="/categories/nouveautes"
            class="flex h-24 border border-concrete hover:border-amber overflow-hidden transition-all duration-500 opacity-0 translate-y-4 rounded-none"
            :class="{ 'opacity-100 translate-y-0': isVisible }"
            :style="{ transitionDelay: isVisible ? `${6 * 100}ms` : '0ms' }"
          >
            <div class="w-2/5 h-full relative overflow-hidden">
              <NuxtImg
                src="/images/jouet7.jpg"
                :alt="t('categories.cat7')"
                loading="lazy"
                class="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div class="w-3/5 flex items-center justify-between px-4">
              <h3 class="text-sm font-display font-semibold uppercase text-midnight">
                {{ t('categories.cat7') }}
              </h3>
              <span class="text-amber text-xs font-display font-semibold">→</span>
            </div>
          </NuxtLink>
        </div>

        <!-- TABLET: Grid 6 colonnes (768px - 1024px) -->
        <div class="hidden md:grid lg:hidden grid-cols-6 gap-6">
          <!-- Cat1 -->
          <NuxtLink
            to="/categories/stimulateurs"
            class="col-span-3 relative group overflow-hidden bg-white border-2 border-concrete hover:border-amber transition-all duration-500 opacity-0 translate-y-4 rounded-none min-h-[240px]"
            :class="{ 'opacity-100 translate-y-0': isVisible }"
            :style="{ transitionDelay: isVisible ? `${0 * 100}ms` : '0ms' }"
          >
            <NuxtImg
              src="/images/jouet1.jpg"
              :alt="t('categories.cat1')"
              class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/60 to-transparent" />
            <div class="absolute bottom-0 p-4 w-full">
              <h3 class="text-base font-display font-semibold uppercase text-white mb-2 text-shadow-2xl">
                {{ t('categories.cat1') }}
              </h3>
              <button class="btn-beveled border-2 border-amber bg-amber text-midnight hover:bg-midnight hover:text-white hover:border-midnight px-4 py-1.5 text-xs font-display font-semibold uppercase tracking-wide transition-all duration-300">
                {{ t('categories.discover') }}
              </button>
            </div>
          </NuxtLink>

          <!-- Cat2 -->
          <NuxtLink
            to="/categories/masturbateurs"
            class="col-span-3 relative group overflow-hidden bg-white border-2 border-concrete hover:border-amber transition-all duration-500 opacity-0 translate-y-4 rounded-none min-h-[240px]"
            :class="{ 'opacity-100 translate-y-0': isVisible }"
            :style="{ transitionDelay: isVisible ? `${1 * 100}ms` : '0ms' }"
          >
            <NuxtImg
              src="/images/jouet2.jpg"
              :alt="t('categories.cat2')"
              class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/60 to-transparent" />
            <div class="absolute bottom-0 p-4 w-full">
              <h3 class="text-base font-display font-semibold uppercase text-white mb-2 text-shadow-2xl">
                {{ t('categories.cat2') }}
              </h3>
              <button class="btn-beveled border-2 border-amber bg-amber text-midnight hover:bg-midnight hover:text-white hover:border-midnight px-4 py-1.5 text-xs font-display font-semibold uppercase tracking-wide transition-all duration-300">
                {{ t('categories.discover') }}
              </button>
            </div>
          </NuxtLink>

          <!-- Cat3 -->
          <NuxtLink
            to="/categories/anneaux"
            class="col-span-6 relative group overflow-hidden bg-white border-2 border-concrete hover:border-amber transition-all duration-500 opacity-0 translate-y-4 rounded-none min-h-[200px]"
            :class="{ 'opacity-100 translate-y-0': isVisible }"
            :style="{ transitionDelay: isVisible ? `${2 * 100}ms` : '0ms' }"
          >
            <NuxtImg
              src="/images/jouet3.jpg"
              :alt="t('categories.cat3')"
              class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/60 to-transparent" />
            <div class="absolute bottom-0 p-4 w-full">
              <h3 class="text-base font-display font-semibold uppercase text-white mb-2 text-shadow-2xl">
                {{ t('categories.cat3') }}
              </h3>
              <button class="btn-beveled border-2 border-amber bg-amber text-midnight hover:bg-midnight hover:text-white hover:border-midnight px-4 py-1.5 text-xs font-display font-semibold uppercase tracking-wide transition-all duration-300">
                {{ t('categories.discover') }}
              </button>
            </div>
          </NuxtLink>

          <!-- Bloc Texte Tablet -->
          <div
            class="col-span-6 bg-white border border-concrete hover:border-amber p-8 flex flex-col items-center justify-center text-center transition-all duration-500 opacity-0 translate-y-4 rounded-none min-h-[200px]"
            :class="{ 'opacity-100 translate-y-0': isVisible }"
            :style="{ transitionDelay: isVisible ? `${3 * 100}ms` : '0ms' }"
          >
            <h2 class="text-xl font-display font-bold text-midnight mb-3">
              {{ t('categories.textBlock.title') }}
            </h2>
            <p class="text-sm font-body text-midnight/70 mb-4">
              {{ t('categories.textBlock.description') }}
            </p>
            <NuxtLink
              to="/categories"
              class="btn-beveled border-2 border-amber bg-amber text-midnight hover:bg-midnight hover:text-white hover:border-midnight px-6 py-2 text-xs font-display font-semibold uppercase tracking-wide transition-all duration-300"
            >
              {{ t('categories.discover') }}
            </NuxtLink>
          </div>

          <!-- Cat4, Cat5, Cat6, Cat7 -->
          <NuxtLink
            to="/categories/lubrifiants"
            class="col-span-3 relative group overflow-hidden bg-white border-2 border-concrete hover:border-amber transition-all duration-500 opacity-0 translate-y-4 rounded-none min-h-[240px]"
            :class="{ 'opacity-100 translate-y-0': isVisible }"
            :style="{ transitionDelay: isVisible ? `${4 * 100}ms` : '0ms' }"
          >
            <NuxtImg src="/images/jouet4.jpg" :alt="t('categories.cat4')" loading="lazy" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/60 to-transparent" />
            <div class="absolute bottom-0 p-4 w-full">
              <h3 class="text-base font-display font-semibold uppercase text-white mb-2 text-shadow-2xl">{{ t('categories.cat4') }}</h3>
              <button class="btn-beveled border-2 border-amber bg-amber text-midnight hover:bg-midnight hover:text-white hover:border-midnight px-4 py-1.5 text-xs font-display font-semibold uppercase tracking-wide transition-all duration-300">{{ t('categories.discover') }}</button>
            </div>
          </NuxtLink>

          <NuxtLink to="/categories/accessoires" class="col-span-3 relative group overflow-hidden bg-white border-2 border-concrete hover:border-amber transition-all duration-500 opacity-0 translate-y-4 rounded-none min-h-[240px]" :class="{ 'opacity-100 translate-y-0': isVisible }" :style="{ transitionDelay: isVisible ? `${5 * 100}ms` : '0ms' }">
            <NuxtImg src="/images/jouet5.jpg" :alt="t('categories.cat5')" loading="lazy" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/60 to-transparent" />
            <div class="absolute bottom-0 p-4 w-full">
              <h3 class="text-base font-display font-semibold uppercase text-white mb-2 text-shadow-2xl">{{ t('categories.cat5') }}</h3>
              <button class="btn-beveled border-2 border-amber bg-amber text-midnight hover:bg-midnight hover:text-white hover:border-midnight px-4 py-1.5 text-xs font-display font-semibold uppercase tracking-wide transition-all duration-300">{{ t('categories.discover') }}</button>
            </div>
          </NuxtLink>

          <NuxtLink to="/categories/nettoyants" class="col-span-3 relative group overflow-hidden bg-white border-2 border-concrete hover:border-amber transition-all duration-500 opacity-0 translate-y-4 rounded-none min-h-[240px]" :class="{ 'opacity-100 translate-y-0': isVisible }" :style="{ transitionDelay: isVisible ? `${6 * 100}ms` : '0ms' }">
            <NuxtImg src="/images/jouet6.jpg" :alt="t('categories.cat6')" loading="lazy" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/60 to-transparent" />
            <div class="absolute bottom-0 p-4 w-full">
              <h3 class="text-base font-display font-semibold uppercase text-white mb-2 text-shadow-2xl">{{ t('categories.cat6') }}</h3>
              <button class="btn-beveled border-2 border-amber bg-amber text-midnight hover:bg-midnight hover:text-white hover:border-midnight px-4 py-1.5 text-xs font-display font-semibold uppercase tracking-wide transition-all duration-300">{{ t('categories.discover') }}</button>
            </div>
          </NuxtLink>

          <NuxtLink to="/categories/nouveautes" class="col-span-3 relative group overflow-hidden bg-white border-2 border-concrete hover:border-amber transition-all duration-500 opacity-0 translate-y-4 rounded-none min-h-[240px]" :class="{ 'opacity-100 translate-y-0': isVisible }" :style="{ transitionDelay: isVisible ? `${7 * 100}ms` : '0ms' }">
            <NuxtImg src="/images/jouet7.jpg" :alt="t('categories.cat7')" loading="lazy" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/60 to-transparent" />
            <div class="absolute bottom-0 p-4 w-full">
              <h3 class="text-base font-display font-semibold uppercase text-white mb-2 text-shadow-2xl">{{ t('categories.cat7') }}</h3>
              <button class="btn-beveled border-2 border-amber bg-amber text-midnight hover:bg-midnight hover:text-white hover:border-midnight px-4 py-1.5 text-xs font-display font-semibold uppercase tracking-wide transition-all duration-300">{{ t('categories.discover') }}</button>
            </div>
          </NuxtLink>
        </div>

        <!-- DESKTOP: Grid 12 colonnes (>= 1024px) - Code original conservé -->
        <div class="hidden lg:grid grid-cols-12 gap-10">
          <!-- Cat1: Stimulateurs (col-span-4) -->
          <NuxtLink
            to="/categories/stimulateurs"
            class="col-span-4 relative group overflow-hidden bg-white border-2 border-concrete hover:border-amber transition-all duration-500 opacity-0 translate-y-4 rounded-none min-h-[280px]"
            :class="{ 'opacity-100 translate-y-0': isVisible }"
            :style="{ transitionDelay: isVisible ? `${0 * 100}ms` : '0ms' }"
          >
            <NuxtImg src="/images/jouet1.jpg" :alt="t('categories.cat1')" loading="lazy" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/60 to-transparent" />
            <div class="absolute bottom-0 p-6 w-full">
              <h3 class="text-lg font-display font-semibold uppercase text-white mb-3 text-shadow-2xl">{{ t('categories.cat1') }}</h3>
              <button class="btn-beveled border-2 border-amber bg-amber text-midnight hover:bg-midnight hover:text-white hover:border-midnight px-6 py-2 text-xs font-display font-semibold uppercase tracking-wide transition-all duration-300">{{ t('categories.discover') }}</button>
            </div>
          </NuxtLink>

          <!-- Cat2 -->
          <NuxtLink to="/categories/masturbateurs" class="col-span-3 relative group overflow-hidden bg-white border-2 border-concrete hover:border-amber transition-all duration-500 opacity-0 translate-y-4 rounded-none min-h-[280px]" :class="{ 'opacity-100 translate-y-0': isVisible }" :style="{ transitionDelay: isVisible ? `${1 * 100}ms` : '0ms' }">
            <NuxtImg src="/images/jouet2.jpg" :alt="t('categories.cat2')" loading="lazy" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/60 to-transparent" />
            <div class="absolute bottom-0 p-6 w-full">
              <h3 class="text-lg font-display font-semibold uppercase text-white mb-3 text-shadow-2xl">{{ t('categories.cat2') }}</h3>
              <button class="btn-beveled border-2 border-amber bg-amber text-midnight hover:bg-midnight hover:text-white hover:border-midnight px-6 py-2 text-xs font-display font-semibold uppercase tracking-wide transition-all duration-300">{{ t('categories.discover') }}</button>
            </div>
          </NuxtLink>

          <!-- Cat3 -->
          <NuxtLink to="/categories/anneaux" class="col-span-5 relative group overflow-hidden bg-white border-2 border-concrete hover:border-amber transition-all duration-500 opacity-0 translate-y-4 rounded-none min-h-[280px]" :class="{ 'opacity-100 translate-y-0': isVisible }" :style="{ transitionDelay: isVisible ? `${2 * 100}ms` : '0ms' }">
            <NuxtImg src="/images/jouet3.jpg" :alt="t('categories.cat3')" loading="lazy" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/60 to-transparent" />
            <div class="absolute bottom-0 p-6 w-full">
              <h3 class="text-lg font-display font-semibold uppercase text-white mb-3 text-shadow-2xl">{{ t('categories.cat3') }}</h3>
              <button class="btn-beveled border-2 border-amber bg-amber text-midnight hover:bg-midnight hover:text-white hover:border-midnight px-6 py-2 text-xs font-display font-semibold uppercase tracking-wide transition-all duration-300">{{ t('categories.discover') }}</button>
            </div>
          </NuxtLink>

          <!-- Cat4 -->
          <NuxtLink to="/categories/lubrifiants" class="col-span-3 relative group overflow-hidden bg-white border-2 border-concrete hover:border-amber transition-all duration-500 opacity-0 translate-y-4 rounded-none min-h-[280px]" :class="{ 'opacity-100 translate-y-0': isVisible }" :style="{ transitionDelay: isVisible ? `${3 * 100}ms` : '0ms' }">
            <NuxtImg src="/images/jouet4.jpg" :alt="t('categories.cat4')" loading="lazy" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/60 to-transparent" />
            <div class="absolute bottom-0 p-6 w-full">
              <h3 class="text-lg font-display font-semibold uppercase text-white mb-3 text-shadow-2xl">{{ t('categories.cat4') }}</h3>
              <button class="btn-beveled border-2 border-amber bg-amber text-midnight hover:bg-midnight hover:text-white hover:border-midnight px-6 py-2 text-xs font-display font-semibold uppercase tracking-wide transition-all duration-300">{{ t('categories.discover') }}</button>
            </div>
          </NuxtLink>

          <!-- Bloc Texte Desktop -->
          <div class="col-span-5 bg-white border border-concrete hover:border-amber p-10 flex flex-col items-center justify-center text-center transition-all duration-500 opacity-0 translate-y-4 rounded-none min-h-[280px]" :class="{ 'opacity-100 translate-y-0': isVisible }" :style="{ transitionDelay: isVisible ? `${4 * 100}ms` : '0ms' }">
            <h2 class="text-2xl font-display font-bold text-midnight mb-4">{{ t('categories.textBlock.title') }}</h2>
            <p class="text-sm font-body text-midnight/70 mb-6">{{ t('categories.textBlock.description') }}</p>
            <NuxtLink to="/categories" class="btn-beveled border-2 border-amber bg-amber text-midnight hover:bg-midnight hover:text-white hover:border-midnight px-6 py-2 text-xs font-display font-semibold uppercase tracking-wide transition-all duration-300">{{ t('categories.discover') }}</NuxtLink>
          </div>

          <!-- Cat5, Cat6, Cat7 -->
          <NuxtLink to="/categories/accessoires" class="col-span-4 relative group overflow-hidden bg-white border-2 border-concrete hover:border-amber transition-all duration-500 opacity-0 translate-y-4 rounded-none min-h-[280px]" :class="{ 'opacity-100 translate-y-0': isVisible }" :style="{ transitionDelay: isVisible ? `${5 * 100}ms` : '0ms' }">
            <NuxtImg src="/images/jouet5.jpg" :alt="t('categories.cat5')" loading="lazy" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/60 to-transparent" />
            <div class="absolute bottom-0 p-6 w-full">
              <h3 class="text-lg font-display font-semibold uppercase text-white mb-3 text-shadow-2xl">{{ t('categories.cat5') }}</h3>
              <button class="btn-beveled border-2 border-amber bg-amber text-midnight hover:bg-midnight hover:text-white hover:border-midnight px-6 py-2 text-xs font-display font-semibold uppercase tracking-wide transition-all duration-300">{{ t('categories.discover') }}</button>
            </div>
          </NuxtLink>

          <NuxtLink to="/categories/nettoyants" class="col-span-5 relative group overflow-hidden bg-white border-2 border-concrete hover:border-amber transition-all duration-500 opacity-0 translate-y-4 rounded-none min-h-[280px]" :class="{ 'opacity-100 translate-y-0': isVisible }" :style="{ transitionDelay: isVisible ? `${6 * 100}ms` : '0ms' }">
            <NuxtImg src="/images/jouet6.jpg" :alt="t('categories.cat6')" loading="lazy" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/60 to-transparent" />
            <div class="absolute bottom-0 p-6 w-full">
              <h3 class="text-lg font-display font-semibold uppercase text-white mb-3 text-shadow-2xl">{{ t('categories.cat6') }}</h3>
              <button class="btn-beveled border-2 border-amber bg-amber text-midnight hover:bg-midnight hover:text-white hover:border-midnight px-6 py-2 text-xs font-display font-semibold uppercase tracking-wide transition-all duration-300">{{ t('categories.discover') }}</button>
            </div>
          </NuxtLink>

          <NuxtLink to="/categories/nouveautes" class="col-span-7 relative group overflow-hidden bg-white border-2 border-concrete hover:border-amber transition-all duration-500 opacity-0 translate-y-4 rounded-none min-h-[280px]" :class="{ 'opacity-100 translate-y-0': isVisible }" :style="{ transitionDelay: isVisible ? `${7 * 100}ms` : '0ms' }">
            <NuxtImg src="/images/jouet7.jpg" :alt="t('categories.cat7')" loading="lazy" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/60 to-transparent" />
            <div class="absolute bottom-0 p-6 w-full">
              <h3 class="text-lg font-display font-semibold uppercase text-white mb-3 text-shadow-2xl">{{ t('categories.cat7') }}</h3>
              <button class="btn-beveled border-2 border-amber bg-amber text-midnight hover:bg-midnight hover:text-white hover:border-midnight px-6 py-2 text-xs font-display font-semibold uppercase tracking-wide transition-all duration-300">{{ t('categories.discover') }}</button>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

/**
 * HomeCategories - Grille Masonry Moderne Responsive
 *
 * RESPONSIVE MOBILE (< 768px):
 * - Section: px-4 py-12 (marges réduites)
 * - Titre: text-3xl mb-8 (compact)
 * - Ligne séparation: w-24 (réduite)
 * - Bloc texte en haut: max-w-full text-center mb-8, texte p text-sm mb-6, CTA mb-8
 * - Grid devient: flex flex-col gap-4 (pas gap-10)
 * - 7 bandeaux horizontaux h-24:
 *   - flex h-24 border border-concrete hover:border-amber overflow-hidden
 *   - Image left: w-2/5 h-full object-cover
 *   - Content right: w-3/5 flex items-center justify-between px-4
 *   - h3: text-sm Sora semibold text-midnight
 *   - Flèche: text-amber text-xs "→"
 * - Pas de marges latérales excessives
 * - Stagger scroll conservé (index * 100ms)
 *
 * RESPONSIVE TABLET (768px - 1024px):
 * - Grid: grid-cols-6 gap-6 intermédiaire
 * - Cards: col-span-3 ou col-span-6 selon disposition
 * - Min-h: 240px (réduit)
 * - Padding: p-4 (réduit)
 * - Textes: text-base (réduit)
 *
 * RESPONSIVE DESKTOP (>= 1024px):
 * - Grid: grid-cols-12 gap-10 (layout original)
 * - Cards: col-span selon architecture originale
 * - Min-h: 280px
 * - Padding: p-6 / p-10
 * - Textes: text-lg
 *
 * DESIGN:
 * - DA strict: midnight/amber/white uniquement
 * - Overlay: from-midnight/90 via-midnight/60 to-transparent
 * - Text-shadow: text-shadow-2xl sur titres desktop/tablet
 * - CTA: bg-amber hover:bg-midnight text-midnight hover:text-white
 * - Scroll reveal: translate-y-4 subtil conservé
 * - Transitions: duration-500 smooth
 */

const { t } = useI18n()

const categoriesGrid = ref<HTMLElement | null>(null)
const isVisible = ref(false)

useIntersectionObserver(
  categoriesGrid,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      isVisible.value = true
    }
  },
  { threshold: 0.2 }
)
</script>
