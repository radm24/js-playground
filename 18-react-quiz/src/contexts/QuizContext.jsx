import { createContext, useReducer, useEffect, useContext } from "react";

const QuizContext = createContext(null);

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  // 'loading', 'error', 'ready', 'active', 'finished'
  status: "loading",
  questionIdx: 0,
  points: 0,
  answer: null,
  highscore: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "fetch_failed":
      return { ...state, status: "error" };
    case "data_received":
      return { ...state, questions: action.payload, status: "ready" };
    case "start_quiz":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "new_answer": {
      const question = state.questions[state.questionIdx];
      const nextPoints =
        action.answer === question.correctOption
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
        questions: state.questions,
        status: "ready",
        highscore: state.highscore,
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
      questions,
      status,
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

    fetch(import.meta.env.VITE_QUIZ_API)
      .then((res) => {
        if (res.ok) return res.json();
        else throw new Error(`HTTP Error! Status: ${res.status}`);
      })
      .then((data) => {
        if (!ignore) dispatch({ type: "data_received", payload: data });
      })
      .catch(() => dispatch({ type: "fetch_failed" }));

    return () => (ignore = true);
  }, []);

  const maxPoints = questions.reduce((acc, q) => acc + q.points, 0);
  const numQuestions = questions.length;
  const isLastAnswer = answer !== null && questionIdx === questions.length - 1;

  return (
    <QuizContext.Provider
      value={{
        questions,
        status,
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
