import { useEffect } from "react";

export default function useKey(key, callback) {
  useEffect(() => {
    function handleKeydown(e) {
      if (e.code === key) callback();
    }

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [key, callback]);
}
