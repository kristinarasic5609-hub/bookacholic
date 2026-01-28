import { Link } from "react-router-dom";
import { Menu, User } from "lucide-react";

export default function Header({ setMenuOpen, menuOpen }) {
    return (
        <div className="fixed top-0 left-0 w-full flex justify-between items-center bg-gray-800 text-white px-4 py-3 shadow-md z-50">
            <button onClick={() => setMenuOpen(!menuOpen)}>
                <Menu size={28} />
            </button>

            <Link to="/account">
                <User size={28} className="cursor-pointer" />
            </Link>
        </div>
    );
}
