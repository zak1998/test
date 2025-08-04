// Global variables
let currentMood = '';
let currentRecipe = null;

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
    newRecipeBtn.addEventListener('click', () => {
        if (currentMood) {
            getRecipe(currentMood);
        }
    });

    backToMoodBtn.addEventListener('click', () => {
        showMoodSelection();
    });

    retryBtn.addEventListener('click', () => {
        if (currentMood) {
            getRecipe(currentMood);
        } else {
            showMoodSelection();
        }
    });

    // Logout button
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
                alert(languageManager.getText('notifications.logoutFailed'));
            }
        } catch (error) {
            console.error('Logout error:', error);
            alert(languageManager.getText('notifications.logoutFailed'));
        }
    });

    // Load user info on page load
    loadUserInfo();
});

// Function to load user information
async function loadUserInfo() {
    try {
        const response = await fetch('/api/user');
        if (response.ok) {
                    const data = await response.json();
        userInfo.textContent = `${languageManager.getText('main.welcome')}, ${data.user.username}!`;
        } else {
            // If not authenticated, redirect to login
            window.location.href = '/login';
        }
    } catch (error) {
        console.error('Error loading user info:', error);
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
        
        // Fetch detailed recipe information
        await fetchDetailedRecipe(recipe.id);
        
    } catch (error) {
        console.error('Error fetching recipe:', error);
        showError('Failed to fetch recipe. Please try again.');
    }
}

// Function to fetch detailed recipe information
async function fetchDetailedRecipe(recipeId) {
    try {
        const currentLang = languageManager.getCurrentLanguage();
        const response = await fetch(`/api/recipe/${recipeId}/detailed?lang=${currentLang}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const detailedRecipe = await response.json();
        displayDetailedRecipe(detailedRecipe);
        
    } catch (error) {
        console.error('Error fetching detailed recipe:', error);
        // Fallback to basic recipe display
        if (currentRecipe) {
            displayRecipe(currentRecipe);
        }
    }
}

// Function to display detailed recipe with translations
function displayDetailedRecipe(recipe) {
    const currentLang = languageManager.getCurrentLanguage();
    
    // Set recipe name with translation
    recipeName.textContent = recipe.name[currentLang] || recipe.name.en || recipe.name;
    
    // Set difficulty badge
    const difficulty = recipe.difficulty || 'medium';
    recipeDifficulty.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    recipeDifficulty.className = `px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(difficulty)}`;
    
    // Set total time (prep + cook)
    const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
    recipeTime.textContent = `${totalTime} min`;
    
    // Set ingredients with quantities
    ingredientsList.innerHTML = '';
    if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
        recipe.ingredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.className = 'flex items-center justify-between mb-2';
            
            const ingredientName = ingredient.name[currentLang] || ingredient.name.en || ingredient.name;
            const amount = ingredient.amount || '';
            const unit = ingredient.unit || '';
            
            li.innerHTML = `
                <div class="flex items-center">
                    <i class="fas fa-circle text-pink-500 text-xs mr-2"></i>
                    <span class="font-medium">${ingredientName}</span>
                </div>
                <span class="text-gray-600 text-sm">${amount} ${unit}</span>
            `;
            ingredientsList.appendChild(li);
        });
    } else {
        // Fallback for old format
        const ingredients = recipe.ingredients ? recipe.ingredients.split(', ') : [];
        ingredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.className = 'flex items-center';
            li.innerHTML = `
                <i class="fas fa-circle text-pink-500 text-xs mr-2"></i>
                <span>${ingredient.trim()}</span>
            `;
            ingredientsList.appendChild(li);
        });
    }
    
    // Set detailed instructions
    instructionsText.innerHTML = '';
    if (recipe.instructions && Array.isArray(recipe.instructions)) {
        recipe.instructions.forEach((instruction, index) => {
            const stepDiv = document.createElement('div');
            stepDiv.className = 'mb-4';
            
            const stepNumber = document.createElement('div');
            stepNumber.className = 'flex items-center mb-2';
            stepNumber.innerHTML = `
                <span class="bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">${instruction.step}</span>
                <span class="font-semibold text-gray-800">${languageManager.getText('recipe.step')} ${instruction.step}</span>
            `;
            
            const stepText = document.createElement('p');
            stepText.className = 'text-gray-700 leading-relaxed ml-9';
            stepText.textContent = instruction.instruction[currentLang] || instruction.instruction.en || instruction.instruction;
            
            stepDiv.appendChild(stepNumber);
            stepDiv.appendChild(stepText);
            instructionsText.appendChild(stepDiv);
        });
    } else {
        // Fallback for old format
        const instructions = recipe.instructions ? recipe.instructions.split('\n') : [];
        instructions.forEach((instruction, index) => {
            if (instruction.trim()) {
                const p = document.createElement('p');
                p.className = 'mb-2';
                p.textContent = `${index + 1}. ${instruction.trim()}`;
                instructionsText.appendChild(p);
            }
        });
    }
    
    // Add additional recipe information if available
    if (recipe.servings || recipe.cuisine || recipe.category) {
        const infoDiv = document.createElement('div');
        infoDiv.className = 'mt-6 pt-4 border-t border-gray-200';
        infoDiv.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                ${recipe.servings ? `<div><i class="fas fa-users mr-2"></i>${languageManager.getText('recipe.servings')}: ${recipe.servings}</div>` : ''}
                ${recipe.cuisine ? `<div><i class="fas fa-globe mr-2"></i>${languageManager.getText('recipe.cuisine')}: ${recipe.cuisine}</div>` : ''}
                ${recipe.category ? `<div><i class="fas fa-tag mr-2"></i>${languageManager.getText('recipe.category')}: ${recipe.category}</div>` : ''}
            </div>
        `;
        instructionsText.appendChild(infoDiv);
    }
    
    showRecipeDisplay();
}

// Function to display recipe (fallback for old format)
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