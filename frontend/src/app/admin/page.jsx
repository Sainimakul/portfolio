"use client";
import React, { useState, useEffect } from "react";
import Login from "./Login";
import AdminApp from "./AdminApp";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("admin_token");
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  function handleLogin() {
    setIsAuthenticated(true);
  }

  function handleLogout() {
    setIsAuthenticated(false);
  }

  if (loading) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0b0b0f",
      }}>
        <div className="spinner-large"></div>
      </div>
    );
  }

  return isAuthenticated ? (
    <AdminApp onLogout={handleLogout} />
  ) : (
    <Login onLogin={handleLogin} />
  );
}