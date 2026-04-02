import { type Friend } from "../../types";
import Avatar from "../common/Avatar";

type Props = {
  availableFriends: Friend[];
  selectedFriends: Friend[];
  onToggleFriend: (friend: Friend) => void;
};

export default function MemberPicker({
  availableFriends,
  selectedFriends,
  onToggleFriend,
}: Props) {
  const isSelected = (friend: Friend) =>
    selectedFriends.some((f) => f.friend_id === friend.friend_id);

  if (availableFriends.length === 0) {
    return <p>No friends available to add.</p>;
  }

  return (
    <div>
      {availableFriends.map((friend) => (
        <div
          key={friend.friend_id}
          onClick={() => onToggleFriend(friend)}
          style={{ cursor: "pointer" }}
        >
          <Avatar
            avatarPath={friend.avatar_url}
            userId={friend.friend_id}
            alt={friend.username}
            size={32}
          />
          <span>{friend.username}</span>
          <input type="checkbox" checked={isSelected(friend)} />
        </div>
      ))}
    </div>
  );
}
