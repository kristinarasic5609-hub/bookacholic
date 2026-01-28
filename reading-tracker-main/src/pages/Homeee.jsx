import { useState, useEffect } from "react";
import { Menu, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/SideBar";
import Header from "../components/Header";


export default function Home({ user, onLogout }) {
  useEffect(() => {
    console.log("User prop:", user);
  }, [user]);



  const [menuOpen, setMenuOpen] = useState(false);
  const [topBooks, setTopBooks] = useState([]);
  const [currentBook, setCurrentBook] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/books")
      .then(res => res.json())
      .then(data => {
        console.log("Books fetched:", data);

        const books = data.books || data;
        const sorted = books.sort((a, b) => b.rating - a.rating);
        setTopBooks(sorted.slice(0, 3));

        if (user.currentlyReading && user.currentlyReading.length > 0) {
          const bookId = user.currentlyReading[0].bookId;

          const book = books.find(b => b.id === bookId);

          if (book) {
            setCurrentBook(book);
            console.log("Found currentBook:", book);
          } else {
            console.log("No matching book for currentlyReading:", bookId);
          }
        }
      })
      .catch(err => console.error("Error fetching books:", err));
  }, [user]);



  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  return (
    <div className="p-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} user={user} />
      <div className="pt-16 px-4 flex flex-col items-center">
        <h1 className="text-black text-2xl font-bold mb-8">
          Welcome, {user.username}!
        </h1>

        {currentBook && (
          <div
            onClick={() => handleBookClick(currentBook.id)}
            className="cursor-pointer bg-white border-4 border-green-500 rounded-lg shadow-lg p-6 w-80 mb-10 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {currentBook.title}
              </h2>
              <p className="text-gray-600">by {currentBook.author}</p>
              <p className="text-sm text-gray-500 italic">{currentBook.genre}</p>
            </div>
            <div className="mt-4 text-center text-green-700 font-semibold">
              📖 Continue Reading
            </div>
          </div>
        )}

        <h2 className="text-xl text-black font-semibold mb-6">
          🔥 Top Books People Are Reading
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {topBooks.map((book) => (
            <div
              key={book.id}
              className="relative bg-white border-4 border-yellow-600 rounded-lg shadow-lg p-6 w-60 h-80 flex flex-col justify-between overflow-hidden group"
            >
              <div>
                <h3 className="text-lg font-bold text-gray-800">{book.title}</h3>
                <p className="text-gray-600">by {book.author}</p>
                <p className="text-sm text-gray-500 italic">{book.genre}</p>
                <p className="text-sm text-yellow-700 mt-2">⭐ {book.rating}/5</p>
              </div>
              <div className="text-center text-yellow-700 font-semibold">
                📖 Keep Reading!
              </div>
              <Link
                to={`/book/${encodeURIComponent(book.id)}`}
                className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <span className="bg-yellow-500 text-black px-4 py-2 rounded font-semibold shadow-lg hover:bg-yellow-400 cursor-pointer">
                  See More
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
