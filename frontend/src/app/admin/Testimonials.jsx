import React, { useState, useEffect } from "react";
import * as adminApi from "../../../service/adminapi";
import { Modal } from "./component/Modal";
import { toast } from "./component/Toast";

function truncate(str, len) {
  if (!str) return ""
  return str.length > len ? str.substring(0, len) + "..." : str
}

function stars(n) {
  return "★".repeat(n) + "☆".repeat(5 - n)
}

export default function Testimonials() {

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)

  const [form, setForm] = useState({
    name: "",
    role: "",
    company: "",
    review: "",
    rating: 5
  })

  const [saving, setSaving] = useState(false)

  async function load() {

    setLoading(true)

    try {

      const res = await adminApi.getTestimonials()
      setItems(res.data || [])

    } catch (err) {

      toast.error(err.message)

    }
    finally {

      setLoading(false)

    }

  }

  useEffect(() => { load() }, [])

  async function handleSave(e) {

    e.preventDefault()
    setSaving(true)

    try {

      await adminApi.addTestimonial(form)

      toast.success("Testimonial added")

      setModal(false)

      load()

    } catch (err) {

      toast.error(err.message)

    }
    finally {

      setSaving(false)

    }

  }

  async function handleDelete(id) {

    if (!confirm("Delete this testimonial?")) return

    try {

      await adminApi.deleteTestimonial(id)

      toast.success("Testimonial deleted")

      load()

    } catch (err) {

      toast.error(err.message)

    }

  }

  return (

    <div className="space-y-6">

      <div>

        <h2 className="text-2xl font-bold">Testimonials</h2>

        <p className="text-gray-500">
          Manage client reviews and feedback
        </p>

      </div>

      <div className="bg-white rounded-xl shadow">

        <div className="flex justify-between items-center p-5 border-b">

          <h3 className="font-semibold">
            All Testimonials ({items.length})
          </h3>

          <button
            onClick={() => {
              setForm({
                name: "",
                role: "",
                company: "",
                review: "",
                rating: 5
              })
              setModal(true)
            }}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >

            + Add Testimonial

          </button>

        </div>

        {loading ? (

          <div className="flex justify-center py-16">

            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

          </div>

        ) : items.length === 0 ? (

          <div className="text-center py-16 text-gray-400">

            <div className="text-4xl mb-3">⭐</div>

            <p>No testimonials yet. Add your first client review!</p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-gray-50 text-left">

                <tr>
                  <th className="p-3">Avatar</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Company</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">Review</th>
                  <th className="p-3">Actions</th>
                </tr>

              </thead>

              <tbody>

                {items.map(t => (

                  <tr key={t.id} className="border-t">

                    <td className="p-3">

                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">

                        {t.avatar_initials || "?"}

                      </div>

                    </td>

                    <td className="p-3 font-medium">
                      {t.name}
                    </td>

                    <td className="p-3 text-gray-500">
                      {t.role || "—"}
                    </td>

                    <td className="p-3">

                      {t.company && (

                        <span className="px-2 py-1 text-xs bg-gray-100 rounded">
                          {t.company}
                        </span>

                      )}

                    </td>

                    <td className="p-3 text-yellow-500 text-sm">
                      {stars(t.rating)}
                    </td>

                    <td className="p-3 text-gray-500">
                      {truncate(t.review, 70)}
                    </td>

                    <td className="p-3">

                      <button
                        onClick={() => handleDelete(t.id)}
                        className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                      >

                        Delete

                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {modal && (

        <Modal title="Add Testimonial" onClose={() => setModal(false)}>

          <form onSubmit={handleSave} className="space-y-4 text-black">

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

                <label className="text-sm font-medium">Role</label>

                <input
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />

              </div>

            </div>

            <div>

              <label className="text-sm font-medium">Company</label>

              <input
                value={form.company}
                onChange={e => setForm({ ...form, company: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />

            </div>

            <div>

              <label className="text-sm font-medium">
                Rating: {form.rating}/5
              </label>

              <div className="flex items-center gap-3 mt-2">

                <input
                  type="range"
                  min="1"
                  max="5"
                  value={form.rating}
                  onChange={e => setForm({ ...form, rating: parseInt(e.target.value) })}
                  className="w-full"
                />

                <span className="text-yellow-500">
                  {stars(form.rating)}
                </span>

              </div>

            </div>

            <div>

              <label className="text-sm font-medium">Review *</label>

              <textarea
                required
                rows="4"
                value={form.review}
                onChange={e => setForm({ ...form, review: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />

            </div>

            <div className="flex justify-end gap-3 pt-3">

              <button
                type="button"
                onClick={() => setModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {saving ? "Adding..." : "Add Testimonial"}
              </button>

            </div>

          </form>

        </Modal>

      )}

    </div>

  )

}