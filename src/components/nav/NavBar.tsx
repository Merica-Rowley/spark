import { NavLink } from "react-router-dom";
import { HiHome, HiNewspaper, HiUserGroup } from "react-icons/hi2";
import { type Profile } from "../../types";
import ProfileDropdown from "./ProfileDropdown";

type Props = {
  profile: Profile;
};

export default function NavBar({ profile }: Props) {
  const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    fontWeight: isActive ? "bold" : "normal",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  });

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        height: "56px",
        borderBottom: "1px solid #eee",
      }}
    >
      {/* App name / logo */}
      <NavLink
        to="/lists"
        style={{
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: "1.2rem",
        }}
      >
        Spark ⚡
      </NavLink>

      {/* Main nav links */}
      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        <NavLink to="/lists" style={navLinkStyle}>
          <HiHome size={20} />
          Lists
        </NavLink>
        <NavLink to="/feed" style={navLinkStyle}>
          <HiNewspaper size={20} />
          Feed
        </NavLink>
        <NavLink to="/friends" style={navLinkStyle}>
          <HiUserGroup size={20} />
          Friends
        </NavLink>
      </div>

      {/* Profile dropdown */}
      <ProfileDropdown profile={profile} />
    </nav>
  );
}
