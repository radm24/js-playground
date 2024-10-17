import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

import { accountOpened } from "../accounts/accountsSlice";

const customersAdapter = createEntityAdapter({
  selectId: (customer) => customer.nationalId,
});

export const createCustomerAccount =
  ({ fullName, nationalId }) =>
  (dispatch) => {
    dispatch(
      customerCreated({
        nationalId,
        fullName,
      })
    );
    dispatch(accountOpened({ id: nationalId }));
    dispatch(setActiveCustomerId(nationalId));
  };

const customersSlice = createSlice({
  name: "customers",
  initialState: customersAdapter.getInitialState({
    activeCustomerId: "",
  }),
  reducers: {
    customerCreated: {
      reducer: customersAdapter.addOne,
      prepare: (payload) => ({
        payload: {
          ...payload,
          createdAt: new Date().toISOString(),
        },
      }),
    },
    setActiveCustomerId(state, action) {
      state.activeCustomerId = action.payload;
    },
  },
});

export const { customerCreated, setActiveCustomerId } = customersSlice.actions;

export default customersSlice.reducer;

export const {
  selectIds: selectCustomersIds,
  selectAll: selectAllCustomers,
  selectById: selectCustomerById,
} = customersAdapter.getSelectors((state) => state.customers);

export const getActiveCustomerId = (state) => state.customers.activeCustomerId;
