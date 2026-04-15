import { NavLink, useLocation } from "react-router-dom";
import { HiHome, HiNewspaper, HiUserGroup } from "react-icons/hi2";
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";
import styles from "./NavBar.module.css";
import clsx from "clsx";
import Logo from "../../assets/Logo";
import Avatar from "../common/Avatar";

export default function NavBar() {
  const { profile } = useAuth();
  const location = useLocation();
  const isProfileActive = location.pathname === "/profile";

  return (
    <nav className={styles.nav}>
      <div className={styles.navInner}>
        {/* Logo */}
        <NavLink to="/lists" className={styles.logo}>
          <Logo size={32} />
          <span className={styles.logoText}>Spark</span>
        </NavLink>

        {/* Nav links */}
        <div className={styles.navLinks}>
          <NavLink
            to="/lists"
            className={({ isActive }) =>
              clsx(styles.navLink, isActive && styles.navLinkActive)
            }
          >
            <HiHome size={22} />
            <span className={styles.navLinkLabel}>Lists</span>
          </NavLink>

          <NavLink
            to="/feed"
            className={({ isActive }) =>
              clsx(styles.navLink, isActive && styles.navLinkActive)
            }
          >
            <HiNewspaper size={22} />
            <span className={styles.navLinkLabel}>Feed</span>
          </NavLink>

          <NavLink
            to="/friends"
            className={({ isActive }) =>
              clsx(styles.navLink, isActive && styles.navLinkActive)
            }
          >
            <HiUserGroup size={22} />
            <span className={styles.navLinkLabel}>Friends</span>
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              clsx(
                styles.mobileProfileTab,
                isActive && styles.mobileProfileTabActive,
              )
            }
          >
            <div className={styles.mobileAvatarWrapper}>
              <Avatar
                avatarPath={profile.avatar_url}
                userId={profile.id}
                alt={profile.username}
                size={22}
              />
            </div>
            <span>Profile</span>
          </NavLink>
        </div>

        {/* Profile dropdown */}
        <div className={styles.navRight}>
          <ProfileDropdown key={profile.avatar_url} />
        </div>
      </div>
    </nav>
  );
}
