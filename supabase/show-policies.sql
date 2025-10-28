-- ============================================================
-- 🔒 AFFICHAGE POLICIES RLS - Conditions Lisibles
-- ============================================================
--
-- ⚠️ COPIER-COLLER DANS SUPABASE SQL EDITOR
--
-- INSTRUCTIONS:
-- 1. Ouvrir Supabase Dashboard
-- 2. Aller dans SQL Editor
-- 3. Copier-coller la query ci-dessous
-- 4. Cliquer sur "Run"
-- 5. Analyser les conditions USING et WITH CHECK
--
-- OBJECTIF:
-- Afficher les policies RLS avec leurs conditions en format lisible
-- Utilise pg_get_expr() pour afficher les expressions SQL complètes
--
-- ============================================================

SELECT
  policyname,
  cmd,
  CASE
    WHEN qual IS NOT NULL THEN pg_get_expr(qual, 'profiles'::regclass)
    ELSE 'N/A'
  END as using_expr,
  CASE
    WHEN with_check IS NOT NULL THEN pg_get_expr(with_check, 'profiles'::regclass)
    ELSE 'N/A'
  END as check_expr
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'profiles'
ORDER BY cmd, policyname;

-- ============================================================
-- 📋 EXPLICATION DES COLONNES
-- ============================================================
--
-- policyname  : Nom de la policy RLS
-- cmd         : Opération SQL (SELECT, INSERT, UPDATE, DELETE)
-- using_expr  : Expression USING (condition pour lire les lignes)
-- check_expr  : Expression WITH CHECK (condition pour écrire)
--
-- pg_get_expr() convertit l'expression stockée en format lisible
--
-- ============================================================
-- 🎯 RÉSULTATS ATTENDUS
-- ============================================================
--
-- policyname                    | cmd    | using_expr        | check_expr
-- ------------------------------|--------|-------------------|-------------------
-- Users can insert own profile  | INSERT | N/A               | (auth.uid() = id)
-- Users can select own profile  | SELECT | (auth.uid() = id) | N/A
-- Users can update own profile  | UPDATE | (auth.uid() = id) | (auth.uid() = id)
--
-- ============================================================
-- 📊 INTERPRÉTATION DES RÉSULTATS
-- ============================================================
--
-- Policy INSERT:
-- - using_expr: N/A (normal, INSERT ne lit pas de lignes existantes)
-- - check_expr: (auth.uid() = id)
--   → Empêche de créer un profil avec un ID différent de auth.uid()
--
-- Policy SELECT:
-- - using_expr: (auth.uid() = id)
--   → Filtre les lignes: l'utilisateur ne voit QUE son propre profil
-- - check_expr: N/A (normal, SELECT ne modifie pas de données)
--
-- Policy UPDATE:
-- - using_expr: (auth.uid() = id)
--   → Cible les lignes: l'utilisateur ne peut modifier QUE son profil
-- - check_expr: (auth.uid() = id)
--   → Vérifie après modification: l'ID ne peut PAS être changé
--
-- ============================================================
-- ✅ VÉRIFICATIONS DE SÉCURITÉ
-- ============================================================
--
-- 1. Vérifier que auth.uid() apparaît dans toutes les expressions
--    ✅ Bon: (auth.uid() = id)
--    ✅ Bon: ((auth.uid())::text = (id)::text)
--    ❌ Mauvais: N/A là où il devrait y avoir une condition
--    ❌ Mauvais: (true) → Permet tout accès
--
-- 2. Vérifier la comparaison avec la colonne 'id'
--    ✅ Bon: auth.uid() = id
--    ❌ Mauvais: auth.uid() = autre_colonne
--
-- 3. Vérifier les combinaisons USING/CHECK
--    INSERT: using_expr = N/A, check_expr = condition ✅
--    SELECT: using_expr = condition, check_expr = N/A ✅
--    UPDATE: using_expr = condition, check_expr = condition ✅
--    DELETE: using_expr = condition, check_expr = N/A ✅
--
-- ============================================================
-- ⚠️ PROBLÈMES COURANTS
-- ============================================================
--
-- Problème 1: Aucun résultat
-- → Aucune policy RLS sur la table profiles
-- → Action: Créer les policies RLS
--
-- Problème 2: using_expr = N/A pour SELECT ou UPDATE
-- → Aucune condition USING, accès total aux lignes
-- → Action: Recréer la policy avec USING (auth.uid() = id)
--
-- Problème 3: check_expr = N/A pour INSERT ou UPDATE
-- → Aucune vérification à l'écriture
-- → Action: Recréer la policy avec WITH CHECK (auth.uid() = id)
--
-- Problème 4: Expression = (true)
-- → Condition toujours vraie, aucune protection
-- → Action: Remplacer par (auth.uid() = id)
--
-- ============================================================
-- 🔍 QUERIES BONUS
-- ============================================================

-- Vérifier que RLS est activé sur la table profiles
SELECT
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = 'profiles';

-- Résultat attendu:
-- tablename | rls_enabled
-- ----------|-------------
-- profiles  | t           (t = true, RLS activé)

-- Si rls_enabled = f (false):
-- → Exécuter: ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 📊 QUERY BONUS: Résumé complet sécurité
-- ============================================================

SELECT
  'Row Level Security' AS security_feature,
  CASE
    WHEN (SELECT rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles')
    THEN 'Activé ✅'
    ELSE 'Désactivé ❌'
  END AS status
UNION ALL
SELECT
  'Nombre de policies RLS',
  COUNT(*)::text || ' policies'
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles'
UNION ALL
SELECT
  'Policy SELECT',
  CASE WHEN EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND cmd = 'SELECT')
  THEN 'Existe ✅' ELSE 'Manquante ❌' END
UNION ALL
SELECT
  'Policy INSERT',
  CASE WHEN EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND cmd = 'INSERT')
  THEN 'Existe ✅' ELSE 'Manquante ❌' END
UNION ALL
SELECT
  'Policy UPDATE',
  CASE WHEN EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND cmd = 'UPDATE')
  THEN 'Existe ✅' ELSE 'Manquante ❌' END;

-- Résultat attendu (exemple sain):
-- security_feature        | status
-- ------------------------|---------------
-- Row Level Security      | Activé ✅
-- Nombre de policies RLS  | 3 policies
-- Policy SELECT           | Existe ✅
-- Policy INSERT           | Existe ✅
-- Policy UPDATE           | Existe ✅

-- ============================================================
-- 🛠️ COMMENT CRÉER LES POLICIES SI MANQUANTES
-- ============================================================
--
-- Si les policies n'existent pas ou sont incorrectes, exécuter:
--
-- -- 1. Activer RLS
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
--
-- -- 2. Supprimer anciennes policies (si nécessaire)
-- DROP POLICY IF EXISTS "Users can select own profile" ON profiles;
-- DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
-- DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
--
-- -- 3. Créer nouvelles policies
-- CREATE POLICY "Users can select own profile"
--   ON profiles FOR SELECT
--   TO authenticated
--   USING (auth.uid() = id);
--
-- CREATE POLICY "Users can insert own profile"
--   ON profiles FOR INSERT
--   TO authenticated
--   WITH CHECK (auth.uid() = id);
--
-- CREATE POLICY "Users can update own profile"
--   ON profiles FOR UPDATE
--   TO authenticated
--   USING (auth.uid() = id)
--   WITH CHECK (auth.uid() = id);
--
-- ============================================================
-- FIN DU SCRIPT
-- ============================================================
