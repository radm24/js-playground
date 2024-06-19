import Friend from "./Friend";

function FriendsList({ friends, selectedFriendId, onSelect }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          key={friend.id}
          {...friend}
          isSelected={friend.id === selectedFriendId}
          onSelect={() => onSelect(friend.id)}
        />
      ))}
    </ul>
  );
}

export default FriendsList;
