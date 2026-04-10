import { useState } from "react";
import { HiXMark, HiCamera, HiTrash } from "react-icons/hi2";
import { type Profile } from "../../types";
import Avatar from "../common/Avatar";
import styles from "./EditProfileModal.module.css";
import clsx from "clsx";

type Props = {
  profile: Profile;
  onClose: () => void;
  onSaved: (
    username: string,
    imageFile: File | null,
    removeAvatar: boolean,
  ) => Promise<void>;
};

export default function EditProfileModal({ profile, onClose, onSaved }: Props) {
  const [username, setUsername] = useState(profile.username);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasCustomAvatar = !!profile.avatar_url;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    setRemoveAvatar(false);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleRemoveAvatar = () => {
    setRemoveAvatar(true);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSave = async () => {
    if (!username.trim()) return;
    try {
      setLoading(true);
      setError(null);
      await onSaved(username.trim(), imageFile, removeAvatar);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // determine what avatar to show in the preview
  const previewAvatarPath = removeAvatar
    ? null
    : imagePreview
      ? null // will show imagePreview img instead
      : profile.avatar_url;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Edit Profile</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <HiXMark size={20} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* Avatar */}
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatarRing}>
                <div className={styles.avatarInner}>
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Avatar
                      avatarPath={previewAvatarPath}
                      userId={profile.id}
                      alt={profile.username}
                      size={84}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className={styles.avatarActions}>
              <button
                className={clsx(
                  styles.changeAvatarButton,
                  imageFile && styles.changeAvatarButtonSelected,
                )}
                onClick={() =>
                  document.getElementById("profile-avatar-upload")?.click()
                }
                disabled={loading}
              >
                <HiCamera size={16} />
                {imageFile ? "Photo selected" : "Change Photo"}
              </button>
              <input
                id="profile-avatar-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />

              {hasCustomAvatar && !imageFile && !removeAvatar && (
                <button
                  className={styles.removeAvatarButton}
                  onClick={handleRemoveAvatar}
                  disabled={loading}
                >
                  <HiTrash size={14} />
                  Remove
                </button>
              )}
            </div>

            {removeAvatar && (
              <p className={styles.resetNote}>
                ✓ Profile picture will be reset to default
              </p>
            )}
          </div>

          {/* Username */}
          <div className={styles.formField}>
            <label className={styles.label}>Username</label>
            <input
              className={styles.input}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>

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
            onClick={handleSave}
            disabled={loading || !username.trim()}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
