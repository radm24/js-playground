import { useEffect } from "react";

import { useQuiz } from "../contexts/QuizContext";

function Timer() {
  const { secondsRemaining, dispatch } = useQuiz();

  useEffect(() => {
    const intervalId = setInterval(() => dispatch({ type: "tick" }), 1000);
    return () => clearInterval(intervalId);
  }, [dispatch]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  return (
    <div className="timer">
      {`${minutes}`.padStart(2, 0)}:{`${seconds}`.padStart(2, 0)}
    </div>
  );
}

export default Timer;
