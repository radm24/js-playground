import { useWorkouts } from "../contexts/WorkoutContext";
import styles from "./WorkoutsList.module.css";

function WorkoutsList() {
  const { workouts, selectWorkout, changePage } = useWorkouts();

  return (
    <section>
      <button
        className={styles.addButton}
        onClick={() => changePage("workout")}
      >
        Add
      </button>
      <ul className={styles.list}>
        {workouts.map(({ id, title }) => (
          <li
            key={id}
            className={styles.item}
            onClick={() => {
              selectWorkout(id);
              changePage("workout");
            }}
          >
            {title}
          </li>
        ))}
      </ul>
      <div></div>
    </section>
  );
}

export default WorkoutsList;
