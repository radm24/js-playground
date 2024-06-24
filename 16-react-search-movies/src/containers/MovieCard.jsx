function MovieCard({ title, poster, onClick, children }) {
  return (
    <li onClick={onClick}>
      <img src={poster} alt={title} />
      <h3>{title}</h3>
      <div>{children}</div>
    </li>
  );
}

export default MovieCard;
