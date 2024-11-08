import { useFetcher } from "react-router-dom";

import { updateOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";

export const action = async ({ params }) => {
  const data = { priority: true };
  await updateOrder(params.id, data);
  return null;
};

export default function UpdateOrder() {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="patch" className="text-right">
      <Button type="primary">Make Priority</Button>
    </fetcher.Form>
  );
}
