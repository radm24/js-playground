import { useState } from "react";
import { useQuiz } from "../contexts/QuizContext";

const DEFAULT_NUM_QUESTIONS = 15;

export default function StartScreen() {
  const [numQuestions, setNumQuestions] = useState(DEFAULT_NUM_QUESTIONS);
  const [category, setCategory] = useState("any");
  const [difficulty, setDifficulty] = useState("any");

  const { categories, dispatch } = useQuiz();

  const categoriesList = categories.map(({ id, name }) => (
    <option key={id} value={id}>
      {name}
    </option>
  ));

  return (
    <div className="start">
      <h2>Welcome to Trivia Quiz!</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          dispatch({
            type: "fetch_quiz",
            payload: { queryNumQuestions: numQuestions, category, difficulty },
          });
        }}
      >
        <label htmlFor="num-questions">Number of Questions</label>
        <input
          id="num-questions"
          type="number"
          min="5"
          max="50"
          value={numQuestions}
          onChange={(e) => setNumQuestions(+e.target.value)}
        />

        <label htmlFor="category">Select Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categoriesList}
        </select>

        <label htmlFor="difficulty">Select Difficulty</label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="any">Any Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <div className="btn-start-wrapper">
          <button className="btn-start">start</button>
          <div></div>
        </div>
      </form>
    </div>
  );
}
