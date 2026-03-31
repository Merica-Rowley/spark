import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { uploadListImage } from "../../lib/storage";

type Props = {
  onClose: () => void;
  onCreated: () => void;
};

export default function CreateListModal({ onClose, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!title.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // create the list first to get the ID
      const { data: listId, error: createError } = await supabase.rpc(
        "create_list",
        {
          p_title: title.trim(),
          p_is_public: false,
        },
      );

      if (createError) throw createError;

      // upload image if one was selected
      if (imageFile && listId) {
        const imagePath = await uploadListImage(listId, imageFile);

        // update the list with the image path
        const { error: updateError } = await supabase
          .from("lists")
          .update({ image_url: imagePath })
          .eq("id", listId);

        if (updateError) throw updateError;
      }

      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create list");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h2>Create New List</h2>
        <button onClick={onClose}>✕</button>
      </div>

      <input
        type="text"
        placeholder="List title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div>
        <label>Cover image (optional)</label>
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
        <button onClick={handleCreate} disabled={loading || !title.trim()}>
          {loading ? "Creating..." : "Create List"}
        </button>
      </div>
    </div>
  );
}
