# 🔍 AUDIT COMPLET - SECTION /COMPTE

## 1️⃣ STRUCTURE DES FICHIERS

```
📁 pages/compte/
  ├─ 📄 index.vue              (104 lignes)  ✅ DASHBOARD COMPLET
  ├─ 📄 profil.vue             (329 lignes)  ✅ PROFIL FONCTIONNEL
  ├─ 📄 commandes.vue          (152 lignes)  ⚠️ STRUCTURE OK, DONNÉES VIDES
  ├─ 📄 favoris.vue            (116 lignes)  ⚠️ STRUCTURE OK, DONNÉES VIDES
  └─ 📄 adresses.vue           (273 lignes)  ✅ FONCTIONNEL (LOCAL)

📄 layouts/compte.vue (91 lignes)
  ✅ Layout partagé avec sidebar + tabs mobile
```

---

## 2️⃣ STRUCTURE DU LAYOUT - `layouts/compte.vue`

### Composants Utilisés
- ✓ **LayoutInfoBanner** (top navigation)
- ✓ **LayoutNavigation** (main header)
- ✓ **Sidebar Desktop** (width-72, sticky top-24)
  - Navigation carré (border-2 border-concrete)
  - 5 liens avec border-l-4 border-amber (actif)
  - States: hover:bg-midnight/5, active: bg-amber/10
- ✓ **Mobile Tabs** (overflow-x-auto avec scrollbar amber)
- ✓ **Main Content** (flex-1 slot)
- ✓ **LayoutFooter**

### Navigation (accountLinks array, ligne 60-66)
```
├─ /compte          → 'compte.menu.dashboard'
├─ /compte/profil   → 'compte.menu.profil'
├─ /compte/commandes → 'compte.menu.commandes'
├─ /compte/favoris  → 'compte.menu.favoris'
└─ /compte/adresses → 'compte.menu.adresses'
```

### Méthodes
- `isActive(path)`: Vérifie `route.path` pour active state
- Utilise `computed` pour route reactivity

---

## 3️⃣ AUDIT DÉTAILLÉ - CHAQUE PAGE

### 📄 `/compte/index.vue` - DASHBOARD

**État:** ✅ **COMPLET** (104 lignes)

#### Configuration
- Layout: `'compte'` ✓
- Middleware: `'auth'` ✓
- Conteneur: `<div class="bg-white border-2 border-concrete p-8">`

#### Fonctionnalités Présentes

| Fonctionnalité | Implémentation | État |
|---|---|---|
| Header titre/welcome | Présent + userDisplayName computed | ✅ |
| Quick Stats (3 cartes) | orderCount, favoritesCount, addressCount | ⚠️ |
| Quick Links (4 liens) | Vers profil/commandes/favoris/adresses | ✅ |
| Design | Carré + border-l-4 border-amber + hover effects | ✅ |
| Responsive | Grid cols-3 med → cols-1 mobile | ✅ |

