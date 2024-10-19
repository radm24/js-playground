import { Outlet } from "react-router-dom";
import { Suspense } from "react";

import Logo from "../Logo/Logo";
import AppNav from "../AppNav/AppNav";
import Spinner from "../Spinner/Spinner";
import styles from "./Sidebar.module.css";

function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />
      <Suspense fallback={<Spinner />}>
        <Outlet />
      </Suspense>
      <footer className={styles.footer}>
        <p className={styles.copyright}>
          &copy; Copyright 2024 by TravelNotes Inc.
        </p>
      </footer>
    </div>
  );
}

export default Sidebar;
