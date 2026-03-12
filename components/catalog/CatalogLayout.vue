<template>
  <div class="min-h-screen bg-chalk">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div class="flex flex-col lg:flex-row lg:gap-8">
        <aside
          class="w-full lg:w-[250px] lg:flex-shrink-0
                 border-b border-concrete pb-6 mb-6
                 lg:border-b-0 lg:border-r lg:pb-0 lg:mb-0 lg:pr-8"
        >
          <slot name="sidebar" />
        </aside>
        <main class="flex-1 min-w-0">
          <slot name="content" />
        </main>

      </div>
    </div>
  </div>
</template>
