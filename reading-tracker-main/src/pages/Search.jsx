import { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import Header from "../components/Header";
import Pagination from "../components/Pagination";
import Sorting from "../components/Sorting";
import { Link } from "react-router-dom";
import Fuse from "fuse.js";
import { booksAPI } from "../utils/api";

export default function Search({ user }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [books, setBooks] = useState([]); 
    const [allBooks, setAllBooks] = useState([]); 
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 12;

    const [sortBy, setSortBy] = useState('title');
    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        fetchBooks();
    }, [currentPage, sortBy, sortOrder]);

    useEffect(() => {
        fetchAllBooks();
    }, []);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const response = await booksAPI.getAll({
                page: currentPage,
                limit: itemsPerPage,
                sortBy,
                sortOrder
            });

            if (response.data.books) {
         
                const validBooks = response.data.books.filter(book =>
                    book &&
                    book.id &&
                    book.title &&
                    book.author
                );
                setBooks(validBooks);
                setTotalPages(response.data.pagination.pages);
                setTotalItems(response.data.pagination.total);
            }
        } catch (err) {
            console.error("Error fetching books:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllBooks = async () => {
        try {
            const response = await booksAPI.getAll({ limit: 1000 }); 
            if (response.data.books) {
                const validBooks = response.data.books.filter(book =>
                    book &&
                    book.id &&
                    book.title &&
                    book.author
                );
                setAllBooks(validBooks);
            }
        } catch (err) {
            console.error("Error fetching all books for search:", err);
        }
    };

    useEffect(() => {
        if (!query) {
            setFilteredBooks(books);
            return;
        }

        const fuse = new Fuse(allBooks, {
            keys: ["title", "author"],
            threshold: 0.4,
        });

        const results = fuse.search(query).map((result) => result.item);
        setFilteredBooks(results);
    }, [query, books, allBooks]);

    const handleSearchChange = (e) => setQuery(e.target.value);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSortChange = (newSortBy, newSortOrder) => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder || 'asc');
        setCurrentPage(1); 
    };

    return (
        <div className="p-0 min-h-screen bg-100 flex flex-col items-center">
            <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} user={user} />

            <div className="pt-20 flex flex-col items-center w-full px-4">
                <div className="w-full max-w-4xl">
                    <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                        Search Books
                    </h1>

                    <form
                        onSubmit={handleSearchSubmit}
                        className="flex flex-col items-center w-full max-w-md mx-auto mb-8"
                    >
                        <input
                            type="text"
                            value={query}
                            onChange={handleSearchChange}
                            placeholder="Type the name of the book or author..."
                            className="w-full p-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button
                            type="submit"
                            className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            Search
                        </button>
                    </form>

                    {!query && (
                        <div className="mb-6">
                            <Sorting
                                sortBy={sortBy}
                                sortOrder={sortOrder}
                                onSortChange={handleSortChange}
                            />
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                                {filteredBooks.length > 0 ? (
                                    filteredBooks.filter(book => book && book.id).map((book) => {
                                        const bookUrl = `/book/${encodeURIComponent(book.id)}`;
                                        return (
                                            <Link
                                                key={book.id}
                                                to={bookUrl}
                                                className="bg-white border border-gray-200 rounded-lg shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 hover:border-green-300"
                                                onClick={(e) => {
                                                 
                                                }}
                                            >
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                                                        {book.title}
                                                    </h3>
                                                    <p className="text-gray-600 mb-1">by {book.author}</p>
                                                    <p className="text-sm text-gray-500 italic mb-2">{book.genre}</p>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-yellow-600">⭐ {book.rating}/5</span>
                                                        <span className="text-gray-500">{book.year}</span>
                                                    </div>
                                                </div>
                                                <div className="text-center text-green-600 font-semibold mt-3">
                                                    📖 View Details
                                                </div>
                                            </Link>
                                        );
                                    })
                                ) : (
                                    <div className="col-span-full text-center py-12">
                                        <p className="text-gray-600 text-lg">
                                            {query ? 'No books found matching your search.' : 'No books available.'}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {!query && totalPages > 1 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                    totalItems={totalItems}
                                    itemsPerPage={itemsPerPage}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
