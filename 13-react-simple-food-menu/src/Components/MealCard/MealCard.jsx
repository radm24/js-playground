function MealCard({ name, ingredients, price, photoName, soldOut }) {
  return (
    <li className={`meal ${soldOut ? "sold-out" : ""}`}>
      <img src={`/${photoName}`} alt={name} />
      <div>
        <h3>{name}</h3>
        <p>{ingredients}</p>
        <span>{soldOut ? "SOLD OUT" : price + "$"}</span>
      </div>
    </li>
  );
}

export default MealCard;
