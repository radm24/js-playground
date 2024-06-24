import { useState, useEffect } from "react";
import useKey from "../useKey";

import StarRating from "./StarRating";

function MovieDetails({
  movie,
  userWatchedRating,
  onCloseMovieDetails,
  onAddWatched,
}) {
  const [userRating, setUserRating] = useState(userWatchedRating);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Released: released,
    Runtime: runtime,
    Genre: genre,
    imdbRating,
    Plot: plot,
    Actors: actors,
    Director: director,
  } = movie;

  useEffect(() => {
    document.title = "Movie | " + title;

    return () => (document.title = "Cinemaite");
  }, [title]);

  useKey("Escape", onCloseMovieDetails);

  const handleAdd = () => {
    const newWatchedMovie = {
      imdbID: movie.imdbID,
      title,
      year,
      poster,
      runtime: Number(runtime.split(" ").at(0)),
      imdbRating,
      userRating: userRating,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovieDetails();
  };

  return (
    <div className="details">
      <button className="btn-back" onClick={onCloseMovieDetails}>
        &larr;
      </button>
      <header>
        <img src={poster} alt={title} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} &bull; {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐️</span>
            {imdbRating} IMDb rating
          </p>
        </div>
      </header>
      <section>
        <div className="rating">
          {userWatchedRating > 0 ? (
            <p>
              You have rated this movie - {userRating}
              <span>⭐️</span>
            </p>
          ) : (
            <>
              <StarRating onSetRating={setUserRating} />
              <button className="btn-add" onClick={handleAdd}>
                + Add To List
              </button>
            </>
          )}
        </div>
        <p>
          <em>{plot}</em>
        </p>
        <p>Starring - {actors}</p>
        <p>Directed by {director}</p>
      </section>
    </div>
  );
}

export default MovieDetails;
