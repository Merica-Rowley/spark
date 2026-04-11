import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiStar,
  HiOutlineStar,
  HiEllipsisHorizontal,
  HiTrash,
  HiCheckCircle,
  HiMiniRocketLaunch,
} from "react-icons/hi2";
import { type ListWithMeta } from "../../types";
import AppImage from "../common/AppImage";
import { useConfirm } from "../../hooks/useConfirm";
import ConfirmModal from "../common/ConfirmModal";
import styles from "./ListCard.module.css";
import clsx from "clsx";

type Props = {
  list: ListWithMeta;
  onDeleteList: (listId: string, imagePath: string | null) => Promise<void>;
  onToggleStar: (listId: string, currentlyStarred: boolean) => Promise<void>;
};

export default function ListCard({ list, onDeleteList, onToggleStar }: Props) {
  const navigate = useNavigate();
  const [starring, setStarring] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { confirm, options, handleConfirm, handleCancel } = useConfirm();

  const progressPercent =
    list.total_items > 0
      ? Math.round((list.completed_items / list.total_items) * 100)
      : 0;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCardClick = () => {
    if (!menuOpen) navigate(`/lists/${list.id}`);
  };

  const handleStar = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setStarring(true);
      await onToggleStar(list.id, list.is_starred);
    } finally {
      setStarring(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = await confirm({
      title: "Delete List",
      message: "Are you sure you want to delete this list?",
      confirmLabel: "Delete",
      variant: "danger",
    });
    if (!confirmed) return;
    await onDeleteList(list.id, list.image_url);
  };

  return (
    <>
      <div
        className={clsx(styles.card, list.is_starred && styles.cardStarred)}
        onClick={handleCardClick}
      >
        {/* Thumbnail */}
        <AppImage
          imagePath={list.image_url}
          alt={list.title}
          className={styles.thumbnail}
        />

        {/* Content */}
        <div className={styles.content}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
            }}
          >
            <p className={styles.title}>{list.title}</p>
            {list.role === "owner" && (
              <span className={styles.ownerBadge}>
                <HiMiniRocketLaunch size={10} />
                Owner
              </span>
            )}
          </div>
          <div className={styles.meta}>
            <span className={styles.itemCount}>
              <HiCheckCircle size={12} />
              {list.completed_items}/{list.total_items} items
            </span>
            {list.total_items > 0 && (
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
          <button
            className={clsx(
              styles.starButton,
              list.is_starred && styles.starButtonActive,
            )}
            onClick={handleStar}
            disabled={starring}
            title={list.is_starred ? "Unstar" : "Star"}
          >
            {list.is_starred ? (
              <HiStar size={18} />
            ) : (
              <HiOutlineStar size={18} />
            )}
          </button>

          {list.role === "owner" && (
            <div ref={menuRef} style={{ position: "relative" }}>
              <button
                className={styles.menuButton}
                onClick={() => setMenuOpen((prev) => !prev)}
                title="More options"
              >
                <HiEllipsisHorizontal size={18} />
              </button>

              {menuOpen && (
                <div className={styles.menuDropdown}>
                  <button
                    className={clsx(styles.menuItem, styles.menuItemDanger)}
                    onClick={handleDelete}
                  >
                    <HiTrash size={16} />
                    Delete List
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
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
