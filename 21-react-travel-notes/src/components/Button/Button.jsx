import styles from "./Button.module.css";

export default function Button({ customClass, onClick, children }) {
  return (
    <button
      className={`${styles.btn} ${
        customClass ? styles[customClass] : styles.primary
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
