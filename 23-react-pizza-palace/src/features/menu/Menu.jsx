import { useLoaderData } from "react-router-dom";

import { getMenu } from "../../services/apiRestaurant";
import MenuItem from "./MenuItem";

export const loader = async () => getMenu();

function Menu() {
  const menu = useLoaderData();

  return (
    <ul className="divide-y divide-slate-200 px-2">
      {menu.map((item) => (
        <MenuItem key={item.id} pizza={item} />
      ))}
    </ul>
  );
}

export default Menu;
