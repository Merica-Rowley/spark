import { useState } from "react";
import { type List } from "../../../types";
import AppImage from "../../common/AppImage";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetImage, setResetImage] = useState(false);

  const isDefaultImage = list.image_url === "defaults/default-list-cover.svg";

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
    <div>
      <div>
        <h2>Edit List</h2>
        <button onClick={onClose}>✕</button>
      </div>

      <div>
        <label>Current image</label>
        <AppImage imagePath={list.image_url} alt={list.title} />
        {!isDefaultImage && !imageFile && (
          <label>
            <input
              type="checkbox"
              checked={resetImage}
              onChange={(e) => setResetImage(e.target.checked)}
            />
            Remove image (restore default)
          </label>
        )}
      </div>

      <div>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
      </div>

      <div>
        <label>Change image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
        />
      </div>

      {error && <p>{error}</p>}

      <div>
        <button onClick={onClose} disabled={loading}>
          Cancel
        </button>
        <button onClick={handleSave} disabled={loading || !title.trim()}>
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
