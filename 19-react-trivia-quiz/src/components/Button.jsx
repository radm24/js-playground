export default function Button({ customClass, isDisabled, onClick, children }) {
  return (
    <button
      className={`btn ${customClass ? customClass : ""}`}
      disabled={isDisabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
