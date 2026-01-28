import { useState, useEffect } from "react";

export default function AdminBooks() {
    const [books, setBooks] = useState([]);
    const [selectedBookId, setSelectedBookId] = useState("");
    const [bookData, setBookData] = useState(null);

    const fetchBooks = () => {
        const token = localStorage.getItem('token');

        fetch("http://localhost:5000/books", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
               
                const books = data.books || data;
                setBooks(books);
                console.log(`Loaded ${books.length} books`);
            })
            .catch((error) => {
                console.error('Error fetching books:', error);
            });
    };

    useEffect(() => {
        fetchBooks();
    }, []);


    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'bookAdded') {
                console.log('Book added event detected, refreshing list...');
                fetchBooks();
                localStorage.removeItem('bookAdded'); 
            }
        };

        window.addEventListener('storage', handleStorageChange);


        const handleVisibilityChange = () => {
            if (!document.hidden && localStorage.getItem('bookAdded')) {
                console.log('Page became visible and bookAdded flag found, refreshing...');
                fetchBooks();
                localStorage.removeItem('bookAdded');
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const handleSelect = (e) => {
        const bookId = e.target.value;
        setSelectedBookId(bookId);
        const book = books.find((b) => b.id === bookId);
        setBookData(book || null);
    };

    const handleChange = (e) => {
        setBookData({ ...bookData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        if (!bookData) return;

        const token = localStorage.getItem('token');

        const bookDataToSend = {
            ...bookData,
            year: Number(bookData.year),
            rating: Number(bookData.rating),
            pages: Number(bookData.pages)
        };

        console.log('Sending book data:', bookDataToSend);

        fetch(`http://localhost:5000/books/${bookData.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(bookDataToSend),
        })
            .then((res) => {
                if (!res.ok) {
                    return res.json().then(errorData => {
                        console.error('Backend error:', errorData);
                        throw new Error(`HTTP error! status: ${res.status}, message: ${errorData.message || 'Unknown error'}`);
                    });
                }
                return res.json();
            })
            .then((updatedBook) => {
                setBooks(books.map((b) => (b.id === updatedBook.id ? updatedBook : b)));
                alert(`Book "${updatedBook.title}" updated successfully!`);
            })
            .catch((error) => {
                console.error('Error updating book:', error);
                alert(`Failed to update book: ${error.message}`);
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

            <h2 className="text-2xl font-bold mb-4 text-black">Alter Books</h2>

            <select
                value={selectedBookId}
                onChange={handleSelect}
                className="border p-2 mb-4 rounded w-80 bg-gray-800 text-white"
            >
                <option value="">Select a book</option>
                {books.map((book) => (
                    <option key={book.id} value={book.id}>
                        {book.title}
                    </option>
                ))}
            </select>

            {bookData && (
                <fieldset className="border p-4 rounded w-96">
                    <legend className="font-bold mb-2 text-black">Edit Book</legend>
                    <div className="flex flex-col gap-2">
                        <label className="flex flex-col text-black">
                            Title:
                            <input
                                type="text"
                                name="title"
                                value={bookData.title}
                                onChange={handleChange}
                                className="border px-2 py-1 rounded w-full text-white bg-gray-800 placeholder-gray-400"
                            />
                        </label>

                        <label className="flex flex-col text-black">
                            Author:
                            <input
                                type="text"
                                name="author"
                                value={bookData.author}
                                onChange={handleChange}
                                className="border px-2 py-1 rounded w-full text-white bg-gray-800 placeholder-gray-400"
                            />
                        </label>

                        <label className="flex flex-col text-black">
                            Genre:
                            <input
                                type="text"
                                name="genre"
                                value={bookData.genre}
                                onChange={handleChange}
                                className="border px-2 py-1 rounded w-full text-white bg-gray-800 placeholder-gray-400"
                            />
                        </label>

                        <label className="flex flex-col text-black">
                            Year:
                            <input
                                type="number"
                                name="year"
                                value={bookData.year}
                                onChange={handleChange}
                                className="border px-2 py-1 rounded w-full text-white bg-gray-800 placeholder-gray-400"
                            />
                        </label>

                        <label className="flex flex-col text-black">
                            Rating:
                            <input
                                type="number"
                                name="rating"
                                value={bookData.rating}
                                min="1"
                                max="5"
                                onChange={handleChange}
                                className="border px-2 py-1 rounded w-full text-white bg-gray-800 placeholder-gray-400"
                            />
                        </label>

                        <label className="flex flex-col text-black">
                            Pages:
                            <input
                                type="number"
                                name="pages"
                                value={bookData.pages}
                                onChange={handleChange}
                                className="border px-2 py-1 rounded w-full text-white bg-gray-800 placeholder-gray-400"
                            />
                        </label>

                        <label className="flex flex-col text-black">
                            Description:
                            <textarea
                                name="description"
                                value={bookData.description}
                                onChange={handleChange}
                                className="border px-2 py-1 rounded w-full text-white bg-gray-800 placeholder-gray-400"
                                rows="4"
                            />
                        </label>

                        <button
                            onClick={handleSave}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2"
                        >
                            Save
                        </button>
                    </div>
                </fieldset>
            )}
        </div>
    );
}
