import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ListsPage from "./pages/ListsPage";
import ListDetailPage from "./pages/ListDetailPage";
import FriendsPage from "./pages/FriendsPage";
import InvitePage from "./pages/InvitePage";
import ProfilePage from "./pages/ProfilePage";
import FriendProfilePage from "./pages/FriendProfilePage";
import FeedPage from "./pages/FeedPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/invite/:code" element={<InvitePage />} />
      <Route
        path="/lists"
        element={
          <ProtectedRoute>
            <ListsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lists/:id"
        element={
          <ProtectedRoute>
            <ListDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/friends"
        element={
          <ProtectedRoute>
            <FriendsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/friends/:id"
        element={
          <ProtectedRoute>
            <FriendProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <FeedPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/lists" replace />} />
    </Routes>
  );
}
