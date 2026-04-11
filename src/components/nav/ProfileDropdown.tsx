import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiUser, HiCog6Tooth, HiArrowRightOnRectangle } from "react-icons/hi2";
import { supabase } from "../../lib/supabaseClient";
import Avatar from "../common/Avatar";
import styles from "./ProfileDropdown.module.css";
import clsx from "clsx";
import { useAuth } from "../../context/AuthContext";

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { profile } = useAuth();

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
    <div ref={dropdownRef} className={styles.container}>
      <button
        className={clsx(styles.trigger, open && styles.triggerOpen)}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Avatar
          key={profile.avatar_url} // forces remount when avatar changes
          avatarPath={profile.avatar_url}
          userId={profile.id}
          alt={profile.username}
          size={36}
        />
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.userInfo}>
            <p className={styles.username}>{profile.username}</p>
          </div>

          <button
            className={styles.menuItem}
            onClick={() => handleNavigate("/profile")}
          >
            <HiUser size={18} />
            View Profile
          </button>

          <button
            className={styles.menuItem}
            onClick={() => handleNavigate("/settings")}
          >
            <HiCog6Tooth size={18} />
            Settings
          </button>

          <div className={styles.menuDivider} />

          <button
            className={clsx(styles.menuItem, styles.menuItemDanger)}
            onClick={handleSignOut}
          >
            <HiArrowRightOnRectangle size={18} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
