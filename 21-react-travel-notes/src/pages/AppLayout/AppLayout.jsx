import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

import Sidebar from "../../components/Sidebar/Sidebar";
import Map from "../../components/Map/Map";
import User from "../../components/User/User";
import styles from "./AppLayout.module.css";

function AppLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {!isAuthenticated ? (
        <Navigate to="/" replace={true} />
      ) : (
        <div className={styles.app}>
          <Sidebar />
          <Map />
          <User />
        </div>
      )}
    </>
  );
}

export default AppLayout;
