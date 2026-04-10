import { useState } from "react";
import {
  HiXMark,
  HiPhoto,
  HiCheckCircle,
  HiCheck,
  HiTrash,
} from "react-icons/hi2";
import { type ListItem, type ListMemberWithProfile } from "../../../types";
import Avatar from "../../common/Avatar";
import styles from "./CreatePostModal.module.css";
import clsx from "clsx";

type Props = {
  item: ListItem;
  listMembers: ListMemberWithProfile[];
  currentUserId: string;
  onClose: () => void;
  onPostCreated: () => void;
  onSkip: () => void;
  onCreatePost: (
    content: string | null,
    imageFile: File | null,
    participantIds: string[],
  ) => Promise<void>;
};

export default function CreatePostModal({
  item,
  listMembers,
  currentUserId,
  onClose,
  onPostCreated,
  onSkip,
  onCreatePost,
}: Props) {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MAX_CHARS = 300;
  const eligibleMembers = listMembers.filter(
    (m) => m.user_id !== currentUserId,
  );

  const handleToggleParticipant = (userId: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      setError(null);
      await onCreatePost(
        content.trim() || null,
        imageFile,
        selectedParticipants,
      );
      onPostCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const charCountClass =
    content.length >= MAX_CHARS
      ? styles.charCountLimit
      : content.length >= MAX_CHARS * 0.8
        ? styles.charCountWarning
        : "";

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h2 className={styles.title}>🎉 Item Completed!</h2>
            <p className={styles.subtitle}>
              Share this achievement with your friends
            </p>
            <span className={styles.itemBadge}>
              <HiCheckCircle size={12} />
              {item.content}
            </span>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <HiXMark size={20} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* Caption */}
          <div className={styles.formField}>
            <label className={styles.label}>Caption (optional)</label>
            <textarea
              className={styles.textarea}
              placeholder="Write something about this accomplishment..."
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, MAX_CHARS))}
              disabled={loading}
            />
            <p className={clsx(styles.charCount, charCountClass)}>
              {content.length}/{MAX_CHARS}
            </p>
          </div>

          {/* Image */}
          <div className={styles.formField}>
            <label className={styles.label}>Photo (optional)</label>
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className={styles.imagePreview}
                />
                <button
                  className={styles.removeImageButton}
                  onClick={handleRemoveImage}
                >
                  <HiTrash size={14} />
                  Remove Photo
                </button>
              </>
            ) : (
              <button
                className={styles.imageUploadButton}
                onClick={() => document.getElementById("post-image")?.click()}
                disabled={loading}
              >
                <HiPhoto size={18} />
                Add a photo
              </button>
            )}
            <input
              id="post-image"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </div>

          {/* Tag collaborators */}
          {eligibleMembers.length > 0 && (
            <div className={styles.formField}>
              <label className={styles.label}>
                Tag Collaborators (optional)
              </label>
              <div className={styles.participantList}>
                {eligibleMembers.map((member) => (
                  <button
                    key={member.user_id}
                    className={clsx(
                      styles.participantOption,
                      selectedParticipants.includes(member.user_id) &&
                        styles.participantOptionSelected,
                    )}
                    onClick={() => handleToggleParticipant(member.user_id)}
                    disabled={loading}
                  >
                    <Avatar
                      avatarPath={member.avatar_url ?? null}
                      userId={member.user_id}
                      alt={member.username}
                      size={28}
                    />
                    <span className={styles.participantName}>
                      {member.username}
                    </span>
                    <div
                      className={clsx(
                        styles.checkbox,
                        selectedParticipants.includes(member.user_id) &&
                          styles.checkboxChecked,
                      )}
                    >
                      {selectedParticipants.includes(member.user_id) && (
                        <HiCheck size={12} />
                      )}
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
          <button className="btn btn-ghost" onClick={onSkip} disabled={loading}>
            Skip for now
          </button>
          <div className={styles.footerActions}>
            <button
              className="btn btn-primary"
              onClick={handleCreate}
              disabled={loading}
            >
              {loading ? "Posting..." : "Create Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
