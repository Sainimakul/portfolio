import React, { useState, useEffect } from "react"
import { deleteSocialLink, getSocialLinks, updateSocialLink, addSocialLink } from "../../../service/adminapi"
import { Modal } from "./component/Modal"
import { toast } from "./component/Toast"

export default function SocialLinks() {

    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(null)

    const [form, setForm] = useState({
        platform: "",
        url: "",
        order_index: 1
    })

    const [saving, setSaving] = useState(false)

    useEffect(() => { load() }, [])

    async function load() {

        try {

            setLoading(true)

            const res = await getSocialLinks()

            setItems(res.data || [])

        } catch (err) {

            toast.error(err.message)

        }
        finally {

            setLoading(false)

        }

    }

    function openAdd() {

        setForm({
            platform: "",
            url: "",
            order_index: items.length + 1
        })

        setModal("add")

    }

    function openEdit(item) {

        setForm({
            platform: item.platform || "",
            url: item.url || "",
            order_index: item.order_index || 1
        })

        setModal(item)

    }

    async function handleSave(e) {

        e.preventDefault()

        setSaving(true)

        try {

            if (modal === "add") {

                await addSocialLink(form)

                toast.success("Social link added")

            } else {

                await updateSocialLink(modal.id, form)

                toast.success("Social link updated")

            }

            setModal(null)

            load()

        } catch (err) {

            toast.error(err.message)

        }
        finally {

            setSaving(false)

        }

    }

    async function handleDelete(id) {

        if (!confirm("Delete this link?")) return

        try {

            await deleteSocialLink(id)

            toast.success("Deleted")

            load()

        } catch (err) {

            toast.error(err.message)

        }

    }

    return (

        <div className="space-y-6 text-black">

            <div>

                <h2 className="text-2xl font-bold">Social Links</h2>

                <p className="text-gray-500">
                    Manage social media links displayed in your portfolio
                </p>

            </div>

            <div className="bg-white rounded-xl shadow">

                <div className="flex justify-between items-center p-5 border-b">

                    <h3 className="font-semibold">
                        All Links ({items.length})
                    </h3>

                    <button
                        onClick={openAdd}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        + Add Link
                    </button>

                </div>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>

                ) : (
<>
<div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm">

                            <thead className="bg-gray-50 text-left">

                                <tr>
                                    <th className="p-3">Order</th>
                                    <th className="p-3">Platform</th>
                                    <th className="p-3">URL</th>
                                    <th className="p-3">Actions</th>
                                </tr>

                            </thead>

                            <tbody>

                                {items.map(link => (

                                    <tr key={link.id} className="border-t">

                                        <td className="p-3">
                                            {link.order_index}
                                        </td>

                                        <td className="p-3 font-medium">
                                            {link.platform}
                                        </td>

                                        <td className="p-3 text-blue-600">
                                            <a href={link.url} target="_blank">
                                                {link.url}
                                            </a>
                                        </td>

                                        <td className="p-3 space-x-2">

                                            <button
                                                onClick={() => openEdit(link)}
                                                className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDelete(link.id)}
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
                    {/* 📱 MOBILE VIEW */}
{/* 📱 MOBILE VIEW */}
<div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">

  {items.map(link => (
    <div
      key={link.id}
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 space-y-4"
    >

      {/* Top */}
      <div className="flex items-center gap-3">

        {/* Icon */}
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
          {link.platform?.charAt(0)?.toUpperCase() || "?"}
        </div>

        {/* Platform Info */}
        <div className="flex-1">
          <h3 className="font-semibold text-sm">
            {link.platform}
          </h3>
          <p className="text-xs text-gray-400">
            Order #{link.order_index}
          </p>
        </div>

      </div>

      {/* URL */}
      <a
        href={link.url}
        target="_blank"
        className="text-sm text-blue-600 break-all hover:underline"
      >
        {link.url}
      </a>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2 pt-2">

        <button
          onClick={() => openEdit(link)}
          className="text-xs bg-gray-100 py-2 rounded-full"
        >
          Edit
        </button>


        <button
          onClick={() => handleDelete(link.id)}
          className="text-xs bg-red-500 text-white py-2 rounded-full"
        >
          Delete
        </button>

      </div>

    </div>
  ))}

</div>
</>
                )}

            </div>

            {modal && (

                <Modal
                    title={modal === "add" ? "Add Social Link" : "Edit Social Link"}
                    onClose={() => setModal(null)}
                >

                    <form onSubmit={handleSave} className="space-y-4">

                        <div>

                            <label className="text-sm font-medium">
                                Platform
                            </label>

                            <input
                                required
                                value={form.platform}
                                onChange={e => setForm({ ...form, platform: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2 mt-1"
                                placeholder="GitHub / LinkedIn / Twitter"
                            />

                        </div>

                        <div>

                            <label className="text-sm font-medium">
                                URL
                            </label>

                            <input
                                required
                                value={form.url}
                                onChange={e => setForm({ ...form, url: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2 mt-1"
                            />

                        </div>

                        <div>

                            <label className="text-sm font-medium">
                                Order
                            </label>

                            <input
                                type="number"
                                value={form.order_index}
                                onChange={e => setForm({ ...form, order_index: parseInt(e.target.value) })}
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
                                {saving ? "Saving..." : "Save"}
                            </button>

                        </div>

                    </form>

                </Modal>

            )}

        </div>

    )

}