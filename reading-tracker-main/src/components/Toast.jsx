import { useEffect } from "react";

export default function Toast({ message, type = "success", onClose, duration = 3000 }) {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const bgColor = type === "success" 
        ? "bg-gradient-to-r from-green-500 to-green-600" 
        : type === "error" 
        ? "bg-gradient-to-r from-red-500 to-red-600" 
        : "bg-gradient-to-r from-yellow-500 to-yellow-600";

    const icon = type === "success" 
        ? "✓" 
        : type === "error" 
        ? "✕" 
        : "⚠";

    return (
        <div className="fixed top-20 right-6 z-50 animate-slide-in">
            <div className={`${bgColor} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[320px] max-w-md backdrop-blur-sm border border-white/20`}>
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-xl font-bold backdrop-blur-sm">
                    {icon}
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-base leading-tight">{message}</p>
                </div>
                <button
                    onClick={onClose}
                    className="flex-shrink-0 text-white/90 hover:text-white transition-colors text-2xl leading-none font-light hover:scale-110 transform duration-200"
                    aria-label="Close"
                >
                    ×
                </button>
            </div>
        </div>
    );
}
