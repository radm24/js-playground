import { useState } from "react";

import Button from "./Button";

function FormSplitBill({ friend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [userExpense, setUserExpense] = useState("");
  const [whoPay, setWhoPay] = useState("user");

  const handleUserExpenseChange = (e) => {
    if (+e.target.value <= bill) setUserExpense(+e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!bill || !userExpense || bill < userExpense) return;

    const newBalance =
      whoPay === "user"
        ? friend.balance + friendExpense
        : friend.balance - userExpense;

    const updatedFriendEntry = {
      ...friend,
      balance: newBalance,
    };

    onSplitBill(updatedFriendEntry);

    setBill("");
    setUserExpense("");
    setWhoPay("user");
  };

  const friendExpense = bill ? bill - userExpense : "";

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {friend.name}</h2>

      <label htmlFor="bill">💰 Bill value</label>
      <input
        id="bill"
        type="number"
        min="0"
        value={bill}
        onChange={(e) => setBill(+e.target.value)}
      />
      <label htmlFor="userExpense">🧍 Your expense</label>
      <input
        id="userExpense"
        type="number"
        min="0"
        value={userExpense}
        onChange={handleUserExpenseChange}
      />

      <label>🧑‍🤝‍🧑 {friend.name}'s expense</label>
      <input type="number" min="0" value={friendExpense} disabled />

      <label htmlFor="whoPay">🤑 Who is paying the bill?</label>
      <select
        id="whoPay"
        value={whoPay}
        onChange={(e) => setWhoPay(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{friend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}

export default FormSplitBill;
