"use client";

export default function Loading() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#0F0F12]">
            {/* Animated logo pulse */}
            <div className="relative mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF6F91] to-[#C8A2FF] flex items-center justify-center text-white font-extrabold text-2xl shadow-[0_0_30px_rgba(255,111,145,0.3)] animate-pulse">
                    J
                </div>
                <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF6F91] to-[#C8A2FF] animate-ping opacity-20" />
            </div>

            {/* Skeleton shimmer bars */}
            <div className="w-48 space-y-3">
                <div className="h-3 rounded-full bg-gradient-to-r from-white/5 via-white/10 to-white/5 animate-[shimmer_1.5s_ease-in-out_infinite] bg-[length:200%_100%]" />
                <div className="h-3 rounded-full bg-gradient-to-r from-white/5 via-white/10 to-white/5 animate-[shimmer_1.5s_ease-in-out_infinite_0.2s] bg-[length:200%_100%] w-3/4 mx-auto" />
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </div>
    );
}
