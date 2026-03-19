"use client"
import React, { useState, useEffect, useCallback } from "react"
import { getMessages, deleteMessage, sendReply } from "../../../service/adminapi"
import { Modal } from "./component/Modal"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Link from "@tiptap/extension-link"
import { success, error } from "../../util/toast";

/* ─────────────────────── helpers ─────────────────────── */
function formatDate(dateStr) {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now - d
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function getInitials(name = "") {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
}

const AVATAR_COLORS = [
  "bg-violet-500", "bg-blue-500", "bg-emerald-500",
  "bg-amber-500", "bg-rose-500", "bg-indigo-500", "bg-teal-500"
]
function avatarColor(name = "") {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

/* ─────────────────────── ToolbarBtn ─────────────────────── */
function ToolbarBtn({ onClick, active, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`
        inline-flex items-center justify-center w-8 h-8 rounded text-sm font-medium transition-all
        ${active
          ? "bg-slate-800 text-white"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}
      `}
    >
      {children}
    </button>
  )
}

/* ─────────────────────── RichEditor ─────────────────────── */
function RichEditor({ value, onChange }) {
  const editor = useEditor({
  extensions: [
    StarterKit,
    Underline,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    Link.configure({ openOnClick: false }),
  ],
  content: value,
  onUpdate: ({ editor }) => onChange(editor.getHTML()),

  // ✅ ADD THIS LINE
  immediatelyRender: false,

  editorProps: {
    attributes: {
      class:
        "prose prose-sm max-w-none min-h-[140px] p-3 focus:outline-none text-slate-800 leading-relaxed",
    },
  },
})

  const setLink = useCallback(() => {
    if (!editor) return
    const url = window.prompt("Enter URL")
    if (url) editor.chain().focus().setLink({ href: url }).run()
  }, [editor])

  if (!editor) return null

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-400 transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-slate-100 bg-slate-50">
        {/* Text style group */}
        <div className="flex items-center gap-0.5">
          <ToolbarBtn
            title="Bold"
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <strong>B</strong>
          </ToolbarBtn>
          <ToolbarBtn
            title="Italic"
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <em>I</em>
          </ToolbarBtn>
          <ToolbarBtn
            title="Underline"
            active={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <span style={{ textDecoration: "underline" }}>U</span>
          </ToolbarBtn>
          <ToolbarBtn
            title="Strikethrough"
            active={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <span style={{ textDecoration: "line-through" }}>S</span>
          </ToolbarBtn>
        </div>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Heading group */}
        <div className="flex items-center gap-0.5">
          <ToolbarBtn
            title="Heading 1"
            active={editor.isActive("heading", { level: 1 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            <span className="text-xs font-bold">H1</span>
          </ToolbarBtn>
          <ToolbarBtn
            title="Heading 2"
            active={editor.isActive("heading", { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <span className="text-xs font-bold">H2</span>
          </ToolbarBtn>
        </div>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Lists */}
        <div className="flex items-center gap-0.5">
          <ToolbarBtn
            title="Bullet list"
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </ToolbarBtn>
          <ToolbarBtn
            title="Numbered list"
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5h10M9 12h10M9 19h10M5 5v.01M5 12v.01M5 19v.01" />
            </svg>
          </ToolbarBtn>
          <ToolbarBtn
            title="Blockquote"
            active={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 7a2 2 0 012-2h2a2 2 0 012 2v4a4 4 0 01-4 4H4a1 1 0 010-2h1a2 2 0 002-2H5a2 2 0 01-2-2V7zm10 0a2 2 0 012-2h2a2 2 0 012 2v4a4 4 0 01-4 4h-1a1 1 0 010-2h1a2 2 0 002-2h-2a2 2 0 01-2-2V7z" />
            </svg>
          </ToolbarBtn>
        </div>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Align */}
        <div className="flex items-center gap-0.5">
          <ToolbarBtn title="Align left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8M4 18h12" /></svg>
          </ToolbarBtn>
          <ToolbarBtn title="Align center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M8 12h8M6 18h12" /></svg>
          </ToolbarBtn>
        </div>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Link + Code */}
        <div className="flex items-center gap-0.5">
          <ToolbarBtn title="Insert link" active={editor.isActive("link")} onClick={setLink}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.101 1.102" />
            </svg>
          </ToolbarBtn>
          <ToolbarBtn title="Code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </ToolbarBtn>
        </div>

        <div className="flex-1" />

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5">
          <ToolbarBtn title="Undo" onClick={() => editor.chain().focus().undo().run()}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 010 16H3m0-16l4-4M3 10l4 4" />
            </svg>
          </ToolbarBtn>
          <ToolbarBtn title="Redo" onClick={() => editor.chain().focus().redo().run()}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 000 16h10M21 10l-4-4m4 4l-4 4" />
            </svg>
          </ToolbarBtn>
        </div>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  )
}

/* ─────────────────────── MessageRow ─────────────────────── */
function MessageRow({ m, onClick }) {
  const color = avatarColor(m.name)

  return (
    <div
      onClick={onClick}
      className={`
        flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-all border-b border-slate-100
        ${m.replied === "false"
          ? "bg-blue-50 border-l-4 border-blue-500 hover:bg-blue-100"
          : "hover:bg-slate-50"}
      `}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 w-9 h-9 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold`}>
        {getInitials(m.name)}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        
        {/* Name + Status */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 text-sm">
              {m.name}
            </span>

            {m.replied === "false" ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">
                Pending
              </span>
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 font-medium">
                Replied
              </span>
            )}
          </div>

          <span className="text-xs text-slate-400">
            {formatDate(m.created_at)}
          </span>
        </div>

        {/* Email */}
        <div className="text-xs text-slate-500 truncate">
          📧 {m.email}
        </div>

        {/* Phone (if exists) */}
        {m.phone && (
          <div className="text-xs text-slate-500">
            📱 {m.phone}
          </div>
        )}

        {/* Subject */}
        {m.subject && (
          <div className="text-sm text-slate-700 font-medium truncate mt-1">
            {m.subject}
          </div>
        )}

        {/* Message Preview */}
        <div className="text-xs text-slate-400 truncate mt-0.5">
          {m.message?.substring(0, 60)}...
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────── Main Component ─────────────────────── */
export default function Messages() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [reply, setReply] = useState("")
  const [sending, setSending] = useState(false)
  const [activeTab, setActiveTab] = useState("unreplied") // "unreplied" | "replied"
  const [search, setSearch] = useState("")

  async function load() {
    setLoading(true)
    try {
      const res = await getMessages()
      setItems(res.data || [])
    } catch (err) {
      error(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id) {
    if (!confirm("Delete this message?")) return
    await deleteMessage(id)
    success("Deleted")
    setSelected(null)
    load()
  }

  async function handleSendReply() {
    if (!reply || reply === "<p></p>") return toast.error("Write something first")
    setSending(true)
    try {
      await sendReply({ id: selected.id,email: selected.email, subject: `Re: ${selected.subject || "Your message"}`, message: reply })
      success("Reply sent!")
      setSelected(null)
      setReply("")
      await load()
    } catch (err) {
      error(err.message)
    } finally {
      setSending(false)
    }
  }

  // Split messages by replied status
  const unreplied = items.filter(m => m.replied == "false")
  const replied = items.filter(m => m.replied == "true")
  const activeList = activeTab === "unreplied" ? unreplied : replied

  // Filter by search
  const filtered = activeList.filter(m => {
    const q = search.toLowerCase()
    return (
      !q ||
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.subject?.toLowerCase().includes(q) ||
      m.message?.toLowerCase().includes(q)
    )
  })

  const color = selected ? avatarColor(selected.name) : ""

  return (
    <div className="h-full flex flex-col text-black">

      {/* ── Header ── */}
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Inbox</h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {unreplied.length} pending · {replied.length} replied
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search messages…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
          />
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 mb-4 bg-slate-100 p-1 rounded-xl w-fit">
        {[
          { key: "unreplied", label: "Unreplied", count: unreplied.length },
          { key: "replied", label: "Replied", count: replied.length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all
              ${activeTab === tab.key
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"}
            `}
          >
            {tab.label}
            <span className={`
              inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold
              ${activeTab === tab.key
                ? tab.key === "unreplied" ? "bg-blue-600 text-white" : "bg-emerald-500 text-white"
                : "bg-slate-300 text-slate-600"}
            `}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── Message List ── */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-0">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400">Loading messages…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-2 text-slate-400">
            <span className="text-4xl">{search ? "🔍" : activeTab === "replied" ? "✅" : "📭"}</span>
            <p className="text-sm font-medium">
              {search ? "No messages match your search" : activeTab === "replied" ? "No replied messages yet" : "No pending messages"}
            </p>
          </div>
        ) : (
          <div className="overflow-y-auto flex-1">
            {filtered.map(m => (
              <MessageRow key={m.id} m={m} onClick={() => { setSelected(m); setReply("") }} />
            ))}
          </div>
        )}
      </div>

     {/* ── Reply Modal ── */}
{selected && (
  <Modal
    title={
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
          {getInitials(selected.name)}
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-slate-900 text-sm leading-tight">{selected.name}</div>
          <div className="text-xs text-slate-500 truncate">{selected.email}</div>
        </div>

        {selected.replied === "true" && (
          <span className="ml-auto flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-full border border-emerald-200">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Replied
          </span>
        )}
      </div>
    }
    onClose={() => setSelected(null)}
  >
    <div className="space-y-4">

      {/* Original Message */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span>{selected.email}</span>
          <span>·</span>
          <span>{formatDate(selected.created_at)}</span>
        </div>

        {selected.subject && (
          <div className="font-semibold text-slate-700">{selected.subject}</div>
        )}

        <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
          {selected.message}
        </p>
      </div>

      {/* Subject */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
          Subject
        </label>
        <input
          value={`Re: ${selected.subject || "Your message"}`}
          readOnly
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
        />
      </div>

      {/* 🔥 Conditional Reply Section */}
      {selected.replied === "true" ? (
        // ✅ SHOW REPLIED CONTENT
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
            Your Reply
          </label>

          <div
            className="prose prose-sm max-w-none border border-slate-200 rounded-xl p-3 bg-slate-50 text-slate-700"
            dangerouslySetInnerHTML={{
              __html: selected.reply || "<p>No reply found</p>",
            }}
          />
        </div>
      ) : (
        // ✅ SHOW EDITOR
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
            Reply
          </label>
          <RichEditor value={reply} onChange={setReply} />
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-1">

        {/* Delete Button */}
        <button
          onClick={() => handleDelete(selected.id)}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm bg-white border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0V5a1 1 0 011-1h4a1 1 0 011 1v2m-7 0h10" />
          </svg>
          Delete
        </button>

        {/* 🔥 Send Button ONLY if not replied */}
        {selected.replied !== "true" && (
          <button
            onClick={handleSendReply}
            disabled={sending}
            className="flex items-center justify-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {sending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send Reply
              </>
            )}
          </button>
        )}

      </div>
    </div>
  </Modal>
)}
    </div>
  )
}