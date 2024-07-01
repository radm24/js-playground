import { useQuiz } from "../contexts/QuizContext";

import Button from "./Button";

function NextButton() {
  const { answer, isLastAnswer, dispatch } = useQuiz();

  return (
    <>
      {answer !== null && (
        <Button
          customClass="btn-ui"
          onClick={() =>
            dispatch({
              type: `${isLastAnswer ? "finish_quiz" : "next_question"}`,
            })
          }
        >
          {isLastAnswer ? "Finish" : "Next"}
        </Button>
      )}
    </>
  );
}

export default NextButton;
