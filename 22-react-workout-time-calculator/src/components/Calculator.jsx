import { useState, useEffect, useRef } from "react";
import clickSound from "../assets/ClickSound.m4a";
import styles from "./Calculator.module.css";

import { useWorkouts } from "../contexts/WorkoutContext";

function useFirstRender() {
  const initialRenderRef = useRef(true);

  useEffect(() => {
    initialRenderRef.current = false;
    return () => (initialRenderRef.current = true);
  }, []);

  return initialRenderRef.current;
}

function Calculator({ allowSound }) {
  const { workouts } = useWorkouts();
  const isInitialRender = useFirstRender();

  const [number, setNumber] = useState(
    workouts.length ? workouts.at(0).exercises.length : 0
  );
  const [sets, setSets] = useState(3);
  const [speed, setSpeed] = useState(90);
  const [durationBreak, setDurationBreak] = useState(5);
  const [duration, setDuration] = useState(() =>
    number === 0 ? 0 : (number * sets * speed) / 60 + (sets - 1) * durationBreak
  );

  const mins = Math.floor(duration);
  const seconds = (duration - mins) * 60;

  useEffect(() => {
    setDuration(
      number === 0
        ? 0
        : (number * sets * speed) / 60 + (sets - 1) * durationBreak
    );
  }, [number, sets, speed, durationBreak]);

  useEffect(() => {
    if (isInitialRender || duration === 0) return;

    function playSound() {
      if (!allowSound) return;
      const sound = new Audio(clickSound);
      sound.play();
    }

    playSound();
  }, [duration, allowSound, isInitialRender]);

  function handleDec() {
    setDuration((d) => (d > 0 ? Math.floor(d) - 1 : d));
  }

  function handleInc() {
    setDuration((d) => Math.ceil(d) + 1);
  }

  return (
    <section className={styles.calculator}>
      <form>
        <div>
          <label>Type of workout</label>
          <select value={number} onChange={(e) => setNumber(+e.target.value)}>
            {workouts.map((workout) => (
              <option key={workout.id} value={workout.exercises.length}>
                {workout.title} ({workout.exercises.length} exercises)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>How many sets?</label>
          <input
            type="range"
            min="1"
            max="10"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
          />
          <span>{sets}</span>
        </div>
        <div>
          <label>How fast are you?</label>
          <input
            type="range"
            min="30"
            max="180"
            step="30"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
          />
          <span>{speed} sec/exercise</span>
        </div>
        <div>
          <label>Break length</label>
          <input
            type="range"
            min="1"
            max="10"
            value={durationBreak}
            onChange={(e) => setDurationBreak(e.target.value)}
          />
          <span>{durationBreak} minutes/break</span>
        </div>
      </form>
      <section>
        <button onClick={handleDec} disabled={workouts.length === 0}>
          –
        </button>
        <p>
          {mins < 10 && "0"}
          {mins}:{seconds < 10 && "0"}
          {seconds}
        </p>
        <button onClick={handleInc} disabled={workouts.length === 0}>
          +
        </button>
      </section>
    </section>
  );
}

export default Calculator;
