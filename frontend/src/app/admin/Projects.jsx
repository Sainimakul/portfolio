"use client";
import React, { useState, useEffect } from "react";
import * as adminApi from "../../../service/adminapi";
import { Modal } from "./component/Modal";
import { toast } from "./component/Toast";

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
      setItems(res.data || res || []);

    } catch (err) {

      toast.error(err.message || "Failed to load projects");

    } finally {

      setLoading(false);

    }
  }

  useEffect(() => { load() }, []);

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
      featured: item.featured || false,
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
        toast.success("Project created");

      } else {

        await adminApi.updateProject(modal.id, form);
        toast.success("Project updated");

      }

      setModal(null);
      load();

    } catch (err) {

      toast.error(err.message || "Failed to save project");

    } finally {

      setSaving(false);

    }

  }

  async function handleDelete(id) {

    if (!confirm("Delete this project?")) return;

    try {

      await adminApi.deleteProject(id);
      toast.success("Project deleted");
      load();

    } catch (err) {

      toast.error(err.message);

    }

  }

  return (

    <div className="space-y-6 text-black">

      <div>
        <h2 className="text-2xl font-bold">Projects</h2>
        <p className="text-gray-500">Manage your portfolio projects</p>
      </div>

      <div className="bg-white rounded-xl shadow">

        <div className="flex justify-between items-center p-5 border-b">

          <h3 className="font-semibold">
            All Projects ({items.length})
          </h3>

          <button
            onClick={openAdd}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Add Project
          </button>

        </div>

        {loading ? (

          <div className="flex justify-center py-16">

            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

          </div>

        ) : items.length === 0 ? (

          <div className="text-center py-16 text-gray-400">

            <div className="text-4xl mb-3">📁</div>
            <p>No projects yet. Add your first one!</p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-gray-50 text-left">

                <tr>
                  <th className="p-3">Thumbnail</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Tech Stack</th>
                  <th className="p-3">Featured</th>
                  <th className="p-3">GitHub</th>
                  <th className="p-3">Live</th>
                  <th className="p-3">Actions</th>
                </tr>

              </thead>

              <tbody>

                {items.map(project => (

                  <tr key={project.id} className="border-t">

                    <td className="p-3">

                      <img
                        src={project.thumbnail || null}
                        alt=""
                        className="w-14 h-10 object-cover rounded"
                      />

                    </td>

                    <td className="p-3 font-medium">
                      {project.title}
                    </td>

                    <td className="p-3 text-gray-500">
                      {truncate(project.description, 70)}
                    </td>

                    <td className="p-3 text-gray-500">
                      {(project.techstack || []).join(", ")}
                    </td>

                    <td className="p-3">
                      {project.featured === "true" ? "⭐ Yes" : "❌ No"}
                    </td>

                    <td className="p-3">

                      {project.github_link ? (

                        <a
                          href={project.github_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          GitHub ↗
                        </a>

                      ) : "—"}

                    </td>

                    <td className="p-3">

                      {project.live_link ? (

                        <a
                          href={project.live_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:underline"
                        >
                          Live ↗
                        </a>

                      ) : "—"}

                    </td>

                    <td className="p-3">

                      <div className="flex gap-2">

                        <button
                          onClick={() => openEdit(project)}
                          className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(project.id)}
                          className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
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

        )}

      </div>

      {modal && (

        <Modal
          title={modal === "add" ? "Add Project" : "Edit Project"}
          onClose={() => setModal(null)}
        >

          <form onSubmit={handleSave} className="space-y-4">

            <div>

              <label className="text-sm font-medium">Title *</label>

              <input
                required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />

            </div>

            <div>

              <label className="text-sm font-medium">Description *</label>

              <textarea
                rows="4"
                required
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />

            </div>

            <div>

              <label className="text-sm font-medium">Thumbnail URL *</label>

              <input
                required
                value={form.thumbnail}
                onChange={e => setForm({ ...form, thumbnail: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />

            </div>

            <div>

              <label className="text-sm font-medium">Tech Stack *</label>

              <input
                required
                placeholder="React, NodeJS, PostgreSQL"
                value={form.techstack.join(",")}
                onChange={(e) =>
                  setForm({
                    ...form,
                    techstack: e.target.value.split(",").map(v => v.trim())
                  })
                }
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />

              <p className="text-xs text-gray-400 mt-1">
                Enter technologies separated by commas
              </p>

            </div>

            <div className="flex items-center gap-2">

              <input
                type="checkbox"
                checked={form.featured == "true" }
                onChange={e =>
                  setForm({ ...form, featured: form.featured == "true" ?  "false" : "true" })
                }
              />

              <label className="text-sm font-medium">
                Featured Project
              </label>

            </div>

            <div>

              <label className="text-sm font-medium">GitHub URL</label>

              <input
                type="url"
                value={form.github_link}
                onChange={e => setForm({ ...form, github_link: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />

            </div>

            <div>

              <label className="text-sm font-medium">Live URL</label>

              <input
                type="url"
                value={form.live_link}
                onChange={e => setForm({ ...form, live_link: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />

            </div>

            <div className="flex justify-end gap-3 pt-3">

              <button
                type="button"
                onClick={() => setModal(null)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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