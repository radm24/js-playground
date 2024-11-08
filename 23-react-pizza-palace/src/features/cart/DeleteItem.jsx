import { useDispatch } from "react-redux";

import { deleteItem } from "./cartSlice";
import Button from "../../ui/Button";

export default function DeleteItem({ itemId }) {
  const dispatch = useDispatch();

  return (
    <Button type="small" onClick={() => dispatch(deleteItem(itemId))}>
      Delete
    </Button>
  );
}
