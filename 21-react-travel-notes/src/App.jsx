import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Suspense, lazy } from "react";

import { AuthProvider } from "./contexts/AuthContext";
import { CitiesProvider } from "./contexts/CitiesContext";

import Homepage from "./pages/Homepage/Homepage";
import PageLayout from "./pages/PageLayout/PageLayout";
import SpinnerFullPage from "./components/SpinnerFullPage/SpinnerFullPage";

const AppLayout = lazy(() => import("./pages/AppLayout/AppLayout"));
const Login = lazy(() => import("./pages/Login/Login"));
const Pricing = lazy(() => import("./pages/Pricing/Pricing"));
const Product = lazy(() => import("./pages/Product/Product"));
const PageNotFound = lazy(() => import("./pages/PageLayout/PageLayout"));
const CityList = lazy(() => import("./components/CityList/CityList"));
const CountryList = lazy(() => import("./components/CountryList/CountryList"));
const City = lazy(() => import("./components/City/City"));
const Form = lazy(() => import("./components/Form/Form"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<PageLayout />}>
        <Route index element={<Homepage />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/product" element={<Product />} />
        <Route path="/login" element={<Login />} />
      </Route>
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Navigate replace to="cities" />} />
        <Route path="cities" element={<CityList />} />
        <Route path="cities/:id" element={<City />} />
        <Route path="countries" element={<CountryList />} />
        <Route path="form" element={<Form />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </>
  ),
  {
    basename: import.meta.env.VITE_BASENAME,
  }
);

function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <Suspense fallback={<SpinnerFullPage />}>
          <RouterProvider router={router} />
        </Suspense>
      </CitiesProvider>
    </AuthProvider>
  );
}

export default App;
