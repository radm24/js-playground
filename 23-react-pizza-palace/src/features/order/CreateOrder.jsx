import { Form, redirect, useNavigation, useActionData } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import { createOrder } from "../../services/apiRestaurant";
import { formatCurrency } from "../../utils/helpers";
import { fetchAddress } from "../user/userSlice";
import { getCart, getCartTotalPrice, clearCart } from "../cart/cartSlice";

import Button from "../../ui/Button";
import EmptyCart from "../cart/EmptyCart";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

export const action = async ({ request, dispatch }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true",
  };

  // Validating input data
  const errors = {};
  if (!isValidPhone(order.phone)) {
    errors.phone =
      "Please enter the correct phone number. We might need it to contact you.";
  }
  if (Object.keys(errors).length > 0) return errors;

  const newOrder = await createOrder(order);
  dispatch(clearCart());
  return redirect(`/order/${newOrder.id}`);
};

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const formErrors = useActionData();

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const dispatch = useDispatch();
  const {
    name: username,
    status: addressStatus,
    position,
    address,
    error: errorAddress,
  } = useSelector((state) => state.user);
  const isLoadingPosition = addressStatus === "loading";

  const cart = useSelector(getCart);
  const cartTotalPrice = useSelector(getCartTotalPrice);
  const priorityPrice = withPriority ? Math.round(cartTotalPrice * 0.2) : 0;
  const totalPrice = cartTotalPrice + priorityPrice;

  const handleFetchAddress = (e) => {
    e.preventDefault();

    dispatch(fetchAddress());
  };

  if (cart.length === 0) return <EmptyCart />;

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>

      <Form method="post">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <div className="grow">
            <input
              className="input"
              type="text"
              name="customer"
              defaultValue={username}
              required
            />
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input className="input" type="tel" name="phone" required />
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-500">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              className="input"
              type="text"
              name="address"
              disabled={isLoadingPosition}
              defaultValue={address}
              required
            />
            {addressStatus === "error" && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-500">
                {errorAddress}
              </p>
            )}
          </div>
          {!address && (
            <span className="absolute right-[8px] top-[34.5px] z-50 sm:right-[5px] sm:top-[3px] md:top-[5px]">
              <Button
                type="small"
                onClick={handleFetchAddress}
                disabled={isLoadingPosition}
              >
                Get Position
              </Button>
            </span>
          )}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400
              focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">
            Want to give your order priority?
          </label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input
            type="hidden"
            name="position"
            value={
              position.latitude && position.longitude
                ? `${position.latitude},${position.longitude}`
                : ""
            }
          />
          <Button type="primary" disabled={isSubmitting || isLoadingPosition}>
            {isSubmitting
              ? "Placing order..."
              : `Order now for ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default CreateOrder;
