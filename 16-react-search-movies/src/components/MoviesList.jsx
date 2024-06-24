import MovieCard from "../containers/MovieCard";

function MoviesList({ movies, onSelect }) {
  const moviesList = movies.map((movie) => (
    <MovieCard
      key={movie.imdbID}
      title={movie.Title}
      poster={movie.Poster}
      onClick={() => onSelect(movie.imdbID)}
    >
      <p>
        <span>🗓</span>
        <span>{movie.Year}</span>
      </p>
    </MovieCard>
  ));

  return <ul className="list list-movies">{moviesList}</ul>;
}

export default MoviesList;
