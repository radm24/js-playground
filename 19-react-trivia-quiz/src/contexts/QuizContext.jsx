import { createContext, useReducer, useEffect, useContext } from "react";
import he from "he";

const QuizContext = createContext(null);

const API_URL = "https://opentdb.com/api.php";
const SECS_PER_QUESTION = 30;

const initialState = {
  searchParams: {},
  categories: [{ id: "any", name: "Any Category" }],
  questions: [],
  // 'ready', 'loading', 'error', 'active', 'finished'
  status: "ready",
  errorMessage: "",
  questionIdx: 0,
  points: 0,
  answer: null,
  highscore: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "categories_fetched":
      return { ...state, categories: [...state.categories, ...action.payload] };
    case "fetch_quiz":
      return { ...state, searchParams: action.payload, status: "loading" };
    case "fetch_failed":
      return { ...state, status: "error", errorMessage: action.payload };
    case "start_quiz": {
      // Decode html entities and shuffle options of questions
      const questions = action.payload.map((question) => {
        const escapedQuestion = he.decode(question.question);
        const escapedCorrectAnswer = he.decode(question.correct_answer);
        const points =
          question.difficulty === "easy"
            ? 1
            : question.difficulty === "medium"
            ? 2
            : question.difficulty === "hard"
            ? 3
            : 0;

        const shuffledOptions = [
          question.correct_answer,
          ...question.incorrect_answers,
        ]
          .map((value) => ({ value, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ value }) => he.decode(value));

        return {
          ...question,
          question: escapedQuestion,
          correct_answer: escapedCorrectAnswer,
          options: shuffledOptions,
          points,
        };
      });

      return {
        ...state,
        questions,
        status: "active",
        secondsRemaining: questions.length * SECS_PER_QUESTION,
      };
    }
    case "new_answer": {
      const question = state.questions[state.questionIdx];
      const nextPoints =
        action.answer === question.correct_answer
          ? state.points + question.points
          : state.points;

      return {
        ...state,
        points: nextPoints,
        answer: action.answer,
      };
    }
    case "next_question":
      return { ...state, questionIdx: state.questionIdx + 1, answer: null };
    case "finish_quiz":
      return {
        ...state,
        status: "finished",
        questionIdx: null,
        answer: null,
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart_quiz":
      return {
        ...initialState,
        searchParams: state.searchParams,
        categories: state.categories,
        questions: state.questions,
        status: "active",
        highscore: state.highscore,
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "back_to_menu":
      return {
        ...initialState,
        searchParams: state.searchParams,
        categories: state.categories,
      };
    case "tick":
      return {
        ...state,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
        secondsRemaining: state.secondsRemaining - 1,
        highscore:
          state.secondsRemaining === 0
            ? state.points > state.highscore
              ? state.points
              : state.highscore
            : state.highscore,
      };
    default:
      throw Error("Unknown action: " + action.type);
  }
}

function QuizProvider({ children }) {
  const [
    {
      searchParams,
      categories,
      questions,
      status,
      errorMessage,
      questionIdx,
      points,
      answer,
      highscore,
      secondsRemaining,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    let ignore = false;

    fetch("https://opentdb.com/api_category.php")
      .then((res) => {
        if (res.ok) return res.json();
        else throw new Error("HTTP error! Status: " + res.status);
      })
      .then((data) => {
        if (ignore) return;
        const categories = data.trivia_categories
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name));
        dispatch({ type: "categories_fetched", payload: categories });
      })
      .catch((err) => console.log(err.message));
    return () => (ignore = true);
  }, []);

  useEffect(() => {
    const { queryNumQuestions, category, difficulty } = searchParams;

    if (!queryNumQuestions) return;

    let url = `${API_URL}?amount=${queryNumQuestions}`;
    if (category !== "any") url += `&category=${category}`;
    if (difficulty !== "any") url += `&difficulty=${difficulty}`;

    let ignore = false;
    fetch(url)
      .then((res) => {
        if (res.ok) return res.json();
        else throw new Error(`HTTP Error! Status: ${res.status}`);
      })
      .then((data) => {
        console.log(data);
        if (data.response_code === 1)
          throw new Error(
            "No results found for your quiz parameters! Try other values."
          );
        if (data.response_code !== 0)
          throw new Error("There was an error fetching questions.");
        if (!ignore) dispatch({ type: "start_quiz", payload: data.results });
      })
      .catch((err) => dispatch({ type: "fetch_failed", payload: err.message }));

    return () => (ignore = true);
  }, [searchParams]);

  const maxPoints = questions.reduce((acc, q) => acc + q.points, 0);
  const numQuestions = questions.length;
  const isLastAnswer = answer !== null && questionIdx === questions.length - 1;

  return (
    <QuizContext.Provider
      value={{
        questions,
        categories,
        status,
        errorMessage,
        questionIdx,
        points,
        answer,
        highscore,
        secondsRemaining,
        maxPoints,
        numQuestions,
        isLastAnswer,

        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (!context)
    throw new Error("QuizContext was used outside of the QuizProvider");
  return context;
}

export { QuizProvider, useQuiz };
