import { useQuiz } from "../contexts/QuizContext";

import Button from "./Button";

function Options({ question: { correct_answer, options } }) {
  const { answer, dispatch } = useQuiz();
  const hasAnswered = answer !== null;

  return (
    <div className="options">
      {options.map((option, idx) => (
        <Button
          key={idx}
          customClass={`btn-option ${option === answer ? "answer" : ""} ${
            hasAnswered ? (option === correct_answer ? "correct" : "wrong") : ""
          }`}
          isDisabled={hasAnswered}
          onClick={() => dispatch({ type: "new_answer", answer: option })}
        >
          {decodeURIComponent(option)}
        </Button>
      ))}
    </div>
  );
}

export default Options;
