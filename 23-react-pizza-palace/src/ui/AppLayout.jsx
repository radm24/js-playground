import { Outlet, useNavigation } from "react-router-dom";

import Loader from "./Loader";
import Header from "./Header";
import CartOverview from "../features/cart/CartOverview";

function AppLayout({ outlet }) {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <div className="grid h-dvh grid-rows-[auto_1fr_auto]">
      {isLoading && <Loader />}

      <Header />

      <div className="overflow-auto">
        <main className="mx-auto max-w-3xl">
          {outlet ? outlet : <Outlet />}
        </main>
      </div>

      <CartOverview />
    </div>
  );
}

export default AppLayout;
