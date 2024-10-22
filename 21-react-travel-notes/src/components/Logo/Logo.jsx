import { Link } from "react-router-dom";
import styles from "./Logo.module.css";
import logo from "/logo.png";

function Logo() {
  return (
    <Link to="/">
      <img src={logo} alt="TravelNotes logo" className={styles.logo} />
    </Link>
  );
}

export default Logo;
