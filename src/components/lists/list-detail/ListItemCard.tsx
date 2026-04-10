import { useState } from "react";
import { HiCheck, HiTrash, HiPhoto } from "react-icons/hi2";
import { type ListItem } from "../../../types";
import { useConfirm } from "../../../hooks/useConfirm";
import ConfirmModal from "../../common/ConfirmModal";
import styles from "./ListItemCard.module.css";
import clsx from "clsx";

type Props = {
  item: ListItem;
  onDelete: (itemId: string) => Promise<void>;
  onItemCheck: (item: ListItem) => Promise<void>;
  onCompletedItemClick: (item: ListItem) => void;
};

export default function ListItemCard({
  item,
  onDelete,
  onItemCheck,
  onCompletedItemClick,
}: Props) {
  const [loading, setLoading] = useState(false);
  const { confirm, options, handleConfirm, handleCancel } = useConfirm();

  const handleCheck = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.is_completed) return;
    try {
      setLoading(true);
      await onItemCheck(item);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (item.is_completed) onCompletedItemClick(item);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = await confirm({
      title: "Delete Item",
      message: "Are you sure you want to delete this item?",
      confirmLabel: "Delete",
      variant: "danger",
    });
    if (!confirmed) return;
    await onDelete(item.id);
  };

  return (
    <>
      <div
        className={clsx(styles.card, item.is_completed && styles.cardCompleted)}
        onClick={handleClick}
      >
        <button
          className={clsx(
            styles.checkbox,
            item.is_completed && styles.checkboxChecked,
          )}
          onClick={handleCheck}
          disabled={loading || item.is_completed}
        >
          {item.is_completed && <HiCheck size={14} />}
        </button>

        <div className={styles.content}>
          <p
            className={clsx(
              styles.text,
              item.is_completed && styles.textCompleted,
            )}
          >
            {item.content}
          </p>
        </div>

        {item.is_completed && item.post_id && (
          <div className={styles.postIndicator}>
            <HiPhoto size={14} />
            Post
          </div>
        )}

        <button className={styles.deleteButton} onClick={handleDelete}>
          <HiTrash size={16} />
        </button>
      </div>

      {options && (
        <ConfirmModal
          {...options}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
