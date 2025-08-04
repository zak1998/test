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
            socialLogin: "Ou se connecter avec",
            loadingTitle: "Bienvenue sur Mood Recipe Finder",
            loadingSubtitle: "Trouver la recette parfaite pour votre humeur..."
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
            noRecipeFound: "Aucune recette trouvée pour cette humeur",
            retry: "Réessayer"
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
            socialLogin: "Or Sign Up Using",
            loadingTitle: "Welcome to Mood Recipe Finder",
            loadingSubtitle: "Finding the perfect recipe for your mood..."
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
            noRecipeFound: "No recipe found for this mood",
            retry: "Try Again"
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
        this.initialized = false;
        this.init();
    }

    init() {
        try {
            this.updateLanguage();
            this.createLanguageSwitcher();
            this.initialized = true;
            console.log('✅ Language manager initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing language manager:', error);
            this.initialized = false;
        }
    }

    setLanguage(lang) {
        try {
            console.log('🔄 setLanguage called with:', lang);
            console.log('🔄 Current language before change:', this.currentLanguage);
            
            this.currentLanguage = lang;
            localStorage.setItem('language', lang);
            console.log('🔄 Language stored in localStorage');
            
            this.updateLanguage();
            console.log('🔄 UI updated');
            
            this.updateLanguageSwitcher();
            console.log('🔄 Language switcher updated');
            
            console.log('✅ Language changed to:', lang);
            
            // Send language preference to server
            this.updateServerLanguagePreference(lang);
            
            // Dispatch custom event for language change
            window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
            console.log('🔄 languageChanged event dispatched');
        } catch (error) {
            console.error('❌ Error changing language:', error);
        }
    }

    async updateServerLanguagePreference(language) {
        try {
            const response = await fetch('/api/language', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ language })
            });

            if (response.ok) {
                console.log('✅ Language preference updated on server');
            } else {
                console.warn('⚠️ Failed to update language preference on server');
            }
        } catch (error) {
            console.error('❌ Error updating language preference on server:', error);
        }
    }

    getText(key) {
        try {
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
        } catch (error) {
            console.error('❌ Error getting text for key:', key, error);
            return key;
        }
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    updateLanguage() {
        try {
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
        } catch (error) {
            console.error('❌ Error updating language:', error);
        }
    }

    createLanguageSwitcher() {
        try {
            // Remove existing language switcher if any
            const existingSwitcher = document.getElementById('languageSwitcher');
            if (existingSwitcher) {
                existingSwitcher.remove();
            }

            // Check if document.body exists
            if (!document.body) {
                console.warn('⚠️ Document body not available for language switcher');
                return;
            }

            const switcher = document.createElement('div');
            switcher.id = 'languageSwitcher';
            switcher.className = 'language-switcher';
            
            const currentLang = this.currentLanguage === 'fr' ? '🇫🇷 FR' : '🇺🇸 EN';
            const otherLang = this.currentLanguage === 'fr' ? '🇺🇸 EN' : '🇫🇷 FR';
            
            // Create button with direct event listener instead of onclick
            const button = document.createElement('button');
            button.className = 'language-btn';
            button.id = 'languageSwitchBtn';
            
            button.innerHTML = `
                <span class="current-lang">${currentLang}</span>
                <span class="switch-arrow">→</span>
                <span class="other-lang">${otherLang}</span>
            `;
            
            // Add click event listener directly
            button.addEventListener('click', (e) => {
                console.log('🔄 Language button clicked!');
                console.log('🔄 Event details:', e);
                e.preventDefault();
                e.stopPropagation();
                
                const currentLang = this.getCurrentLanguage();
                const newLang = currentLang === 'fr' ? 'en' : 'fr';
                console.log('🔄 Switching from', currentLang, 'to', newLang);
                
                // Test if the button is actually clickable
                console.log('🔄 Button element:', button);
                console.log('🔄 Button parent:', button.parentElement);
                console.log('🔄 Button styles:', window.getComputedStyle(button));
                
                this.setLanguage(newLang);
            });
            
            // Also add a mouseenter event to test if the button is interactive
            button.addEventListener('mouseenter', () => {
                console.log('🔄 Mouse entered language button');
            });
            
            switcher.appendChild(button);

            // Insert the switcher in the appropriate location
            this.insertLanguageSwitcher(switcher);
            
            // Force the switcher to be visible with inline styles
            switcher.style.position = 'fixed';
            switcher.style.top = '20px';
            switcher.style.right = '20px';
            switcher.style.zIndex = '9999';
            switcher.style.display = 'block';
            switcher.style.visibility = 'visible';
            switcher.style.pointerEvents = 'auto';
            switcher.style.cursor = 'pointer';
            
            console.log('✅ Language switcher created successfully');
            console.log('✅ Button event listener attached');
        } catch (error) {
            console.error('❌ Error creating language switcher:', error);
        }
    }

    insertLanguageSwitcher(switcher) {
        try {
            // Check if document.body exists and has children
            if (!document.body) {
                console.warn('⚠️ Document body not available');
                return;
            }

            // Always insert at the very top of the body for fixed positioning
            if (document.body.firstChild) {
                document.body.insertBefore(switcher, document.body.firstChild);
            } else {
                document.body.appendChild(switcher);
            }
            
            // Ensure it's visible
            setTimeout(() => {
                if (switcher.parentElement) {
                    switcher.style.display = 'block';
                    switcher.style.visibility = 'visible';
                    console.log('✅ Language switcher made visible');
                }
            }, 100);
            
            console.log('✅ Language switcher inserted successfully');
        } catch (error) {
            console.error('❌ Error inserting language switcher:', error);
        }
    }

    updateLanguageSwitcher() {
        try {
            this.createLanguageSwitcher();
        } catch (error) {
            console.error('❌ Error updating language switcher:', error);
        }
    }
}



