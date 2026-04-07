import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { type Profile } from "../../types";
import Avatar from "../common/Avatar";

type Props = {
  profile: Profile;
};

export default function ProfileDropdown({ profile }: Props) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleNavigate = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <button onClick={() => setOpen((prev) => !prev)}>
        <Avatar
          avatarPath={profile.avatar_url}
          userId={profile.id}
          alt={profile.username}
          size={36}
        />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "100%",
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "8px",
            minWidth: "160px",
            zIndex: 100,
          }}
        >
          <div style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>
            <p style={{ margin: 0, fontWeight: "bold" }}>{profile.username}</p>
          </div>
          <button onClick={() => handleNavigate("/profile")}>
            View Profile
          </button>
          <button onClick={() => handleNavigate("/settings")}>Settings</button>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      )}
    </div>
  );
}
