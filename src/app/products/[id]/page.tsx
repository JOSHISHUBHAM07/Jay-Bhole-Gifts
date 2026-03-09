"use client";

import { useState, use, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Truck, Shield, ChevronRight, Share2, Heart, Gift } from "lucide-react";
import AddToCartButton from "@/components/ui/AddToCartButton";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const [product, setProduct] = useState<any>(null);
    const [activeImage, setActiveImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [customText, setCustomText] = useState("");
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await fetch(`/api/products/${unwrappedParams.id}`);
                const data = await res.json();
                if (data && !data.error) {
                    setProduct({
                        id: data._id,
                        name: data.name,
                        price: data.price,
                        rating: data.rating || 4.8,
                        reviews: data.reviews || 124,
                        description: data.description,
                        features: data.features || ["100% Premium Material", "Quality Assured", "Fast Shipping"],
                        images: data.images && data.images.length > 0 ? data.images : ["https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
                        category: data.category,
                        canCustomize: data.canCustomize || false,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch product", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [unwrappedParams.id]);

    if (loading) {
        return <div className="min-h-screen bg-[#0F0F12] flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#FF6F91]/20 border-t-[#FF6F91] rounded-full animate-spin" /></div>;
    }

    if (!product) {
        return <div className="min-h-screen bg-[#0F0F12] flex items-center justify-center text-white text-2xl font-bold">Product Not Found</div>;
    }

    return (
        <div className="bg-[#0F0F12] min-h-screen -mt-24 pt-32 pb-20">
            <div className="container mx-auto px-4 md:px-6">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs font-bold text-[#B5B5C0]/50 uppercase tracking-widest mb-10">
                    <Link href="/" className="hover:text-[#FF6F91] transition-colors">Home</Link>
                    <ChevronRight className="w-3 h-3" />
                    <Link href={`/products?category=${product.category.toLowerCase()}`} className="hover:text-[#FF6F91] transition-colors">{product.category}</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-white truncate max-w-[200px]">{product.name}</span>
                </nav>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Image Gallery */}
                    <div className="flex flex-col-reverse md:flex-row gap-4">
                        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible hide-scrollbar">
                            {product.images.map((img: string, idx: number) => (
                                <button key={idx} onClick={() => setActiveImage(idx)} className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === idx ? "border-[#FF6F91] shadow-[0_0_15px_rgba(255,111,145,0.3)]" : "border-white/10 opacity-50 hover:opacity-100"}`}>
                                    <Image src={img} alt={`Thumb ${idx + 1}`} fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full aspect-square md:aspect-auto md:h-[600px] rounded-2xl overflow-hidden bg-[#1A1A20] border border-white/[0.06] flex-1 group">
                            <AnimatePresence mode="wait">
                                <motion.div key={activeImage} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="absolute inset-0">
                                    <Image src={product.images[activeImage]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" priority />
                                </motion.div>
                            </AnimatePresence>
                            <button onClick={() => setIsWishlisted(!isWishlisted)} className="absolute top-5 right-5 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/50 hover:text-[#FF6F91] hover:border-[#FF6F91]/30 transition-all z-10">
                                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#FF6F91] text-[#FF6F91]' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold tracking-widest text-[#C8A2FF] bg-[#C8A2FF]/10 px-4 py-1.5 rounded-full uppercase">{product.category}</span>
                            <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#B5B5C0] hover:text-white transition-all"><Share2 className="w-4 h-4" /></button>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">{product.name}</h1>

                        <div className="flex items-center gap-5 mb-8">
                            <div className="text-3xl font-extrabold text-[#F7C873]">${product.price.toFixed(2)}</div>
                            <div className="h-6 w-px bg-white/10" />
                            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                                <Star className="w-3.5 h-3.5 fill-[#F7C873] text-[#F7C873]" />
                                <span className="font-bold text-white text-sm">{product.rating}</span>
                                <span className="text-[#B5B5C0] text-sm ml-1">({product.reviews})</span>
                            </div>
                        </div>

                        <p className="text-[#B5B5C0] text-lg leading-relaxed mb-8">{product.description}</p>

                        {/* Customization */}
                        {product.canCustomize && (
                            <div className="mb-8 p-6 bg-[#1A1A20] rounded-2xl border border-white/[0.06]">
                                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><Gift className="w-5 h-5 text-[#FF6F91]" /> Personalize</h3>
                                <p className="text-sm text-[#B5B5C0] mb-4">Add initials or a short name to be engraved.</p>
                                <input type="text" placeholder="E.g., JS or John" maxLength={10} value={customText} onChange={(e) => setCustomText(e.target.value)} className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#B5B5C0]/40 focus:outline-none focus:border-[#FF6F91]/50 focus:shadow-[0_0_10px_rgba(255,111,145,0.1)] transition-all font-bold" />
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                            <div className="flex items-center border border-white/10 rounded-full bg-white/5 p-1 w-full sm:w-32 h-14 shrink-0">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 text-white transition-colors text-lg">-</button>
                                <span className="flex-1 text-center font-bold text-white">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 text-white transition-colors text-lg">+</button>
                            </div>
                            <AddToCartButton
                                product={{ id: product.id, name: product.name, price: product.price, image: product.images[0], category: product.category }}
                                quantity={quantity}
                                customization={customText}
                            />
                        </div>

                        {/* Guarantees */}
                        <div className="grid grid-cols-2 gap-4 pt-6 mt-8 border-t border-white/5">
                            <div className="flex items-center gap-3 p-4 bg-[#1A1A20] rounded-xl border border-white/[0.06]">
                                <Truck className="w-5 h-5 text-[#C8A2FF]" />
                                <div><h4 className="font-bold text-white text-sm">Free Delivery</h4><p className="text-xs text-[#B5B5C0]">3-5 days</p></div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-[#1A1A20] rounded-xl border border-white/[0.06]">
                                <Shield className="w-5 h-5 text-[#F7C873]" />
                                <div><h4 className="font-bold text-white text-sm">Quality Guarantee</h4><p className="text-xs text-[#B5B5C0]">30-day returns</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
