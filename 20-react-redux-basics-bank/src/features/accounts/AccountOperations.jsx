import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getActiveCustomerId } from "../customers/customersSlice";
import {
  deposit,
  withdraw,
  requestLoan,
  payLoan,
  selectAccountById,
  getLoadingStatus,
} from "./accountsSlice";

function AccountOperations() {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanPurpose, setLoanPurpose] = useState("");
  const [currency, setCurrency] = useState("USD");

  const dispatch = useDispatch();
  const customerId = useSelector(getActiveCustomerId);
  const account = useSelector((state) => selectAccountById(state, customerId));
  const isLoading = useSelector(getLoadingStatus);

  function handleDeposit() {
    if (!depositAmount) return;

    dispatch(deposit({ id: customerId, amount: depositAmount, currency }));
    setDepositAmount("");
    setCurrency("USD");
  }

  function handleWithdrawal() {
    if (!withdrawalAmount) return;

    dispatch(withdraw({ id: customerId, amount: withdrawalAmount }));
    setWithdrawalAmount("");
  }

  function handleRequestLoan() {
    if (!loanAmount || !loanPurpose) return;

    dispatch(requestLoan({ id: customerId, amount: loanAmount, loanPurpose }));
    setLoanAmount("");
    setLoanPurpose("");
  }

  function handlePayLoan() {
    dispatch(payLoan({ id: customerId }));
  }

  return (
    <div>
      <h2>Your account operations</h2>
      <div className="inputs">
        <div>
          <label>Deposit</label>
          <input
            type="number"
            value={depositAmount}
            min="0"
            onChange={(e) => setDepositAmount(+e.target.value)}
          />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="USD">US Dollar</option>
            <option value="EUR">Euro</option>
            <option value="GBP">British Pound</option>
          </select>

          <button onClick={handleDeposit} disabled={isLoading}>
            {isLoading ? "Converting..." : "Deposit"} {depositAmount}
          </button>
        </div>

        <div>
          <label>Withdraw</label>
          <input
            type="number"
            value={withdrawalAmount}
            min="0"
            onChange={(e) => setWithdrawalAmount(+e.target.value)}
          />
          <button
            onClick={handleWithdrawal}
            disabled={
              account.balance < withdrawalAmount || account.balance === 0
            }
          >
            Withdraw {withdrawalAmount}
          </button>
        </div>

        <div>
          <label>Request loan</label>
          <input
            type="number"
            value={loanAmount}
            min="0"
            onChange={(e) => setLoanAmount(+e.target.value)}
            placeholder="Loan amount"
          />
          <input
            value={loanPurpose}
            onChange={(e) => setLoanPurpose(e.target.value)}
            placeholder="Loan purpose"
          />
          <button onClick={handleRequestLoan} disabled={account.loan}>
            Request loan
          </button>
        </div>

        {account.loan > 0 && (
          <div>
            <span>
              Pay back ${account.loan} ({account.loanPurpose})
            </span>
            <button
              onClick={handlePayLoan}
              disabled={
                account.loan === 0 ||
                (account.loan > 0 && account.balance < account.loan)
              }
            >
              Pay loan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountOperations;
