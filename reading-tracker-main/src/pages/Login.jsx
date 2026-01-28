import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import image from '../jsonfiles/image1.png';

function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await axios.post("http://localhost:5000/users/login", {
                username,
                password
            });

            if (res.data.token && res.data.user) {
                localStorage.setItem("token", res.data.token);

                onLogin(res.data.user);

                console.log("✅ Login successful", res.data.user);

                if (res.data.user.role === 'admin') {
                    console.log("Admin user detected, redirecting to admin dashboard");
                    navigate("/admin");
                } else {
                    console.log("Regular user detected, redirecting to home");
                    navigate("/home");
                }
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#f5e7d4] flex items-center justify-center">
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
                        Please log in!
                    </p>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full max-w-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
                        <div>
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-3 py-2 border border-[#b8a38a] bg-[#faf8f3] rounded focus:outline-none focus:ring-1 focus:ring-[#b48a5a] text-[#333333] placeholder-gray-400"
                                required
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-[#b8a38a] bg-[#faf8f3] rounded focus:outline-none focus:ring-1 focus:ring-[#b48a5a] text-[#333333] placeholder-gray-400"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 w-full bg-[#b48a5a] text-white py-2 px-4 rounded hover:bg-[#a0784a] focus:outline-none focus:ring-2 focus:ring-[#8d6630] disabled:opacity-50 transition-colors"
                        >
                            {loading ? "Logging in..." : "Login in!"}
                        </button>
                    </form>

                    <div className="mt-6 text-sm text-[#333333] text-center">
                        <p>
                            Don't already have an account?{" "}
                            <a href="/signup" className="underline hover:text-[#b48a5a]">
                                Sign up!
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
