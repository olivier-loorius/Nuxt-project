# 📞 PHONE INPUT DEBUG GUIDE

## Étape 1: Activer les logs du navigateur

1. Ouvre ton application (http://localhost:3000)
2. Va sur la page du profil (`/compte/profil`)
3. Ouvre la **Developer Console** (F12 ou Ctrl+Shift+K)
4. Cherche l'onglet **Console**

## Étape 2: Charger le profil

1. Recharge la page (F5 ou Ctrl+R)
2. Attends quelques secondes le chargement du profil
3. Regarde dans la console les logs:

```
[profil.loadProfile] profile.phone from Supabase: ???
[profil.loadProfile] formData.phone set to: ???
[PhoneInput.watch] newValue: ???
[PhoneInput.watch] match: ???
```

**Copie-moi EXACTEMENT ce qui s'affiche.**

## Étape 3: Editer le téléphone

1. Clique sur le bouton "Modifier"
2. La section téléphone devient éditable
3. Dans la console, tu devrais voir:

```
[PhoneInput.watch] newValue: ...
[PhoneInput.watch] match: ...
[PhoneInput.watch] displayNumber after format: ...
```

**Copie-moi TOUS ces logs.**

## Étape 4: Taper dans le champ téléphone

1. Efface le contenu actuel
2. Tape un nouveau numéro (ex: "0612345678")
3. Regarde dans la console:

```
[PhoneInput.handleInput] rawValue before: ...
[PhoneInput.handleInput] digits extracted: ...
[PhoneInput.handleInput] displayNumber after format: ...
[PhoneInput.updateFullNumber] digits: ...
[PhoneInput.updateFullNumber] selectedCountry: ...
[PhoneInput.updateFullNumber] fullNumber emitted: ...
```

**Copie-moi TOUS ces logs.**

## Étape 5: Vérifier la base de données

1. Va sur Supabase Dashboard: https://supabase.com
2. Sélectionne ton projet
3. Clique sur **SQL Editor** (à gauche)
4. Exécute cette requête:

```sql
SELECT id, phone, length(phone) as phone_length
FROM public.profiles
WHERE id = 'TON_USER_ID';
```

**Remplace `TON_USER_ID` par ton ID utilisateur** (visible dans les logs de Supabase)

**Ou exécute simplement:**

```sql
SELECT id, phone, length(phone) as phone_length
FROM public.profiles
WHERE phone IS NOT NULL
LIMIT 5;
```

5. Copie-moi le résultat exact

## Format attendu

Le téléphone devrait être stocké comme:
- `"+33612345678"` (13 caractères: +33 + 10 chiffres)
- OU `"+330612345678"` (14 caractères: +33 + 0 + 10 chiffres)

## Questions clés à élucider

1. **Quel est le format stocké dans Supabase?**
   - `"+33612345678"` ?
   - `"+330612345678"` ?
   - Quelque chose d'autre ?

2. **Qu'est-ce qui s'affiche dans le PhoneInput au chargement?**
   - Le composant affiche-t-il le bon nombre de chiffres?
   - Y a-t-il un décalage?

3. **Qu'est-ce qui est émis lors de l'édition?**
   - Le numéro complet est-il émis correctement?
   - Ou un chiffre manque-t-il?

## Support

Si tu me fournis TOUS les logs + le résultat SQL, je pourrai identifier exactement le problème et le corriger définitivement.
