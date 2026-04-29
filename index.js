const newDishBtn = document.getElementById("new-dish-btn");
const prevDishBtn = document.getElementById("prev-dish-btn");
const saveDishBtn = document.getElementById("save-dish-btn");

const dishName = document.getElementById("dish-name");
const dishImage = document.getElementById("dish-image");
const ingredientsList = document.getElementById("ingredients-list");
const instructionsText = document.getElementById("instructions-text");
const favoritesList = document.getElementById("favorites-list");

let history = [];
let currentIndex = -1;

async function getRandomMeal() {
  try {
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");

    if (!response.ok) throw new Error("Network error");

    const data = await response.json();
    const meal = data.meals[0];

    displayMeal(meal);

    history.push(meal);
    currentIndex++;

    // save last viewed meal
    localStorage.setItem("lastMeal", JSON.stringify(meal));

  } catch (error) {
    console.error(error);
    dishName.textContent = "Error loading dish";
  }
}

function displayMeal(meal) {
  dishName.textContent = meal.strMeal;

  dishImage.src = meal.strMealThumb;
  dishImage.style.display = "block";

  ingredientsList.innerHTML = "";

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== "") {
      const li = document.createElement("li");
      li.textContent = `${measure} ${ingredient}`;
      ingredientsList.appendChild(li);
    }
  }

  instructionsText.textContent = meal.strInstructions;
}

function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

function saveFavorites(favorites) {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

saveDishBtn.addEventListener("click", () => {
  if (currentIndex >= 0) {
    const favorites = getFavorites();
    const currentMeal = history[currentIndex];

    // prevent duplicates
    if (!favorites.find(meal => meal.idMeal === currentMeal.idMeal)) {
      favorites.push(currentMeal);
      saveFavorites(favorites);
      renderFavorites();
    }
  }
});

function renderFavorites() {
  const favorites = getFavorites();
  favoritesList.innerHTML = "";

  favorites.forEach((meal, index) => {
    const li = document.createElement("li");
    li.textContent = meal.strMeal;

    li.addEventListener("click", () => {
      displayMeal(meal);
    });

    favoritesList.appendChild(li);
  });
}

newDishBtn.addEventListener("click", getRandomMeal);

prevDishBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    displayMeal(history[currentIndex]);
  }
});

function loadLastMeal() {
  const lastMeal = JSON.parse(localStorage.getItem("lastMeal"));
  if (lastMeal) {
    displayMeal(lastMeal);
    history.push(lastMeal);
    currentIndex = 0;
  } else {
    getRandomMeal();
  }
}

renderFavorites();
loadLastMeal();