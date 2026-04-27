const newDishBtn = document.getElementById("new-dish-btn");
const prevDishBtn = document.getElementById("prev-dish-btn");

const dishName = document.getElementById("dish-name");
const dishImage = document.getElementById("dish-image");
const ingredientsList = document.getElementById("ingredients-list");
const instructionsText = document.getElementById("instructions-text");

let history = [];
let currentIndex = -1;

async function getRandomMeal() {
  try {
    console.log("Fetching meal...");

    const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");

    if (!response.ok) {
      throw new Error("Network error");
    }

    const data = await response.json();
    console.log(data);

    const meal = data.meals[0];

    displayMeal(meal);

    history.push(meal);
    currentIndex++;

  } catch (error) {
    console.error("Error:", error);
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

newDishBtn.addEventListener("click", getRandomMeal);

prevDishBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    displayMeal(history[currentIndex]);
  }
});

getRandomMeal();