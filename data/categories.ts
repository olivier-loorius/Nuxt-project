// ─── Types ────────────────────────────────────────────────────────────────────

export interface CatalogSubcategory {
  /** Identifiant unique de la sous-catégorie (snake_case) */
  id: string
  /** Clé i18n → catalog.subcategories.<key> */
  labelKey: string
  /** Nombre de produits dans cette sous-catégorie */
  count: number
}

export interface CatalogCategory {
  /** Identifiant unique de la catégorie (snake_case) */
  id: string
  /** Clé i18n → catalog.categories.<key> */
  labelKey: string
  /** Total de produits dans la catégorie (somme des sous-catégories) */
  total: number
  children: CatalogSubcategory[]
}

// ─── Données ──────────────────────────────────────────────────────────────────

export const CATALOG_CATEGORIES: CatalogCategory[] = [
  {
    id: 'masturbateurs',
    labelKey: 'catalog.categories.masturbateurs',
    total: 16,
    children: [
      { id: 'manchons',    labelKey: 'catalog.subcategories.manchons',    count: 5 },
      { id: 'interactifs', labelKey: 'catalog.subcategories.interactifs', count: 4 },
      { id: 'torsoles',    labelKey: 'catalog.subcategories.torsoles',    count: 4 },
      { id: 'poupees',     labelKey: 'catalog.subcategories.poupees',     count: 3 },
    ],
  },
  {
    id: 'anneaux_peniens',
    labelKey: 'catalog.categories.anneaux_peniens',
    total: 16,
    children: [
      { id: 'anneaux_simples',  labelKey: 'catalog.subcategories.anneaux_simples',  count: 4 },
      { id: 'anneaux_vibreurs', labelKey: 'catalog.subcategories.anneaux_vibreurs', count: 5 },
      { id: 'cockrings',        labelKey: 'catalog.subcategories.cockrings',        count: 4 },
      { id: 'kits_anneaux',     labelKey: 'catalog.subcategories.kits_anneaux',     count: 3 },
    ],
  },
  {
    id: 'stimulateurs_prostatiques',
    labelKey: 'catalog.categories.stimulateurs_prostatiques',
    total: 16,
    children: [
      { id: 'vibrateurs_prostatiques', labelKey: 'catalog.subcategories.vibrateurs_prostatiques', count: 5 },
      { id: 'masseurs_prostatiques',   labelKey: 'catalog.subcategories.masseurs_prostatiques',   count: 4 },
      { id: 'plugs',                   labelKey: 'catalog.subcategories.plugs',                   count: 5 },
      { id: 'perinee',                 labelKey: 'catalog.subcategories.perinee',                 count: 2 },
    ],
  },
  {
    id: 'accessoires_bdsm',
    labelKey: 'catalog.categories.accessoires_bdsm',
    total: 16,
    children: [
      { id: 'menottes',        labelKey: 'catalog.subcategories.menottes',        count: 4 },
      { id: 'masques',         labelKey: 'catalog.subcategories.masques',         count: 4 },
      { id: 'fessees',         labelKey: 'catalog.subcategories.fessees',         count: 4 },
      { id: 'kits_decouverte', labelKey: 'catalog.subcategories.kits_decouverte', count: 4 },
    ],
  },
  {
    id: 'lubrifiants',
    labelKey: 'catalog.categories.lubrifiants',
    total: 16,
    children: [
      { id: 'lube_eau',       labelKey: 'catalog.subcategories.lube_eau',       count: 5 },
      { id: 'lube_silicone',  labelKey: 'catalog.subcategories.lube_silicone',  count: 4 },
      { id: 'lube_hybride',   labelKey: 'catalog.subcategories.lube_hybride',   count: 4 },
      { id: 'lube_chauffant', labelKey: 'catalog.subcategories.lube_chauffant', count: 3 },
    ],
  },
  {
    id: 'lingerie_homme',
    labelKey: 'catalog.categories.lingerie_homme',
    total: 16,
    children: [
      { id: 'boxers',       labelKey: 'catalog.subcategories.boxers',       count: 5 },
      { id: 'strings',      labelKey: 'catalog.subcategories.strings',      count: 4 },
      { id: 'jockstraps',   labelKey: 'catalog.subcategories.jockstraps',   count: 4 },
      { id: 'combinaisons', labelKey: 'catalog.subcategories.combinaisons', count: 3 },
    ],
  },
]
