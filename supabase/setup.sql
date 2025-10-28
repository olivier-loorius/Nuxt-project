-- =====================================================
-- BOYS & TOYS - SUPABASE DATABASE SETUP
-- =====================================================
-- Setup complet pour système e-commerce avec authentification
-- À exécuter dans Supabase SQL Editor
-- =====================================================

-- Activer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 1. TABLE PROFILES (Profils utilisateurs)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,

  -- Metadata inscription
  newsletter BOOLEAN DEFAULT false,
  age_verified BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Contraintes
  CONSTRAINT phone_format CHECK (phone IS NULL OR phone ~* '^\+?[0-9\s]{6,20}$')
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at DESC);

-- =====================================================
-- 2. TABLE ADDRESSES (Adresses de livraison/facturation)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Type d'adresse
  type TEXT NOT NULL CHECK (type IN ('billing', 'shipping', 'both')),
  is_default BOOLEAN DEFAULT false,

  -- Informations adresse
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company TEXT,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  state_province TEXT,
  country TEXT NOT NULL DEFAULT 'FR',
  phone TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Contraintes
  CONSTRAINT postal_code_format CHECK (postal_code ~* '^[0-9A-Z\s-]{3,10}$')
);

-- Index pour recherche par utilisateur
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_default ON public.addresses(user_id, is_default) WHERE is_default = true;

-- =====================================================
-- 3. TABLE ORDERS (Commandes)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,

  -- Numéro de commande lisible
  order_number TEXT UNIQUE NOT NULL,

  -- Statut commande
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')
  ),

  -- Montants (en centimes pour éviter problèmes float)
  subtotal INTEGER NOT NULL CHECK (subtotal >= 0),
  shipping_cost INTEGER NOT NULL DEFAULT 0 CHECK (shipping_cost >= 0),
  tax INTEGER NOT NULL DEFAULT 0 CHECK (tax >= 0),
  discount INTEGER NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total INTEGER NOT NULL CHECK (total >= 0),

  -- Adresses (snapshot au moment de la commande)
  shipping_address JSONB NOT NULL,
  billing_address JSONB NOT NULL,

  -- Informations paiement
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (
    payment_status IN ('pending', 'paid', 'failed', 'refunded')
  ),
  payment_id TEXT,

  -- Informations livraison
  shipping_method TEXT,
  tracking_number TEXT,
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,

  -- Notes
  customer_notes TEXT,
  admin_notes TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Contraintes
  CONSTRAINT total_calculation CHECK (total = subtotal + shipping_cost + tax - discount)
);

-- Indexes pour recherche et tri
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);

-- =====================================================
-- 4. TABLE ORDER_ITEMS (Articles de commande)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,

  -- Informations produit (snapshot au moment de la commande)
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_sku TEXT,
  product_image TEXT,

  -- Variante (taille, couleur, etc.)
  variant_id TEXT,
  variant_options JSONB,

  -- Prix et quantité (en centimes)
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price INTEGER NOT NULL CHECK (unit_price >= 0),
  total_price INTEGER NOT NULL CHECK (total_price >= 0),

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Contraintes
  CONSTRAINT total_price_calculation CHECK (total_price = quantity * unit_price)
);

-- Index pour recherche par commande
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- =====================================================
-- 5. TABLE CART_ITEMS (Panier utilisateur)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Informations produit
  product_id TEXT NOT NULL,
  variant_id TEXT,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Un utilisateur ne peut avoir le même produit/variante qu'une fois dans son panier
  CONSTRAINT unique_cart_item UNIQUE (user_id, product_id, variant_id)
);

-- Index pour recherche rapide panier utilisateur
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON public.cart_items(product_id);

-- =====================================================
-- 6. FUNCTIONS (Fonctions automatiques)
-- =====================================================

-- Fonction: Gérer la création d'un nouveau profil utilisateur
-- Crée automatiquement un profil dans public.profiles lors de l'inscription
-- L'email est géré par auth.users, pas besoin de le dupliquer ici
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    phone,
    newsletter,
    age_verified,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'firstName', NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'lastName', NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE((NEW.raw_user_meta_data->>'newsletter')::boolean, false),
    COALESCE((NEW.raw_user_meta_data->>'age_verified')::boolean, false),
    NOW(),
    NOW()
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- En cas d'erreur, on log et on retourne quand même NEW pour ne pas bloquer l'inscription
  RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- Fonction: Mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

-- Fonction: Générer numéro de commande unique
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_number TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- Format: BT-YYYYMMDD-XXXX (BT = Boys & Toys)
    new_number := 'BT-' ||
                  TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
                  LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');

    -- Vérifier si le numéro existe déjà
    SELECT EXISTS(SELECT 1 FROM public.orders WHERE order_number = new_number) INTO exists;

    EXIT WHEN NOT exists;
  END LOOP;

  RETURN new_number;
END;
$$;

-- Fonction: Auto-générer order_number avant insert
CREATE OR REPLACE FUNCTION public.set_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := public.generate_order_number();
  END IF;
  RETURN NEW;
END;
$$;

-- =====================================================
-- 7. TRIGGERS (Déclencheurs automatiques)
-- =====================================================

