import { type Friend } from "../../types";
import FriendCard from "./FriendCard";

type Props = {
  friends: Friend[];
  onRemoveFriend: (friendId: string) => Promise<void>;
};

export default function FriendsList({ friends, onRemoveFriend }: Props) {
  if (friends.length === 0) {
    return (
      <p>You don't have any friends yet. Invite someone to get started!</p>
    );
  }

  return (
    <>
      {friends.map((friend) => (
        <FriendCard
          key={friend.friend_id}
          friend={friend}
          onRemove={onRemoveFriend}
        />
      ))}
    </>
  );
}
