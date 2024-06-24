function WatchedSummary({ watched }) {
  const summary = {
    imdbRating: 0,
    userRating: 0,
    runtime: 0,
  };
  const numWatched = watched.length;

  watched.forEach((movie) => {
    summary.imdbRating += movie.imdbRating / numWatched;
    summary.userRating += movie.userRating / numWatched;
    summary.runtime += movie.runtime / numWatched;
  });

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{numWatched} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{+summary.imdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{+summary.userRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{summary.runtime.toFixed()} min</span>
        </p>
      </div>
    </div>
  );
}

export default WatchedSummary;
