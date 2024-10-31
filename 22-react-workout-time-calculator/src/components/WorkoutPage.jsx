import { useState, useRef, useEffect } from "react";
import { useWorkouts } from "../contexts/WorkoutContext";
import styles from "./WorkoutPage.module.css";

function WorkoutPage() {
  const {
    workouts,
    activeWorkoutId,
    selectWorkout,
    saveWorkout,
    deleteWorkout,
    changePage,
  } = useWorkouts();
  const workout = workouts.find((workout) => workout.id === activeWorkoutId);

  const [mode] = useState(!workout ? "add" : "edit");
  const [title, setTitle] = useState(!workout ? "" : workout.title);
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [exercises, setExercises] = useState(
    mode === "add" ? [] : [...workout.exercises]
  );
  const [exerciseIdInEdit, setExerciseIdInEdit] = useState(null);
  const [exerciseInEdit, setExerciseInEdit] = useState("");
  const [newExercise, setNewExercise] = useState("");
  const [isExerciseAdded, setIsExerciseAdded] = useState(false);

  const inputTitleRef = useRef();
  const inputsExercisesRef = useRef([]);
  const exercisesListBottomRef = useRef();

  useEffect(() => {
    if (isTitleEditing) inputTitleRef.current.focus();
  }, [isTitleEditing]);

  useEffect(() => {
    if (exerciseIdInEdit !== null)
      inputsExercisesRef.current[exerciseIdInEdit].focus();
  }, [exerciseIdInEdit]);

  useEffect(() => {
    if (!isExerciseAdded) return;

    exercisesListBottomRef.current.scrollIntoView({
      behavior: "smooth",
    });
    setIsExerciseAdded(false);
  }, [isExerciseAdded]);

  const backToMainPage = () => {
    selectWorkout(null);
    changePage("workouts");
  };

  const addNewExercise = (e) => {
    if (e.type === "keyup" && e.code !== "Enter") return;

    if (!newExercise) {
      alert("No exercise name!");
      return;
    }

    exercises.push(newExercise);
    setNewExercise("");
    setIsExerciseAdded(true);
  };

  const editExercise = (idx) => {
    setExerciseIdInEdit(idx);
    setExerciseInEdit(exercises[idx]);
  };

  const deleteExercise = (idx) => {
    setExercises((ex) => {
      const newExercises = [...ex];
      newExercises.splice(idx, 1);
      return newExercises;
    });
  };

  const saveTitleChanges = () => {
    if (!title) {
      alert("Please provide a name for workout routine!");
      return;
    }
    setIsTitleEditing(false);
  };

  const discardTitleChanges = () => {
    setTitle(title);
    setIsTitleEditing(false);
  };

  const saveExerciseChanges = (idx) => {
    if (!exerciseInEdit) {
      deleteExercise(idx);
    }

    if (exerciseInEdit) {
      setExercises((ex) => {
        const newExercises = [...ex];
        newExercises[exerciseIdInEdit] = exerciseInEdit;
        return newExercises;
      });
    }

    quitExerciseEditMode();
  };

  const quitExerciseEditMode = () => {
    setExerciseIdInEdit(null);
    setExerciseInEdit("");
  };

  const saveWorkoutHandler = () => {
    if (!title) {
      alert("Please provide a name for workout routine!");
      return;
    }
    if (!exercises.length) {
      alert("There should be at least one exercise in workout routine!");
      return;
    }

    saveWorkout(mode, { title, exercises });
  };

  const deleteWorkoutHandler = () => {
    deleteWorkout();
  };

  return (
    <section className={styles.workoutPage}>
      <button className={styles.backButton} onClick={backToMainPage}>
        &larr;
      </button>

      {/* Add Workout Page */}
      {mode === "add" && (
        <>
          {/* Title */}
          <div className={styles.box}>
            <input
              className={styles.titleInput}
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Exercises List */}
          <div className={`${styles.box} ${styles.list}`}>
            {exercises.map((ex, idx) => (
              <div key={idx} className={styles.item}>
                <input
                  className={styles.itemInput}
                  type="text"
                  placeholder="Exercise"
                  value={ex}
                  onChange={(e) =>
                    setExercises((s) => {
                      const newExercises = [...s];
                      newExercises[idx] = e.target.value;
                      return newExercises;
                    })
                  }
                />
                <div className={styles.itemControls}>
                  <span onClick={() => deleteExercise(idx)}>🗑️</span>
                </div>
              </div>
            ))}
            <div ref={exercisesListBottomRef}></div>
          </div>
        </>
      )}

      {/* Edit Workout Page */}
      {mode === "edit" && (
        <>
          {/* Title */}
          <div className={styles.box}>
            {!isTitleEditing ? (
              <>
                <h2 className={styles.title}>{title}</h2>
                <div className={styles.itemControls}>
                  {exerciseIdInEdit === null && (
                    <span onClick={() => setIsTitleEditing(true)}>🖊️</span>
                  )}
                </div>
              </>
            ) : (
              <>
                <input
                  className={styles.titleInput}
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  ref={inputTitleRef}
                />
                <div className={styles.itemControls}>
                  <span onClick={saveTitleChanges}>✔️</span>
                  <span onClick={discardTitleChanges}>❌</span>
                </div>
              </>
            )}
          </div>

          {/* Exercises List */}
          <div className={`${styles.box} ${styles.list}`}>
            {exercises.map((name, idx) => (
              <div key={idx} className={styles.item}>
                {idx !== exerciseIdInEdit ? (
                  <>
                    <p>{name}</p>
                    <div className={styles.itemControls}>
                      {!isTitleEditing && exerciseIdInEdit === null && (
                        <>
                          <span onClick={() => editExercise(idx)}>🖊️</span>
                          <span onClick={() => deleteExercise(idx)}>🗑️</span>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <input
                      className={styles.itemInput}
                      type="text"
                      placeholder="Exercise"
                      value={exerciseInEdit}
                      onChange={(e) => setExerciseInEdit(e.target.value)}
                      ref={(el) => (inputsExercisesRef.current[idx] = el)}
                    ></input>
                    <div className={styles.itemControls}>
                      <span onClick={() => saveExerciseChanges(idx)}>✔️</span>
                      <span onClick={quitExerciseEditMode}>❌</span>
                    </div>
                  </>
                )}
              </div>
            ))}
            <div ref={exercisesListBottomRef}></div>
          </div>
        </>
      )}

      <div className={`${styles.box}`}>
        {/* Add Workout Controls */}
        <input
          className={styles.newExerciseInput}
          type="text"
          placeholder="Add exercise"
          value={newExercise}
          onChange={(e) => setNewExercise(e.target.value)}
          onKeyUp={addNewExercise}
        />
        <button className={styles.addButton} onClick={addNewExercise}>
          +
        </button>

        {/* Save / Delete Workout Buttons */}
        <div className={styles.workoutControls}>
          {(mode === "add" ||
            (mode === "edit" &&
              !isTitleEditing &&
              exerciseIdInEdit === null)) && (
            <button className={styles.saveButton} onClick={saveWorkoutHandler}>
              Save
            </button>
          )}
          {mode === "edit" && (
            <button
              className={styles.deleteButton}
              onClick={deleteWorkoutHandler}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default WorkoutPage;
