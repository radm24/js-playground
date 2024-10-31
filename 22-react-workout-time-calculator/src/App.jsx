import { useState } from "react";
import { useWorkouts } from "./contexts/WorkoutContext";
import Time from "./components/Time";
import TabsPanel from "./components/TabsPanel";
import ToggleSounds from "./components/ToggleSounds";
import Calculator from "./components/Calculator";
import WorkoutsList from "./components/WorkoutsList";
import WorkoutPage from "./components/WorkoutPage";

function App() {
  const { currentPage } = useWorkouts();
  const [allowSound, setAllowSound] = useState(true);

  return (
    <main>
      <h1>Workout timer</h1>
      <Time description="For your workout on" />
      <ToggleSounds allowSound={allowSound} setAllowSound={setAllowSound} />

      {currentPage !== "workout" && <TabsPanel />}

      {currentPage === "timer" && <Calculator allowSound={allowSound} />}

      {currentPage === "workouts" && <WorkoutsList />}

      {currentPage === "workout" && <WorkoutPage />}
    </main>
  );
}

export default App;
