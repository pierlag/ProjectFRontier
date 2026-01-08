// auth.js
// Gestion de l'authentification EntraID avec MSAL.js

let myMSALObj;
let username = "";

/**
 * Initialise l'objet MSAL au chargement de la page
 */
function initializeMsal() {
    myMSALObj = new msal.PublicClientApplication(msalConfig);
    
    // Gestion de la redirection après authentification
    myMSALObj.handleRedirectPromise()
        .then(handleResponse)
        .catch(err => {
            console.error("Erreur lors de l'authentification:", err);
            showError("Erreur d'authentification: " + err.message);
        });
}

/**
 * Gère la réponse après authentification
 */
function handleResponse(response) {
    if (response !== null) {
        username = response.account.username;
        showWelcomeMessage(response.account);
        updateUI(true);
    } else {
        // Vérifie si un utilisateur est déjà connecté
        const currentAccounts = myMSALObj.getAllAccounts();
        if (currentAccounts.length === 0) {
            updateUI(false);
        } else if (currentAccounts.length === 1) {
            username = currentAccounts[0].username;
            showWelcomeMessage(currentAccounts[0]);
            updateUI(true);
        }
    }
}

/**
 * Connexion de l'utilisateur
 */
function signIn() {
    myMSALObj.loginRedirect(loginRequest)
        .catch(err => {
            console.error("Erreur de connexion:", err);
            showError("Erreur de connexion: " + err.message);
        });
}

/**
 * Déconnexion de l'utilisateur
 */
function signOut() {
    const logoutRequest = {
        account: myMSALObj.getAccountByUsername(username)
    };
    
    myMSALObj.logoutRedirect(logoutRequest)
        .catch(err => {
            console.error("Erreur de déconnexion:", err);
        });
}

/**
 * Récupère un token d'accès
 */
async function getTokenRedirect(request) {
    request.account = myMSALObj.getAccountByUsername(username);
    
    return await myMSALObj.acquireTokenSilent(request)
        .catch(error => {
            console.warn("Acquisition silencieuse du token a échoué, utilisation du mode interactif");
            if (error instanceof msal.InteractionRequiredAuthError) {
                return myMSALObj.acquireTokenRedirect(request);
            } else {
                console.error(error);
            }
        });
}

/**
 * Appelle l'API Microsoft Graph pour obtenir les informations utilisateur
 */
async function getUserProfile() {
    const tokenResponse = await getTokenRedirect(tokenRequest);
    if (tokenResponse) {
        try {
            const response = await fetch("https://graph.microsoft.com/v1.0/me", {
                headers: {
                    'Authorization': 'Bearer ' + tokenResponse.accessToken
                }
            });
            const userData = await response.json();
            displayUserProfile(userData);
        } catch (error) {
            console.error("Erreur lors de la récupération du profil:", error);
            showError("Impossible de récupérer le profil utilisateur");
        }
    }
}

/**
 * Met à jour l'interface utilisateur en fonction de l'état de connexion
 */
function updateUI(isAuthenticated) {
    const signInButton = document.getElementById('signInButton');
    const signOutButton = document.getElementById('signOutButton');
    const welcomeDiv = document.getElementById('welcomeMessage');
    const contentDiv = document.getElementById('authenticatedContent');
    const unauthenticatedDiv = document.getElementById('unauthenticatedContent');
    
    if (isAuthenticated) {
        signInButton.style.display = 'none';
        signOutButton.style.display = 'inline-block';
        welcomeDiv.style.display = 'block';
        contentDiv.style.display = 'block';
        unauthenticatedDiv.style.display = 'none';
    } else {
        signInButton.style.display = 'inline-block';
        signOutButton.style.display = 'none';
        welcomeDiv.style.display = 'none';
        contentDiv.style.display = 'none';
        unauthenticatedDiv.style.display = 'block';
    }
}

/**
 * Affiche le message de bienvenue
 */
function showWelcomeMessage(account) {
    const welcomeDiv = document.getElementById('welcomeMessage');
    welcomeDiv.innerHTML = `
        <h2>Bienvenue, ${account.name || account.username} ! 👋</h2>
        <p class="user-email">Connecté en tant que: ${account.username}</p>
    `;
}

/**
 * Affiche le profil utilisateur complet
 */
function displayUserProfile(userData) {
    const profileDiv = document.getElementById('userProfile');
    if (profileDiv) {
        profileDiv.innerHTML = `
            <h3>Informations du profil</h3>
            <p><strong>Nom:</strong> ${userData.displayName || 'N/A'}</p>
            <p><strong>Email:</strong> ${userData.mail || userData.userPrincipalName || 'N/A'}</p>
            <p><strong>Poste:</strong> ${userData.jobTitle || 'N/A'}</p>
            <p><strong>Téléphone:</strong> ${userData.businessPhones?.[0] || 'N/A'}</p>
        `;
    }
}

/**
 * Affiche un message d'erreur
 */
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    } else {
        alert(message);
    }
}

// Initialise MSAL au chargement de la page
window.addEventListener('DOMContentLoaded', initializeMsal);
