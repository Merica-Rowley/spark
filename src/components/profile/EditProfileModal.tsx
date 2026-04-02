import { useState } from "react";
import { type Profile } from "../../types";
import Avatar from "../common/Avatar";

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
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasCustomAvatar = !!profile.avatar_url;

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

  return (
    <div>
      <div>
        <h2>Edit Profile</h2>
        <button onClick={onClose}>✕</button>
      </div>

      {/* Current avatar display */}
      <div>
        <label>Profile Picture</label>
        <Avatar
          avatarPath={removeAvatar ? null : profile.avatar_url}
          userId={profile.id}
          alt={profile.username}
          size={80}
        />
        {hasCustomAvatar && !imageFile && (
          <label>
            <input
              type="checkbox"
              checked={removeAvatar}
              onChange={(e) => setRemoveAvatar(e.target.checked)}
            />
            Remove profile picture (restore default)
          </label>
        )}
      </div>

      <div>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />
      </div>

      <div>
        <label>Change profile picture</label>
        <input
          type="file"
          accept="image/*"
          disabled={loading}
          onChange={(e) => {
            setImageFile(e.target.files?.[0] ?? null);
            setRemoveAvatar(false); // cancel remove if new file selected
          }}
        />
      </div>

      {error && <p>{error}</p>}

      <div>
        <button onClick={onClose} disabled={loading}>
          Cancel
        </button>
        <button onClick={handleSave} disabled={loading || !username.trim()}>
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
