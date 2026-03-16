"use client";

import React, { useState, useEffect } from "react";
import {
  getExperiences,
  addExperience,
  updateExperience,
  deleteExperience
} from "../../../service/adminapi";

import { Modal } from "./component/Modal";
import { toast } from "./component/Toast";

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

  useEffect(() => {
    load();
  }, []);

  async function load() {

    try {

      setLoading(true);

      const res = await getExperiences();

      const data = res?.data;

      setItems(Array.isArray(data) ? data : []);

    } catch (err) {

      toast.error(err.message || "Failed to load experiences");

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

    const parsedPoints =
      typeof item.points === "string"
        ? item.points.split(",").map(v => v.trim())
        : Array.isArray(item.points)
        ? item.points
        : [];

    setForm({
      role: item.role || "",
      company: item.company || "",
      description: item.description || "",
      start_date: item.start_date ? item.start_date.substring(0,10) : "",
      end_date: item.end_date ? item.end_date.substring(0,10) : "",
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

        toast.success("Experience created");

      } else {

        await updateExperience(modal?.id, payload);

        toast.success("Experience updated");

      }

      setModal(null);

      load();

    } catch (err) {

      toast.error(err.message || "Failed to save");

    } finally {

      setSaving(false);

    }

  }

  async function handleDelete(id) {

    if (!confirm("Delete this experience?")) return;

    try {

      await deleteExperience(id);

      toast.success("Experience deleted");

      load();

    } catch (err) {

      toast.error(err.message);

    }

  }

  return (

    <div className="space-y-6 text-black">

      <div>

        <h2 className="text-2xl font-bold">Experiences</h2>

        <p className="text-gray-500">
          Manage your work experience
        </p>

      </div>

      <div className="bg-white rounded-xl shadow">

        <div className="flex justify-between items-center p-5 border-b">

          <h3 className="font-semibold">
            All Experiences ({items.length})
          </h3>

          <button
            onClick={openAdd}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Add Experience
          </button>

        </div>

        {loading ? (

          <div className="flex justify-center py-16">

            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

          </div>

        ) : items.length === 0 ? (

          <div className="text-center py-16 text-gray-400">

            <div className="text-4xl mb-3">💼</div>

            <p>No experiences yet</p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-gray-50 text-left">

                <tr>
                  <th className="p-3">Role</th>
                  <th className="p-3">Company</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Points</th>
                  <th className="p-3">Actions</th>
                </tr>

              </thead>

              <tbody>

                {items.map(exp => {

                  const points =
                    typeof exp.points === "string"
                      ? exp.points.split(",")
                      : Array.isArray(exp.points)
                      ? exp.points
                      : [];

                  return (

                    <tr key={exp.id} className="border-t">

                      <td className="p-3 font-medium">
                        {exp.role}
                      </td>

                      <td className="p-3 text-gray-500">
                        {exp.company}
                      </td>

                      <td className="p-3 text-gray-500">
                        {truncate(exp.description, 60)}
                      </td>

                      <td className="p-3">

                        {exp.start_date?.substring(0,10)} - {exp.is_current ? "Present" : exp.end_date?.substring(0,10)}

                      </td>

                      <td className="p-3 text-gray-500">

                        {points.slice(0,2).join(", ")}

                      </td>

                      <td className="p-3">

                        <div className="flex gap-2">

                          <button
                            onClick={() => openEdit(exp)}
                            className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(exp.id)}
                            className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )

                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {modal && (

        <Modal
          title={modal === "add" ? "Add Experience" : "Edit Experience"}
          onClose={() => setModal(null)}
        >

          <form onSubmit={handleSave} className="space-y-4">

            <div>

              <label className="text-sm font-medium">Role *</label>

              <input
                required
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />

            </div>

            <div>

              <label className="text-sm font-medium">Company *</label>

              <input
                required
                value={form.company}
                onChange={e => setForm({ ...form, company: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />

            </div>

            <div>

              <label className="text-sm font-medium">Description</label>

              <textarea
                rows="3"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />

            </div>

            <div className="grid grid-cols-2 gap-4">

              <div>

                <label className="text-sm font-medium">Start Date *</label>

                <input
                  type="date"
                  required
                  value={form.start_date}
                  onChange={e => setForm({ ...form, start_date: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />

              </div>

              <div>

                <label className="text-sm font-medium">End Date</label>

                <input
                  type="date"
                  value={form.end_date}
                  onChange={e => setForm({ ...form, end_date: e.target.value })}
                  disabled={form.is_current}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />

              </div>

            </div>

            <div className="flex items-center gap-2">

              <input
                type="checkbox"
                checked={form.is_current}
                onChange={e =>
                  setForm({ ...form, is_current: e.target.checked })
                }
              />

              <label className="text-sm font-medium">
                Currently working here
              </label>

            </div>

            <div>

              <label className="text-sm font-medium">Experience Points *</label>

              <textarea
                required
                placeholder="Built scalable APIs, Optimized PostgreSQL queries"
                value={(form.points || []).join(",")}
                onChange={(e) =>
                  setForm({
                    ...form,
                    points: e.target.value.split(",").map(v => v.trim())
                  })
                }
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />

              <p className="text-xs text-gray-400 mt-1">
                Separate points with commas
              </p>

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
                {saving ? "Saving..." : "Save Experience"}
              </button>

            </div>

          </form>

        </Modal>

      )}

    </div>

  );

}