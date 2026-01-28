import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import SignUp from "./pages/Signup.jsx";
import Home from "./pages/Homeee.jsx";
import Account from "./pages/Account.jsx";
import Book from "./pages/Book.jsx";
import Search from "./pages/Search.jsx";
import Library from "./pages/Library.jsx";
import Suggestion from "./pages/suggestion.jsx";
import Statistic from "./pages/Statistics.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Users from "./pages/Users.jsx";
import AlterBooks from "./pages/alterBooks.jsx";
import AddBooks from "./pages/AddBooks.jsx";
import Request from "./pages/requests.jsx";
export default function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  function ProtectedRoute({ children, role }) {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    if (role && user.role !== role) {
      return <Navigate to="/login" replace />;
    }
    return children;
  }

  return (
    <div className="min-h-screen w-full bg-beige">
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUp />} />

          <Route
            path="/home"
            element={
              <ProtectedRoute role="user">
                <Home user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute role="user">
                <Account user={user} onUpdate={setUser} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/suggestion"
            element={
              <ProtectedRoute role="user">
                <Suggestion user={user} onUpdate={setUser} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/library"
            element={
              <ProtectedRoute role="user">
                <Library user={user} onUpdate={setUser} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute role="user">
                <Search user={user} onUpdate={setUser} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/statistics"
            element={
              <ProtectedRoute role="user">
                <Statistic user={user} onUpdate={setUser} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book/:bookId"
            element={
              <ProtectedRoute role="user">
                <Book user={user} setUser={setUser} onUpdate={setUser} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute role="admin">
                <Users user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alter"
            element={
              <ProtectedRoute role="admin">
                <AlterBooks user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add"
            element={
              <ProtectedRoute role="admin">
                <AddBooks user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/req"
            element={
              <ProtectedRoute role="admin">
                <Request user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </div>
  );
}
