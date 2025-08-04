// Translation system for Mood Recipe Finder
const translations = {
    fr: {
        // Login page
        login: {
            title: "Connexion",
            subtitle: "Bienvenue sur Mood Recipe Finder",
            username: "Nom d'utilisateur",
            password: "Mot de passe",
            usernamePlaceholder: "Tapez votre nom d'utilisateur",
            passwordPlaceholder: "Tapez votre mot de passe",
            forgotPassword: "Mot de passe oublié ?",
            loginButton: "SE CONNECTER",
            orSignUp: "Ou s'inscrire avec",
            signUpLink: "S'INSCRIRE",
            socialLogin: "Ou se connecter avec"
        },
        // Register page
        register: {
            title: "Inscription",
            subtitle: "Rejoignez Mood Recipe Finder aujourd'hui !",
            username: "Nom d'utilisateur",
            email: "Email",
            password: "Mot de passe",
            confirmPassword: "Confirmer le mot de passe",
            usernamePlaceholder: "Choisissez un nom d'utilisateur",
            emailPlaceholder: "Entrez votre email",
            passwordPlaceholder: "Créez un mot de passe (min 6 caractères)",
            confirmPasswordPlaceholder: "Confirmez votre mot de passe",
            registerButton: "S'INSCRIRE",
            orSignUp: "Ou s'inscrire avec",
            loginLink: "SE CONNECTER",
            alreadyHaveAccount: "Vous avez déjà un compte ?"
        },
        // Main app page
        main: {
            title: "Trouveur de Recettes par Humeur",
            subtitle: "Découvrez la recette parfaite pour votre humeur",
            welcome: "Bienvenue",
            logout: "Déconnexion",
            selectMood: "Sélectionnez votre humeur",
            getRecipe: "Obtenir une recette",
            newRecipe: "Nouvelle recette",
            backToMoods: "Retour aux humeurs",
            loading: "Chargement...",
            error: "Erreur",
            noRecipeFound: "Aucune recette trouvée pour cette humeur"
        },
        // Moods
        moods: {
            happy: "Heureux",
            sad: "Triste",
            excited: "Excité",
            anxious: "Anxieux",
            sick: "Malade",
            romantic: "Romantique",
            refreshed: "Rafraîchi",
            adventurous: "Aventureux"
        },
        // Notifications
        notifications: {
            success: "Succès",
            error: "Erreur",
            warning: "Avertissement",
            loginSuccess: "Connexion réussie",
            loginRedirect: "Redirection vers Mood Recipe Finder...",
            loginFailed: "Échec de connexion",
            invalidCredentials: "Identifiants invalides",
            connectionError: "Erreur de connexion",
            tryAgainLater: "Veuillez réessayer plus tard",
            registrationSuccess: "Inscription réussie",
            registrationFailed: "Échec de l'inscription",
            registrationError: "Erreur lors de l'inscription",
            requiredFields: "Champs requis",
            fillAllFields: "Veuillez remplir tous les champs",
            passwordTooShort: "Mot de passe trop court",
            passwordMinLength: "Le mot de passe doit contenir au moins 6 caractères",
            passwordsDontMatch: "Mots de passe différents",
            passwordsNotMatching: "Les mots de passe ne correspondent pas",
            logoutSuccess: "Déconnexion réussie",
            logoutFailed: "Échec de la déconnexion"
        },
        // Recipe details
        recipe: {
            ingredients: "Ingrédients",
            instructions: "Instructions",
            prepTime: "Temps de préparation",
            difficulty: "Difficulté",
            minutes: "minutes",
            easy: "Facile",
            medium: "Moyen",
            hard: "Difficile"
        },
        // Language switcher
        language: {
            current: "Langue actuelle",
            switchTo: "Changer vers",
            french: "Français",
            english: "Anglais"
        }
    },
    en: {
        // Login page
        login: {
            title: "Login",
            subtitle: "Welcome back to Mood Recipe Finder",
            username: "Username",
            password: "Password",
            usernamePlaceholder: "Type your username",
            passwordPlaceholder: "Type your password",
            forgotPassword: "Forgot password?",
            loginButton: "LOGIN",
            orSignUp: "Or Sign Up Using",
            signUpLink: "SIGN UP",
            socialLogin: "Or Sign Up Using"
        },
        // Register page
        register: {
            title: "Register",
            subtitle: "Join Mood Recipe Finder today!",
            username: "Username",
            email: "Email",
            password: "Password",
            confirmPassword: "Confirm Password",
            usernamePlaceholder: "Choose a username",
            emailPlaceholder: "Enter your email",
            passwordPlaceholder: "Create a password (min 6 characters)",
            confirmPasswordPlaceholder: "Confirm your password",
            registerButton: "REGISTER",
            orSignUp: "Or Sign Up Using",
            loginLink: "LOGIN",
            alreadyHaveAccount: "Already have an account?"
        },
        // Main app page
        main: {
            title: "Mood Recipe Finder",
            subtitle: "Discover the perfect recipe for your mood",
            welcome: "Welcome",
            logout: "Logout",
            selectMood: "Select your mood",
            getRecipe: "Get Recipe",
            newRecipe: "New Recipe",
            backToMoods: "Back to Moods",
            loading: "Loading...",
            error: "Error",
            noRecipeFound: "No recipe found for this mood"
        },
        // Moods
        moods: {
            happy: "Happy",
            sad: "Sad",
            excited: "Excited",
            anxious: "Anxious",
            sick: "Sick",
            romantic: "Romantic",
            refreshed: "Refreshed",
            adventurous: "Adventurous"
        },
        // Notifications
        notifications: {
            success: "Success",
            error: "Error",
            warning: "Warning",
            loginSuccess: "Login successful",
            loginRedirect: "Redirecting to Mood Recipe Finder...",
            loginFailed: "Login failed",
            invalidCredentials: "Invalid credentials",
            connectionError: "Connection error",
            tryAgainLater: "Please try again later",
            registrationSuccess: "Registration successful",
            registrationFailed: "Registration failed",
            registrationError: "Registration error",
            requiredFields: "Required fields",
            fillAllFields: "Please fill in all fields",
            passwordTooShort: "Password too short",
            passwordMinLength: "Password must be at least 6 characters",
            passwordsDontMatch: "Passwords don't match",
            passwordsNotMatching: "Passwords do not match",
            logoutSuccess: "Logout successful",
            logoutFailed: "Logout failed"
        },
        // Recipe details
        recipe: {
            ingredients: "Ingredients",
            instructions: "Instructions",
            prepTime: "Preparation time",
            difficulty: "Difficulty",
            minutes: "minutes",
            easy: "Easy",
            medium: "Medium",
            hard: "Hard"
        },
        // Language switcher
        language: {
            current: "Current language",
            switchTo: "Switch to",
            french: "French",
            english: "English"
        }
    }
};

