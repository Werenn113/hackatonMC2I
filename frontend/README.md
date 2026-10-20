# Mail Tinder - Frontend

Application de type "Tinder du mail" développée avec Vue 3, Vite et Tailwind CSS pour le Hackaton MC2I.

## Fonctionnalités

- **Récupération des mails** : Connexion à l'API n8n pour récupérer les mails
- **Classement automatique** : Les mails sont classés en 3 catégories (Important, Normal, Faible)
- **Système de swipe** :
  - ⬅️ Swipe gauche : Marquer comme lu
  - ➡️ Swipe droite : Aller à la page de réponse
  - ⬆️ Swipe haut : Réponse automatique par IA
- **Génération de mails de test** : 50 mails de démo générés si l'API n8n n'est pas disponible
- **Page de réponse** : Interface complète pour répondre aux mails avec bouton IA
- **Filtrage par catégorie** : Navigation facile entre les différentes catégories

## Prérequis

- Node.js 18+ 
- npm ou yarn

## Installation

```bash
# Se placer dans le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

## Configuration

### API n8n

L'application se connecte par défaut à : `https://werenn.app.n8n.cloud/webhook-test`

Les endpoints utilisés sont :
- `GET /mails` - Récupérer tous les mails
- `GET /needs_reply` - Récupérer les mails nécessitant une réponse
- `POST /action` - Envoyer une action (swipe)

Pour modifier l'URL de l'API, éditer le fichier `src/services/api.js` :

```javascript
const API_BASE_URL = 'VOTRE_URL_N8N';
```

### Génération de mails de test

Si l'API n8n n'est pas disponible, l'application génère automatiquement 50 mails de test avec :
- 20% de mails Importants (boss, famille, clients)
- 50% de mails Normaux (collègues, amis)
- 30% de mails Faibles (spam, démarchage)

## Structure du projet

```
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   └── MailCard.vue      # Composant de carte de mail avec swipe
│   ├── pages/
│   │   ├── HomePage.vue     # Page principale avec liste des mails
│   │   └── ReplyPage.vue    # Page de réponse au mail
│   ├── services/
│   │   └── api.js           # Service de connexion à l'API n8n
│   ├── App.vue              # Composant racine
│   ├── main.js              # Point d'entrée
│   ├── router.js            # Configuration du routeur
│   └── style.css            # Styles globaux avec Tailwind
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Utilisation

### Navigation

- **Clavier** :
  - ⬅️ : Marquer comme lu
  - ➡️ : Aller à la page de réponse
  - ⬆️ : Réponse IA automatique
  - ⬇️ : Mail suivant

- **Mobile/Tactile** :
  - Glisser vers la gauche : Marquer comme lu
  - Glisser vers la droite : Répondre
  - Glisser vers le haut : Réponse IA

### Filtrage

Cliquez sur les badges en haut de l'écran pour filtrer par catégorie :
- Tous
- ⭐ Important
- 📧 Normal
- 🗑️ Faible

## Personnalisation

### Catégorisation automatique

La catégorisation est basée sur l'expéditeur du mail. Pour modifier les règles, éditer `src/services/api.js` :

```javascript
const importantSenders = ['boss@entreprise.com', 'maman@famille.fr', ...];
const normalSenders = ['collegue@entreprise.com', 'ami@hotmail.com', ...];
const faibleSenders = ['spam@publicite.com', 'promo@boutique.fr', ...];
```

### Styles

Les couleurs et styles peuvent être modifiés dans `tailwind.config.js` :

```javascript
colors: {
  primary: '#3b82f6',
  important: '#ef4444',
  normal: '#3b82f6',
  faible: '#6b7280',
}
```

## Déploiement

```bash
# Construire pour la production
npm run build

# Prévisualiser la build
npm run preview
```

Les fichiers générés seront dans le dossier `dist/`.

## Technologies utilisées

- **Framework** : Vue 3
- **Bundler** : Vite
- **CSS** : Tailwind CSS
- **API** : Connexion à n8n via fetch

## Contributeurs

Application développée pour le Hackaton MC2I.
