"use client"
import React, { useState, useEffect } from "react"
import  {getMessages,deleteMessage } from "../../../service/adminapi"
import { toast } from "./component/Toast"
import { Modal } from "./component/Modal"
import dynamic from "next/dynamic"

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })
import "react-quill/dist/quill.snow.css"

function formatDate(dateStr) {
  if (!dateStr) return ""
  return new Date(dateStr).toLocaleString()
}

export default function Messages() {

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [reply, setReply] = useState("")
  const [sending, setSending] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await getMessages()
      setItems(res.data || [])
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id) {
    if (!confirm("Delete this message?")) return
    await deleteMessage(id)
    toast.success("Deleted")
    load()
  }

  async function handleSendReply() {
    if (!reply) return toast.error("Write something")

    setSending(true)
    try {
      await sendReply({
        to: selected.email,
        subject: `Re: ${selected.subject || "Your message"}`,
        message: reply
      })

      toast.success("Reply sent")
      setSelected(null)
      setReply("")
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSending(false)
    }
  }

  return (

    <div className="h-full flex flex-col text-black">

      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-bold">Inbox</h2>
        <p className="text-gray-500 text-sm">Manage user messages</p>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-xl shadow overflow-hidden">

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            📭 No messages
          </div>
        ) : (

          <div className="divide-y">

            {items.map(m => (

              <div
                key={m.id}
                onClick={() => setSelected(m)}
                className="p-4 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
              >

                <div className="min-w-0">

                  <div className="font-medium truncate">
                    {m.name}
                  </div>

                  <div className="text-sm text-gray-500 truncate">
                    {m.subject || m.message?.substring(0, 60)}
                  </div>

                </div>

                <div className="text-xs text-gray-400 whitespace-nowrap">
                  {formatDate(m.created_at)}
                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* 🔥 Reply Modal */}
      {selected && (

        <Modal
          title={`Reply to ${selected.name}`}
          onClose={() => setSelected(null)}
        >

          <div className="space-y-4">

            {/* Message Preview */}
            <div className="bg-gray-50 p-3 rounded text-sm">

              <div className="font-medium">{selected.name}</div>
              <div className="text-gray-500 text-xs">{selected.email}</div>

              {selected.subject && (
                <div className="mt-2">
                  <strong>Subject:</strong> {selected.subject}
                </div>
              )}

              <p className="mt-2 text-gray-600">
                {selected.message}
              </p>

            </div>

            {/* Editor */}
            <div>
              <label className="text-sm font-medium">Reply</label>

              <div className="mt-2">
                <ReactQuill
                  value={reply}
                  onChange={setReply}
                  className="bg-white"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-2">

              <button
                onClick={() => handleDelete(selected.id)}
                className="px-3 py-2 text-sm bg-red-500 text-white rounded"
              >
                Delete
              </button>

              <button
                onClick={handleSendReply}
                disabled={sending}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {sending ? "Sending..." : "Send Reply"}
              </button>

            </div>

          </div>

        </Modal>

      )}

    </div>
  )
}