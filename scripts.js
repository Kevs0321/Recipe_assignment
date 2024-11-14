document.addEventListener('DOMContentLoaded', () => {
    // Fetch JSON data
    fetch('recipe.json')
        .then(response => response.json())
        .then(data => {
            populateDropdown(data);
            setupDropdownListener(data);
        })
        .catch(error => console.error('Error fetching recipes:', error));
        
    // DOM Elements
    const recipeDetails = document.getElementById('recipe-details');
    const recipeTitle = document.getElementById('recipe-title');
    const recipeImage = document.getElementById('recipe-image');
    const recipeDescription = document.getElementById('recipe-description');
    const recipeCuisine = document.getElementById('recipe-cuisine');
    const recipeDifficulty = document.getElementById('recipe-difficulty');
    const recipeServings = document.getElementById('recipe-servings');
    const recipePrepTime = document.getElementById('recipe-prep-time');
    const recipeCookTime = document.getElementById('recipe-cook-time');
    const recipeIngredients = document.getElementById('recipe-ingredients');
    const recipeInstructions = document.getElementById('recipe-instructions');
    const doubleServingsButton = document.getElementById('double-servings');
    const convertUnitsButton = document.getElementById('convert-units');
    let currentRecipe = null;
    let isImperial = false;

    // Populate dropdown with recipe names
    function populateDropdown(recipes) {
        const recipeDropdown = document.getElementById('recipe-dropdown');
        
        // Default option
        const defaultOption = document.createElement('option');
        defaultOption.textContent = 'Select a Recipe';
        defaultOption.value = '';
        recipeDropdown.appendChild(defaultOption);

        // Add each recipe to the dropdown
        recipes.forEach(recipe => {
            const option = document.createElement('option');
            option.value = recipe.name;
            option.textContent = recipe.name;
            recipeDropdown.appendChild(option);
        });
    }

    // Listen for dropdown selection changes
    function setupDropdownListener(recipes) {
        const recipeDropdown = document.getElementById('recipe-dropdown');
        recipeDropdown.addEventListener('change', () => {
            const selectedRecipeName = recipeDropdown.value;
            const selectedRecipe = recipes.find(recipe => recipe.name === selectedRecipeName);
            if (selectedRecipe) {
                displayRecipe(selectedRecipe);
            } else {
                recipeDetails.classList.add('hidden');
            }
        });
    }

    // Display the selected recipe's details
    function displayRecipe(recipe) {
        currentRecipe = JSON.parse(JSON.stringify(recipe)); // Deep copy to avoid modifying original
        recipeDetails.classList.remove('hidden');

        // Set Recipe Details
        recipeTitle.textContent = recipe.name;
        recipeImage.src = recipe.image;
        recipeDescription.textContent = recipe.description;
        recipeCuisine.textContent = recipe.cuisine;
        recipeDifficulty.textContent = recipe.difficulty;
        recipeServings.textContent = recipe.servings;
        recipePrepTime.textContent = formatTime(recipe.prepTime);
        recipeCookTime.textContent = formatTime(recipe.cookTime);

        displayIngredients(recipe.ingredients);
        displayInstructions(recipe.instructions);
        displayNutrition(recipe.nutritionalInfo);
        displayTags(recipe.tags);
    }

    // Format time to display hours and minutes if > 60
    function formatTime(minutes) {
        return minutes >= 60 ? `${Math.floor(minutes / 60)} hr ${minutes % 60} min` : `${minutes} min`;
    }

    // Display ingredients list
    function displayIngredients(ingredients) {
        recipeIngredients.innerHTML = '';
        ingredients.forEach(ingredient => {
            const listItem = document.createElement('li');
            listItem.textContent = `${ingredient.amount} ${ingredient.unit} ${ingredient.item}`;
            recipeIngredients.appendChild(listItem);
        });
    }

    // Display instructions list
    function displayInstructions(instructions) {
        recipeInstructions.innerHTML = '';
        instructions.forEach(step => {
            const listItem = document.createElement('li');
            listItem.textContent = step.text;
            recipeInstructions.appendChild(listItem);
        });
    }

    // Double servings, ingredients, and nutritional info
    doubleServingsButton.onclick = () => {
        if (currentRecipe) {
        // Double the servings
        currentRecipe.servings *= 2;
        recipeServings.textContent = currentRecipe.servings;

        // Double each ingredient amount
        currentRecipe.ingredients.forEach(ingredient => {
            ingredient.amount *= 2;
        });
        displayIngredients(currentRecipe.ingredients);

        // Double the nutritional information values
        for (const key in currentRecipe.nutritionalInfo) {
            currentRecipe.nutritionalInfo[key] *= 2;
        }
        displayNutrition(currentRecipe.nutritionalInfo);
        }
    };

    // Display nutritional information
    function displayNutrition(nutritionalInfo) {
        const recipeNutrition = document.getElementById('recipe-nutrition');
            recipeNutrition.innerHTML = ''; 

    // Create list items for each nutritional attribute
        for (const [key, value] of Object.entries(nutritionalInfo)) {
            const listItem = document.createElement('li');
            listItem.textContent = `${capitalizeFirstLetter(key)}: ${value}`;
            recipeNutrition.appendChild(listItem);
        }
    };

    // Display tags
    function displayTags(tags) {
        const recipeTags = document.getElementById('recipe-tags');
        recipeTags.textContent = tags.join(', '); 
    };

    // Helper function to capitalize the first letter of each nutritional attribute
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // Convert units between metric and imperial
    convertUnitsButton.onclick = () => {
        if (currentRecipe) {
            isImperial = !isImperial;
            currentRecipe.ingredients.forEach(ingredient => {
                if (isImperial && ingredient.unit === 'grams') {
                    ingredient.amount = (ingredient.amount * 0.00220462).toFixed(2);
                    ingredient.unit = 'lbs';
                } else if (!isImperial && ingredient.unit === 'lbs') {
                    ingredient.amount = (ingredient.amount / 0.00220462).toFixed(2);
                    ingredient.unit = 'grams';
                }
            });
            displayIngredients(currentRecipe.ingredients);
        }
    };
});