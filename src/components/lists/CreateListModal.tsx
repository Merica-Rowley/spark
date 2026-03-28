import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type Props = {
  onClose: () => void;
  onCreated: () => void;
};

export default function CreateListModal({ onClose, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!title.trim()) return;

    setLoading(true);
    setError(null);

    const { error } = await supabase.rpc("create_list", {
      p_title: title.trim(),
      p_is_public: false,
      p_image_url: null,
    });

    if (error) {
      setError(error.message);
    } else {
      onCreated();
    }

    setLoading(false);
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
