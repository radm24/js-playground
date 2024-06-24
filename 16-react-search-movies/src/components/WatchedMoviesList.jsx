import MovieCard from "../containers/MovieCard";

function WatchedMoviesList({ watched, onSelect, onRemoveWatched }) {
  const watchedList = watched.map((movie) => (
    <MovieCard
      key={movie.imdbID}
      title={movie.title}
      poster={movie.poster}
      onClick={() => onSelect(movie.imdbID)}
    >
      <p>
        <span>⭐️</span>
        <span>{movie.imdbRating}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{movie.userRating}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{movie.runtime} min</span>
      </p>

      <button
        className="btn-delete"
        onClick={(e) => onRemoveWatched(e, movie.imdbID)}
      >
        X
      </button>
    </MovieCard>
  ));

  return <ul className="list list-watched">{watchedList}</ul>;
}

export default WatchedMoviesList;
