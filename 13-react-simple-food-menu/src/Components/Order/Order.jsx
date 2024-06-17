import Button from "../Button/Button.jsx";

function Order({ closingHours }) {
  return (
    <div className="order">
      <p>We're open until {closingHours}:00. Come visit us or order online.</p>
      <Button text="Order Now" />
    </div>
  );
}

export default Order;
