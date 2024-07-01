import { useQuiz } from "../contexts/QuizContext";

export default function Progress() {
  const { numQuestions, questionIdx, maxPoints, points, answer } = useQuiz();

  return (
    <div className="progress">
      <progress
        max={numQuestions}
        value={questionIdx + Number(answer !== null)}
      />
      <p>
        Question <strong>{questionIdx + 1}</strong> / {numQuestions}
      </p>
      <p>
        <strong>{points}</strong> / {maxPoints} points
      </p>
    </div>
  );
}
