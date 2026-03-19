// profile.jsx
"use client";
import React, { useState, useEffect } from "react";
import * as adminApi from "../../../service/adminapi";
import { success, error } from "../../util/toast";

const TEMPLATES = [
  { id: 1, name: "Modern Minimal", preview: "Clean and minimal design with focus on content", icon: "✨" },
  { id: 2, name: "Creative Portfolio", preview: "Bold colors and creative layout for artists", icon: "🎨" },
  { id: 3, name: "Corporate Professional", preview: "Professional design for business portfolios", icon: "💼" },
  { id: 4, name: "Developer Tech", preview: "Tech-focused layout with code snippets", icon: "💻" },
  { id: 5, name: "Photography Showcase", preview: "Full-width images and gallery layout", icon: "📸" },
  { id: 6, name: "Interactive Bold", preview: "Dynamic animations and interactive elements", icon: "⚡" },
];

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    title: "",
    bio: "",
    location: "",
    email: "",
    linkedin: "",
    github: "",
    status: "available",
    projects_count: 0,
    tech_stack_count: 0,
    template_id: 1
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadProfile(); }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      const data = await adminApi.getProfile();
      setProfile(data.data || profile);
    } catch (err) {
      error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      await adminApi.updateProfile(profile);
      success("Profile updated successfully");
    } catch (err) {
      error(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
        <p className="text-gray-500 text-sm">Manage your public profile information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">👤</span>
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                required
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Professional Title *</label>
              <input
                required
                value={profile.title}
                onChange={e => setProfile({ ...profile, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Senior Developer"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio *</label>
            <textarea
              rows="4"
              required
              value={profile.bio}
              onChange={e => setProfile({ ...profile, bio: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tell your story..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                value={profile.location}
                onChange={e => setProfile({ ...profile, location: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="San Francisco, CA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                required
                value={profile.email}
                onChange={e => setProfile({ ...profile, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="john@example.com"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">🔗</span>
            Social Links
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
              <input
                value={profile.linkedin}
                onChange={e => setProfile({ ...profile, linkedin: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
              <input
                value={profile.github}
                onChange={e => setProfile({ ...profile, github: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://github.com/username"
              />
            </div>
          </div>
        </div>

        {/* Template Selection */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">🎨</span>
            Portfolio Template
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {TEMPLATES.map(t => (
              <div
                key={t.id}
                onClick={() => setProfile({ ...profile, template_id: t.id })}
                className={`border rounded-xl p-4 cursor-pointer transition-all ${
                  profile.template_id === t.id
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <div className="text-4xl mb-3">{t.icon}</div>
                <h4 className="font-medium text-gray-800 mb-1">{t.name}</h4>
                <p className="text-xs text-gray-500 line-clamp-2">{t.preview}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Status & Stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">📊</span>
            Status & Statistics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability Status</label>
              <select
                value={profile.status}
                onChange={e => setProfile({ ...profile, status: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="available">✅ Available for work</option>
                <option value="busy">⏰ Currently busy</option>
                <option value="open">💬 Open to opportunities</option>
                <option value="hiring">🤝 Hiring</option>
              </select>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Projects</p>
              <p className="text-2xl font-semibold text-gray-800">{profile.projects_count}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Tech Stack</p>
              <p className="text-2xl font-semibold text-gray-800">{profile.tech_stack_count}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            type="button"
            onClick={loadProfile}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}