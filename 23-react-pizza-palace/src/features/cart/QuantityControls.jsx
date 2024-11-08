import { useDispatch } from "react-redux";

import { incrementItemQuantity, decrementItemQuantity } from "./cartSlice";

import Button from "../../ui/Button";

function QuantityControls({ itemId, quantity }) {
  const dispatch = useDispatch();

  return (
    <div className="flex items-center gap-2 md:gap-3">
      <Button
        type="round"
        onClick={() => dispatch(decrementItemQuantity(itemId))}
      >
        -
      </Button>
      <span className="text-sm font-medium">{quantity}</span>
      <Button
        type="round"
        onClick={() => dispatch(incrementItemQuantity(itemId))}
      >
        +
      </Button>
    </div>
  );
}

export default QuantityControls;
