import { Link } from "react-router-dom";

export default function AdminDashboard({ user, onLogout }) {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-black">Admin Dashboard</h1>
                <button
                    onClick={onLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                    to="/users"
                    className="p-6 bg-white shadow rounded hover:bg-yellow-100 transition"
                >
                    Manage Users
                </Link>

                <Link
                    to="/alter"
                    className="p-6 bg-white shadow rounded hover:bg-yellow-100 transition"
                >
                    Alter Books
                </Link>

                <Link
                    to="/add"
                    className="p-6 bg-white shadow rounded hover:bg-yellow-100 transition"
                >
                    Add Book
                </Link>

                <Link
                    to="/req"
                    className="p-6 bg-white shadow rounded hover:bg-yellow-100 transition"
                >
                    Review requests
                </Link>
            </section>

            <footer className="mt-12 text-gray-500">
                Logged in as: <strong>{user.username}</strong> ({user.role})
            </footer>
        </div>
    );
}
