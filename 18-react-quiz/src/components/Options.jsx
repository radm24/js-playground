import { useQuiz } from "../contexts/QuizContext";

import Button from "./Button";

function Options({ question: { options, correctOption } }) {
  const { answer, dispatch } = useQuiz();
  const hasAnswered = answer !== null;

  return (
    <div className="options">
      {options.map((option, idx) => (
        <Button
          key={idx}
          customClass={`btn-option ${idx === answer ? "answer" : ""} ${
            hasAnswered ? (idx === correctOption ? "correct" : "wrong") : ""
          }`}
          isDisabled={hasAnswered}
          onClick={() => dispatch({ type: "new_answer", answer: idx })}
        >
          {option}
        </Button>
      ))}
    </div>
  );
}

export default Options;
