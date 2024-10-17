import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";

const accountsAdapter = createEntityAdapter();

export const deposit = createAsyncThunk(
  "accounts/deposit",
  async ({ id, amount, currency }) => {
    if (currency === "USD") return { id, amount };

    const to = "USD";
    const response = await fetch(
      `https://api.frankfurter.app/latest?base=${currency}&symbols=${to}`
    );
    const data = await response.json();
    return { id, amount, data };
  }
);

const accountsSlice = createSlice({
  name: "accounts",
  initialState: accountsAdapter.getInitialState({
    isLoading: false,
  }),
  reducers: {
    accountOpened: {
      reducer: accountsAdapter.addOne,
      prepare: ({ id }) => ({
        payload: {
          id,
          balance: 0,
          loan: 0,
          loanPurpose: "",
        },
      }),
    },
    withdraw(state, action) {
      const { id, amount } = action.payload;
      const account = state.entities[id];
      if (account.balance >= amount) {
        account.balance -= amount;
      }
    },
    requestLoan(state, action) {
      const { id, amount, loanPurpose } = action.payload;
      const account = state.entities[id];
      if (account.loan === 0) {
        account.balance += amount;
        account.loan += amount;
        account.loanPurpose = loanPurpose;
      }
    },
    payLoan(state, action) {
      const { id } = action.payload;
      const account = state.entities[id];
      if (account.balance >= account.loan) {
        account.balance -= account.loan;
        account.loan = 0;
        account.loanPurpose = "";
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(deposit.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deposit.fulfilled, (state, action) => {
      const { id, amount, data } = action.payload;
      let depositAmount = amount;
      if (data) depositAmount = amount * data.rates["USD"];
      state.entities[id].balance += depositAmount;
      state.isLoading = false;
    });
    builder.addCase(deposit.rejected, (state, action) => {
      state.isLoading = false;
      console.log(action.error.message);
      alert("Unable to convert to USD!\nPlease try again later.");
    });
  },
});

export const { accountOpened, withdraw, requestLoan, payLoan } =
  accountsSlice.actions;

export default accountsSlice.reducer;

export const { selectById: selectAccountById } = accountsAdapter.getSelectors(
  (state) => state.accounts
);

export const getLoadingStatus = (state) => state.accounts.isLoading;
