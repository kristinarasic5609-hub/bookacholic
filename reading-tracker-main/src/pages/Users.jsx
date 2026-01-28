import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function AdminUsers({ user }) {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch("http://localhost:5000/users", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                const users = data.users || data;
                setUsers(users);
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    }, []);

    const handleReport = (user) => {
        alert(`Reported user: ${user.username}`);
    };

    return (
        <div className="p-8">

            <button
                onClick={() => navigate(-1)}
                className="mb-4 bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400"
            >
                ← Back
            </button>

            <h2 className="text-2xl font-bold mb-4 text-black">All Users</h2>
            <table className="min-w-full bg-white shadow rounded text-black">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-2 text-left">Username</th>
                        <th className="p-2 text-left">Email</th>
                        <th className="p-2 text-left">Age</th>
                        <th className="p-2 text-left">Gender</th>
                        <th className="p-2 text-left">Role</th>
                        <th className="p-2 text-left">Report</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-b">
                            <td className="p-2">{user.username}</td>
                            <td className="p-2">{user.email}</td>
                            <td className="p-2">{user.age}</td>
                            <td className="p-2">{user.gender}</td>
                            <td className="p-2">{user.role}</td>
                            <td className="p-2">
                                <button
                                    onClick={() => handleReport(user)}
                                    className="text-red-600 hover:text-red-800 font-bold"
                                >
                                    ⚠️
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
