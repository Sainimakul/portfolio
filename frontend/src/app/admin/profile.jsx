import React, { useState, useEffect } from "react";
import * as adminApi from "../../../service/adminapi";
import { toast } from "./component/Toast";

const TEMPLATES = [
    { id: 1, name: "Modern Minimal", preview: "Clean and minimal design with focus on content" },
    { id: 2, name: "Creative Portfolio", preview: "Bold colors and creative layout for artists" },
    { id: 3, name: "Corporate Professional", preview: "Professional design for business portfolios" },
    { id: 4, name: "Developer Tech", preview: "Tech-focused layout with code snippets" },
    { id: 5, name: "Photography Showcase", preview: "Full-width images and gallery layout" },
    { id: 6, name: "Interactive Bold", preview: "Dynamic animations and interactive elements" },
]

export default function Profile() {

    const [profile, setProfile] = useState({
        name: "",
        title: "",
        bio: "",
        location: "",
        email: "",
        linkedin: "",
        github: "",
        status: "available",
        projects_count: 0,
        tech_stack_count: 0,
        template_id: 1
    })

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => { loadProfile() }, [])

    async function loadProfile() {

        try {

            setLoading(true)

            const data = await adminApi.getProfile()

            setProfile(data.data || profile)

        } catch (err) {

            toast.error(err.message)

        }
        finally {

            setLoading(false)

        }

    }

    async function handleSubmit(e) {

        e.preventDefault()

        setSaving(true)

        try {

            await adminApi.updateProfile(profile)

            toast.success("Profile updated successfully")

        } catch (err) {

            toast.error(err.message)

        }
        finally {

            setSaving(false)

        }

    }

    if (loading) {

        return (

            <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )

    }

    return (

        <div className="space-y-8 max-w-5xl text-black">

            <div>
                <h2 className="text-2xl font-bold">Profile Settings</h2>
                <p className="text-gray-500">Manage your public profile and portfolio information</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Basic Info */}

                <div className="bg-white rounded-xl shadow p-6 space-y-5">

                    <h3 className="font-semibold text-lg">Basic Information</h3>

                    <div className="grid md:grid-cols-2 gap-4">

                        <div>
                            <label className="text-sm font-medium">Full Name *</label>
                            <input
                                required
                                value={profile.name}
                                onChange={e => setProfile({ ...profile, name: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2 mt-1"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Professional Title *</label>
                            <input
                                required
                                value={profile.title}
                                onChange={e => setProfile({ ...profile, title: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2 mt-1"
                            />
                        </div>

                    </div>

                    <div>

                        <label className="text-sm font-medium">Bio *</label>

                        <textarea
                            rows="4"
                            required
                            value={profile.bio}
                            onChange={e => setProfile({ ...profile, bio: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2 mt-1"
                        />

                    </div>

                    <div className="grid md:grid-cols-2 gap-4">

                        <div>

                            <label className="text-sm font-medium">Location</label>

                            <input
                                value={profile.location}
                                onChange={e => setProfile({ ...profile, location: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2 mt-1"
                            />

                        </div>

                        <div>

                            <label className="text-sm font-medium">Email *</label>

                            <input
                                type="email"
                                required
                                value={profile.email}
                                onChange={e => setProfile({ ...profile, email: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2 mt-1"
                            />

                        </div>

                    </div>

                </div>

                {/* Social */}

                <div className="bg-white rounded-xl shadow p-6 space-y-5">

                    <h3 className="font-semibold text-lg">Social Links</h3>

                    <div className="grid md:grid-cols-2 gap-4">

                        <input
                            value={profile.linkedin}
                            onChange={e => setProfile({ ...profile, linkedin: e.target.value })}
                            placeholder="LinkedIn URL"
                            className="border rounded-lg px-3 py-2"
                        />

                        <input
                            value={profile.github}
                            onChange={e => setProfile({ ...profile, github: e.target.value })}
                            placeholder="GitHub URL"
                            className="border rounded-lg px-3 py-2"
                        />

                    </div>

                </div>

                {/* Templates */}

                <div className="bg-white rounded-xl shadow p-6 space-y-5">

                    <h3 className="font-semibold text-lg">Template Selection</h3>

                    <div className="grid md:grid-cols-3 gap-4">

                        {TEMPLATES.map(t => (

                            <div
                                key={t.id}
                                onClick={() => setProfile({ ...profile, template_id: t.id })}
                                className={`border rounded-lg p-4 cursor-pointer transition
${profile.template_id == t.id ? "border-blue-500 bg-blue-50" : "hover:border-gray-300"}
`}
                            >

                                <div className="h-24 bg-gray-100 rounded mb-3 flex items-center justify-center text-sm">
                                    Template {t.id}
                                </div>

                                <h4 className="font-medium text-sm">{t.name}</h4>

                                <p className="text-xs text-gray-500 mt-1">
                                    {t.preview}
                                </p>

                            </div>

                        ))}

                    </div>

                </div>

                {/* Status */}

                <div className="bg-white rounded-xl shadow p-6 space-y-5">

                    <h3 className="font-semibold text-lg">Status & Stats</h3>

                    <div className="grid md:grid-cols-3 gap-4">

                        <select
                            value={profile.status}
                            onChange={e => setProfile({ ...profile, status: e.target.value })}
                            className="border rounded-lg px-3 py-2"
                        >
                            <option value="available">Available for work</option>
                            <option value="busy">Currently busy</option>
                            <option value="open">Open to opportunities</option>
                            <option value="hiring">Hiring</option>
                        </select>

                        <div className="border rounded-lg px-4 py-2 bg-gray-50">
                            <span className="text-sm text-gray-500">Projects</span>
                            <div className="text-lg font-semibold">{profile.projects_count}</div>
                        </div>

                        <div className="border rounded-lg px-4 py-2 bg-gray-50">
                            <span className="text-sm text-gray-500">Tech Stack</span>
                            <div className="text-lg font-semibold">{profile.tech_stack_count}</div>
                        </div>

                    </div>

                </div>

                <div className="flex justify-end gap-3">

                    <button
                        type="button"
                        onClick={loadProfile}
                        className="px-4 py-2 bg-gray-200 rounded-lg"
                    >
                        Reset
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        {saving ? "Saving..." : "Save Profile"}
                    </button>

                </div>

            </form>

        </div>

    )

}
