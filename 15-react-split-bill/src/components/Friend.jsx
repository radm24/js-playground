import Button from "./Button";

function Friend({ name, image, balance, isSelected, onSelect }) {
  const balanceText =
    balance < 0
      ? `You owe ${name} ${Math.abs(balance)}€`
      : balance > 0
      ? `${name} owes you ${balance}€`
      : `You and ${name} are even`;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <Button onClick={onSelect}>{isSelected ? "Close" : "Select"}</Button>
      <p className={balance < 0 ? "red" : balance > 0 ? "green" : ""}>
        {balanceText}
      </p>
    </li>
  );
}

export default Friend;
