// config.example.js
// Copiez ce fichier en config.js et remplacez les valeurs par vos propres identifiants

const msalConfig = {
    auth: {
        clientId: "VOTRE_CLIENT_ID_ICI",
        authority: "https://login.microsoftonline.com/VOTRE_TENANT_ID_ICI",
        redirectUri: "VOTRE_REDIRECT_URI_ICI"
    },
    cache: {
        cacheLocation: "sessionStorage", // "sessionStorage" ou "localStorage"
        storeAuthStateInCookie: false
    }
};

const loginRequest = {
    scopes: ["User.Read"]
};

const tokenRequest = {
    scopes: ["User.Read"]
};
