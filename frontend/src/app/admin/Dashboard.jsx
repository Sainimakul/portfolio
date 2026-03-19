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

  // Dashboard.jsx - replace statCards array with this:
  const statCards = [
    { title: "Projects", value: stats.projects, icon: "work", bg: "bg-blue-100", text: "text-blue-600" },
    { title: "Skills", value: stats.skills, icon: "psychology", bg: "bg-yellow-100", text: "text-yellow-600" },
    { title: "Blogs", value: stats.blogs, icon: "article", bg: "bg-green-100", text: "text-green-600" },
    { title: "Testimonials", value: stats.testimonials, icon: "star", bg: "bg-pink-100", text: "text-pink-600" },
    { title: "Messages", value: stats.messages, icon: "chat", bg: "bg-purple-100", text: "text-purple-600" },
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
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                  <span className={`material-icons text-xl ${stat.text}`}>{stat.icon}</span>
                </div>
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
<span className="material-icons text-5xl text-gray-300">chat</span>
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
                <span className="material-icons text-xl text-blue-600">add_circle</span>

              </div>
              <p className="text-sm font-medium text-gray-800 mb-1">Add Project</p>
              <p className="text-xs text-gray-500">Create a new project</p>
            </button>

            <button
              onClick={() => window.location.href = "/admin?page=blogs"}
              className="p-5 rounded-xl bg-green-50 hover:bg-green-100 border border-green-200 transition-all group text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-green-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="material-icons text-xl text-green-600">edit</span>

              </div>
              <p className="text-sm font-medium text-gray-800 mb-1">Write Blog</p>
              <p className="text-xs text-gray-500">Share your thoughts</p>
            </button>

            <button
              onClick={() => window.location.href = "/admin?page=skills"}
              className="p-5 rounded-xl bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 transition-all group text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-yellow-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="material-icons text-xl text-yellow-600">bolt</span>

              </div>
              <p className="text-sm font-medium text-gray-800 mb-1">Add Skill</p>
              <p className="text-xs text-gray-500">Update your expertise</p>
            </button>

            <button
              onClick={() => window.open("/", "_blank")}
              className="p-5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all group text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="material-icons text-xl text-purple-600">visibility</span>

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