"use client";
import React, { useState } from "react";
import { adminLogin } from "../../../service/adminapi";
import { toast } from "./component/Toast";

export default function Login({ onLogin }) {

    const [form, setForm] = useState({ email: "", password: "" })
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    async function submit(e) {

        e.preventDefault()
        setLoading(true)

        try {

            const data = await adminLogin(form)

            localStorage.setItem("admin_token", data.data.token)

            toast.success("Login successful")

            onLogin()

        } catch (err) {

            toast.error(err.message || "Login failed")

        }
        finally {

            setLoading(false)

        }

    }

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 text-black">

            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">

                <div className="text-center space-y-2">

                    <div className="text-4xl">⚡</div>

                    <h1 className="text-2xl font-bold">Admin Login</h1>

                    <p className="text-gray-500 text-sm">
                        Welcome back! Please login to continue.
                    </p>

                </div>

                <form onSubmit={submit} className="space-y-5">

                    <div>

                        <label className="text-sm font-medium">Email</label>

                        <div className="relative mt-1">

                            <span className="absolute left-3 top-2.5 text-gray-400">
                                📧
                            </span>

                            <input
                                type="email"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                placeholder="[admin@example.com](mailto:admin@example.com)"
                                required
                                disabled={loading}
                                className="w-full border rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>

                    </div>

                    <div>

                        <label className="text-sm font-medium">Password</label>

                        <div className="relative mt-1">

                            <span className="absolute left-3 top-2.5 text-gray-400">
                                🔒
                            </span>

                            <input
                                type={showPassword ? "text" : "password"}
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                placeholder="••••••••"
                                required
                                disabled={loading}
                                className="w-full border rounded-lg pl-9 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-gray-400"

                            >

                                {showPassword ? "👁️" : "👁️‍🗨️"} </button>

                        </div>

                    </div>

                    <div className="flex justify-between items-center text-sm">

                        <label className="flex items-center gap-2 text-gray-600">

                            <input type="checkbox" className="rounded" />

                            Remember me

                        </label>

                        <a href="#" className="text-blue-600 hover:underline">
                            Forgot password?
                        </a>

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"

                    >

                        {loading ? (
                            <> <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Signing in...
                            </>
                        ) : (
                            "Login to Dashboard"
                        )}

                    </button>

                </form>


                </div>

            </div>

        </div>

    )

}
