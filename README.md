# Neuron Sentinel — PWA Citoyen

Application mobile (installable) pour les citoyens de Lomé : météo, niveau
de risque, alertes officielles et signalement de danger pour leur quartier.

Parle au **même backend** que le dashboard des autorités
(`../backend`), via les routes `/api/citizen/*`. Aucun appel direct à
OpenWeather/OSM — tout passe par le backend.

## Lancer en local

```bash
cp .env.example .env
npm install
npm run dev
```

Ouvre sur `http://localhost:5174` (port distinct du dashboard, qui tourne
sur 5173, pour pouvoir lancer les deux en même temps). Le backend doit
tourner sur `http://localhost:4000` (ou ajuste `VITE_API_BASE_URL`).

## Installer comme app (PWA)

Sur mobile (Chrome/Safari), ouvre l'URL puis « Ajouter à l'écran
d'accueil ». Le manifest + service worker sont déjà configurés
(`public/manifest.json`, `public/sw.js`) avec les icônes du logo Neuron
Sentinel (`public/icons/`).

## Ce qui est fait / pas fait (hackathon)

- ✅ Inscription/connexion citoyenne (téléphone + mot de passe, sans SMS/OTP)
- ✅ Géolocalisation ponctuelle → résolution de zone côté backend
- ✅ Accueil : zone, météo, risque, alerte active
- ✅ Liste des alertes de la zone
- ✅ Signalement de danger (type + description + GPS)
- ✅ App shell en cache (ouvre hors-ligne), dernières données zone affichées
  avec horodatage si le réseau est indisponible
- ❌ Notifications push (pas branché — nécessiterait VAPID + abonnement
  stocké en base, pas fait pour rester dans les temps)
- ❌ Upload de photo pour un signalement (le champ `media` existe côté API
  mais aucun input file dans l'UI)
