import logo from "../assets/logo.png";

export default function Header() {
  return (
    <header className="app-header">
      <img src={logo} alt="Logo" />
      <h1>Trivia Quiz</h1>
    </header>
  );
}
