# 📋 CHECKLIST DES LOGS À COPIER

## 🔍 Lors du chargement de la page

Recherche dans la console:
- [ ] `[profil.loadProfile] profile.phone from Supabase:`
- [ ] `[profil.loadProfile] formData.phone set to:`
- [ ] `[PhoneInput.watch] newValue:`
- [ ] `[PhoneInput.watch] match:`

**Format attendu:**
```
[profil.loadProfile] profile.phone from Supabase: "+33612345678"
[profil.loadProfile] formData.phone set to: "+33612345678"
[PhoneInput.watch] newValue: "+33612345678"
[PhoneInput.watch] match: ["+33612345678", "+33", "612345678"]
[PhoneInput.watch] indicator: +33 digits: 612345678
[PhoneInput.watch] Added 0, new digits: 0612345678
[PhoneInput.watch] displayNumber after format: 06 12 34 56 78
```

---

## ✏️ Lors de l'édition (Clic sur "Modifier")

Recherche:
- [ ] `[PhoneInput.handleInput] rawValue before:`
- [ ] `[PhoneInput.handleInput] digits extracted:`
- [ ] `[PhoneInput.handleInput] displayNumber after format:`
- [ ] `[PhoneInput.updateFullNumber] digits:`
- [ ] `[PhoneInput.updateFullNumber] selectedCountry:`
- [ ] `[PhoneInput.updateFullNumber] fullNumber emitted:`

**Format attendu (exemple: utilisateur tape "0612345678"):**
```
[PhoneInput.handleInput] rawValue before: "06 12 34 56 78"
[PhoneInput.handleInput] digits extracted: "0612345678"
[PhoneInput.handleInput] displayNumber after format: "06 12 34 56 78"
[PhoneInput.updateFullNumber] digits: "0612345678" selectedCountry: "+33" fullNumber emitted: "+330612345678"
```

---

## 🗄️ Résultat SQL de Supabase

Exécute dans **SQL Editor**:

```sql
SELECT id, phone, length(phone) as phone_length
FROM public.profiles
WHERE phone IS NOT NULL
LIMIT 5;
```

**Copie le résultat exact:**
```
id | phone | phone_length
---|-------|-------------
xxx | ??? | ??
```

---

## 🐛 Diagnostic rapide

| Élément | Vérifie | Problème si |
|---------|---------|-----------|
| Stockage DB | `length(phone)` | ≠ 13 ou 14 |
| Format | `phone` commence par | ≠ "+33" |
| Parsing | `match` dans watch | `null` |
| Affichage | `displayNumber after format` | Moins de 10 chiffres |
| Émission | `fullNumber emitted` | Manque un chiffre |

---

## 📝 Template à remplir

```
## Logs au chargement:
[Copie-colle tous les logs ici]

## Logs lors de l'édition:
[Copie-colle tous les logs ici]

## Résultat SQL:
[Copie le résultat exact]

## Observations:
[Décris ce que tu vois/remarques]
```

---

## 💡 Indices

- Si le regex ne match pas → `match: null`
- Si le phone n'existe pas en DB → `null` ou `undefined`
- Si un chiffre disparaît → Vérifie le `slice(0, 10)`
- Si l'indicateur disparaît → Vérifie le parsing du +33
