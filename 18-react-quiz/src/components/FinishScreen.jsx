import { useQuiz } from "../contexts/QuizContext";

import Button from "./Button";

function FinishScreen() {
  const { points, maxPoints, highscore, dispatch } = useQuiz();

  const percentage = (points / maxPoints) * 100;

  let emoji;
  if (percentage === 100) emoji = "🤩";
  if (percentage >= 80 && percentage < 100) emoji = "🥳";
  if (percentage >= 50 && percentage < 80) emoji = "🤓";
  if (percentage >= 0 && percentage < 50) emoji = "😔";
  if (percentage === 0) emoji = "😭";

  return (
    <>
      <p className="result">
        <span>{emoji}</span> You scored <strong>{points}</strong> out of{" "}
        {maxPoints} ({Math.round(percentage)}%)
      </p>
      <p className="highscore">(Highscore: {highscore} points)</p>
      <Button
        customClass="btn-ui"
        onClick={() => dispatch({ type: "restart_quiz" })}
      >
        Restart Quiz
      </Button>
    </>
  );
}

export default FinishScreen;
