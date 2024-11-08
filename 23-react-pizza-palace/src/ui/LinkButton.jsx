import { Link, useNavigate } from "react-router-dom";

function LinkButton({ children, to, delta }) {
  const navigate = useNavigate();
  const className = "text-sm text-blue-500 hover:text-blue-600 hover:underline";

  return (
    <>
      {delta !== undefined ? (
        <button className={className} onClick={() => navigate(delta)}>
          {children}
        </button>
      ) : (
        <Link to={to} className={className}>
          {children}
        </Link>
      )}
    </>
  );
}

export default LinkButton;
