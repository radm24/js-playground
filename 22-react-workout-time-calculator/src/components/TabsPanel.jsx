import { useWorkouts } from "../contexts/WorkoutContext";
import styles from "./TabsPanel.module.css";

function TabsPanel() {
  const { currentPage, changePage } = useWorkouts();

  return (
    <nav className={styles.tabsPanel}>
      <ul>
        <li
          className={currentPage === "timer" ? styles.active : ""}
          onClick={() => changePage("timer")}
        >
          Timer
        </li>
        <li
          className={currentPage === "workouts" ? styles.active : ""}
          onClick={() => changePage("workouts")}
        >
          Workouts
        </li>
      </ul>
    </nav>
  );
}

export default TabsPanel;
