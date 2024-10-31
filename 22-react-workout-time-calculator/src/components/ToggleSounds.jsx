import styles from "./ToggleSounds.module.css";

function ToggleSounds({ allowSound, setAllowSound }) {
  return (
    <button
      className={styles.soundButton}
      onClick={() => setAllowSound((allow) => !allow)}
    >
      {allowSound ? "🔈" : "🔇"}
    </button>
  );
}

export default ToggleSounds;
