import { useState } from "react";

import { mealsData } from "../../data.js";

import MealsList from "../MealsList/MealsList.jsx";

function Menu() {
  const [meals] = useState(mealsData);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleDotClick = (e) => {
    setActiveSlide(+e.target.dataset.id);
  };

  const slideMeals = meals.slice(activeSlide * 6, activeSlide * 6 + 6);

  return (
    <main className="menu">
      <h2>Our Menu</h2>
      {mealsData.length > 0 ? (
        <>
          <p>
            Authentic Italian cuisine. {mealsData.length} creative dishes to
            choose from. All organic, all delicious, all cooked with love.
          </p>
          <MealsList meals={slideMeals} />
        </>
      ) : (
        <p>We're still working on our menu. Please come back later :)</p>
      )}
      <div className="dots">
        {[...Array(Math.ceil(meals.length / 6))].map((_, idx) => (
          <div
            key={idx}
            className={`dots__dot ${
              idx === activeSlide ? " dots__dot--active" : ""
            }`}
            data-id={idx}
            onClick={handleDotClick}
          ></div>
        ))}
      </div>
    </main>
  );
}

export default Menu;