#### Détails des Stats
1. **Orders** (amber: #D4A574)
   - bg-amber/5, border-amber/40
   - Affiche `orderCount` (ref: 0)

2. **Favorites** (copper: #B87333)
   - bg-copper/5, border-copper/40
   - Affiche `favoritesCount` (ref: 0)

3. **Addresses** (midnight: #1A1D2E)
   - bg-midnight/5, border-midnight/40
   - Affiche `addressCount` (ref: 0)

#### Data Binding
- `useSupabaseUser()` pour user
- `userDisplayName` computed (firstName ou email ou 'Utilisateur')
- Refs pour stats (initialisés à 0)

#### ⚠️ CE QUI MANQUE

```
❌ Intégration Supabase pour récupérer les stats
❌ Fetch orderCount depuis table orders
❌ Fetch favoritesCount depuis table favorites
❌ Fetch addressCount depuis table addresses
❌ Hook onMounted() pour charger les données
❌ Gestion des erreurs lors du fetch
```

---

### 📄 `/compte/profil.vue` - PROFIL

**État:** ✅ **FONCTIONNEL COMPLET** (329 lignes)

#### Configuration
- Layout: `'compte'` ✓
- Middleware: `'auth'` ✓

#### Fonctionnalités Présentes

| Fonctionnalité | Implémentation | État |
|---|---|---|
| Email (readonly) | Affiche user?.email Supabase | ✅ |
| Password (masked) | "••••••••••••" avec toggle Eye/EyeOff | ✅ |
| Edit Mode | isEditing state + buttons Save/Cancel | ✅ |
| Form Fields | firstName, lastName, birthDate, phone | ✅ |
| Validation | canSubmit computed (firstName + lastName requis) | ✅ |
| Loading State | Skeleton loading (animate-pulse) | ✅ |
| Delete Account | Modal confirmation + success modal | ✅ |
| Persistence | useProfile() composable | ✅ |
| Async Phone | PhoneInput component (defineAsyncComponent) | ✅ |

#### Sections Détaillées

**1. Section Email & Password**
- Email: disabled, readonly, message d'explication
- Password: masked par défaut, toggleable, readonly

**2. Section Profil Éditable**
```
Fields:
├─ firstName* (obligatoire)
├─ lastName* (obligatoire)
├─ birthDate (optionnel, type="date")
└─ phone (optionnel, PhoneInput component)
```

**3. Edit Mode**
- Button "Modifier" → `isEditing = true`
- Inputs deviennent éditables (bg-white, focus:ring-2 focus:ring-amber)
- Buttons Save/Cancel apparaissent

**4. Delete Account**
- Button "Supprimer le compte" (red text)
- ConfirmModal pour confirmation
- SuccessModal après suppression
- Redirection vers `/` après fermeture

#### Fonctions Principales
```typescript
loadProfile()          // Récupère depuis Supabase via useProfile()
enterEditMode()        // Passe en édition
cancelEdit()           // Revient à originalData
handleSubmit()         // Appelle updateProfile()
handleDeleteAccount()  // Appelle deleteAccount()
```

#### ✅ COMPLÈTEMENT FONCTIONNEL!

---

### 📄 `/compte/commandes.vue` - COMMANDES

**État:** ⚠️ **STRUCTURE OK, DONNÉES VIDES** (152 lignes)

#### Configuration
- Layout: `'compte'` ✓
- Middleware: `'auth'` ✓

#### Fonctionnalités Présentes

| Fonctionnalité | Implémentation | État |
|---|---|---|
| Header | Title + subtitle i18n | ✅ |
| Orders List | Affiche si orders.length > 0 | ✅ |
| Order Info | Numero, Status badge, Date, Total | ✅ |
| Status Styling | 5 couleurs (pending/processing/shipped/delivered/cancelled) | ✅ |
| Empty State | Message + CTA vers /nouveautes | ✅ |
| Utilitaires | formatDate(), formatPrice(), getStatusLabel() | ✅ |
| Responsive | flex-col mobile → flex-row desktop | ✅ |

#### Structure de Données
```typescript
interface Order {
  id: string
  number: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
}

const orders = ref<Order[]>([])  // ARRAY VIDE!
```

#### Status Styling
```
pending:    bg-yellow-100 text-yellow-800
processing: bg-blue-100 text-blue-800
shipped:    bg-purple-100 text-purple-800
delivered:  bg-green-100 text-green-800
cancelled:  bg-red-100 text-red-800
```

#### ⚠️ CE QUI MANQUE

```
❌ Fetch orders depuis Supabase
❌ Hook onMounted() pour charger les commandes
❌ useProfile() ou composable pour récupérer orders
❌ Logique "Voir les détails" (bouton vide)
❌ Pagination si beaucoup de commandes
❌ Gestion des erreurs Supabase
```

---

### 📄 `/compte/favoris.vue` - FAVORIS

**État:** ⚠️ **STRUCTURE OK, DONNÉES VIDES** (116 lignes)

#### Configuration
- Layout: `'compte'` ✓
- Middleware: `'auth'` ✓

#### Fonctionnalités Présentes

| Fonctionnalité | Implémentation | État |
|---|---|---|
| Header | Title + subtitle i18n | ✅ |
| Favorites Grid | Grid 1→3 cols responsive | ✅ |
| Product Card | Image, Name, Price, Buttons | ✅ |
| Remove Button | Croix rouge, top-right, appelle removeFavorite() | ✅ |
| Add to Cart | Button "Ajouter au panier" | ⚠️ |
| Empty State | Message + CTA vers /nouveautes | ✅ |
| Price Formatting | Intl.NumberFormat EUR | ✅ |

#### Structure de Données
```typescript
interface Product {
  id: string
  name: string
  price: number
  image?: string
}

const favorites = ref<Product[]>([])  // ARRAY VIDE!
```

#### Logique Implémentée
```typescript
removeFavorite(productId)  // Filter array ✅
addToCart(productId)       // FONCTION VIDE ⚠️
formatPrice(price)         // Intl.NumberFormat ✅
```

#### ⚠️ CE QUI MANQUE

```
❌ Fetch favorites depuis Supabase
❌ Hook onMounted() pour charger les favoris
❌ Logique addToCart() vide (pas intégration panier)
❌ Intégration avec store panier global
❌ Gestion des erreurs Supabase
❌ Rafraîchissement après suppression de favoris
```

---

### 📄 `/compte/adresses.vue` - ADRESSES

**État:** ✅ **FONCTIONNEL (DONNÉES LOCALES)** (273 lignes)

#### Configuration
- Layout: `'compte'` ✓
- Middleware: `'auth'` ✓

#### Fonctionnalités Présentes

| Fonctionnalité | Implémentation | État |
|---|---|---|
| Header + Add Button | Title + "Ajouter une adresse" button | ✅ |
| Addresses List | Grid 1→2 cols responsive | ✅ |
| Default Badge | Affiche si isDefault = true | ✅ |
| Address Display | Full name, street, city, country, phone | ✅ |
| Edit Button | Appelle editAddress() | ⚠️ |
| Delete Button | Appelle deleteAddress(), filtre array | ✅ |
| Empty State | Message + CTA | ✅ |
| Modal Form | Fixed overlay avec form | ✅ |

#### Structure de Données
```typescript
interface Address {
  id: string
  firstName: string
  lastName: string
  street: string
  zipCode: string
  city: string
  country: string
  phone?: string
  isDefault: boolean
}

const addresses = ref<Address[]>([])
const showAddForm = ref(false)
```

#### Form Fields
```
├─ firstName, lastName (grid 2 cols)
├─ street
├─ zipCode, city (grid 2 cols)
├─ country (default: 'France')
└─ phone
```

#### Logique Implémentée
```typescript
handleSubmitAddress()      // Crée Address + push array ✅
                          // isDefault = true si première
                          // Génère id: Date.now().toString()
deleteAddress(addressId)   // Filter array correctement ✅
editAddress(addressId)     // FONCTION VIDE ⚠️
                          // Pas d'édition réelle
```

#### ⚠️ CE QUI MANQUE

```
❌ Fetch adresses depuis Supabase
❌ Persister les données en Supabase au lieu du local
❌ Implémenter editAddress() (modification réelle)
❌ Hook onMounted() pour charger les adresses
❌ Gestion des erreurs Supabase
❌ Validation d'adresse (code postal format, etc.)
❌ Sélection du pays via dropdown au lieu de text input
```

---

## 4️⃣ TABLEAU RÉCAPITULATIF

| Page | Lignes | État | Contenu | Layout | Auth | Fonctionnalités Clés |
|---|---|---|---|---|---|---|
| **index** | 104 | ⚠️ Partiel | Dashboard avec stats | ✅ | ✅ | Stats refs vides, pas de fetch Supabase |
| **profil** | 329 | ✅ Complet | Profil utilisateur édit | ✅ | ✅ | Edit mode, delete account, useProfile() |
| **commandes** | 152 | ⚠️ Partiel | Liste commandes | ✅ | ✅ | Structure OK, array orders vide |
| **favoris** | 116 | ⚠️ Partiel | Grid favoris | ✅ | ✅ | Structure OK, array favorites vide, addToCart() vide |
| **adresses** | 273 | ✅ Local | CRUD adresses | ✅ | ✅ | Complet en local, pas Supabase, editAddress() vide |

---

## 5️⃣ RÉSUMÉ - CE QUI MANQUE PAR PAGE

### Dashboard (`/compte/index.vue`)
**À implémenter pour avoir les stats:**
```typescript
// 1. Créer composable useAccountStats()
export const useAccountStats = () => {
  const fetchOrderCount = async () => {
    const { data } = await supabase
      .from('orders')
      .select('count')
      .eq('user_id', user.value?.id)
    return data?.[0]?.count || 0
  }

  const fetchFavoritesCount = async () => {
    const { data } = await supabase
      .from('favorites')
      .select('count')
      .eq('user_id', user.value?.id)
    return data?.[0]?.count || 0
  }

  const fetchAddressCount = async () => {
    const { data } = await supabase
      .from('addresses')
      .select('count')
      .eq('user_id', user.value?.id)
    return data?.[0]?.count || 0
  }

  return { fetchOrderCount, fetchFavoritesCount, fetchAddressCount }
}

// 2. Dans index.vue: onMounted hook
onMounted(async () => {
  const { fetchOrderCount, fetchFavoritesCount, fetchAddressCount } = useAccountStats()
  orderCount.value = await fetchOrderCount()
  favoritesCount.value = await fetchFavoritesCount()
  addressCount.value = await fetchAddressCount()
})
```

### Commandes (`/compte/commandes.vue`)
**À implémenter:**
```typescript
// 1. Créer composable useOrders()
// 2. onMounted: charger les commandes
// 3. Implémenter logique "Voir les détails"
// 4. Ajouter pagination si nécessaire
// 5. Ajouter filtres par status
```

### Favoris (`/compte/favoris.vue`)
**À implémenter:**
```typescript
// 1. Créer composable useFavorites()
// 2. onMounted: charger les favoris
// 3. Intégrer addToCart() avec store panier
// 4. Rafraîchir après removeFavorite()
// 5. Afficher message success/error
```

### Adresses (`/compte/adresses.vue`)
**À améliorer:**
```typescript
// 1. Créer composable useAddresses()
// 2. onMounted: charger depuis Supabase
// 3. Implémenter editAddress() (popup form avec données pré-remplies)
// 4. handleSubmit: UPDATE si editMode, CREATE sinon
// 5. Persister en Supabase, pas en local
// 6. Ajouter validation (code postal, etc.)
// 7. Sélect dropdown pour pays au lieu de text input
```

---

## 6️⃣ CONCLUSION

### État Général: 60% Complet ✅⚠️

- **✅ Profil** : Complètement fonctionnel
- **✅ Adresses** : Fonctionnel en local (besoin Supabase)
- **⚠️ Dashboard** : Structure OK, stats vides
- **⚠️ Commandes** : Structure OK, données vides
- **⚠️ Favoris** : Structure OK, données vides

### Priorités d'Implémentation
1. **Dashboard** - Fetch stats (rapide, 15 min)
2. **Commandes** - Fetch orders (30 min)
3. **Favoris** - Fetch + intégration panier (45 min)
4. **Adresses** - Supabase + edit fonctionnel (30 min)
5. **Polish** - Erreurs, validations, edge cases (1h)

**Temps total estimé:** 2h30 pour tout fonctionnel avec Supabase
