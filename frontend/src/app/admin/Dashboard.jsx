import React, { useState, useEffect } from "react";
import * as adminApi from "../../../service/adminapi";
import { toast } from "./component/Toast";

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
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  const statCards = [
    { title: "Projects", value: stats.projects, icon: "🚀", color: "from-blue-500 to-blue-600" },
    { title: "Skills", value: stats.skills, icon: "⚡", color: "from-yellow-500 to-orange-500" },
    { title: "Blogs", value: stats.blogs, icon: "📝", color: "from-green-500 to-emerald-600" },
    { title: "Testimonials", value: stats.testimonials, icon: "⭐", color: "from-pink-500 to-rose-500" },
    { title: "Messages", value: stats.messages, icon: "💬", color: "from-purple-500 to-indigo-600" },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 bg-gray-50 min-h-screen text-black">

      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">Dashboard</h2>
        <p className="text-gray-500 text-sm md:text-base">
          Welcome back 👋
        </p>
      </div>

      {/* 🔥 Stats Section */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">

  {statCards.map((stat) => (
    <div
      key={stat.title}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-4 flex flex-col items-start justify-between"
    >
      {/* Top Row */}
      <div className="flex justify-between w-full items-center">
        <div className={`w-10 h-10 flex items-center justify-center rounded-lg text-white bg-gradient-to-r ${stat.color}`}>
          {stat.icon}
        </div>

        {loading ? (
          <div className="h-4 w-10 bg-gray-200 animate-pulse rounded" />
        ) : (
          <span className="text-lg font-bold">{stat.value}</span>
        )}
      </div>

      {/* Bottom */}
      <p className="text-xs sm:text-sm text-gray-500 mt-3">
        {stat.title}
      </p>
    </div>
  ))}

</div>

      {/* 🔥 Bottom Section */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Messages */}
        <div className="bg-white rounded-2xl shadow-sm p-5 md:p-6">

          <h3 className="font-semibold mb-4 text-lg">
            Recent Messages
          </h3>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-200 animate-pulse rounded" />
              ))}
            </div>
          ) : recentMessages.length === 0 ? (
            <p className="text-gray-400 text-sm">No messages yet</p>
          ) : (
            <div className="space-y-4">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-3 rounded-lg hover:bg-gray-50 transition border"
                >
                  <div className="flex justify-between items-center text-sm">
                    <strong className="truncate">{msg.name}</strong>
                    <span className="text-gray-400 text-xs">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                    {msg.subject || msg.message?.substring(0, 80)}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm p-5 md:p-6">

          <h3 className="font-semibold mb-4 text-lg">
            Quick Actions
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">

            <button
              className="p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition text-left"
              onClick={() => window.location.href = "/admin?page=projects"}
            >
              <div className="text-lg">➕</div>
              <p className="text-sm font-medium mt-1">Add Project</p>
            </button>

            <button
              className="p-4 rounded-xl bg-green-50 hover:bg-green-100 transition text-left"
              onClick={() => window.location.href = "/admin?page=blogs"}
            >
              <div className="text-lg">📝</div>
              <p className="text-sm font-medium mt-1">Write Blog</p>
            </button>

            <button
              className="p-4 rounded-xl bg-yellow-50 hover:bg-yellow-100 transition text-left"
              onClick={() => window.location.href = "/admin?page=skills"}
            >
              <div className="text-lg">⚡</div>
              <p className="text-sm font-medium mt-1">Add Skill</p>
            </button>

            <button
              className="p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition text-left"
              onClick={() => window.open("/", "_blank")}
            >
              <div className="text-lg">👁️</div>
              <p className="text-sm font-medium mt-1">View Site</p>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}