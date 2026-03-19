// Experiences.jsx
"use client";
import React, { useState, useEffect } from "react";
import {
  getExperiences,
  addExperience,
  updateExperience,
  deleteExperience
} from "../../../service/adminapi";
import { Modal } from "./component/Modal";
import { success, error } from "../../util/toast";

function truncate(str, len) {
  if (!str) return "";
  return str.length > len ? str.substring(0, len) + "..." : str;
}

export default function Experiences() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    role: "",
    company: "",
    description: "",
    start_date: "",
    end_date: "",
    is_current: false,
    points: []
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      setLoading(true);
      const res = await getExperiences();
      setItems(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      error(err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setForm({
      role: "",
      company: "",
      description: "",
      start_date: "",
      end_date: "",
      is_current: false,
      points: []
    });
    setModal("add");
  }

  function openEdit(item) {
    const parsedPoints = typeof item.points === "string"
      ? item.points.split(",").map(v => v.trim())
      : item.points || [];

    setForm({
      role: item.role || "",
      company: item.company || "",
      description: item.description || "",
      start_date: item.start_date?.substring(0, 10) || "",
      end_date: item.end_date?.substring(0, 10) || "",
      is_current: item.is_current === true || item.is_current === "true",
      points: parsedPoints
    });
    setModal(item);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...form,
        end_date: form.is_current ? null : form.end_date,
        points: form.points || []
      };

      if (modal === "add") {
        await addExperience(payload);
        success("Experience added");
      } else {
        await updateExperience(modal.id, payload);
        success("Experience updated");
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
    if (!confirm("Delete this experience?")) return;
    await deleteExperience(id);
    success("Experience deleted");
    load();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Work Experience</h2>
          <p className="text-gray-500 text-sm">Manage your professional journey</p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2 text-sm sm:w-auto w-full"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Experience
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="text-5xl mb-4">💼</div>
          <p className="text-gray-500">No experiences yet. Add your first one!</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map(exp => (
                  <tr key={exp.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">{exp.role}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{exp.company}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {exp.start_date?.substring(0, 10)} - {exp.is_current ? "Present" : exp.end_date?.substring(0, 10)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                      {truncate(exp.description, 80)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(exp)}
                          className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(exp.id)}
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

          {/* Mobile Timeline */}
          <div className="md:hidden relative pl-8 space-y-6">
            {/* Vertical line */}
            <div className="absolute left-4 top-2 bottom-0 w-0.5 bg-blue-200"></div>

            {items.map(exp => {
              const points = typeof exp.points === "string"
                ? exp.points.split(",")
                : exp.points || [];

              return (
                <div key={exp.id} className="relative">
                  {/* Dot */}
                  <div className="absolute -left-8 top-2 w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow"></div>

                  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-800">{exp.role}</h3>
                      <p className="text-sm text-gray-600">{exp.company}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {exp.start_date?.substring(0, 10)} → {exp.is_current ? "Present" : exp.end_date?.substring(0, 10)}
                      </p>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{truncate(exp.description, 100)}</p>

                    {points.length > 0 && (
                      <ul className="text-xs text-gray-500 list-disc pl-4 mb-4 space-y-1">
                        {points.slice(0, 2).map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                        {points.length > 2 && <li>+{points.length - 2} more</li>}
                      </ul>
                    )}

                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => openEdit(exp)}
                        className="flex-1 px-3 py-2 text-xs bg-gray-100 text-gray-600 rounded-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="flex-1 px-3 py-2 text-xs bg-red-100 text-red-600 rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Modal */}
      {modal && (
        <Modal
          title={modal === "add" ? "Add Experience" : "Edit Experience"}
          onClose={() => setModal(null)}
          size="lg"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <input
                  required
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Senior Developer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                <input
                  required
                  value={form.company}
                  onChange={e => setForm({ ...form, company: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tech Corp"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows="3"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your responsibilities..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                <input
                  type="date"
                  required
                  value={form.start_date}
                  onChange={e => setForm({ ...form, start_date: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={form.end_date}
                  onChange={e => setForm({ ...form, end_date: e.target.value })}
                  disabled={form.is_current}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_current"
                checked={form.is_current}
                onChange={e => setForm({ ...form, is_current: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="is_current" className="text-sm text-gray-700">Currently working here</label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Key Achievements *</label>
              <textarea
                required
                rows="4"
                value={(form.points || []).join(", ")}
                onChange={(e) => setForm({
                  ...form,
                  points: e.target.value.split(",").map(v => v.trim())
                })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Led team of 5, Increased sales by 20%, Developed new feature"
              />
              <p className="text-xs text-gray-500 mt-1">Separate achievements with commas</p>
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
                {saving ? "Saving..." : "Save Experience"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}