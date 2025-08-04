// Global variables
let currentMood = '';
let currentRecipe = null;

// Safe language manager access with fallbacks
function getText(key, fallback = key) {
    if (window.languageManager && typeof window.languageManager.getText === 'function') {
        return window.languageManager.getText(key);
    }
    return fallback;
}

// DOM elements
const moodSelection = document.getElementById('moodSelection');
const loading = document.getElementById('loading');
const recipeDisplay = document.getElementById('recipeDisplay');
const errorDisplay = document.getElementById('errorDisplay');

// Recipe display elements
const recipeName = document.getElementById('recipeName');
const recipeDifficulty = document.getElementById('recipeDifficulty');
const recipeTime = document.getElementById('recipeTime');
const ingredientsList = document.getElementById('ingredientsList');
const instructionsText = document.getElementById('instructionsText');

// Buttons
const newRecipeBtn = document.getElementById('newRecipeBtn');
const backToMoodBtn = document.getElementById('backToMoodBtn');
const retryBtn = document.getElementById('retryBtn');
const logoutBtn = document.getElementById('logoutBtn');
const errorMessage = document.getElementById('errorMessage');
const userInfo = document.getElementById('userInfo');

// Mood buttons
const moodButtons = document.querySelectorAll('.mood-btn');

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Add click listeners to mood buttons
    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            const mood = button.getAttribute('data-mood');
            selectMood(mood);
        });
    });

    // Add click listeners to action buttons
    if (newRecipeBtn) {
        newRecipeBtn.addEventListener('click', () => {
            if (currentMood) {
                getRecipe(currentMood);
            }
        });
    }

    if (backToMoodBtn) {
        backToMoodBtn.addEventListener('click', () => {
            showMoodSelection();
        });
    }

    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            if (currentMood) {
                getRecipe(currentMood);
            } else {
                showMoodSelection();
            }
        });
    }

    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    window.location.href = '/login';
                } else {
                    alert(getText('notifications.logoutFailed', 'Logout failed'));
                }
            } catch (error) {
                console.error('Logout error:', error);
                alert(getText('notifications.logoutFailed', 'Logout failed'));
            }
        });
    }

    // Load user info on page load
    loadUserInfo();
});

// Function to load user information
async function loadUserInfo() {
    try {
        const response = await fetch('/api/user');
        if (response.ok) {
            const data = await response.json();
            if (userInfo) {
                userInfo.textContent = `${getText('main.welcome', 'Welcome')}, ${data.user.username}!`;
            }
        } else if (response.status === 401) {
            // If not authenticated, redirect to login
            window.location.href = '/login';
        } else {
            console.log('Error loading user info:', response.status);
        }
    } catch (error) {
        console.error('Error loading user info:', error);
        // On network error, redirect to login
        window.location.href = '/login';
    }
}

// Function to handle mood selection
function selectMood(mood) {
    currentMood = mood;
    showLoading();
    getRecipe(mood);
}

// Function to fetch recipe from API
async function getRecipe(mood) {
    try {
        showLoading();
        
        const response = await fetch(`/api/recipes/${mood}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const recipe = await response.json();
        currentRecipe = recipe;
        displayRecipe(recipe);
        
    } catch (error) {
        console.error('Error fetching recipe:', error);
        showError('Failed to fetch recipe. Please try again.');
    }
}

// Function to display recipe
function displayRecipe(recipe) {
    // Set recipe name
    recipeName.textContent = recipe.name;
    
    // Set difficulty badge
    recipeDifficulty.textContent = recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1);
    recipeDifficulty.className = `px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(recipe.difficulty)}`;
    
    // Set prep time
    recipeTime.textContent = `${recipe.prep_time} min`;
    
    // Set ingredients
    const ingredients = recipe.ingredients.split(', ');
    ingredientsList.innerHTML = '';
    ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.className = 'flex items-center';
        li.innerHTML = `
            <i class="fas fa-circle text-pink-500 text-xs mr-2"></i>
            <span>${ingredient.trim()}</span>
        `;
        ingredientsList.appendChild(li);
    });
    
    // Set instructions
    const instructions = recipe.instructions.split('\n');
    instructionsText.innerHTML = '';
    instructions.forEach(instruction => {
        if (instruction.trim()) {
            const p = document.createElement('p');
            p.className = 'mb-2';
            p.textContent = instruction.trim();
            instructionsText.appendChild(p);
        }
    });
    
    showRecipeDisplay();
}

// Function to get difficulty color
function getDifficultyColor(difficulty) {
    switch (difficulty.toLowerCase()) {
        case 'easy':
            return 'bg-green-100 text-green-800';
        case 'medium':
            return 'bg-yellow-100 text-yellow-800';
        case 'hard':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

// UI state functions
function showLoading() {
    moodSelection.classList.add('hidden');
    loading.classList.remove('hidden');
    recipeDisplay.classList.add('hidden');
    errorDisplay.classList.add('hidden');
}

function showRecipeDisplay() {
    moodSelection.classList.add('hidden');
    loading.classList.add('hidden');
    recipeDisplay.classList.remove('hidden');
    errorDisplay.classList.add('hidden');
}

function showMoodSelection() {
    moodSelection.classList.remove('hidden');
    loading.classList.add('hidden');
    recipeDisplay.classList.add('hidden');
    errorDisplay.classList.add('hidden');
    currentMood = '';
    currentRecipe = null;
}

function showError(message) {
    moodSelection.classList.add('hidden');
    loading.classList.add('hidden');
    recipeDisplay.classList.add('hidden');
    errorDisplay.classList.remove('hidden');
    errorMessage.textContent = message;
}

// Add some visual feedback for mood buttons
moodButtons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.05)';
        button.style.transition = 'transform 0.2s ease';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
    });
});

// Add smooth transitions
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in animation for mood buttons
    moodButtons.forEach((button, index) => {
        button.style.opacity = '0';
        button.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            button.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
        }, index * 100);
    });
}); 

// Function to refresh current recipe with new language
async function refreshCurrentRecipe() {
    if (currentMood && currentRecipe) {
        try {
            const response = await fetch(`/api/recipes/${currentMood}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const recipe = await response.json();
            currentRecipe = recipe;
            displayRecipe(recipe);
            console.log('✅ Recipe refreshed with new language');
            
        } catch (error) {
            console.error('Error refreshing recipe:', error);
        }
    }
}

// Listen for language changes
window.addEventListener('languageChanged', refreshCurrentRecipe); 