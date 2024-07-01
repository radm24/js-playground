import { useQuiz } from "../contexts/QuizContext";

import Options from "./Options";

export default function Question() {
  const { questions, questionIdx } = useQuiz();
  const question = questions[questionIdx];

  return (
    <div>
      <h4>{question.question}</h4>
      <Options question={question} />
    </div>
  );
}
