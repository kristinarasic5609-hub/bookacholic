import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../utils/api";
import image from '../jsonfiles/image1.png';


export default function Signup() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        age: "",
        gender: ""
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [registered, setRegistered] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setMessage("");
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const userData = {
                ...form,
                age: form.age ? parseInt(form.age) : undefined,
                gender: form.gender || undefined
            };

            const response = await authAPI.register(userData);

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));

                setRegistered(true);
                setMessage("Registration successful! Redirecting to home...");

                setTimeout(() => {
                    navigate("/home");
                }, 2000);
            }
        } catch (err) {
            console.error(err);
            if (err.response?.data?.errors) {
                const validationErrors = err.response.data.errors.map(error => error.msg).join(', ');
                setError(validationErrors);
            } else {
                setError(err.response?.data?.message || "Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#f5e7d4] flex items-center justify-center">
            {registered ? (
                <div className="bg-[#f5e7d4] p-8 w-full max-w-md text-center">
                    <div className="bg-lightgreen w-16 h-16 flex items-center justify-center rounded-full mb-4 mx-auto">
                        <svg className="w-8 h-8 text-darkgreen" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-[#333333] mb-2">Account Created!</h2>
                    <p className="text-[#333333] mb-6">{message}</p>
                    <Link to="/login" className="bg-[#b48a5a] hover:bg-[#a0784a] text-white px-6 py-2 rounded font-semibold transition-colors">
                        Go to Login
                    </Link>
                </div>
            ) : (
                <div className="w-full max-w-5xl h-[540px] bg-[#f5e7d4] flex px-10 py-8">
                    <div className="hidden md:flex w-1/3 items-center justify-center pr-8">
                        <img
                            src={image}
                            alt="Image to be added"
                            className="w-64 h-64 border-2 border-dashed border-[#b48a5a] bg-[#e4cda4] object-contain rounded"
                        />
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center">
                        <h2 className="text-2xl font-bold mb-2 text-[#333333] text-center">
                            Welcome to bookaholic!
                        </h2>
                        <p className="text-lg mb-6 text-[#333333] text-center">
                            Please sign up!
                        </p>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full max-w-sm">
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 w-full max-w-sm">
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
                            <div>
                                <input
                                    name="username"
                                    placeholder="Username"
                                    value={form.username}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-[#b8a38a] bg-[#faf8f3] rounded focus:outline-none focus:ring-1 focus:ring-[#b48a5a] text-[#333333] placeholder-gray-400"
                                    required
                                />
                            </div>

                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-[#b8a38a] bg-[#faf8f3] rounded focus:outline-none focus:ring-1 focus:ring-[#b48a5a] text-[#333333] placeholder-gray-400"
                                    required
                                />
                            </div>

                            <div>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-[#b8a38a] bg-[#faf8f3] rounded focus:outline-none focus:ring-1 focus:ring-[#b48a5a] text-[#333333] placeholder-gray-400"
                                    required
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <input
                                        type="number"
                                        name="age"
                                        placeholder="Age"
                                        value={form.age}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-[#b8a38a] bg-[#faf8f3] rounded focus:outline-none focus:ring-1 focus:ring-[#b48a5a] text-[#333333] placeholder-gray-400"
                                        min="13"
                                        max="120"
                                        required
                                    />
                                </div>

                                <div className="flex-1">
                                    <select
                                        name="gender"
                                        value={form.gender}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-[#b8a38a] bg-[#faf8f3] rounded focus:outline-none focus:ring-1 focus:ring-[#b48a5a] text-[#333333]"
                                        required
                                    >
                                        <option value="">Gender</option>
                                        <option value="female">Female</option>
                                        <option value="male">Male</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-4 w-full bg-[#b48a5a] text-white py-2 px-4 rounded hover:bg-[#a0784a] focus:outline-none focus:ring-2 focus:ring-[#8d6630] disabled:opacity-50 transition-colors"
                            >
                                {loading ? "Creating..." : "Sign up!"}
                            </button>
                        </form>

                        <div className="mt-6 text-sm text-[#333333] text-center">
                            <p>
                                Already have an account?{" "}
                                <Link to="/login" className="underline hover:text-[#b48a5a]">
                                    log in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
