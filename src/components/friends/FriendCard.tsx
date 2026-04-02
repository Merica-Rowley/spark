import { useNavigate } from "react-router-dom";
import { type Friend } from "../../types";
import Avatar from "../common/Avatar";

type Props = {
  friend: Friend;
  onRemove: (friendId: string) => Promise<void>;
};

export default function FriendCard({ friend, onRemove }: Props) {
  const navigate = useNavigate();

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      !confirm(
        `Are you sure you want to remove ${friend.username} as a friend?`,
      )
    )
      return;
    await onRemove(friend.friend_id);
  };

  return (
    <div onClick={() => navigate(`/friends/${friend.friend_id}`)}>
      <Avatar
        avatarPath={friend.avatar_url}
        userId={friend.friend_id}
        alt={friend.username}
      />
      <span>{friend.username}</span>
      <button onClick={handleRemove}>Remove</button>
    </div>
  );
}
