import React, { useState, useEffect } from "react";
import * as adminApi from "../../../service/adminapi";
import { toast } from "./component/Toast";

function formatDate(dateStr) {
  if (!dateStr) return ""

  const date = new Date(dateStr)

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

export default function Messages() {

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {

    setLoading(true)

    try {

      const res = await adminApi.getMessages()
      setItems(res.data || [])

    } catch (err) {

      toast.error(err.message)

    }
    finally {

      setLoading(false)

    }

  }

  useEffect(() => { load() }, [])

  async function handleDelete(id) {

    if (!confirm("Delete this message?")) return

    try {

      await adminApi.deleteMessage(id)

      toast.success("Message deleted")

      load()

    } catch (err) {

      toast.error(err.message)

    }

  }

  return (

    <div className="space-y-6 text-black">

      <div>
        <h2 className="text-2xl font-bold">Messages</h2>
        <p className="text-gray-500">Contact form submissions from visitors</p>
      </div>

      {loading ? (

        <div className="flex justify-center py-20">

          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

        </div>

      ) : items.length === 0 ? (

        <div className="text-center py-20 text-gray-400">
          <div className="text-4xl mb-3">📭</div>
          <p>No messages yet. Share your portfolio!</p>
        </div>

      ) : (

        <div className="space-y-5">

          {items.map(m => (

            <div
              key={m.id}
              className="bg-white rounded-xl shadow p-5 space-y-4"
            >

              <div className="flex justify-between items-start">

                <div>

                  <strong className="block text-gray-900">
                    {m.name}
                  </strong>

                  <a
                    href={`mailto:${m.email}`}
                    className="text-sm text-blue-600 hover:underline"

                  >

                    {m.email} </a>

                </div>

                <span className="text-xs text-gray-400">
                  {formatDate(m.created_at)}
                </span>

              </div>

              {m.subject && (

                <div className="text-sm text-gray-700">

                  <strong>Subject:</strong> {m.subject}

                </div>

              )}

              <div className="text-gray-600 text-sm leading-relaxed">

                {m.message}

              </div>

              <div className="flex gap-3 pt-2">

                <a
                  href={`mailto:${m.email}?subject=Re: ${m.subject || "Your message"}`}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"

                >

                  Reply ✉️ </a>

                <button
                  onClick={() => handleDelete(m.id)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"

                >

                  Delete </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  )

}
