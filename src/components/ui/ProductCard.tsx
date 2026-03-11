"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Star, ShoppingBag, Eye, Heart } from "lucide-react";
import { useRef } from "react";
import { useToast } from "@/components/effects/Toast";

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    rating: number;
    image: string;
    category: string;
    isNew?: boolean;
}

export default function ProductCard({ id, name, price, rating, image, category, isNew }: ProductCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { showToast } = useToast();

    // 3D Tilt
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };
    const handleMouseLeave = () => { x.set(0); y.set(0); };

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        showToast(`${name} added to cart!`, "success");
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformPerspective: 800 }}
            className="group relative bg-[#202028] rounded-2xl p-3 border border-white/[0.06] flex flex-col h-full overflow-hidden card-glow will-change-transform"
        >
            {/* Hover glow */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: "inset 0 0 50px rgba(255,111,145,0.06)" }} />

            {/* Badges */}
            <div className="absolute top-5 left-5 z-10 flex flex-col gap-2">
                {isNew && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.3 }} className="bg-gradient-to-r from-[#FF6F91] to-[#C8A2FF] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-[0_0_15px_rgba(255,111,145,0.4)] uppercase tracking-wider">
                        New
                    </motion.span>
                )}
            </div>

            {/* Wishlist — always visible on touch, hover-only on desktop */}
            <button className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/50 hover:text-[#FF6F91] hover:border-[#FF6F91]/30 hover:scale-110 transition-all md:opacity-0 md:group-hover:opacity-100">
                <Heart className="w-4 h-4" />
            </button>

            {/* Image */}
            <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4 bg-[#1A1A20]">
                <Image src={image} alt={name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" unoptimized className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-2 hover:bg-white/20 transition-all">
                        <Eye className="w-3.5 h-3.5" /> Quick View
                    </motion.button>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 px-1 pb-1">
                <div className="text-[10px] text-[#C8A2FF] font-bold tracking-widest uppercase mb-1.5">{category}</div>
                <Link href={`/products/${id}`} className="group-hover:text-[#FF6F91] transition-colors">
                    <h3 className="font-bold text-[1rem] text-white line-clamp-2 mb-3 leading-snug">{name}</h3>
                </Link>
                <div className="mt-auto flex items-end justify-between">
                    <div className="flex flex-col">
                        <span className="text-xl font-extrabold text-[#F7C873]">${price.toFixed(2)}</span>
                        <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3.5 h-3.5 fill-[#F7C873] text-[#F7C873]" />
                            <span className="text-xs font-semibold text-[#B5B5C0]">{rating.toFixed(1)}</span>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={handleQuickAdd}
                        className="bg-white/5 border border-white/10 text-white px-3 md:px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#FF6F91] hover:border-[#FF6F91] hover:shadow-[0_0_20px_rgba(255,111,145,0.3)] transition-all flex items-center gap-1.5 min-h-[40px]"
                    >
                        <ShoppingBag className="w-3.5 h-3.5" /> Add
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
