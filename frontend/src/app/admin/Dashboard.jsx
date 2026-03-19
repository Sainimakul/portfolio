// Dashboard.jsx
import React, { useState, useEffect } from "react";
import * as adminApi from "../../../service/adminapi";
import { success, error } from "../../util/toast";

export default function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    blogs: 0,
    testimonials: 0,
    messages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [recentMessages, setRecentMessages] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);

    try {
      const [projects, skills, blogs, testimonials, messages] =
        await Promise.all([
          adminApi.getProjects().catch(() => ({ data: [] })),
          adminApi.getSkills().catch(() => ({ data: [] })),
          adminApi.getBlogs().catch(() => ({ data: [] })),
          adminApi.getTestimonials().catch(() => ({ data: [] })),
          adminApi.getMessages().catch(() => ({ data: [] })),
        ]);

      setStats({
        projects: projects.data?.length || 0,
        skills: skills.data?.length || 0,
        blogs: blogs.data?.length || 0,
        testimonials: testimonials.data?.length || 0,
        messages: messages.data?.length || 0,
      });

      setRecentMessages((messages.data || []).slice(0, 5));
    } catch (err) {
      error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  const statCards = [
    { 
      title: "Projects", 
      value: stats.projects, 
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      gradient: "from-blue-500 to-indigo-500",
      bg: "bg-blue-100",
      text: "text-blue-600"
    },
    { 
      title: "Skills", 
      value: stats.skills, 
      icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      gradient: "from-yellow-500 to-orange-500",
      bg: "bg-yellow-100",
      text: "text-yellow-600"
    },
    { 
      title: "Blogs", 
      value: stats.blogs, 
      icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
      gradient: "from-green-500 to-emerald-500",
      bg: "bg-green-100",
      text: "text-green-600"
    },
    { 
      title: "Testimonials", 
      value: stats.testimonials, 
      icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
      gradient: "from-pink-500 to-rose-500",
      bg: "bg-pink-100",
      text: "text-pink-600"
    },
    { 
      title: "Messages", 
      value: stats.messages, 
      icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z",
      gradient: "from-purple-500 to-indigo-500",
      bg: "bg-purple-100",
      text: "text-purple-600"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-all duration-200 group shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                <svg 
                  className={`w-5 h-5 ${stat.text}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                </svg>
              </div>
              
              {loading ? (
                <div className="h-6 w-12 bg-gray-200 animate-pulse rounded" />
              ) : (
                <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
              )}
            </div>
            
            <p className="text-sm text-gray-500 mt-3 font-medium">
              {stat.title}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Recent Messages
            </h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              Latest 5
            </span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : recentMessages.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p className="text-gray-400">No messages yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg, index) => (
                <div
                  key={msg.id || index}
                  className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                        {msg.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {msg.name || 'Anonymous'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {msg.email || 'No email'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : 'Recently'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 pl-10">
                    {msg.subject || msg.message?.substring(0, 100)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Quick Actions
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => window.location.href = "/admin?page=projects"}
              className="p-5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all group text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-800 mb-1">Add Project</p>
              <p className="text-xs text-gray-500">Create a new project</p>
            </button>

            <button
              onClick={() => window.location.href = "/admin?page=blogs"}
              className="p-5 rounded-xl bg-green-50 hover:bg-green-100 border border-green-200 transition-all group text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-green-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-800 mb-1">Write Blog</p>
              <p className="text-xs text-gray-500">Share your thoughts</p>
            </button>

            <button
              onClick={() => window.location.href = "/admin?page=skills"}
              className="p-5 rounded-xl bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 transition-all group text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-yellow-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-800 mb-1">Add Skill</p>
              <p className="text-xs text-gray-500">Update your expertise</p>
            </button>

            <button
              onClick={() => window.open("/", "_blank")}
              className="p-5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all group text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-800 mb-1">View Site</p>
              <p className="text-xs text-gray-500">See your portfolio</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}