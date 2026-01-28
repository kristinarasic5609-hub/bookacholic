import { useState, useEffect } from "react";

export default function ReviewRequests({ user }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [requests, setRequests] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [bookData, setBookData] = useState({
        title: "",
        author: "",
        genre: "",
        year: "",
        rating: "",
        pages: "",
        description: "",
    });

    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch("http://localhost:5000/requests", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                const requests = data.requests || data;
                setRequests(requests);
            })
            .catch((err) => console.error("Error fetching requests:", err));
    }, []);

    useEffect(() => {
        if (requests.length > 0 && currentIndex < requests.length) {
            const req = requests[currentIndex];
            setBookData({
                title: req.title || "",
                author: req.author || "",
                genre: req.genre || "",
                year: req.year || "",
                rating: "",
                pages: "",
                description: "",
            });
        }
    }, [requests, currentIndex]);

    const handleChange = (e) => {
        setBookData({ ...bookData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (requests.length === 0) return;

        const req = requests[currentIndex];
        const newBook = {
            ...bookData,
            id: Date.now().toString(),
            year: Number(bookData.year),
            rating: Number(bookData.rating),
            pages: Number(bookData.pages),
        };

        try {
            const token = localStorage.getItem('token');

            await fetch("http://localhost:5000/books", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newBook),
            });

            await fetch(`http://localhost:5000/requests/${req.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            alert("Book added and request removed ✅");

            const nextIndex = currentIndex + 1;
            if (nextIndex < requests.length) {
                setCurrentIndex(nextIndex);
            } else {
                setRequests([]);
            }
        } catch (error) {
            console.error("Error processing request:", error);
            alert("Something went wrong ❌");
        }
    };

    const hasRequests = requests.length > 0 && currentIndex < requests.length;

    return (
        <div className="p-0 min-h-screen bg-100">
            <div className="pt-20 px-6 max-w-lg mx-auto">

                <button
                    onClick={() => window.history.back()}
                    className="mb-4 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                    ← Back
                </button>

                <h1 className="text-2xl font-bold mb-6 text-center text-black">
                    Review Book Requests
                </h1>

                {hasRequests ? (
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white p-6 rounded-2xl shadow-lg space-y-4"
                    >
                        <input
                            type="text"
                            name="title"
                            placeholder="Book Title"
                            value={bookData.title}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-lg"
                        />

                        <input
                            type="text"
                            name="author"
                            placeholder="Author"
                            value={bookData.author}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-lg"
                        />

                        <input
                            type="text"
                            name="genre"
                            placeholder="Genre"
                            value={bookData.genre}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-lg"
                        />

                        <input
                            type="number"
                            name="year"
                            placeholder="Year"
                            value={bookData.year}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-lg"
                        />

                        <input
                            type="number"
                            name="rating"
                            placeholder="Rating (1-5)"
                            min="1"
                            max="5"
                            value={bookData.rating}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-lg"
                        />

                        <input
                            type="number"
                            name="pages"
                            placeholder="Pages"
                            value={bookData.pages}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-lg"
                        />

                        <textarea
                            name="description"
                            placeholder="Description"
                            value={bookData.description}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="w-full p-2 border rounded-lg"
                        />

                        <button
                            type="submit"
                            className="w-full bg-yellow-500 text-black py-2 rounded-lg hover:bg-yellow-600"
                        >
                            Add Book & Remove Request
                        </button>
                    </form>
                ) : (
                    <p className="text-center text-gray-600 text-xl mt-10">
                        There are no more pending requests.
                    </p>
                )}
            </div>
        </div>
    );
}
