import { Link } from "react-router-dom";

export default function SidebarMenu({ menuOpen, setMenuOpen, user }) {
    if (!menuOpen) return null;

    return (
        <div className="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white p-6 shadow-lg z-40">
            <button
                onClick={() => setMenuOpen(false)}
                className="mb-6 text-red-400"
            >
                Close ✖
            </button>

            <nav className="flex flex-col space-y-4">
                {user?.role === "user" && (
                    <>
                        <Link to="/home" className="hover:text-yellow-400">
                            Home
                        </Link>
                        <Link to="/suggestion" className="hover:text-yellow-400">
                            Add a book
                        </Link>
                        <Link to="/search" className="hover:text-yellow-400">
                            Search books
                        </Link>
                        <Link to="/library" className="hover:text-yellow-400">
                            Library
                        </Link>
                        <Link to="/statistics" className="hover:text-yellow-400">
                            Statistics
                        </Link>
                    </>
                )}

                {user?.role === "admin" && (
                    <>
                        <Link to="/admin" className="hover:text-yellow-400">
                            Admin Dashboard
                        </Link>
                    </>
                )}
            </nav>
        </div>
    );
}
