import { useQuiz } from "../contexts/QuizContext";

import Button from "./Button";

export default function Error() {
  const { errorMessage, dispatch } = useQuiz();

  return (
    <div className="error-container">
      <p className="error">
        <span>💥</span> {errorMessage}
      </p>
      <Button onClick={() => dispatch({ type: "back_to_menu" })}>
        To Main Menu
      </Button>
    </div>
  );
}
