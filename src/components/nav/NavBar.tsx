import { NavLink } from "react-router-dom";
import { HiHome, HiNewspaper, HiUserGroup } from "react-icons/hi2";
import ProfileDropdown from "./ProfileDropdown";
import styles from "./NavBar.module.css";
import clsx from "clsx";
import { useAuth } from "../../context/AuthContext";

export default function NavBar() {
  const { profile } = useAuth();

  return (
    <nav className={styles.nav}>
      <div className={styles.navInner}>
        {/* Logo */}
        <NavLink to="/lists" className={styles.logo}>
          {/* Replace src with your logo when ready */}
          <span className={styles.logoText}>Spark ⚡</span>
        </NavLink>

        {/* Nav links */}
        <div className={styles.navLinks}>
          <NavLink
            to="/lists"
            className={({ isActive }) =>
              clsx(styles.navLink, isActive && styles.navLinkActive)
            }
          >
            <HiHome size={20} />
            <span>Lists</span>
          </NavLink>

          <NavLink
            to="/feed"
            className={({ isActive }) =>
              clsx(styles.navLink, isActive && styles.navLinkActive)
            }
          >
            <HiNewspaper size={20} />
            <span>Feed</span>
          </NavLink>

          <NavLink
            to="/friends"
            className={({ isActive }) =>
              clsx(styles.navLink, isActive && styles.navLinkActive)
            }
          >
            <HiUserGroup size={20} />
            <span>Friends</span>
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
