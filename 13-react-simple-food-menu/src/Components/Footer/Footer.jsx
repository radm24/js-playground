import Order from "../Order/Order.jsx";

export default function Footer() {
  const curHours = new Date().getHours();
  const closingHours = 22;
  const openingHours = 8;
  const isOpen = curHours >= openingHours && curHours < closingHours;

  return (
    <footer className="footer">
      {isOpen ? (
        <Order closingHours={closingHours} />
      ) : (
        <p>
          We're happy to welcome you between {openingHours}:00 and{" "}
          {closingHours}:00.
        </p>
      )}
    </footer>
  );
}
