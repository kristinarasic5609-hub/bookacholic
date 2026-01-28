import { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import Header from "../components/Header";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function Statistics({ user }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [monthlyStats, setMonthlyStats] = useState([]);

    useEffect(() => {
        if (!user || !user.finished) return;

        const months = Array.from({ length: 12 }, (_, i) => ({
            month: new Date(0, i).toLocaleString("en-US", { month: "short" }),
            count: 0,
        }));

        user.finished.forEach((entry) => {
            let finishedDate;
            if (typeof entry === "string") {
                finishedDate = new Date();
            } else if (entry.finishedAt) {
                finishedDate = new Date(entry.finishedAt);
            } else {
                return;
            }

            const monthIndex = finishedDate.getMonth();
            if (months[monthIndex]) months[monthIndex].count += 1;
        });

        setMonthlyStats(months);
    }, [user]);

    return (
        <div className="min-h-screen bg-100">
            <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} user={user} />

            <div className="pt-24 md:pt-32 px-6 md:px-12 lg:px-20 flex flex-col items-center w-full">
                <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                    {user.username}'s Reading Stats
                </h1>

                {monthlyStats.length === 0 ? (
                    <p className="text-gray-600 text-lg">Loading stats...</p>
                ) : (
                    <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-6 md:p-10">
                        <ResponsiveContainer width="100%" height={450}>
                            <BarChart
                                data={monthlyStats}
                                margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="month" tick={{ fontSize: 14, fill: "#4B5563" }} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 14, fill: "#4B5563" }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#f9fafb", borderRadius: "10px", border: "1px solid #d1d5db" }}
                                />
                                <Bar dataKey="count" fill="#f59e0b" radius={[10, 10, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    
    );
}
