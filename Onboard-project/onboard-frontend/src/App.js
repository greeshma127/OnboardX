import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Registration from "./Registration";
import Dashboard from "./Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  // login handler
  const handleLogin = async (formData) => {
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setAllUsers(data.allUsers || []);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // registration success handler
  const handleRegistrationSuccess = (newUser) => {
    setUser(newUser);
  };

  // logout handler
  const handleLogout = () => {
    setUser(null);
    setAllUsers([]);
  };

  const handleUpdateUser = (updatedUser) => {
  setUser(prev => ({ ...prev, ...updatedUser }));
};


  return (
    <Router>
      <Routes>
        {!user && (
          <>
            <Route path="/" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Registration onSuccess={handleRegistrationSuccess} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}

        {user && (
          <>
            <Route
              path="/dashboard"
              element={<Dashboard user={user} allUsers={allUsers} onLogout={handleLogout} />}
            />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
