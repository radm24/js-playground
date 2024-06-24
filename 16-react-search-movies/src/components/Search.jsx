import { useRef, useEffect } from "react";
import useKey from "../useKey";

export default function Search({ query, setQuery }) {
  const inputRef = useRef(null);

  useKey("Enter", () => {
    if (document.activeElement === inputRef.current) return;
    setQuery("");
    inputRef.current.focus();
  });

  return (
    <input
      type="search"
      className="search"
      placeholder="Press Enter to search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputRef}
    />
  );
}
