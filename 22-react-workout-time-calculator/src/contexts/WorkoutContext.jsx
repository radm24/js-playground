import { useReducer, createContext, useContext, useEffect } from "react";
import { nanoid } from "nanoid";

const testData = [
  {
    id: "1b",
    title: "Full-body workout",
    exercises: ["Pull ups", "Push ups"],
  },
  {
    id: "2a",
    title: "Arms + Legs",
    exercises: ["Pull ups", "Push ups", "Bench Press"],
  },
  {
    id: "3g",
    title: "Arms only",
    exercises: ["Pull ups", "Push ups", "Bench Press", "Planche"],
  },
  {
    id: "4u",
    title: "Legs only",
    exercises: ["Pull ups", "Push ups", "Bench Press", "Planche", "Squats"],
  },
  {
    id: "5j",
    title: "Core only",
    exercises: [
      "Pull ups",
      "Push ups",
      "Bench Press",
      "Planche",
      "Squats",
      "Cat Hang",
      "Handstand",
      "Pike Push Ups",
      "Biceps Curls",
    ],
  },
];

const WorkoutContext = createContext();

const initialState = {
  // workouts: testData,
  workouts: [],
  activeWorkoutId: null,
  currentPage: "timer",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "page":
      return {
        ...state,
        currentPage: action.payload,
      };
    case "workout/added":
      return {
        ...state,
        workouts: [...state.workouts, action.payload],
        currentPage: "workouts",
      };
    case "workout/selected":
      return {
        ...state,
        activeWorkoutId: action.payload,
        currentPage: "workout",
      };
    case "workout/updated": {
      const updatedWorkouts = [...state.workouts];
      const idx = updatedWorkouts.findIndex(
        (workout) => workout.id === action.payload.id
      );
      updatedWorkouts[idx] = action.payload;

      return {
        ...state,
        workouts: updatedWorkouts,
        currentPage: "workouts",
      };
    }
    case "workout/deleted": {
      const updatedWorkouts = [...state.workouts];
      const idx = updatedWorkouts.findIndex(
        (workout) => workout.id === state.activeWorkoutId
      );
      updatedWorkouts.splice(idx, 1);

      return {
        ...state,
        workouts: updatedWorkouts,
        currentPage: "workouts",
      };
    }
    default:
      throw new Error("Unknown action type " + action.type);
  }
};

const WorkoutsProvider = ({ children }) => {
  const [{ workouts, activeWorkoutId, currentPage }, dispatch] = useReducer(
    reducer,
    initialState,
    () => {
      const data = JSON.parse(localStorage.getItem("workouts"));
      return {
        ...initialState,
        workouts: data && data.length ? data : initialState.workouts,
      };
    }
  );

  useEffect(() => {
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }, [workouts]);

  const changePage = (page) => dispatch({ type: "page", payload: page });

  const selectWorkout = (id) => {
    dispatch({ type: "workout/selected", payload: id });
  };

  const saveWorkout = (mode, { title, exercises }) => {
    const id = mode === "add" ? nanoid() : activeWorkoutId;
    const newWorkout = { id, title, exercises };

    if (mode === "add") {
      dispatch({ type: "workout/added", payload: newWorkout });
    }
    if (mode === "edit") {
      dispatch({ type: "workout/updated", payload: newWorkout });
    }
  };

  const deleteWorkout = () => dispatch({ type: "workout/deleted" });

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        activeWorkoutId,
        currentPage,
        selectWorkout,
        saveWorkout,
        deleteWorkout,
        changePage,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

const useWorkouts = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error("WorkoutsContext is used outside of WorkoutsProvider.");
  }
  return context;
};

export { WorkoutsProvider, useWorkouts };
