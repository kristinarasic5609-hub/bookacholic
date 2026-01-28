import { useState } from "react";

export default function AddBooks() {
    const [bookData, setBookData] = useState({
        title: "",
        author: "",
        genre: "",
        year: "",
        rating: "",
        pages: "",
        description: "",
    });

    const handleChange = (e) => {
        setBookData({ ...bookData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        for (const key in bookData) {
            if (!bookData[key]) {
                alert(`Please fill in the ${key} field.`);
                return;
            }
        }

        const newBook = {
            ...bookData,
            id: Date.now().toString(),
            year: Number(bookData.year),
            rating: Number(bookData.rating),
            pages: Number(bookData.pages),
        };

        console.log('Sending new book data:', newBook);

        const token = localStorage.getItem('token');

        fetch("http://localhost:5000/books", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(newBook),
        })
            .then((res) => {
                console.log('Response status:', res.status);
                if (!res.ok) {
                    return res.json().then(errorData => {
                        console.error('Backend error:', errorData);
                        throw new Error(`Failed to add book: ${errorData.message || 'Unknown error'}`);
                    });
                }
                return res.json();
            })
            .then((savedBook) => {
                console.log('Book saved successfully:', savedBook);
                localStorage.setItem('bookAdded', 'true'); 
                alert("Book added successfully!");
                window.history.back();
            })
            .catch((err) => {
                console.error('Error adding book:', err);
                alert(`Failed to add book: ${err.message}`);
            });
    };

    return (
        <div className="p-8">
            <button
                onClick={() => window.history.back()}
                className="mb-4 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 text-black"
            >
                ← Back
            </button>

            <h2 className="text-2xl text-black font-bold mb-4">Add New Book</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={bookData.title}
                    onChange={handleChange}
                    required
                    className="border px-2 py-1 rounded w-full"
                />

                <input
                    type="text"
                    name="author"
                    placeholder="Author"
                    value={bookData.author}
                    onChange={handleChange}
                    required
                    className="border px-2 py-1 rounded w-full"
                />

                <input
                    type="text"
                    name="genre"
                    placeholder="Genre"
                    value={bookData.genre}
                    onChange={handleChange}
                    required
                    className="border px-2 py-1 rounded w-full"
                />

                <input
                    type="number"
                    name="year"
                    placeholder="Year"
                    value={bookData.year}
                    onChange={handleChange}
                    required
                    className="border px-2 py-1 rounded w-full"
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
                    className="border px-2 py-1 rounded w-full"
                />

                <input
                    type="number"
                    name="pages"
                    placeholder="Pages"
                    value={bookData.pages}
                    onChange={handleChange}
                    required
                    className="border px-2 py-1 rounded w-full"
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={bookData.description}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="border px-2 py-1 rounded w-full"
                />

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add Book
                </button>
            </form>
        </div>
    );
}
