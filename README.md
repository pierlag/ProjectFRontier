# ProjetFRontier

Application web avec authentification Microsoft EntraID (Azure Active Directory).

## 🔐 Configuration de l'authentification

Ce projet utilise Microsoft Authentication Library (MSAL.js) pour l'authentification EntraID.

### Installation

1. Clonez le dépôt
2. Le fichier `config.js` contient déjà vos identifiants configurés
3. **Important** : Le fichier `config.js` est dans `.gitignore` et ne sera pas commité

### Structure des fichiers

- `index.html` : Page principale de l'application
- `auth.js` : Logique d'authentification MSAL
- `config.js` : Configuration EntraID (non versionné)
- `config.example.js` : Template de configuration
- `.gitignore` : Protège les fichiers sensibles

### Sécurité

⚠️ **Important** :
- Le fichier `config.js` contient des informations sensibles et ne doit jamais être commité
- Les identifiants sont stockés côté client uniquement pendant la session
- Les tokens sont stockés dans `sessionStorage` pour plus de sécurité

### Utilisation

1. Ouvrez `index.html` dans un navigateur
2. Cliquez sur "Se connecter avec Microsoft"
3. Authentifiez-vous avec vos identifiants Microsoft
4. Accédez aux fonctionnalités de l'application

### Déploiement sur GitHub Pages

Pour déployer sur GitHub Pages :
1. Assurez-vous que `config.js` est bien présent sur votre serveur
2. Vérifiez que l'URI de redirection correspond à votre URL GitHub Pages
3. Activez GitHub Pages dans les paramètres du dépôt

### Permissions requises

L'application demande les permissions suivantes :
- `User.Read` : Lecture du profil utilisateur de base

## 📝 Licence

Ce projet est sous licence MIT.
