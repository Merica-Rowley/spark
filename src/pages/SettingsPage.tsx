import {
  HiMoon,
  HiSun,
  HiLockClosed,
  HiTrash,
  HiInformationCircle,
} from "react-icons/hi2";
import { useTheme } from "../context/ThemeContext";
import styles from "./SettingsPage.module.css";
import clsx from "clsx";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Settings</h1>

      {/* Appearance */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Appearance</p>
        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <span className={styles.settingLabel}>
              {isDark ? (
                <>
                  <HiMoon
                    size={14}
                    style={{ display: "inline", marginRight: 6 }}
                  />
                  Dark Mode
                </>
              ) : (
                <>
                  <HiSun
                    size={14}
                    style={{ display: "inline", marginRight: 6 }}
                  />
                  Light Mode
                </>
              )}
            </span>
            <span className={styles.settingDescription}>
              {isDark ? "Switch to light mode" : "Switch to dark mode"}
            </span>
          </div>
          <label className={styles.toggle}>
            <input
              className={styles.toggleInput}
              type="checkbox"
              checked={isDark}
              onChange={toggleTheme}
            />
            <span className={styles.toggleSlider} />
          </label>
        </div>
      </div>

      {/* Account */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Account</p>

        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <span className={styles.settingLabel}>
              <HiLockClosed
                size={14}
                style={{ display: "inline", marginRight: 6 }}
              />
              Reset Password
            </span>
            <span className={styles.settingDescription}>
              Change your account password
            </span>
          </div>
          <span className={styles.comingSoon}>Coming soon</span>
        </div>

        <div className={clsx(styles.settingRow)}>
          <div className={styles.settingInfo}>
            <span className={styles.settingLabel}>
              <HiTrash
                size={14}
                style={{ display: "inline", marginRight: 6 }}
              />
              Delete Account
            </span>
            <span className={styles.settingDescription}>
              Permanently delete your account and all data
            </span>
          </div>
          <span className={styles.comingSoon}>Coming soon</span>
        </div>
      </div>

      {/* About */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>About</p>
        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <span className={styles.settingLabel}>
              <HiInformationCircle
                size={14}
                style={{ display: "inline", marginRight: 6 }}
              />
              Version
            </span>
            <span className={styles.settingDescription}>Spark Beta 0.1.0</span>
          </div>
        </div>
      </div>

      {/* App info */}
      <div className={styles.appInfo}>
        <p className={styles.appName}>Spark ⚡</p>
        <p className={styles.appVersion}>Made with ❤️</p>
      </div>
    </div>
  );
}
