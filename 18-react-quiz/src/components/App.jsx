import { useQuiz } from "../contexts/QuizContext";

import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Progress from "./Progress";
import Question from "./Question";
import Timer from "./Timer";
import NextButton from "./NextButton";
import FinishScreen from "./FinishScreen";

function App() {
  const { status } = useQuiz();

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <StartScreen />}
        {status === "active" && (
          <>
            <Progress />
            <Question />
            <Timer />
            <NextButton />
          </>
        )}
        {status === "finished" && <FinishScreen />}
      </Main>
    </div>
  );
}

export default App;
