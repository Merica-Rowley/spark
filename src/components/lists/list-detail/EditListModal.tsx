import { useState } from "react";
import { HiXMark, HiPhoto, HiTrash } from "react-icons/hi2";
import { type List } from "../../../types";
import AppImage from "../../common/AppImage";
import styles from "./EditListModal.module.css";
import clsx from "clsx";
import { prepareImageForPreview } from "../../../lib/storage";

type Props = {
  list: List;
  onClose: () => void;
  onSaved: (
    title: string,
    imageFile: File | null,
    resetImage: boolean,
  ) => Promise<void>;
};

export default function EditListModal({ list, onClose, onSaved }: Props) {
  const [title, setTitle] = useState(list.title);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [resetImage, setResetImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageProcessing, setImageProcessing] = useState(false);

  const isDefaultImage = list.image_url === "defaults/default-list-cover.svg";

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    try {
      setImageProcessing(true);
      const { previewUrl, convertedFile } = await prepareImageForPreview(file);
      setImageFile(convertedFile);
      setImagePreview(previewUrl);
      setResetImage(false); // only needed in EditProfileModal and EditListModal
    } catch (err) {
      setError("Failed to process image. Please try a different file.");
    } finally {
      setImageProcessing(false);
    }
  };

  const handleRemoveImage = () => {
    setResetImage(true);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSave = async () => {
    if (!title.trim()) return;
    try {
      setLoading(true);
      setError(null);
      await onSaved(title.trim(), imageFile, resetImage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update list");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Edit List</h2>
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>

          {/* Image */}
          <div className={styles.formField}>
            <label className={styles.label}>Cover Image</label>

            {/* Show preview of new image if selected */}
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="New cover"
                  className={styles.imagePreview}
                />
                <p className={styles.newImageLabel}>✓ New image selected</p>
              </>
            ) : resetImage ? (
              <p className={styles.newImageLabel}>
                ✓ Image will be reset to default
              </p>
            ) : (
              <AppImage
                imagePath={list.image_url}
                alt={list.title}
                className={styles.currentImage}
              />
            )}

            <div className={styles.imageActions}>
              <button
                className={clsx(
                  styles.imageUploadButton,
                  imageFile && styles.imageSelected,
                )}
                onClick={() =>
                  document.getElementById("edit-list-image")?.click()
                }
                disabled={loading || imageProcessing}
              >
                {imageProcessing ? (
                  <>
                    <div
                      className="spinner"
                      style={{ width: 16, height: 16, borderWidth: 2 }}
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    <HiPhoto size={18} />
                    {imageFile ? imageFile.name : "Change Image"}
                  </>
                )}
              </button>
              <input
                id="edit-list-image"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />

              {!isDefaultImage && !imageFile && !resetImage && (
                <button
                  className={styles.removeImageButton}
                  onClick={handleRemoveImage}
                  disabled={loading}
                >
                  <HiTrash size={14} />
                  Remove
                </button>
              )}
            </div>
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
            disabled={loading || !title.trim()}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