// Language management system
class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'fr';
        this.init();
    }

    init() {
        this.updateLanguage();
        this.createLanguageSwitcher();
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        this.updateLanguage();
        this.updateLanguageSwitcher();
    }

    getText(key) {
        const keys = key.split('.');
        let text = translations[this.currentLanguage];
        
        for (const k of keys) {
            if (text && text[k]) {
                text = text[k];
            } else {
                console.warn(`Translation key not found: ${key}`);
                return key;
            }
        }
        
        return text;
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    updateLanguage() {
        // Update all elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            const text = this.getText(key);
            if (text) {
                element.textContent = text;
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            const text = this.getText(key);
            if (text) {
                element.placeholder = text;
            }
        });

        // Update titles
        document.querySelectorAll('[data-translate-title]').forEach(element => {
            const key = element.getAttribute('data-translate-title');
            const text = this.getText(key);
            if (text) {
                element.title = text;
            }
        });
    }

    createLanguageSwitcher() {
        // Remove existing language switcher if any
        const existingSwitcher = document.getElementById('languageSwitcher');
        if (existingSwitcher) {
            existingSwitcher.remove();
        }

        const switcher = document.createElement('div');
        switcher.id = 'languageSwitcher';
        switcher.className = 'language-switcher';
        
        const currentLang = this.currentLanguage === 'fr' ? '🇫🇷 FR' : '🇺🇸 EN';
        const otherLang = this.currentLanguage === 'fr' ? '🇺🇸 EN' : '🇫🇷 FR';
        
        switcher.innerHTML = `
            <button class="language-btn" onclick="languageManager.setLanguage('${this.currentLanguage === 'fr' ? 'en' : 'fr'}')">
                <span class="current-lang">${currentLang}</span>
                <span class="switch-arrow">→</span>
                <span class="other-lang">${otherLang}</span>
            </button>
        `;

        // Insert the switcher in the appropriate location
        this.insertLanguageSwitcher(switcher);
        
        // Debug: log that the switcher was created
        console.log('Language switcher created:', switcher);
    }

    insertLanguageSwitcher(switcher) {
        // Try to find the best position for the language switcher
        const header = document.querySelector('.text-center');
        if (header) {
            // Insert after the header
            header.parentNode.insertBefore(switcher, header.nextSibling);
        } else {
            // Insert at the top of the body
            document.body.insertBefore(switcher, document.body.firstChild);
        }
    }

    updateLanguageSwitcher() {
        this.createLanguageSwitcher();
    }
}

// Initialize language manager
const languageManager = new LanguageManager();

// Export for use in other scripts
window.languageManager = languageManager; 