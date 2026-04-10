import { HiClipboardDocumentList } from "react-icons/hi2";
import { type ListWithMeta } from "../../types";
import ListCard from "./ListCard";
import styles from "./ListGrid.module.css";
import clsx from "clsx";

type Props = {
  lists: ListWithMeta[];
  onDeleteList: (listId: string, imagePath: string | null) => Promise<void>;
  onToggleStar: (listId: string, currentlyStarred: boolean) => Promise<void>;
  refreshing?: boolean;
};

export default function ListGrid({
  lists,
  onDeleteList,
  onToggleStar,
  refreshing,
}: Props) {
  if (lists.length === 0) {
    return (
      <div className={styles.emptyState}>
        <HiClipboardDocumentList size={48} className={styles.emptyIcon} />
        <p className={styles.emptyTitle}>No lists yet</p>
        <p className={styles.emptyText}>
          Create your first bucket list to get started!
        </p>
      </div>
    );
  }

  return (
    <div className={clsx(styles.container, refreshing && styles.refreshing)}>
      {lists.map((list) => (
        <ListCard
          key={list.id}
          list={list}
          onDeleteList={onDeleteList}
          onToggleStar={onToggleStar}
        />
      ))}
    </div>
  );
}
