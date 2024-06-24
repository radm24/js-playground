import { useState } from "react";
import useFetchData from "../useFetchData";
import useLocalStorageState from "../useLocalStorageState";

import Box from "../containers/Box";

import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import MoviesList from "./MoviesList";
import MovieDetails from "./MovieDetails";
import WatchedSummary from "./WatchedSummary";
import WatchedMoviesList from "./WatchedMoviesList";

function Main({ movies, isLoading, error }) {
  const [watched, setWatched] = useLocalStorageState("watched", []);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const endpoint = selectedMovieId ? `i=${selectedMovieId}` : null;
  const [selectedMovie, isLoadingDetails] = useFetchData(endpoint);

  const handleSelectMovie = (id) => {
    setSelectedMovieId((selectedId) => (id !== selectedId ? id : null));
  };

  const handleCloseMovieDetails = () => {
    setSelectedMovieId(null);
  };

  const handleAddWatched = (movie) => {
    setWatched((watched) => [...watched, movie]);
  };

  const handleRemoveWatched = (e, imdbID) => {
    e.stopPropagation();
    setWatched((watched) => watched.filter((movie) => movie.imdbID != imdbID));
  };

  const userRating = selectedMovieId
    ? watched.find((movie) => movie.imdbID === selectedMovieId)?.userRating ?? 0
    : 0;

  return (
    <main className="main">
      <Box>
        {isLoading && <Loader />}
        {error && <ErrorMessage message={error} />}

        {!isLoading && !error && (
          <MoviesList movies={movies} onSelect={handleSelectMovie} />
        )}
      </Box>
      <Box>
        {isLoadingDetails ? (
          <Loader />
        ) : selectedMovie ? (
          <MovieDetails
            movie={selectedMovie}
            userWatchedRating={userRating}
            onCloseMovieDetails={handleCloseMovieDetails}
            onAddWatched={handleAddWatched}
          />
        ) : (
          <>
            <WatchedSummary watched={watched} />
            <WatchedMoviesList
              watched={watched}
              onSelect={setSelectedMovieId}
              onRemoveWatched={handleRemoveWatched}
            />
          </>
        )}
      </Box>
    </main>
  );
}

export default Main;
