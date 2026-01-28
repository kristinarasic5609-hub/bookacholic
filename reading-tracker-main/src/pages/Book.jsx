import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/SideBar";
import Header from "../components/Header";
import { booksAPI } from "../utils/api";

export default function Book({ user, onUpdate }) {
    const { bookId: rawBookId } = useParams();
    const bookId = decodeURIComponent(rawBookId);
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [similarBooks, setSimilarBooks] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [userBookStatus, setUserBookStatus] = useState(null);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);

    useEffect(() => {
        const fetchBookData = async () => {
            try {
            
                const bookResponse = await booksAPI.getById(bookId);
                const selectedBook = bookResponse.data;

                if (!selectedBook) {
                    console.error(`Book with ID ${bookId} not found`);
                    navigate("/home");
                    return;
                }

                setBook(selectedBook);

             
                const allBooksResponse = await booksAPI.getAll({
                    limit: 1000, 
                    genre: selectedBook.genre 
                });

                const allBooks = allBooksResponse.data.books || [];
                const similar = allBooks
                    .filter(b => b.genre === selectedBook.genre && b.id && b.id !== selectedBook.id)
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 3);

                setSimilarBooks(similar);

            } catch (err) {
                console.error("Error fetching book data:", err);
             
                try {
                    const response = await booksAPI.getAll({ limit: 1000 });
                    const books = response.data.books || [];

                    const selected = books.find(b => {
                        if (!b.id) return false;
                        return b.id.toString() === bookId.toString();
                    });

                    if (!selected) {
                        console.error(`Book with ID ${bookId} not found in fallback`);
                        navigate("/home");
                        return;
                    }

                    setBook(selected);

                    const similar = books
                        .filter(b => b.genre === selected.genre && b.id && b.id !== selected.id)
                        .sort((a, b) => b.rating - a.rating)
                        .slice(0, 3);

                    setSimilarBooks(similar);
                } catch (fallbackErr) {
                    console.error("Fallback fetch also failed:", fallbackErr);
                    navigate("/home");
                }
            }
        };

        fetchBookData();
    }, [bookId, navigate]);

    useEffect(() => {
        if (!user || !book) return;

        if (user.currentlyReading?.some(b => b.bookId === book.id.toString())) setUserBookStatus("currentlyReading");
        else if (user.wantToRead?.some(b => b.bookId === book.id.toString())) setUserBookStatus("wantToRead");
        else if (user.finished?.some(b => b.bookId === book.id.toString())) setUserBookStatus("finished");
        else setUserBookStatus(null);
    }, [user, book]);

    if (!book) return <div className="pt-16 px-4">Loading...</div>;

    const statusLabels = {
        currentlyReading: "📖 Reading Now",
        wantToRead: "📚 To Read",
        finished: "✅ Already Read",
    };

    const handleStatusChange = async (status) => {
        if (!user || !book) return;

        const now = new Date().toISOString();
        const updatedUser = { ...user };

        updatedUser.currentlyReading = updatedUser.currentlyReading?.filter(b => b.bookId !== book.id.toString()) || [];
        updatedUser.wantToRead = updatedUser.wantToRead?.filter(b => b.bookId !== book.id.toString()) || [];
        updatedUser.finished = updatedUser.finished?.filter(b => b.bookId !== book.id.toString()) || [];

        if (status === "currentlyReading") updatedUser.currentlyReading.push({ bookId: book.id.toString(), startedAt: now });
        if (status === "wantToRead") updatedUser.wantToRead.push({ bookId: book.id.toString(), addedAt: now });
        if (status === "finished") updatedUser.finished.push({ bookId: book.id.toString(), finishedAt: now });

        onUpdate(updatedUser);
        setUserBookStatus(status);
        setShowStatusDropdown(false);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/users/${user.id}/reading-lists`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentlyReading: updatedUser.currentlyReading,
                    wantToRead: updatedUser.wantToRead,
                    finished: updatedUser.finished
                }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to update user data on server");
            }
        } catch (err) {
            console.error(err);
            alert("Could not update user library. Try again.");
        }
    };

    const handleRemoveBook = async () => {
        if (!user || !book) return;

        const updatedUser = { ...user };

        updatedUser.currentlyReading = updatedUser.currentlyReading?.filter(b => b.bookId !== book.id.toString()) || [];
        updatedUser.wantToRead = updatedUser.wantToRead?.filter(b => b.bookId !== book.id.toString()) || [];
        updatedUser.finished = updatedUser.finished?.filter(b => b.bookId !== book.id.toString()) || [];

        onUpdate(updatedUser);
        setUserBookStatus(null);
        setShowStatusDropdown(false);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/users/${user.id}/reading-lists`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentlyReading: updatedUser.currentlyReading,
                    wantToRead: updatedUser.wantToRead,
                    finished: updatedUser.finished
                }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to remove book");
            }
        } catch (err) {
            console.error(err);
            alert("Could not remove book. Try again.");
        }
    };

    return (
        <div className="p-0">
            <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} user={user} />

            <div className="pt-16 px-4 flex flex-col items-center">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="bg-white border-4 border-yellow-600 rounded-lg shadow-lg p-6 w-64 h-80 flex flex-col justify-center items-center">
                        <h3 className="text-lg font-bold text-gray-800 text-center">{book.title}</h3>
                        <p className="text-gray-600 text-center">by {book.author}</p>
                    </div>
                    <div className="flex-1 flex flex-col">
                        <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
                        <p className="text-gray-700 mb-2">by {book.author}</p>
                        <p className="text-yellow-700 font-semibold mb-2">⭐ {book.rating}/5</p>
                        <p className="text-gray-500 mb-2">Genre: {book.genre}</p>
                        <p className="text-gray-500 mb-4">Year: {book.year}</p>
                        <p className="text-gray-500 mb-4">Page number: {book.pages}</p>
                        <p className="text-gray-800">{book.description}</p>

                        <div className="flex gap-4 mt-6 relative">
                            {userBookStatus ? (
                                <div className="relative flex items-center gap-2">
                                    <button
                                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 font-semibold text-black"
                                        onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                                    >
                                        {statusLabels[userBookStatus]}
                                    </button>
                                    <button
                                        className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-400"
                                        onClick={handleRemoveBook}
                                    >
                                        Remove
                                    </button>

                                    {showStatusDropdown && (
                                        <div className="absolute top-full mt-1 bg-white border rounded shadow w-40 z-10 text-black">
                                            {Object.entries(statusLabels).map(([key, label]) => (
                                                <div
                                                    key={key}
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleStatusChange(key)}
                                                >
                                                    {label}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <button
                                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400"
                                        onClick={() => handleStatusChange("currentlyReading")}
                                    >
                                        Reading Now
                                    </button>
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
                                        onClick={() => handleStatusChange("wantToRead")}
                                    >
                                        Read Later
                                    </button>
                                    <button
                                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400"
                                        onClick={() => handleStatusChange("finished")}
                                    >
                                        Already Read
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <h2 className="text-xl font-semibold mt-12 mb-4 w-full text-black">
                    More books in {book.genre}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-5xl">
                    {similarBooks.map(b => (
                        <Link key={b.id} to={`/book/${encodeURIComponent(b.id)}`}>
                            <div className="bg-white border-2 border-gray-400 rounded-lg shadow p-4 w-52 h-64 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
                                <div>
                                    <h3 className="text-md font-bold text-gray-800">{b.title}</h3>
                                    <p className="text-gray-600">by {b.author}</p>
                                    <p className="text-sm text-gray-500 italic">{b.genre}</p>
                                    <p className="text-sm text-yellow-700 mt-1">⭐ {b.rating}/5</p>
                                </div>
                                <div className="text-center text-yellow-700 font-semibold mt-2">
                                    📖 Keep Reading!
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
