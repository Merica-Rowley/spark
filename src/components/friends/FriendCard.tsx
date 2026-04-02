import { type Friend } from "../../types";

type Props = {
  friend: Friend;
  onRemove: (friendId: string) => Promise<void>;
};

export default function FriendCard({ friend, onRemove }: Props) {
  const handleRemove = async () => {
    if (
      !confirm(
        `Are you sure you want to remove ${friend.username} as a friend?`,
      )
    )
      return;
    await onRemove(friend.friend_id);
  };

  return (
    <div>
      <span>{friend.username}</span>
      <button onClick={handleRemove}>Remove</button>
    </div>
  );
}
