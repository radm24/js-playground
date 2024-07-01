import { useQuiz } from "../contexts/QuizContext";

import Button from "./Button";

export default function StartScreen() {
  const { numQuestions, dispatch } = useQuiz();

  return (
    <div className="start">
      <h2>Welcome to The React Quiz!</h2>
      <h3>{numQuestions} questions to test your React mastery</h3>
      <Button onClick={() => dispatch({ type: "start_quiz" })}>
        Let's start!
      </Button>
    </div>
  );
}
