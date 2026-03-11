"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { getRecentlyViewedIds } from "@/lib/recently-viewed";
import { Clock } from "lucide-react";

export default function RecentlyViewed({ currentProductId }: { currentProductId?: string }) {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRecent() {
            const ids = getRecentlyViewedIds().filter(id => id !== currentProductId);
            
            if (ids.length === 0) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch('/api/products/batch', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids })
                });
                
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error("Failed to fetch recently viewed", error);
            } finally {
                setLoading(false);
            }
        }

        fetchRecent();
    }, [currentProductId]);

    if (loading || products.length === 0) return null;

    return (
        <section className="mt-20 pt-16 border-t border-white/5">
            <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-xl bg-[#C8A2FF]/10 flex items-center justify-center text-[#C8A2FF]">
                    <Clock className="w-5 h-5" />
                </div>
                <h2 className="text-3xl font-extrabold text-white">Recently Viewed</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {products.map((p, idx) => (
                    <motion.div
                        key={p._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Link 
                            href={`/products/${p._id}`} 
                            className="group relative rounded-2xl overflow-hidden bg-[#1A1A20] border border-white/[0.06] hover:border-white/20 transition-all block"
                        >
                            <div className="relative aspect-square overflow-hidden bg-[#0F0F12]">
                                <Image 
                                    src={p.images?.[0] || 'https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'} 
                                    alt={p.name} 
                                    fill 
                                    sizes="(max-width: 768px) 50vw, 20vw" 
                                    className="object-cover group-hover:scale-105 transition-transform duration-700" 
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-white font-bold truncate text-sm mb-1">{p.name}</h3>
                                <div className="text-[#F7C873] font-extrabold text-sm">${p.price.toFixed(2)}</div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
