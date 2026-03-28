import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ListsPage from "./pages/ListsPage";
import ListDetailPage from "./pages/ListDetailPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
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
      <Route path="*" element={<Navigate to="/lists" replace />} />
    </Routes>
  );
}
