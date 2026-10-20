# Mail Tinder Mobile - Application Tinder du Mail

Application mobile-first de type "Tinder du mail" développée avec **Vue 3 + Vite + Tailwind CSS** pour le Hackaton MC2I.

## 📱 Preview

![Mail Tinder Mobile](https://via.placeholder.com/400x800/ff4081/ffffff?text=Mail+Tinder+Mobile)

## ✨ Fonctionnalités

### Design Mobile
- **Dégradé rose/orange** en arrière-plan
- **Carte de mail centrée** avec photo de profil
- **Badges de statistiques** en haut de l'écran
- **Boutons d'action circulaires** (❌ Supprimer, 🤖 IA, ✉️ Répondre)
- **Navigation entre mails** avec flèches

### Gestion des Mails
- **50 mails de test** générés automatiquement
- **Classement automatique** en 3 catégories :
  - ⭐ **IMPORTANT** (rouge) - Boss, famille, clients
  - 📧 **NORMAL** (bleu) - Collègues, amis
  - 🗑️ **FAIBLE** (gris) - Spam, démarchage

### Actions
| Bouton | Action |
|--------|--------|
| ❌ | Supprimer/Archiver le mail |
| 🤖 | Générer une réponse IA automatique |
| ✉️ | Répondre manuellement au mail |

### Statistiques
- **Boîte** : Nombre total de mails
- **À répondre** : Mails nécessitant une réponse
- **Envoyés** : Mails déjà traités

### Mode Démo
- **Données intégrées** : 50 mails de test générés
- **Alert visible** : "Mode démo (données intégrées)"
- **Prêt pour la démo** sans configuration

## 🚀 Installation

### Prérequis
- Node.js 18+
- npm ou yarn

### Étapes

```bash
# Se placer dans le dossier frontend
cd /c/_Code/hackatonMC2I/frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera disponible sur **http://localhost:5173**

## 📱 Utilisation Mobile

### sur téléphone
1. Ouvrez le navigateur de votre téléphone
2. Accédez à `http://[VOTRE_IP]:5173`
3. Ajoutez à l'écran d'accueil pour une expérience PWA

### Actions tactiles
- **Glisser** : Navigation entre les mails
- **Taper** : Boutons d'action

## 🔧 Configuration

### Passer en mode connecté

1. Modifiez le fichier `src/App.vue`
2. Cherchez la ligne :
   ```javascript
   const demoMode = ref(true);
   ```
3. Changez pour :
   ```javascript
   const demoMode = ref(false);
   ```
4. Configurez l'URL de votre API n8n :
   ```javascript
   const API_BASE_URL = 'https://werenn.app.n8n.cloud/webhook-test';
   ```

### Personnaliser les mails de test

Dans `src/App.vue`, modifiez les tableaux :
```javascript
const importantSenders = [...];
const normalSenders = [...];
const faibleSenders = [...];
```

### Personnaliser les couleurs

Dans `tailwind.config.js` :
```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: '#ff4081',
        secondary: '#ff6b6b',
      },
    },
  },
};
```

## 📁 Structure du Projet

```
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.vue              # Application principale
│   ├── main.js              # Point d'entrée
│   └── style.css            # Styles globaux + Tailwind
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🎯 Déploiement

### Pour la démo
```bash
npm run build
npm run preview
```

Les fichiers sont générés dans `/dist`

### Sur Netlify/Vercel
1. Poussez le code sur GitHub
2. Connectez votre compte Netlify/Vercel
3. Sélectionnez le dépôt
4. Déployez automatiquement

## 💡 Astuces

- **Pour une vraie PWA** : Ajoutez un `manifest.json`
- **Pour des vraies données** : Connectez votre API n8n
- **Pour plus de mails** : Augmentez le nombre dans `generateTestMails()`
- **Pour changer les couleurs** : Modifiez le dégradé dans `style.css`

## 🤝 Contributeurs

Application développée pour le **Hackaton MC2I**.

Technologies : Vue 3, Vite, Tailwind CSS, n8n

## 📄 Licence

MIT
