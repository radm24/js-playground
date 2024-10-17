import { useSelector, useDispatch } from "react-redux";

import { selectAllCustomers } from "./features/customers/customersSlice";
import {
  getActiveCustomerId,
  setActiveCustomerId,
} from "./features/customers/customersSlice";

import CreateCustomer from "./features/customers/CreateCustomer";
import Customer from "./features/customers/Customer";
import AccountOperations from "./features/accounts/AccountOperations";
import BalanceDisplay from "./features/accounts/BalanceDisplay";

function App() {
  const dispatch = useDispatch();
  const customers = useSelector(selectAllCustomers);
  const customerId = useSelector(getActiveCustomerId);

  return (
    <div>
      <h1>⚛️ The React-Redux Bank 💸</h1>
      {!customerId && <CreateCustomer />}

      <label htmlFor="customer">Choose a customer</label>
      <select
        id="customer"
        value={customerId}
        onChange={(e) => dispatch(setActiveCustomerId(e.target.value))}
      >
        <option value=""></option>
        {customers.map(({ nationalId, fullName }) => (
          <option key={nationalId} value={nationalId}>
            {fullName}
          </option>
        ))}
      </select>

      {customerId && (
        <>
          <Customer />
          <AccountOperations />
          <BalanceDisplay />
        </>
      )}
    </div>
  );
}

export default App;
