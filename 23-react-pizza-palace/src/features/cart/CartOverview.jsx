import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { formatCurrency } from "../../utils/helpers";
import { getCartTotalQuantity, getCartTotalPrice } from "./cartSlice";

function CartOverview() {
  const cartTotalQuantity = useSelector(getCartTotalQuantity);
  const cartTotalPrice = useSelector(getCartTotalPrice);

  if (cartTotalQuantity === 0) return null;

  return (
    <div
      className="flex items-center justify-between bg-stone-800 p-4 text-sm uppercase
        text-stone-200 sm:px-6 md:text-base"
    >
      <p className="space-x-4 font-semibold text-stone-300 sm:space-x-6">
        <span>{cartTotalQuantity} pizzas</span>
        <span>{formatCurrency(cartTotalPrice)}</span>
      </p>
      <Link to="/cart">Open cart</Link>
    </div>
  );
}

export default CartOverview;
