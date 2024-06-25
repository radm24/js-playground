export default function Input({ value, onLocationChange }) {
  return (
    <input
      type="text"
      placeholder="Search for location..."
      value={value}
      onChange={onLocationChange}
    />
  );
}
