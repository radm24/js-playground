import PageNav from "../../components/PageNav/PageNav";
import styles from "./PageNotFound.module.css";

export default function PageNotFound() {
  return (
    <div className={styles.page}>
      <PageNav />
      <main>
        <h1>Page not found 😢</h1>
      </main>
    </div>
  );
}
