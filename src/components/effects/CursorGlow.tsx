"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorGlow() {
    const [isVisible, setIsVisible] = useState(false);
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const springConfig = { damping: 25, stiffness: 200 };
    const x = useSpring(cursorX, springConfig);
    const y = useSpring(cursorY, springConfig);

    useEffect(() => {
        const isMobile = window.matchMedia("(pointer: coarse)").matches;
        if (isMobile) return;

        setIsVisible(true);

        const move = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        window.addEventListener("mousemove", move);
        return () => window.removeEventListener("mousemove", move);
    }, [cursorX, cursorY]);

    if (!isVisible) return null;

    return (
        <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-screen"
            style={{ x, y }}
        >
            <div
                className="w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.07]"
                style={{
                    background: "radial-gradient(circle, rgba(255,111,145,0.8) 0%, rgba(200,162,255,0.4) 40%, transparent 70%)",
                }}
            />
        </motion.div>
    );
}
