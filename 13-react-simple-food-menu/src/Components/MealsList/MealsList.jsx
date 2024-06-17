import MealCard from "../MealCard/MealCard.jsx";

function MealList({ meals }) {
  return (
    <ul className="meals">
      {meals.map((meal) => (
        <MealCard key={meal.name} {...meal} />
      ))}
    </ul>
  );
}

export default MealList;
