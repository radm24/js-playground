function Stats({ items }) {
  if (!items.length)
    return (
      <footer className="stats">
        <em>Start adding some items to your packing list 🚀</em>
      </footer>
    );

  const numItems = items.length;
  const packedItems = items.filter((item) => item.packed);
  const packedItemsPercent = Math.round((packedItems.length / numItems) * 100);

  return (
    <footer className="stats">
      <em>
        {packedItemsPercent !== 100
          ? `💼 You have ${numItems} items in your list, and you already packed ${packedItems.length} (${packedItemsPercent}%)`
          : "You got everything! Ready to go ✈️"}
      </em>
    </footer>
  );
}

export default Stats;
