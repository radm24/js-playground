import { useState } from "react";

import FriendsList from "./components/FriendsList";
import FormAddFriend from "./components/FormAddFriend";
import FormSplitBill from "./components/FormSplitBill";
import Button from "./components/Button";

const initialFriends = [
  {
    id: 118836,
    name: "Mike",
    image: "https://i.pravatar.cc/48?u=60",
    balance: -7,
  },
  {
    id: 933372,
    name: "Jane",
    image: "https://i.pravatar.cc/48?u=31",
    balance: 20,
  },
  {
    id: 499476,
    name: "Arnold",
    image: "https://i.pravatar.cc/48?u=67",
    balance: 0,
  },
];

function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [showAddFriendForm, setShowAddFriendForm] = useState(false);

  const handleFriendSelect = (id) => {
    setSelectedFriendId((s) => (s !== id ? id : null));
    if (showAddFriendForm) setShowAddFriendForm(false);
  };

  const handleFriendAdd = (newFriend) => {
    setFriends([...friends, newFriend]);
    setShowAddFriendForm(false);
  };

  const handleSplitBill = (updatedFriendEntry) => {
    const updatedFriends = friends.map((friend) => {
      if (friend.id === updatedFriendEntry.id) return updatedFriendEntry;
      return friend;
    });
    setFriends(updatedFriends);
    setSelectedFriendId(null);
  };

  const selectedFriend = friends.find(
    (friend) => friend.id === selectedFriendId
  );

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectedFriendId={selectedFriendId}
          onSelect={handleFriendSelect}
        />
        {showAddFriendForm && <FormAddFriend onFriendAdd={handleFriendAdd} />}
        {!selectedFriendId && (
          <Button onClick={() => setShowAddFriendForm((s) => !s)}>
            {showAddFriendForm ? "Close" : "Add friend"}
          </Button>
        )}
      </div>
      {selectedFriendId && (
        <FormSplitBill
          key={selectedFriendId}
          friend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

export default App;
