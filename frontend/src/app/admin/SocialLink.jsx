// SocialLink.jsx
"use client";
import React, { useState, useEffect } from "react";
import { deleteSocialLink, getSocialLinks, updateSocialLink, addSocialLink } from "../../../service/adminapi";
import { Modal } from "./component/Modal";
import { success, error } from "../../util/toast";

export default function SocialLinks() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    platform: "",
    url: "",
    order_index: 1
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      setLoading(true);
      const res = await getSocialLinks();
      setItems(res.data || []);
    } catch (err) {
      error(err.message);
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setForm({
      platform: "",
      url: "",
      order_index: items.length + 1
    });
    setModal("add");
  }

  function openEdit(item) {
    setForm({
      platform: item.platform || "",
      url: item.url || "",
      order_index: item.order_index || 1
    });
    setModal(item);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    try {
      if (modal === "add") {
        await addSocialLink(form);
        success("Social link added");
      } else {
        await updateSocialLink(modal.id, form);
        success("Social link updated");
      }
      setModal(null);
      load();
    } catch (err) {
      error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this link?")) return;
    try {
      await deleteSocialLink(id);
      success("Link deleted");
      load();
    } catch (err) {
      error(err.message);
    }
  }

  const platformColors = {
    github: "bg-gray-800",
    linkedin: "bg-blue-700",
    twitter: "bg-blue-400",
    instagram: "bg-pink-600",
    facebook: "bg-blue-600",
    youtube: "bg-red-600",
    default: "bg-blue-600"
  };

  function getPlatformColor(platform) {
    const key = platform?.toLowerCase() || "default";
    return platformColors[key] || platformColors.default;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Social Links</h2>
          <p className="text-gray-500 text-sm">Manage your social media presence</p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2 text-sm sm:w-auto w-full"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Link
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="text-5xl mb-4">🔗</div>
          <p className="text-gray-500">No social links yet. Add your first one!</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Platform</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">URL</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map(link => (
                  <tr key={link.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">#{link.order_index}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full ${getPlatformColor(link.platform)} flex items-center justify-center text-white text-xs`}>
                          {link.platform?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <span className="font-medium text-gray-800">{link.platform}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                      >
                        {link.url}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(link)}
                          className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(link.id)}
                          className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {items.map(link => (
              <div key={link.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full ${getPlatformColor(link.platform)} flex items-center justify-center text-white font-semibold`}>
                    {link.platform?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{link.platform}</h3>
                    <p className="text-xs text-gray-500">Order #{link.order_index}</p>
                  </div>
                </div>

                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all block mb-4"
                >
                  {link.url}
                </a>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(link)}
                    className="flex-1 px-3 py-2 text-xs bg-gray-100 text-gray-600 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(link.id)}
                    className="flex-1 px-3 py-2 text-xs bg-red-100 text-red-600 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {modal && (
        <Modal
          title={modal === "add" ? "Add Social Link" : "Edit Social Link"}
          onClose={() => setModal(null)}
          size="md"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Platform *</label>
              <input
                required
                value={form.platform}
                onChange={e => setForm({ ...form, platform: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="GitHub, LinkedIn, Twitter..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL *</label>
              <input
                required
                type="url"
                value={form.url}
                onChange={e => setForm({ ...form, url: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://github.com/username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
              <input
                type="number"
                min="1"
                value={form.order_index}
                onChange={e => setForm({ ...form, order_index: parseInt(e.target.value) || 1 })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setModal(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Link"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}