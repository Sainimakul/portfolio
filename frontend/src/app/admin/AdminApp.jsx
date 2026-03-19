"use client";
import React, { useState, useEffect } from "react";
import Dashboard from "./Dashboard";
import Projects from "./Projects";
import Skills from "./Skills";
import Blogs from "./Blogs";
import Testimonials from "./Testimonials";
import Profile from "./profile";
import SocialLinks from "./SocialLink";
import Experiences from "./Experiences";
import Messages from "./Messages";

function AdminApp({ onLogout }) {
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 1024);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const navigation = [
    { id: "dashboard",    label: "Dashboard",    icon: "dashboard" },
    { id: "projects",     label: "Projects",     icon: "work" },
    { id: "skills",       label: "Skills",       icon: "psychology" },
    { id: "blogs",        label: "Blogs",        icon: "article" },
    { id: "testimonials", label: "Testimonials", icon: "star" },
    { id: "messages",     label: "Messages",     icon: "chat" },
    { id: "profile",      label: "Profile",      icon: "person" },
    { id: "social",       label: "Social Media", icon: "public" },
    { id: "experience",   label: "Experience",   icon: "business_center" },
  ];

  const pages = {
    dashboard:    <Dashboard />,
    projects:     <Projects />,
    skills:       <Skills />,
    blogs:        <Blogs />,
    testimonials: <Testimonials />,
    messages: <Messages/>,
    profile:      <Profile />,
    social:       <SocialLinks />,
    experience:   <Experiences />,
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    onLogout();
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50 h-16 shadow-sm">
        <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <span className="material-icons text-gray-600">menu</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-800">Portfolio</span>
          <span className="text-sm text-gray-500">Admin</span>
        </div>

        <button onClick={handleLogout} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <span className="material-icons text-gray-600">logout</span>
        </button>
      </header>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 flex flex-col shadow-lg`}>

        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-md">
              <span className="text-2xl font-bold text-white">AP</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
              <p className="text-sm text-gray-500">Manage your portfolio</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <span className="material-icons text-gray-600">close</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = page === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setPage(item.id);
                    if (isMobile) setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <span className={`material-icons text-xl ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`}>
                    {item.icon}
                  </span>
                  <span className="flex-1 text-left font-medium">{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors group mb-2"
          >
            <span className="material-icons text-gray-400 group-hover:text-gray-600">open_in_new</span>
            <span className="flex-1">View Portfolio</span>
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors group"
          >
            <span className="material-icons text-red-500 group-hover:text-red-600">logout</span>
            <span className="flex-1 text-left font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="lg:hidden h-16"></div>

        {/* Page Header */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-800">
                {navigation.find((n) => n.id === page)?.label || "Dashboard"}
              </h1>
              <span className="text-sm text-gray-400">/ overview</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="material-icons text-gray-600">notifications</span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="material-icons text-gray-600">share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {pages[page]}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminApp;