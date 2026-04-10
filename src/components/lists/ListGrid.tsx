import { type ListWithMeta } from "../../types";
import ListCard from "./ListCard";

type Props = {
  lists: ListWithMeta[];
  onDeleteList: (listId: string, imagePath: string | null) => Promise<void>;
  onToggleStar: (listId: string, currentlyStarred: boolean) => Promise<void>;
  refreshing?: boolean;
};

export default function ListGrid({ lists, onDeleteList, onToggleStar }: Props) {
  return (
    <div>
      {lists.length === 0 ? (
        <p>You don't have any lists yet. Create one to get started!</p>
      ) : (
        lists.map((list) => (
          <ListCard
            key={list.id}
            list={list}
            onDeleteList={onDeleteList}
            onToggleStar={onToggleStar}
          />
        ))
      )}
    </div>
  );
}
