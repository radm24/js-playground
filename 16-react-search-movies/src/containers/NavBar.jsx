import Logo from "../components/Logo";

export default function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}
