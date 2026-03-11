"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WhatsAppWidget() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Replace with the actual admin phone number using an environment variable
    const adminPhone = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "919876543210"; 
    const message = encodeURIComponent("Hi, I need some help with your gift shop!");

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
            >
                <Link
                    href={`https://wa.me/${adminPhone}?text=${message}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] hover:scale-110 transition-all"
                    aria-label="Chat with us on WhatsApp"
                >
                    <MessageCircle className="w-7 h-7" />
                </Link>
            </motion.div>
        </AnimatePresence>
    );
}
