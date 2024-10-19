import { useSearchParams } from "react-router-dom";

export function useUrlPosition() {
  const [searchParams] = useSearchParams();
  const { lat, lng } = Object.fromEntries(searchParams);
  return [lat, lng];
}
