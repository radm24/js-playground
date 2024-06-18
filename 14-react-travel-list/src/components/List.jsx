import { useState } from "react";

import ListItem from "./ListItem";

function List({ items, onToggleItem, onRemoveItem, onClearList }) {
  const [sortBy, setSortBy] = useState("order");

  const sortedItems =
    sortBy === "order"
      ? items
      : [...items].sort((a, b) => {
          if (sortBy === "description") {
            return a.description.localeCompare(b.description);
          }
          if (sortBy === "packed") {
            return (
              b.packed - a.packed || a.description.localeCompare(b.description)
            );
          }
        });

  const itemsList = sortedItems.map((item) => (
    <ListItem
      key={item.id}
      onToggleItem={onToggleItem}
      onRemoveItem={onRemoveItem}
      {...item}
    />
  ));

  return (
    <div className="list">
      <ul>{itemsList}</ul>
      <div className="actions">
        <select name="sort" onChange={(e) => setSortBy(e.target.value)}>
          <option value="order">Sort by input order</option>
          <option value="description">Sort description</option>
          <option value="packed">Sort by packed status</option>
        </select>
        <button onClick={onClearList}>Clear list</button>
      </div>
    </div>
  );
}

export default List;
