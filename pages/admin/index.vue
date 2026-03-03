<template>
  <div>
    <h1 class="text-2xl font-display font-bold text-midnight mb-8">Dashboard</h1>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="bg-white border border-concrete rounded-sm p-6">
        <p class="text-xs font-body tracking-widest uppercase text-midnight/40 mb-2">Produits</p>
        <p class="text-3xl font-display font-bold text-midnight">—</p>
      </div>

      <div class="bg-white border border-concrete rounded-sm p-6">
        <p class="text-xs font-body tracking-widest uppercase text-midnight/40 mb-2">Utilisateurs</p>
        <p class="text-3xl font-display font-bold text-midnight">—</p>
      </div>

      <div class="bg-white border border-concrete rounded-sm p-6">
        <p class="text-xs font-body tracking-widest uppercase text-midnight/40 mb-2">Commandes</p>
        <p class="text-3xl font-display font-bold text-midnight">—</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: 'admin',
})
</script>
