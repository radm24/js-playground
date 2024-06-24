import { useState, useEffect } from "react";

export default function useLocalStorageState(key, initialState) {
  const [value, setValue] = useState(() => {
    const data = JSON.parse(localStorage.getItem(key));
    return data ? data : initialState;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}
