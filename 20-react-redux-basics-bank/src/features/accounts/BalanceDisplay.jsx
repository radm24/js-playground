import { useSelector } from "react-redux";

import { getActiveCustomerId } from "../customers/customersSlice";
import { selectAccountById } from "./accountsSlice";

function formatCurrency(value) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function BalanceDisplay() {
  const customerId = useSelector(getActiveCustomerId);
  const account = useSelector((state) => selectAccountById(state, customerId));

  return <div className="balance">{formatCurrency(account.balance)}</div>;
}

export default BalanceDisplay;
