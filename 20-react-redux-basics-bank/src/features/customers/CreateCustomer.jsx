import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { createCustomerAccount, selectCustomersIds } from "./customersSlice";

function Customer() {
  const [fullName, setFullName] = useState("");
  const [nationalId, setNationalId] = useState("");

  const dispatch = useDispatch();
  const customersIds = useSelector(selectCustomersIds);

  function handleClick() {
    if (!fullName || !nationalId) return;

    if (customersIds.find((id) => id === nationalId)) {
      alert("Wrong National ID");
      return;
    }

    dispatch(createCustomerAccount({ fullName, nationalId }));
    setFullName("");
    setNationalId("");
  }

  return (
    <div>
      <h2>Create new customer</h2>
      <div className="inputs">
        <div>
          <label>Customer full name</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div>
          <label>National ID</label>
          <input
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
          />
        </div>
        <button onClick={handleClick}>Create new customer</button>
      </div>
    </div>
  );
}

export default Customer;
