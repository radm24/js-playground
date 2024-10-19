import { Outlet } from "react-router-dom";
import PageNav from "../../components/PageNav/PageNav";
import styles from "./PageLayout.module.css";

function PageLayout() {
  return (
    <div className={styles.page}>
      <PageNav />
      <Outlet />
    </div>
  );
}

export default PageLayout;
