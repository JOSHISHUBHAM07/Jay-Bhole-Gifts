"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Check, Sparkles } from "lucide-react";
import { useToast } from "@/components/effects/Toast";
import { useCart, CartProduct } from "@/context/CartContext";

interface AddToCartButtonProps {
    product: CartProduct;
    quantity?: number;
    customization?: string;
    className?: string;
    disabled?: boolean;
}

export default function AddToCartButton({ product, quantity = 1, customization, className = "", disabled = false }: AddToCartButtonProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
    const btnRef = useRef<HTMLButtonElement>(null);
    const { showToast } = useToast();
    const { addToCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled || isAdding) return;

        // Ripple
        const rect = btnRef.current!.getBoundingClientRect();
        const ripple = { x: e.clientX - rect.left, y: e.clientY - rect.top, id: Date.now() };
        setRipples((prev) => [...prev, ripple]);
        setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== ripple.id)), 600);

        setIsAdding(true);
        addToCart(product, quantity, customization);

        setTimeout(() => {
            setIsAdding(false);
            setIsAdded(true);
            showToast(`${product.name} added to cart!`, "success");
            setTimeout(() => setIsAdded(false), 2000);
        }, 500);
    };

    return (
        <button
            ref={btnRef}
            onClick={handleAddToCart}
            disabled={disabled || isAdding}
            className={`relative overflow-hidden ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            {/* Ripple effects */}
            {ripples.map((ripple) => (
                <motion.span
                    key={ripple.id}
                    initial={{ width: 0, height: 0, opacity: 0.5 }}
                    animate={{ width: 300, height: 300, opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute rounded-full bg-white/30 pointer-events-none -translate-x-1/2 -translate-y-1/2"
                    style={{ left: ripple.x, top: ripple.y }}
                />
            ))}

            <AnimatePresence mode="wait">
                {!isAdding && !isAdded && (
                    <motion.div key="idle" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.2 }} className="flex items-center justify-center gap-2 w-full h-full">
                        <ShoppingBag className="w-5 h-5" />
                        <span>Add to Cart</span>
                    </motion.div>
                )}
                {isAdding && (
                    <motion.div key="adding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center w-full h-full">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </motion.div>
                )}
                {isAdded && (
                    <motion.div key="added" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.5, opacity: 0 }} transition={{ type: "spring", damping: 15 }} className="flex items-center justify-center gap-2 w-full h-full text-green-300">
                        <Sparkles className="w-5 h-5" />
                        <span>Added!</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    );
}
