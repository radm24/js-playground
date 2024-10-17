import { configureStore } from "@reduxjs/toolkit";

import customersReducer from "../features/customers/customersSlice";
import accountsReducer from "../features/accounts/accountsSlice";

export const store = configureStore({
  reducer: {
    customers: customersReducer,
    accounts: accountsReducer,
  },
});
