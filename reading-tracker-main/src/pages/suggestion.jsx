import { useState } from "react";
import Sidebar from "../components/SideBar";
import Header from "../components/Header";
import Toast from "../components/Toast";

export default function Suggestion({ user }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [toast, setToast] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        author: "",
        year: "",
        genre: "",
        rating: "",
        pages: "",
        description: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            setToast({ message: "You must be logged in to add a book!", type: "error" });
            return;
        }

        const payload = {
            id: Date.now().toString(),
            title: formData.title,
            author: formData.author,
            year: Number(formData.year),
            genre: formData.genre,
            ...(formData.rating && { rating: Number(formData.rating) }),
            ...(formData.pages && { pages: Number(formData.pages) }),
            ...(formData.description && { description: formData.description }),
        };

        try {
            const res = await fetch("http://localhost:5000/books", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (res.status === 201) {
                setToast({ message: "Book added successfully! 🎉", type: "success" });
                setFormData({ title: "", author: "", year: "", genre: "", rating: "", pages: "", description: "" });
            } else if (res.status === 401) {
                setToast({ message: "You are not authorized. Please log in again.", type: "error" });
            } else {
                const data = await res.json();
                setToast({ message: data.message || 'Failed to add book. Please check the input.', type: "error" });
            }
        } catch (error) {
            console.error("Error adding book:", error);
            setToast({ message: "Something went wrong. Please try again.", type: "error" });
        }
    };

    return (
        <div className="p-0">
            <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} user={user} />
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="pt-20 px-6 max-w-lg mx-auto">
                <h1 className="text-2xl font-bold mb-6 text-center text-black">
                    Add a Book
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="bg-100 p-6 rounded-2xl shadow-lg space-y-4"
                >
                    <input
                        type="text"
                        name="title"
                        placeholder="Book Title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg"
                        required
                    />

                    <input
                        type="text"
                        name="author"
                        placeholder="Author"
                        value={formData.author}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg"
                        required
                    />

                    <input
                        type="number"
                        name="year"
                        placeholder="Year"
                        value={formData.year}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg"
                        required
                    />

                    <input
                        type="text"
                        name="genre"
                        placeholder="Genre"
                        value={formData.genre}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg"
                        required
                    />

                    <input
                        type="number"
                        name="rating"
                        placeholder="Rating (1-5) - Optional"
                        min="1"
                        max="5"
                        value={formData.rating}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg"
                    />

                    <input
                        type="number"
                        name="pages"
                        placeholder="Number of Pages - Optional"
                        min="1"
                        value={formData.pages}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg"
                    />

                    <textarea
                        name="description"
                        placeholder="Description - Optional"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full p-2 border rounded-lg"
                    />

                    <button
                        type="submit"
                        className="w-full bg-yellow-500 text-black py-2 rounded-lg hover:bg-yellow-600"
                    >
                        Add Book
                    </button>
                </form>
            </div>
        </div>
    );
}
