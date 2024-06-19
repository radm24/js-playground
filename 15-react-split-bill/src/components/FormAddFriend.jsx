import { useState } from "react";

import Button from "./Button";

const defaultImageURL = "https://i.pravatar.cc/48";

function FormAddFriend({ onFriendAdd }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState(defaultImageURL);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !image) return;

    const id = window.crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?u=${id}`,
      balance: 0,
    };

    onFriendAdd(newFriend);

    setName("");
    setImage(defaultImageURL);
  };

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label htmlFor="friendName">🧑‍🤝‍🧑 Friend name</label>
      <input
        id="friendName"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <label htmlFor="imageURL">🖼️ Image URL</label>
      <input
        id="imageURL"
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      ></input>
      <Button>Add</Button>
    </form>
  );
}

export default FormAddFriend;
