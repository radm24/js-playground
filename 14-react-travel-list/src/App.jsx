import { useState } from "react";

import Logo from "./components/Logo";
import Form from "./components/Form";
import List from "./components/List";
import Stats from "./components/Stats";

function App() {
  const [items, setItems] = useState([]);

  const handleAddItem = (newItem) => {
    setItems([...items, newItem]);
  };

  const handleToggleItem = (id) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) return { ...item, packed: !item.packed };
      else return item;
    });
    setItems(updatedItems);
  };

  const handleRemoveItem = (id) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
  };

  const handleClearList = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete all items?"
    );
    if (confirmed) setItems([]);
  };

  return (
    <div className="app">
      <Logo />
      <Form onAddItem={handleAddItem} />
      <List
        items={items}
        onToggleItem={handleToggleItem}
        onRemoveItem={handleRemoveItem}
        onClearList={handleClearList}
      />
      <Stats items={items} />
    </div>
  );
}

export default App;
