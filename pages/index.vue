<template>
  <div>
    <SectionsHomeHero />
    <SectionsHomeBestSellers />
    <SectionsHomeCategories />
    <SectionsHomeTransition />
    <SectionsHomeVisionTrust />
    <SectionsHomeNewsletter />
  </div>
</template>

<script setup lang="ts">
/**
 * PAGE HOMEPAGE - Boys & Toys
 *
 * Composant orchestrateur pur (pas de logique métier).
 * Assemble les 6 sections principales de la homepage dans un ordre défini.
 *
 * SECTIONS (ordre d'affichage):
 *
 * 1. HomeHero
 *    - Carrousel automatique 3 slides (7s interval)
 *    - Hauteur: 70vh avec overlay gradient
 *    - 2 CTA par slide (Découvrir + Acheter)
 *    - Navigation dots cliquables
 *
 * 2. HomeBestSellers
 *    - Grid responsive de 4 produits best-sellers
 *    - Images PNG optimisées avec NuxtImg
 *    - Cards avec hover effects (border amber + shadow)
 *    - Boutons "Ajouter au panier"
 *
 * 3. HomeCategories
 *    - Grille masonry responsive (12 colonnes desktop, 6 tablet, bandeaux mobile)
 *    - 7 catégories produits avec images et CTAs
 *    - Bloc texte intégré dans la grille
 *    - Scroll reveal animations avec stagger effect
 *
 * 4. HomeTransition
 *    - Section de pause visuelle entre categories et vision
 *    - Fond chalk avec bordure amber
 *    - Texte centré: engagement de la marque
 *
 * 5. HomeVisionTrust
 *    - Split layout: image + texte (7 cols) + trust items (3 cols)
 *    - Citation inspirante avec image de fond et overlay
 *    - 4 items trust avec icônes Lucide (livraison, discrétion, qualité, paiement)
 *    - Fond chalk pour la colonne trust
 *
 * 6. HomeNewsletter
 *    - Layout inline grid (5 colonnes: 2 textes + 3 form)
 *    - Fond midnight avec form sur fond amber
 *    - Input email + checkbox RGPD + texte légal
 *    - Responsive: stack vertical sur mobile
 *
 * ARCHITECTURE:
 * - Séparation des responsabilités (SoC)
 * - Composants réutilisables
 * - Ancien: 17KB / 324 lignes → Nouveau: ~500 bytes / 20 lignes
 * - Réduction: -97% taille
 */
</script>
