# 🔍 Audit Supabase BDD

Script d'audit de la structure de base de données Supabase.

## Prérequis

- Node.js installé
- Variables d'environnement configurées
- Accès à Supabase avec service role key

## Variables d'environnement requises

Ajouter dans `.env` :

```bash
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_KEY=votre-service-role-key
# OU
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key
```

**⚠️ IMPORTANT:** Utilisez la **Service Role Key** (pas l'anon key) pour accéder aux tables système.

## Comment lancer le script

### Méthode 1: Avec tsx (recommandé)

```bash
# Installer tsx globalement si pas déjà fait
npm install -g tsx

# Lancer le script
tsx utils/audit-supabase.ts
```

### Méthode 2: Avec Node loader

```bash
node --loader tsx utils/audit-supabase.ts
```

### Méthode 3: Compiler puis exécuter

```bash
# Compiler TypeScript
npx tsc utils/audit-supabase.ts --outDir dist --module esnext --target es2020

# Exécuter
node dist/utils/audit-supabase.js
```

## Que vérifie le script ?

### ✅ 1. Auth Users
- Liste les 5 premiers users de `auth.users`
- Affiche: id, email, raw_user_meta_data, created_at

### ✅ 2. Profiles
- Liste les 10 premiers profils de `profiles`
- Affiche toutes les colonnes

### ✅ 3. Correspondance IDs
- Compare les IDs entre `auth.users` et `profiles`
- Identifie les users **sans profil correspondant**
- Liste les emails et IDs manquants

### ✅ 4. Trigger handle_new_user
- Vérifie l'existence du trigger `on_auth_user_created`
- Confirme que les nouveaux users créent automatiquement un profil

### ✅ 5. RLS Policies
- Liste toutes les policies Row Level Security sur `profiles`
- Vérifie la protection de la table

## Exemple de sortie

```
🔍 Démarrage de l'audit Supabase...

✅ Connexion à Supabase...
   URL: https://xxxxx.supabase.co
   Key: eyJhbGc...

📊 Query 1: auth.users (LIMIT 5)
   SELECT id, email, raw_user_meta_data, created_at FROM auth.users LIMIT 5
   ✅ 5 users trouvés

📊 Query 2: profiles (LIMIT 10)
   SELECT * FROM profiles LIMIT 10
   ✅ 3 profils trouvés

🔍 Analyse: Users sans profil correspondant
   ⚠️  2 users sans profil
   Users concernés:
   - user@example.com (abc-123-uuid)
   - test@example.com (def-456-uuid)

🔧 Query 3: Trigger handle_new_user
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created'
   ❌ Trigger non trouvé

🔒 Query 4: RLS Policies sur profiles
   SELECT * FROM pg_policies WHERE tablename = 'profiles'
   ✅ 3 policies trouvées
   Policies:
   - profiles_select_policy (SELECT)
   - profiles_update_policy (UPDATE)
   - profiles_insert_policy (INSERT)

============================================================
📋 RÉSULTAT AUDIT COMPLET (JSON)
============================================================

{
  "timestamp": "2025-01-15T10:30:00.000Z",
  "auth_users": [...],
  "profiles": [...],
  "missing_profiles": [
    {
      "user_id": "abc-123-uuid",
      "email": "user@example.com",
      "created_at": "2025-01-15T09:00:00.000Z"
    }
  ],
  "trigger_exists": false,
  "trigger_details": [],
  "rls_policies": [...],
  "summary": {
    "total_users": 5,
    "total_profiles": 3,
    "users_without_profile": 2,
    "trigger_ok": false,
    "policies_count": 3
  }
}

============================================================
📊 RÉSUMÉ
============================================================
Total users auth.users: 5
Total profiles: 3
Users sans profil: 2
Trigger handle_new_user: ❌ MANQUANT
RLS Policies: 3
============================================================

⚠️  ATTENTION: Certains users n'ont pas de profil correspondant!
   → Vérifier que le trigger handle_new_user fonctionne correctement
   → Créer manuellement les profils manquants si nécessaire

⚠️  ATTENTION: Trigger handle_new_user non trouvé!
   → Les nouveaux users ne créeront pas automatiquement de profil
   → Installer le trigger depuis supabase/migrations/handle_new_user.sql
```

## Résolution des problèmes courants

### Erreur: "SUPABASE_URL ou SUPABASE_KEY manquant"

**Solution:** Vérifier que le fichier `.env` contient les variables et est chargé.

```bash
# Tester les variables
echo $SUPABASE_URL
echo $SUPABASE_KEY
```

### Erreur: "permission denied for table auth.users"

**Solution:** Utiliser la **Service Role Key** au lieu de l'anon key.

La service role key se trouve dans:
- Supabase Dashboard → Settings → API → Service Role Key

### Erreur: "Cannot find module '@supabase/supabase-js'"

**Solution:** Installer les dépendances

```bash
npm install @supabase/supabase-js
```

### Users sans profil détectés

**Actions à faire:**

1. **Vérifier le trigger:**
   ```sql
   -- Dans Supabase SQL Editor
   SELECT * FROM pg_trigger WHERE tgname LIKE '%user%';
   ```

2. **Créer les profils manquants manuellement:**
   ```sql
   INSERT INTO profiles (id, created_at, updated_at)
   SELECT id, created_at, now()
   FROM auth.users
   WHERE id NOT IN (SELECT id FROM profiles);
   ```

3. **Installer le trigger si manquant:**
   Voir `supabase/migrations/handle_new_user.sql`

## Fréquence d'audit recommandée

- **Après chaque inscription** : Vérifier que le profil est créé
- **1x par semaine** : Audit complet de la BDD
- **Après migration** : Vérifier l'intégrité des données

## Support

Si le script détecte des anomalies:
1. Capturer la sortie JSON complète
2. Vérifier les logs Supabase Dashboard
3. Consulter la documentation Supabase RLS
