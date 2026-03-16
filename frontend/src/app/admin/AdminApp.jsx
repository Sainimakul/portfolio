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
// import Experiences from "./experiences"

function AdminApp({ onLogout }) {

    const [page, setPage] = useState("dashboard")

    const nav = [
        { id: "dashboard", label: "Dashboard", icon: "▦" },
        { id: "projects", label: "Projects", icon: "🚀" },
        { id: "skills", label: "Skills", icon: "⚡" },
        { id: "blogs", label: "Blogs", icon: "📝" },
        { id: "testimonials", label: "Testimonials", icon: "⭐" },
        { id: "messages", label: "Messages", icon: "💬" },
        {id: "profile", label: "Profile", icon: "📝"},
        {id: "social", label: "Socail Media", icon: "📝"},
        {id: "experience", label: "Experience", icon: "📝"}


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

        <div className="flex h-screen bg-gray-100 text-black">

            {/* Sidebar */}

            <aside className="w-64 bg-gray-900 text-white flex flex-col">

                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-xl font-bold">⚡ Admin</h1>
                    <p className="text-xs text-gray-400">Portfolio Manager</p>
                </div>

                <nav className="flex-1 p-3 space-y-1">

                    {nav.map(n => (
                        <button
                            key={n.id}
                            onClick={() => setPage(n.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition
${page === n.id
                                    ? "bg-gray-800 text-white"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                }`}

                        >

                            <span>{n.icon}</span> <span>{n.label}</span> </button>
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

                        Logout </button>

                </div>

            </aside>

            {/* Main Content */}

            <main className="flex-1 overflow-y-auto p-8">
                {pages[page]}
            </main>

        </div>

    )

}

export default AdminApp
