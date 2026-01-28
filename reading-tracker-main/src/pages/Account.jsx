import { useState, useEffect } from "react";
import { Menu, User, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "../components/SideBar";
import Header from "../components/Header";

export default function Account({ user, onUpdate, onLogout }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [formData, setFormData] = useState({
        username: user.username,
        email: user.email,
        password: "",
        age: user.age || "",
        gender: user.gender || "",
        role: user.role || "user",
    });
    const [editingFields, setEditingFields] = useState({});
    const [currentUser, setCurrentUser] = useState(user);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setCurrentUser(parsedUser);
            setFormData({
                username: parsedUser.username,
                email: parsedUser.email,
                password: "",
                age: parsedUser.age || "",
                gender: parsedUser.gender || "",
                role: parsedUser.role || "user",
            });
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleEdit = (field) => {
        setEditingFields({ ...editingFields, [field]: !editingFields[field] });
    };

    const handleSave = async () => {
        try {
            const updateData = {
                username: formData.username,
                email: formData.email,
                age: formData.age || '',
                gender: formData.gender || ''
            };

            if (formData.password && formData.password.trim() !== '') {
                updateData.password = formData.password;
            }

            const res = await fetch(`http://localhost:5000/users/${currentUser.id}/simple-update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updateData),
            });

            if (!res.ok) {
                const errorData = await res.text();
                throw new Error(`Update failed. Status: ${res.status}`);
            }

            const updatedUser = await res.json();
            setCurrentUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            if (onUpdate) onUpdate(updatedUser);
            setEditingFields({});
            setFormData(prev => ({ ...prev, password: '' }));
            alert("Account updated successfully!");
        } catch (err) {
            console.error("Account update error:", err);
            alert(`Failed to update account: ${err.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-100 relative">
            <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />


            <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} user={user} />
            <div className="pt-32 px-4 flex justify-center">
                <div
                    className="max-w-6xl border rounded-lg p-6 flex gap-8 mx-auto"
                    style={{ backgroundColor: "#f3f4f6", borderColor: "#d1d5db" }}
                >
                    <div className="flex-shrink-0 flex flex-col items-center justify-start">
                        <User size={64} className="text-gray-400 mb-2" />
                        <span className="text-black text-sm">{currentUser.username}</span>
                    </div>

                    <div className="flex-1 space-y-4 text-black">
                        <div className="flex justify-between items-center border-b border-gray-300 pb-2">
                            <div>
                                <span className="font-semibold text-black">Username: </span>
                                {editingFields.username ? (
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="border rounded px-2 py-1 text-black"
                                    />
                                ) : (
                                    <span>{formData.username}</span>
                                )}
                            </div>
                            <button onClick={() => toggleEdit("username")}>
                                <Edit size={18} className="text-gray-500 hover:text-gray-800" />
                            </button>
                        </div>

                        <div className="flex justify-between items-center border-b border-gray-300 pb-2">
                            <div>
                                <span className="font-semibold">Email: </span>
                                {editingFields.email ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="border rounded px-2 py-1 text-black"
                                    />
                                ) : (
                                    <span>{formData.email}</span>
                                )}
                            </div>
                            <button onClick={() => toggleEdit("email")}>
                                <Edit size={18} className="text-gray-500 hover:text-gray-800" />
                            </button>
                        </div>

                        <div className="flex justify-between items-center border-b border-gray-300 pb-2">
                            <div>
                                <span className="font-semibold">Age: </span>
                                {editingFields.age ? (
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="border rounded px-2 py-1 text-black"
                                    />
                                ) : (
                                    <span>{formData.age}</span>
                                )}
                            </div>
                            <button onClick={() => toggleEdit("age")}>
                                <Edit size={18} className="text-gray-500 hover:text-gray-800" />
                            </button>
                        </div>

                        <div className="flex justify-between items-center border-b border-gray-300 pb-2">
                            <div>
                                <span className="font-semibold">Gender: </span>
                                {editingFields.gender ? (
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="border rounded px-2 py-1 text-black"
                                    >
                                        <option value="">Select</option>
                                        <option value="female">Female</option>
                                        <option value="male">Male</option>
                                        <option value="other">Other</option>
                                    </select>
                                ) : (
                                    <span>{formData.gender}</span>
                                )}
                            </div>
                            <button onClick={() => toggleEdit("gender")}>
                                <Edit size={18} className="text-gray-500 hover:text-gray-800" />
                            </button>
                        </div>

                        <div className="flex justify-between items-center border-b border-gray-300 pb-2">
                            <div>
                                <span className="font-semibold">Role: </span>
                                <span>{formData.role}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center border-b border-gray-300 pb-2">
                            <div>
                                <span className="font-semibold">Password: </span>
                                {editingFields.password ? (
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="New password"
                                        className="border rounded px-2 py-1 text-black"
                                    />
                                ) : (
                                    <span>••••••••</span>
                                )}
                            </div>
                            <button onClick={() => toggleEdit("password")}>
                                <Edit size={18} className="text-gray-500 hover:text-gray-800" />
                            </button>
                        </div>

                        <div className="flex justify-end mt-4">
                            <button
                                onClick={handleSave}
                                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-400"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-4 right-4">
                <button
                    onClick={() => {
                        if (onLogout) onLogout();
                    }}
                    className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-400 shadow-lg"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
