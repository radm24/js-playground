import { useSelector } from "react-redux";

import { getActiveCustomerId, selectCustomerById } from "./customersSlice";

function Customer() {
  const customerId = useSelector(getActiveCustomerId);
  const customer = useSelector((state) =>
    selectCustomerById(state, customerId)
  );

  return <h2>👋 Welcome, {customer.fullName}</h2>;
}

export default Customer;