// Initialize language manager with error handling
let languageManager;

function initializeLanguageManager() {
    try {
        languageManager = new LanguageManager();
        // Export for use in other scripts
        window.languageManager = languageManager;
        console.log('✅ Language manager initialized and exported to window');
        
        // Retry creating language switcher after a short delay
        setTimeout(() => {
            if (languageManager && !document.getElementById('languageSwitcher')) {
                console.log('🔄 Retrying language switcher creation...');
                languageManager.createLanguageSwitcher();
            }
        }, 500);
        
    } catch (error) {
        console.error('❌ Failed to initialize language manager:', error);
        // Create a fallback language manager
        window.languageManager = {
            getText: (key) => key,
            setLanguage: () => {},
            getCurrentLanguage: () => 'en',
            updateLanguage: () => {},
            createLanguageSwitcher: () => {},
            initialized: false
        };
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLanguageManager);
} else {
    initializeLanguageManager();
}

// Also try to initialize on window load as a backup
window.addEventListener('load', () => {
    if (!window.languageManager || !window.languageManager.initialized) {
        console.log('🔄 Retrying language manager initialization on window load...');
        initializeLanguageManager();
    }
});

// Test function for debugging
window.testLanguageSwitcher = function() {
    console.log('🧪 Testing language switcher...');
    console.log('🧪 window.languageManager:', window.languageManager);
    console.log('🧪 Current language:', window.languageManager?.getCurrentLanguage());
    
    const switcher = document.getElementById('languageSwitcher');
    console.log('🧪 Language switcher element:', switcher);
    
    const button = document.getElementById('languageSwitchBtn');
    console.log('🧪 Language button element:', button);
    
    if (button) {
        console.log('🧪 Button clickable:', button.click);
        console.log('🧪 Button styles:', window.getComputedStyle(button));
        console.log('🧪 Button parent styles:', window.getComputedStyle(button.parentElement));
    }
    
    // Try to trigger a click programmatically
    if (button) {
        console.log('🧪 Triggering click programmatically...');
        button.click();
    }
}; 