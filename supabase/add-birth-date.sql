-- =====================================================
-- MIGRATION : Ajouter colonne birth_date à profiles
-- =====================================================
-- À exécuter dans Supabase SQL Editor
-- =====================================================

-- Ajouter la colonne birth_date
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS birth_date DATE;

-- Ajouter un commentaire pour documenter
COMMENT ON COLUMN public.profiles.birth_date IS 'Date de naissance de l''utilisateur (optionnelle)';

-- Optionnel : Ajouter une contrainte pour éviter les dates impossibles
-- (pas de date future, pas de date trop ancienne)
ALTER TABLE public.profiles
ADD CONSTRAINT birth_date_realistic
CHECK (
  birth_date IS NULL
  OR (
    birth_date >= '1900-01-01'
    AND birth_date <= CURRENT_DATE
  )
);

-- Vérification
DO $$
BEGIN
  RAISE NOTICE '✅ Colonne birth_date ajoutée avec succès !';
  RAISE NOTICE '📅 Type : DATE (format YYYY-MM-DD)';
  RAISE NOTICE '🔒 Contrainte : entre 1900-01-01 et aujourd''hui';
END $$;
