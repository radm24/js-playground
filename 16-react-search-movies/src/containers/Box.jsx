import { useState } from "react";

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((s) => !s)}>
        {isOpen ? "-" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

export default Box;
