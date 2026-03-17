"use client"
import React, { useState } from "react"

import Dashboard from "./Dashboard"
import Projects from "./Projects"
import Skills from "./Skills"
import Blogs from "./Blogs"
import Testimonials from "./Testimonials"
import Messages from "./Messages"
import Profile from "./profile"
import SocialLinks from "./SocialLink"
import Experiences from "./Experiences"

function AdminApp({ onLogout }) {

    const [page, setPage] = useState("dashboard")
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const nav = [
        { id: "dashboard", label: "Dashboard", icon: "▦" },
        { id: "projects", label: "Projects", icon: "🚀" },
        { id: "skills", label: "Skills", icon: "⚡" },
        { id: "blogs", label: "Blogs", icon: "📝" },
        { id: "testimonials", label: "Testimonials", icon: "⭐" },
        { id: "messages", label: "Messages", icon: "💬" },
        { id: "profile", label: "Profile", icon: "👤" },
        { id: "social", label: "Social Media", icon: "🌐" },
        { id: "experience", label: "Experience", icon: "📊" }
    ]

    const pages = {
        dashboard: <Dashboard />,
        projects: <Projects />,
        skills: <Skills />,
        blogs: <Blogs />,
        testimonials: <Testimonials />,
        messages: <Messages />,
        profile: <Profile />,
        social: <SocialLinks />,
        experience: <Experiences />
    }

    function logout() {
        localStorage.removeItem("admin_token")
        onLogout()
    }

    return (
        <div className="flex h-screen bg-gray-100 text-black overflow-hidden">

            {/* 🔹 Mobile Topbar */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-900 text-white flex items-center justify-between px-4 py-3 z-50">
                <button onClick={() => setSidebarOpen(true)}>☰</button>
                <h1 className="text-lg font-bold">Admin</h1>
                <div />
            </div>

            {/* 🔹 Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* 🔹 Sidebar */}
            <aside className={`
                fixed md:static z-50 top-0 left-0 h-full w-64 bg-gray-900 text-white flex flex-col
                transform transition-transform duration-300
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0
            `}>

                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-xl font-bold">⚡ Admin</h1>
                    <p className="text-xs text-gray-400">Portfolio Manager</p>
                </div>

                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">

                    {nav.map(n => (
                        <button
                            key={n.id}
                            onClick={() => {
                                setPage(n.id)
                                setSidebarOpen(false) // close on mobile
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition
${page === n.id
                                    ? "bg-gray-800 text-white"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                }`}
                        >
                            <span>{n.icon}</span>
                            <span>{n.label}</span>
                        </button>
                    ))}

                </nav>

                <div className="p-5 border-t border-gray-800 space-y-2">

                    <a href="/" className="block text-xs text-gray-400 hover:text-white">
                        View Portfolio
                    </a>

                    <button
                        onClick={logout}
                        className="text-xs text-red-500 hover:text-red-400"
                    >
                        Logout
                    </button>

                </div>

            </aside>

            {/* 🔹 Main Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 mt-12 md:mt-0">
                {pages[page]}
            </main>

        </div>
    )
}

export default AdminApp