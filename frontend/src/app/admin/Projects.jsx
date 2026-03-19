// Projects.jsx
"use client";
import React, { useState, useEffect } from "react";
import * as adminApi from "../../../service/adminapi";
import { Modal } from "./component/Modal";
import { success, error } from "../../util/toast";

function truncate(str, length) {
  if (!str) return "";
  if (str.length <= length) return str;
  return str.substring(0, length) + "...";
}

export default function Projects() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    github_link: "",
    live_link: "",
    thumbnail: "",
    featured: false,
    techstack: []
  });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await adminApi.getProjects();
      const data = res.data || res || [];
      const formatted = data.map(p => ({
        ...p,
        featured: p.featured === true || p.featured === "true"
      }));
      setItems(formatted);
    } catch (err) {
      error(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setForm({
      title: "",
      description: "",
      github_link: "",
      live_link: "",
      thumbnail: "",
      featured: false,
      techstack: []
    });
    setModal("add");
  }

  function openEdit(item) {
    setForm({
      title: item.title || "",
      description: item.description || "",
      github_link: item.github_link || "",
      live_link: item.live_link || "",
      thumbnail: item.thumbnail || "",
      featured: Boolean(item.featured),
      techstack: item.techstack || []
    });
    setModal(item);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    try {
      if (modal === "add") {
        await adminApi.addProject(form);
        
        success("Project created");
      } else {
        await adminApi.updateProject(modal.id, form);
        success("Project updated");
      }
      setModal(null);
      load();
    } catch (err) {
      error(err.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this project?")) return;
    try {
      await adminApi.deleteProject(id);
      success("Project deleted");
      load();
    } catch (err) {
      error(err.message);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
          <p className="text-gray-500">Manage your portfolio projects</p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2 text-sm sm:w-auto w-full"
        >
<span className="material-icons text-sm">add</span>
      Add Project
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="text-5xl mb-4">📁</div>
          <p className="text-gray-500">No projects yet. Add your first one!</p>
        </div>
      ) : (
        <>
          {/* Desktop Table - Hidden on mobile */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tech Stack</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Links</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map(project => (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={project.thumbnail || "/placeholder.jpg"}
                          alt=""
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                        />
                        <div>
                          <p className="font-medium text-gray-800">{project.title}</p>
                          <p className="text-sm text-gray-500">{truncate(project.description, 50)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(project.techstack || []).slice(0, 3).map((tech, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {tech}
                          </span>
                        ))}
                        {(project.techstack || []).length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{(project.techstack || []).length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {project.featured ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                          Featured
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          Regular
                          </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        {project.github_link && (
<a href={project.github_link} target="_blank" className="text-gray-400 hover:text-gray-600">
  <span className="material-icons text-xl">code</span>
</a>
                        )}
                        {project.live_link && (
<a href={project.github_link} target="_blank" className="text-gray-400 hover:text-gray-600">
  <span className="material-icons text-xl">code</span>
</a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(project)}
                          className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
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
            {items.map(project => (
              <div key={project.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="relative">
                  <img
                    src={project.thumbnail || "/placeholder.jpg"}
                    alt=""
                    className="w-full h-40 object-cover"
                  />
                  {project.featured && (
                    <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full">
                      ⭐ Featured
                    </span>
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-gray-800">{project.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {(project.techstack || []).slice(0, 3).map((tech, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex gap-2">
                      {project.github_link && (
<a href={project.github_link} target="_blank" className="text-gray-400 hover:text-gray-600">
  <span className="material-icons text-xl">code</span>
</a>
                      )}
<a href={project.live_link} target="_blank" className="text-gray-400 hover:text-gray-600">
  <span className="material-icons text-xl">open_in_new</span>
</a>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(project)}
                        className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {modal && (
        <Modal
          title={modal === "add" ? "Add Project" : "Edit Project"}
          onClose={() => setModal(null)}
          size="lg"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL *</label>
                <input
                  required
                  value={form.thumbnail}
                  onChange={e => setForm({ ...form, thumbnail: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                rows="4"
                required
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack *</label>
              <input
                required
                value={form.techstack.join(",")}
                onChange={(e) =>
                  setForm({
                    ...form,
                    techstack: e.target.value.split(",").map(v => v.trim())
                  })
                }
                placeholder="React, Node.js, MongoDB"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                <input
                  type="url"
                  value={form.github_link}
                  onChange={e => setForm({ ...form, github_link: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Live URL</label>
                <input
                  type="url"
                  value={form.live_link}
                  onChange={e => setForm({ ...form, live_link: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={e => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="featured" className="text-sm text-gray-700">Featured Project</label>
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
                {saving ? "Saving..." : "Save Project"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}