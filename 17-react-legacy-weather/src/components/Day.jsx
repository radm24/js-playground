import { getWeatherIcon, formatDay } from "../utils";

export default function Day({
  code,
  date,
  tempMin,
  tempMax,
  isToday,
  isImportant,
  onClick,
}) {
  return (
    <li className={`day ${isImportant ? "important" : ""}`} onClick={onClick}>
      <span>{getWeatherIcon(code)}</span>
      <p>{isToday ? "Today" : formatDay(date)}</p>
      <p>
        {Math.floor(tempMin)}&deg; &mdash;{" "}
        <strong>{Math.ceil(tempMax)}&deg;</strong>
      </p>
    </li>
  );
}
