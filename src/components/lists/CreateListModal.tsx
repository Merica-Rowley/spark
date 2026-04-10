import { useState, useEffect } from "react";
import { HiXMark, HiPhoto, HiCheck } from "react-icons/hi2";
import { supabase } from "../../lib/supabaseClient";
import { uploadListImage } from "../../lib/storage";
import { getFriends } from "../../lib/friends";
import { addListMember } from "../../lib/lists";
import { type Friend } from "../../types";
import Avatar from "../common/Avatar";
import styles from "./CreateListModal.module.css";
import clsx from "clsx";

type Props = {
  onClose: () => void;
  onCreated: () => void;
};

export default function CreateListModal({ onClose, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);

  useEffect(() => {
    getFriends().then(setFriends).catch(console.error);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleToggleFriend = (friend: Friend) => {
    setSelectedFriends((prev) =>
      prev.some((f) => f.friend_id === friend.friend_id)
        ? prev.filter((f) => f.friend_id !== friend.friend_id)
        : [...prev, friend],
    );
  };

  const isSelected = (friend: Friend) =>
    selectedFriends.some((f) => f.friend_id === friend.friend_id);

  const handleCreate = async () => {
    if (!title.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const { data: listId, error: createError } = await supabase.rpc(
        "create_list",
        {
          p_title: title.trim(),
          p_is_public: false,
        },
      );

      if (createError) throw createError;

      if (imageFile && listId) {
        const imagePath = await uploadListImage(listId, imageFile);
        const { error: updateError } = await supabase
          .from("lists")
          .update({ image_url: imagePath })
          .eq("id", listId);
        if (updateError) throw updateError;
      }

      await Promise.all(
        selectedFriends.map((friend) =>
          addListMember(listId, friend.friend_id),
        ),
      );

      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create list");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Create New List</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <HiXMark size={20} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* Title */}
          <div className={styles.formField}>
            <label className={styles.label}>Title</label>
            <input
              className={styles.input}
              type="text"
              placeholder="e.g. Summer Adventures"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>

          {/* Image upload */}
          <div className={styles.formField}>
            <label className={styles.label}>Cover Image (optional)</label>
            <div className={styles.imageUpload}>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className={styles.imagePreview}
                />
              )}
              <button
                className={clsx(
                  styles.imageUploadButton,
                  imageFile && styles.imageSelected,
                )}
                onClick={() =>
                  document.getElementById("create-list-image")?.click()
                }
                disabled={loading}
              >
                <HiPhoto size={18} />
                {imageFile ? imageFile.name : "Choose Cover Image"}
              </button>
              <input
                id="create-list-image"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Collaborators */}
          {friends.length > 0 && (
            <div className={styles.formField}>
              <label className={styles.label}>
                Add Collaborators (optional)
              </label>
              <div className={styles.memberList}>
                {friends.map((friend) => (
                  <button
                    key={friend.friend_id}
                    className={clsx(
                      styles.memberOption,
                      isSelected(friend) && styles.memberOptionSelected,
                    )}
                    onClick={() => handleToggleFriend(friend)}
                    disabled={loading}
                  >
                    <Avatar
                      avatarPath={friend.avatar_url}
                      userId={friend.friend_id}
                      alt={friend.username}
                      size={28}
                    />
                    <span className={styles.memberName}>{friend.username}</span>
                    <div
                      className={clsx(
                        styles.memberCheckbox,
                        isSelected(friend) && styles.memberCheckboxChecked,
                      )}
                    >
                      {isSelected(friend) && <HiCheck size={12} />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <p className={styles.error}>{error}</p>}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button
            className="btn btn-ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleCreate}
            disabled={loading || !title.trim()}
          >
            {loading ? "Creating..." : "Create List"}
          </button>
        </div>
      </div>
    </div>
  );
}
