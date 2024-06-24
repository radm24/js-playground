import { useState } from "react";
import useFetchData from "./useFetchData";

import NavBar from "./containers/NavBar";

import Main from "./components/Main";
import Search from "./components/Search";
import NumResults from "./components/NumResults";

function App() {
  const [query, setQuery] = useState("");

  const endpoint = query.length > 2 ? `s=${query}` : null;
  const [moviesData, isLoading, error] = useFetchData(endpoint, 1);

  const movies = moviesData?.Search ? moviesData.Search : [];

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults numMovies={movies?.length ?? 0} />
      </NavBar>

      <Main movies={movies} isLoading={isLoading} error={error} />
    </>
  );
}

export default App;
