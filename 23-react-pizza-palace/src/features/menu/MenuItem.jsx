import { useSelector, useDispatch } from "react-redux";

import { getQuantityByItemId } from "../cart/cartSlice";
import { addItem } from "../cart/cartSlice";
import { formatCurrency } from "../../utils/helpers";

import QuantityControls from "../cart/QuantityControls";
import Button from "../../ui/Button";
import DeleteItem from "../cart/DeleteItem";

function MenuItem({ pizza }) {
  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;
  const dispatch = useDispatch();

  const quantity = useSelector((state) => getQuantityByItemId(state, id));
  const isInCart = quantity > 0;

  const handleAddItem = () => {
    const newItem = {
      pizzaId: id,
      name,
      quantity: 1,
      unitPrice,
      totalPrice: unitPrice,
    };

    dispatch(addItem(newItem));
  };

  return (
    <li className="flex gap-4 py-2">
      <img
        src={imageUrl}
        alt={name}
        className={`h-24 ${soldOut ? "opacity-70 grayscale" : ""}`}
      />

      <div className="flex grow flex-col pt-0.5">
        <p className="font-medium">{name}</p>
        <p className="text-sm capitalize italic text-stone-500">
          {ingredients.join(", ")}
        </p>
        <div className="mt-auto flex items-center justify-between">
          {!soldOut ? (
            <p className="text-sm">{formatCurrency(unitPrice)}</p>
          ) : (
            <p className="text-sm font-medium uppercase text-stone-500">
              Sold out
            </p>
          )}

          {!soldOut && (
            <>
              {isInCart ? (
                <div className="flex items-center gap-3 sm:gap-8">
                  <QuantityControls itemId={id} quantity={quantity} />
                  <DeleteItem itemId={id} />
                </div>
              ) : (
                <Button type="small" onClick={handleAddItem}>
                  Add to cart
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </li>
  );
}

export default MenuItem;