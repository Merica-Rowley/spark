import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./components/nav/AuthLayout";
import LoginPage from "./pages/LoginPage";
import ListsPage from "./pages/ListsPage";
import ListDetailPage from "./pages/ListDetailPage";
import FriendsPage from "./pages/FriendsPage";
import FeedPage from "./pages/FeedPage";
import ProfilePage from "./pages/ProfilePage";
import FriendProfilePage from "./pages/FriendProfilePage";
import SettingsPage from "./pages/SettingsPage";
import InvitePage from "./pages/InvitePage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/invite/:code" element={<InvitePage />} />

      <Route
        path="/lists"
        element={
          <AuthLayout>
            <ListsPage />
          </AuthLayout>
        }
      />
      <Route
        path="/lists/:id"
        element={
          <AuthLayout>
            <ListDetailPage />
          </AuthLayout>
        }
      />
      <Route
        path="/feed"
        element={
          <AuthLayout>
            <FeedPage />
          </AuthLayout>
        }
      />
      <Route
        path="/friends"
        element={
          <AuthLayout>
            <FriendsPage />
          </AuthLayout>
        }
      />
      <Route
        path="/friends/:id"
        element={
          <AuthLayout>
            <FriendProfilePage />
          </AuthLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <AuthLayout>
            <ProfilePage />
          </AuthLayout>
        }
      />
      <Route
        path="/settings"
        element={
          <AuthLayout>
            <SettingsPage />
          </AuthLayout>
        }
      />
      <Route path="*" element={<Navigate to="/lists" replace />} />
    </Routes>
  );
}