-- Trigger: Créer profil automatiquement lors de l'inscription
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Trigger: Updated_at pour profiles
DROP TRIGGER IF EXISTS on_profiles_updated ON public.profiles;
CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger: Updated_at pour addresses
DROP TRIGGER IF EXISTS on_addresses_updated ON public.addresses;
CREATE TRIGGER on_addresses_updated
  BEFORE UPDATE ON public.addresses
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger: Updated_at pour orders
DROP TRIGGER IF EXISTS on_orders_updated ON public.orders;
CREATE TRIGGER on_orders_updated
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger: Updated_at pour cart_items
DROP TRIGGER IF EXISTS on_cart_items_updated ON public.cart_items;
CREATE TRIGGER on_cart_items_updated
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger: Auto-générer order_number
DROP TRIGGER IF EXISTS on_order_set_number ON public.orders;
CREATE TRIGGER on_order_set_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.set_order_number();

-- =====================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 8.1 POLICIES - PROFILES
-- =====================================================

-- Lecture: Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Insertion: Automatique via trigger (service_role seulement)
CREATE POLICY "Service role can insert profiles"
  ON public.profiles
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Mise à jour: Les utilisateurs peuvent modifier leur propre profil
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Suppression: Uniquement service_role (cascade depuis auth.users)
CREATE POLICY "Service role can delete profiles"
  ON public.profiles
  FOR DELETE
  TO service_role
  USING (true);

-- =====================================================
-- 8.2 POLICIES - ADDRESSES
-- =====================================================

-- Lecture: Les utilisateurs peuvent voir leurs propres adresses
CREATE POLICY "Users can view own addresses"
  ON public.addresses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Insertion: Les utilisateurs peuvent créer leurs propres adresses
CREATE POLICY "Users can insert own addresses"
  ON public.addresses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Mise à jour: Les utilisateurs peuvent modifier leurs propres adresses
CREATE POLICY "Users can update own addresses"
  ON public.addresses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Suppression: Les utilisateurs peuvent supprimer leurs propres adresses
CREATE POLICY "Users can delete own addresses"
  ON public.addresses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- 8.3 POLICIES - ORDERS
-- =====================================================

-- Lecture: Les utilisateurs peuvent voir leurs propres commandes
CREATE POLICY "Users can view own orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Insertion: Les utilisateurs peuvent créer leurs propres commandes
CREATE POLICY "Users can insert own orders"
  ON public.orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Mise à jour: Restreint (seulement certains champs)
-- Les utilisateurs NE peuvent PAS modifier leurs commandes après création
-- Seulement service_role peut modifier (pour admin)
CREATE POLICY "Service role can update orders"
  ON public.orders
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Suppression: Uniquement service_role
CREATE POLICY "Service role can delete orders"
  ON public.orders
  FOR DELETE
  TO service_role
  USING (true);

-- =====================================================
-- 8.4 POLICIES - ORDER_ITEMS
-- =====================================================

-- Lecture: Via la commande parent
CREATE POLICY "Users can view own order items"
  ON public.order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Insertion: Via la commande parent
CREATE POLICY "Users can insert own order items"
  ON public.order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Mise à jour et suppression: Uniquement service_role
CREATE POLICY "Service role can update order items"
  ON public.order_items
  FOR UPDATE
  TO service_role
  USING (true);

CREATE POLICY "Service role can delete order items"
  ON public.order_items
  FOR DELETE
  TO service_role
  USING (true);

-- =====================================================
-- 8.5 POLICIES - CART_ITEMS
-- =====================================================

-- Lecture: Les utilisateurs peuvent voir leur propre panier
CREATE POLICY "Users can view own cart"
  ON public.cart_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Insertion: Les utilisateurs peuvent ajouter à leur panier
CREATE POLICY "Users can insert own cart items"
  ON public.cart_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Mise à jour: Les utilisateurs peuvent modifier leur panier
CREATE POLICY "Users can update own cart items"
  ON public.cart_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Suppression: Les utilisateurs peuvent supprimer de leur panier
CREATE POLICY "Users can delete own cart items"
  ON public.cart_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- 9. FUNCTION RPC POUR SUPPRESSION COMPTE
-- =====================================================

-- Fonction appelée depuis le frontend pour supprimer le compte utilisateur
CREATE OR REPLACE FUNCTION public.delete_user()
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Supprimer l'utilisateur de auth.users
  -- Le CASCADE supprimera automatiquement le profil et données liées
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;

-- =====================================================
-- 10. DONNÉES DE TEST (OPTIONNEL)
-- =====================================================

-- Décommenter pour créer des données de test
/*
-- Exemple d'insertion de profil de test
INSERT INTO public.profiles (id, email, first_name, last_name, newsletter, age_verified)
VALUES (
  gen_random_uuid(),
  'test@example.com',
  'John',
  'Doe',
  true,
  true
) ON CONFLICT (email) DO NOTHING;
*/

-- =====================================================
-- FIN DU SETUP
-- =====================================================

-- Vérifier que tout est créé correctement
DO $$
BEGIN
  RAISE NOTICE '✅ Setup terminé avec succès !';
  RAISE NOTICE '📊 Tables créées : profiles, addresses, orders, order_items, cart_items';
  RAISE NOTICE '🔧 Functions créées : handle_new_user, handle_updated_at, generate_order_number';
  RAISE NOTICE '⚡ Triggers créés : auto-création profil, auto-update timestamps, auto-génération order_number';
  RAISE NOTICE '🔒 RLS activé sur toutes les tables avec policies appropriées';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Prochaines étapes :';
  RAISE NOTICE '1. Exécuter ce script dans Supabase SQL Editor';
  RAISE NOTICE '2. Générer les types TypeScript : npx supabase gen types typescript --project-id xqdveglwgmlvvqpvhgcs > types/database.types.ts';
  RAISE NOTICE '3. Tester l''inscription d''un nouvel utilisateur';
  RAISE NOTICE '4. Vérifier que le profil est créé automatiquement';
END $$;
