-- Debug Script: Voir exactement ce qui est stocké dans les phones
-- Exécute cette requête dans Supabase SQL Editor

-- Option 1: Voir tous les phones (sans user_id spécifique)
SELECT id, phone, created_at, updated_at FROM public.profiles WHERE phone IS NOT NULL LIMIT 10;

-- Option 2: Si tu connais ton user_id, exécute:
-- SELECT id, phone, created_at, updated_at FROM public.profiles WHERE id = 'ton-user-id';

-- Option 3: Voir le format exact
SELECT
  id,
  phone,
  length(phone) as phone_length,
  substring(phone from 1 for 3) as indicateur,
  substring(phone from 4) as numero_apres_indicateur
FROM public.profiles
WHERE phone IS NOT NULL
LIMIT 10;
