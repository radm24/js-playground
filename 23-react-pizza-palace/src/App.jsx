import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import store from "./store.js";

import AppLayout from "./ui/AppLayout";
import Home from "./ui/Home";
import Menu, { loader as menuLoader } from "./features/menu/Menu";
import Cart from "./features/cart/Cart";
import CreateOrder, {
  action as createOrderAction,
} from "./features/order/CreateOrder";
import Order, { loader as orderLoader } from "./features/order/Order";
import { action as updateOrderAction } from "./features/order/UpdateOrder.jsx";
import Error from "./ui/Error";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        element={<AppLayout />}
        errorElement={<AppLayout outlet={<Error />} />}
      >
        <Route index element={<Home />} />
        <Route
          path="/menu"
          element={<Menu />}
          loader={menuLoader}
          errorElement={<Error />}
        />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/order/new"
          element={<CreateOrder />}
          action={async ({ request }) =>
            createOrderAction({ request, dispatch: store.dispatch })
          }
        />
        <Route
          path="/order/:id"
          element={<Order />}
          loader={orderLoader}
          action={updateOrderAction}
        />
      </Route>
    </>,
  ),
  { basename: import.meta.env.VITE_BASENAME },
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
