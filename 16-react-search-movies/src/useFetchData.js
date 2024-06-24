import { useState, useEffect } from "react";

const API_URL = `http://www.omdbapi.com/?apikey=${
  import.meta.env.VITE_API_KEY
}`;

export default function useFetchData(endpoint, timeoutSec = 0) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setData(null);
    setError(null);

    if (!endpoint) return;

    async function fetchData() {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_URL}&${endpoint}`);
        if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);

        const data = await res.json();
        if (ignore) return;
        if (data.Response === "False") throw new Error("Movie not found");

        setData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    let ignore = false;
    const timeoutId = setTimeout(fetchData, timeoutSec * 1000);

    return () => {
      ignore = true;
      clearTimeout(timeoutId);
    };
  }, [endpoint, timeoutSec]);

  return [data, isLoading, error];
}
