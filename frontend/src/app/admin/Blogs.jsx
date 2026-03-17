import React, { useState, useEffect } from "react";
import * as adminApi from "../../../service/adminapi";
import { Modal } from "./component/Modal";
import { toast } from "./component/Toast";

function slugify(text){
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g,"-")
    .replace(/[^\w-]+/g,"")
    .replace(/--+/g,"-")
}

function truncate(str,len){
  if(!str) return ""
  return str.length>len?str.substring(0,len)+"...":str
}

function formatDate(dateStr){
  if(!dateStr) return ""
  const date=new Date(dateStr)
  return date.toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})
}

export default function Blogs(){

  const [items,setItems]=useState([])
  const [loading,setLoading]=useState(true)
  const [modal,setModal]=useState(null)

  const [form,setForm]=useState({
    title:"",
    slug:"",
    excerpt:"",
    content:"",
    category:"",
    read_time:"",
    publish_date:""
  })

  const [saving,setSaving]=useState(false)

  async function load(){
    setLoading(true)

    try{
      const res=await adminApi.getBlogs()
      setItems(res.data||[])
    }
    catch(err){
      toast.error(err.message)
    }
    finally{
      setLoading(false)
    }
  }

  useEffect(()=>{load()},[])

  function openAdd(){
    setForm({
      title:"",
      slug:"",
      excerpt:"",
      content:"",
      category:"",
      read_time:"",
      publish_date:""
    })
    setModal("add")
  }

  function openEdit(item){
    setForm({
      title:item.title||"",
      slug:item.slug||"",
      excerpt:item.excerpt||"",
      content:item.content||"",
      category:item.category||"",
      read_time:item.read_time||"",
      publish_date:item.publish_date?item.publish_date.substring(0,10):""
    })
    setModal(item)
  }

  async function handleSave(e){

    e.preventDefault()
    setSaving(true)

    const payload={
      ...form,
      slug:form.slug||slugify(form.title)
    }

    try{

      if(modal==="add"){
        await adminApi.addBlog(payload)
        toast.success("Blog created")
      }
      else{
        await adminApi.updateBlog(modal.id,payload)
        toast.success("Blog updated")
      }

      setModal(null)
      load()

    }
    catch(err){
      toast.error(err.message)
    }
    finally{
      setSaving(false)
    }

  }

  async function handleDelete(id){

    if(!confirm("Delete this blog post?")) return

    try{

      await adminApi.deleteBlog(id)
      toast.success("Blog deleted")
      load()

    }
    catch(err){
      toast.error(err.message)
    }

  }

return (
  <div className="space-y-6 text-black">

    {/* Header */}
    <div>
      <h2 className="text-xl md:text-2xl font-bold">Blog Posts</h2>
      <p className="text-gray-500 text-sm md:text-base">
        Write and manage your articles
      </p>
    </div>

    {/* Container */}
    <div className="bg-white rounded-xl shadow">

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-5 border-b">
        <h3 className="font-semibold text-sm md:text-base">
          All Posts ({items.length})
        </h3>

        <button
          onClick={openAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 w-full sm:w-auto"
        >
          + New Post
        </button>
      </div>

      {/* Loading / Empty */}
      {loading ? (
        <div className="p-10 text-center text-gray-500">
          Loading...
        </div>
      ) : items.length === 0 ? (
        <div className="p-10 text-center text-gray-400">
          📝 No posts yet
        </div>
      ) : (
        <>
          {/* 🔥 Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Excerpt</th>
                  <th className="p-3">Read Time</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {items.map(b => (
                  <tr key={b.id} className="border-t">
                    <td className="p-3 font-medium">{b.title}</td>

                    <td className="p-3">
                      <span className="px-2 py-1 text-xs bg-gray-100 rounded">
                        {b.category || "General"}
                      </span>
                    </td>

                    <td className="p-3 text-gray-500">
                      {truncate(b.excerpt, 60)}
                    </td>

                    <td className="p-3 text-gray-500">
                      {b.read_time || "-"}
                    </td>

                    <td className="p-3 text-gray-500">
                      {formatDate(b.publish_date)}
                    </td>

                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => openEdit(b)}
                        className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(b.id)}
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

          {/* 🔥 Mobile Cards */}
          <div className="md:hidden space-y-4 p-4">
            {items.map(b => (
              <div key={b.id} className="border rounded-lg p-4 space-y-2 shadow-sm">

                <div className="font-semibold">{b.title}</div>

                <div className="text-xs text-gray-500">
                  {formatDate(b.publish_date)} • {b.read_time || "-"}
                </div>

                <div className="text-sm text-gray-600">
                  {truncate(b.excerpt, 80)}
                </div>

                <div>
                  <span className="px-2 py-1 text-xs bg-gray-100 rounded">
                    {b.category || "General"}
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => openEdit(b)}
                    className="flex-1 px-3 py-2 text-xs bg-gray-200 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(b.id)}
                    className="flex-1 px-3 py-2 text-xs bg-red-500 text-white rounded"
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

    {/* 🔥 Modal */}
    {modal && (
      <Modal
        title={modal === "add" ? "New Blog Post" : "Edit Blog Post"}
        onClose={() => setModal(null)}
      >

        <form onSubmit={handleSave} className="space-y-4">

          <div>
            <label className="text-sm font-medium">Title *</label>
            <input
              required
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full mt-1 border rounded-lg px-3 py-2"
            />
          </div>

          {/* 🔥 Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="text-sm font-medium">Slug</label>
              <input
                value={form.slug}
                onChange={e => setForm({ ...form, slug: e.target.value })}
                className="w-full mt-1 border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Category</label>
              <input
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full mt-1 border rounded-lg px-3 py-2"
              />
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="text-sm font-medium">Read Time</label>
              <input
                value={form.read_time}
                onChange={e => setForm({ ...form, read_time: e.target.value })}
                className="w-full mt-1 border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Publish Date</label>
              <input
                type="date"
                value={form.publish_date}
                onChange={e => setForm({ ...form, publish_date: e.target.value })}
                className="w-full mt-1 border rounded-lg px-3 py-2"
              />
            </div>

          </div>

          <div>
            <label className="text-sm font-medium">Excerpt</label>
            <input
              value={form.excerpt}
              onChange={e => setForm({ ...form, excerpt: e.target.value })}
              className="w-full mt-1 border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Content</label>
            <textarea
              rows="6"
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              className="w-full mt-1 border rounded-lg px-3 py-2"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={() => setModal(null)}
              className="px-4 py-2 text-sm bg-gray-200 rounded-lg w-full sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg w-full sm:w-auto"
            >
              {saving ? "Saving..." : "Publish"}
            </button>

          </div>

        </form>

      </Modal>
    )}

  </div>
)

}