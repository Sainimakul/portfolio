"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head"; // ✅ ADD THIS
import Login from "./Login";
import AdminApp from "./AdminApp";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Service Worker register
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", {
        scope: "/admin",
      });
    }

    // Auth check
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
      <>
        {/* ✅ Manifest ONLY for admin */}
        <Head>
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
          <link rel="manifest" href="/admin-manifest.json" />
          <meta name="theme-color" content="#000000" />
        </Head>

        <div style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#0b0b0f",
        }}>
          <div className="spinner-large"></div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* ✅ Manifest applied */}
      <Head>
        <link rel="manifest" href="/admin-manifest.json" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      {isAuthenticated ? (
        <AdminApp onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  );
}