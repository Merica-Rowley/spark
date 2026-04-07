import { useTheme } from "../context/ThemeContext";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <h1>Settings</h1>

      <div>
        <h2>Appearance</h2>
        <div>
          <span>Dark Mode</span>
          <button onClick={toggleTheme}>
            {theme === "dark" ? "🌙 On" : "☀️ Off"}
          </button>
        </div>
      </div>

      <div>
        <h2>Account</h2>
        <div>
          <span>Reset Password</span>
          <button disabled>Coming soon</button>
        </div>
      </div>
    </div>
  );
}
