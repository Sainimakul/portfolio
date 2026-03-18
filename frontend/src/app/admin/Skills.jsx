"use client";
import React, { useState, useEffect } from "react";
import * as adminApi from "../../../service/adminapi";
import { Modal } from "./component/Modal";
import { toast } from "./component/Toast";

function truncate(str, len) {
  if (!str) return "";
  return str.length > len ? str.substring(0, len) + "..." : str;
}

export default function Skills() {

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    percentage: 80,
    icon: "",
    order_index: 1
  });

  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await adminApi.getSkills();
      setItems(res.data || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openAdd() {
    setForm({
      name: "",
      description: "",
      percentage: 80,
      icon: "",
      order_index: items.length + 1
    });
    setModal("add");
  }

  function openEdit(item) {
    setForm({
      name: item.name || "",
      description: item.description || "",
      percentage: item.percentage || 80,
      icon: item.icon || "",
      order_index: item.order_index || 1
    });
    setModal(item);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    try {
      if (modal === "add") {
        await adminApi.addSkill(form);
        toast.success("Skill added");
      } else {
        await adminApi.updateSkill(modal.id, form);
        toast.success("Skill updated");
      }

      setModal(null);
      load();

    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this skill?")) return;

    try {
      await adminApi.deleteSkill(id);
      toast.success("Skill deleted");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="space-y-6 text-black p-4 md:p-6">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Skills</h2>
        <p className="text-gray-500">
          Manage your technical skills
        </p>
      </div>

      <div className="bg-white rounded-xl shadow">

        {/* Top Bar */}
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="font-semibold">
            All Skills ({items.length})
          </h3>

          <button
            onClick={openAdd}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg"
          >
            + Add Skill
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">⚡</div>
            <p>No skills yet</p>
          </div>
        ) : (
          <>
            {/* 📱 MOBILE VIEW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 md:hidden">

              {items.map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-2xl shadow hover:shadow-lg transition p-4 space-y-3"
                >

                  {/* Top */}
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {s.icon || "📌"}
                    </div>

                    <div>
                      <h3 className="font-semibold text-sm">
                        {s.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        #{s.order_index}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-500">
                    {truncate(s.description, 70)}
                  </p>

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Level</span>
                      <span>{s.percentage}%</span>
                    </div>

                    <div className="w-full bg-gray-200 h-2 rounded-full">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${s.percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">

                    <button
                      onClick={() => openEdit(s)}
                      className="flex-1 text-xs bg-gray-100 py-1 rounded-full"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(s.id)}
                      className="flex-1 text-xs bg-red-500 text-white py-1 rounded-full"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              ))}

            </div>

            {/* 💻 DESKTOP TABLE */}
            <div className="hidden md:block overflow-x-auto">

              <table className="w-full text-sm">

                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="p-3">Order</th>
                    <th className="p-3">Icon</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Level</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map(s => (
                    <tr key={s.id} className="border-t hover:bg-gray-50">

                      <td className="p-3">{s.order_index}</td>

                      <td className="p-3 text-xl">
                        {s.icon || "📌"}
                      </td>

                      <td className="p-3 font-medium">
                        {s.name}
                      </td>

                      <td className="p-3 text-gray-500">
                        {truncate(s.description, 60)}
                      </td>

                      <td className="p-3">
                        <div className="flex items-center">
                          <div className="w-40 bg-gray-200 h-2 rounded-full">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${s.percentage}%` }}
                            />
                          </div>
                          <span className="text-xs ml-2">
                            {s.percentage}%
                          </span>
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEdit(s)}
                            className="px-2 py-1 text-xs bg-gray-200 rounded"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(s.id)}
                            className="px-2 py-1 text-xs bg-red-500 text-white rounded"
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
          </>
        )}

      </div>

      {/* MODAL (unchanged) */}
      {modal && (
        <Modal
          title={modal === "add" ? "Add Skill" : "Edit Skill"}
          onClose={() => setModal(null)}
        >
          <form onSubmit={handleSave} className="space-y-4">

            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="text-sm font-medium">Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Icon</label>
                <input
                  value={form.icon}
                  onChange={e => setForm({ ...form, icon: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <input
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Proficiency: {form.percentage}%
              </label>

              <input
                type="range"
                min="0"
                max="100"
                value={form.percentage}
                onChange={e => setForm({
                  ...form,
                  percentage: parseInt(e.target.value)
                })}
                className="w-full mt-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Order</label>
              <input
                type="number"
                value={form.order_index}
                onChange={e => setForm({
                  ...form,
                  order_index: parseInt(e.target.value)
                })}
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                {saving ? "Saving..." : "Save Skill"}
              </button>

            </div>

          </form>
        </Modal>
      )}

    </div>
  );
}