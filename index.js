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

function setLoading(isLoading) {
  if (isLoading) {
    dishName.innerHTML = '<div class="loader"></div>';
  }
}

async function getRandomMeal() {
  setLoading(true);

  try {
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    if (!response.ok) throw new Error();

    const data = await response.json();
    const meal = data.meals[0];

    displayMeal(meal);

    history.push(meal);
    currentIndex++;

    localStorage.setItem("lastMeal", JSON.stringify(meal));
  } catch (error) {
    dishName.textContent = "Error loading dish";
  }
}

function displayMeal(meal) {
  const container = document.querySelector(".container");

  container.classList.remove("fade-in");
  void container.offsetWidth;
  container.classList.add("fade-in");

  dishName.textContent = meal.strMeal;

  dishImage.classList.remove("show");
  dishImage.src = meal.strMealThumb;

  dishImage.onload = () => {
    dishImage.classList.add("show");
  };

  ingredientsList.innerHTML = "";

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== "") {
      const li = document.createElement("li");
      li.textContent = `${measure} ${ingredient}`;

      li.style.opacity = "0";
      setTimeout(() => {
        li.style.opacity = "1";
      }, i * 40);

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

  favorites.forEach((meal) => {
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