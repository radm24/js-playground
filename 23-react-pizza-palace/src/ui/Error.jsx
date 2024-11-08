import { useRouteError } from "react-router-dom";

import LinkButton from "./LinkButton";

function NotFound() {
  const error = useRouteError();

  return (
    <div className="px-4 py-3">
      <h1>Something went wrong 😢</h1>
      <p className="mb-4">{error.message || error.data}</p>
      <LinkButton delta={-1}>&larr; Go back</LinkButton>
    </div>
  );
}

export default NotFound;
