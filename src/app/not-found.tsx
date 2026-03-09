"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
    return (
        <div className="bg-[#0F0F12] -mt-24 min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background orbs */}
            <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[#FF6F91]/8 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-[#C8A2FF]/8 rounded-full blur-[150px] pointer-events-none" />

            <div className="text-center relative z-10 px-4">
                {/* Animated 404 SVG */}
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", bounce: 0.4 }} className="mb-8">
                    <svg viewBox="0 0 400 120" className="w-[300px] md:w-[400px] mx-auto" fill="none">
                        <defs>
                            <linearGradient id="grad404" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#FF6F91" />
                                <stop offset="100%" stopColor="#C8A2FF" />
                            </linearGradient>
                        </defs>
                        <motion.text
                            x="200" y="95"
                            textAnchor="middle"
                            fill="url(#grad404)"
                            fontSize="120"
                            fontWeight="900"
                            fontFamily="var(--font-outfit), sans-serif"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                        >
                            404
                        </motion.text>
                    </svg>
                </motion.div>

                {/* Floating gift box animation */}
                <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="text-6xl mb-8"
                >
                    🎁
                </motion.div>

                <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                    Oops! Gift not found
                </motion.h2>

                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-[#B5B5C0] text-lg max-w-md mx-auto mb-10">
                    Looks like this gift has already been delivered to someone special. Let's find you something else!
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF6F91] to-[#C8A2FF] text-white px-8 py-4 rounded-full font-bold shadow-[0_0_20px_rgba(255,111,145,0.3)] hover:shadow-[0_0_30px_rgba(255,111,145,0.5)] hover:scale-105 transition-all">
                        <Home className="w-5 h-5" /> Go Home
                    </Link>
                    <Link href="/products" className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all">
                        <Search className="w-5 h-5" /> Browse Gifts
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
