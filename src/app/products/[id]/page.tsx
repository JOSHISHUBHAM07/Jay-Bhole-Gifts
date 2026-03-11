"use client";

import { useState, use, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Truck, Shield, ChevronRight, Share2, Heart, Gift } from "lucide-react";
import AddToCartButton from "@/components/ui/AddToCartButton";
import { trackProductView } from "@/lib/recently-viewed";
import RecentlyViewed from "@/components/ui/RecentlyViewed";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const [product, setProduct] = useState<any>(null);
    const [activeImage, setActiveImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [customText, setCustomText] = useState("");
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [loading, setLoading] = useState(true);

    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [reviewMsg, setReviewMsg] = useState({ text: "", type: "" });
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

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
                        rating: data.averageRating || 4.8,
                        reviews: data.numReviews || 0,
                        reviewsList: data.reviews || [],
                        variants: data.variants || [],
                        stock: data.stock || 0,
                        description: data.description,
                        features: data.features || ["100% Premium Material", "Quality Assured", "Fast Shipping"],
                        images: data.images && data.images.length > 0 ? data.images : ["https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
                        category: data.category,
                        canCustomize: data.canCustomize || false,
                    });
                    if (data.variants && data.variants.length > 0) {
                        setSelectedVariant(data.variants[0]);
                    }

                    // Fetch Related Products
                    try {
                        const relRes = await fetch(`/api/products?category=${data.category}`);
                        const relData = await relRes.json();
                        if (Array.isArray(relData)) {
                            setRelatedProducts(relData.filter((p: any) => p._id !== data._id).slice(0, 4));
                        }
                    } catch (e) { console.error("Failed to fetch related", e) }

                }
            } catch (error) {
                console.error("Failed to fetch product", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
        trackProductView(unwrappedParams.id);
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
                            <button
                                onClick={async () => {
                                    setIsWishlisted(!isWishlisted);
                                    try {
                                        await fetch('/api/user/wishlist', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ productId: product.id })
                                        });
                                    } catch (e) {
                                        console.error("Failed to update wishlist");
                                        setIsWishlisted(isWishlisted); // Revert on failure
                                    }
                                }}
                                className="absolute top-5 right-5 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/50 hover:text-[#FF6F91] hover:border-[#FF6F91]/30 transition-all z-10"
                            >
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

                        {/* Variants */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-widest">Options</h3>
                                <div className="flex flex-wrap gap-3">
                                    {product.variants.map((v: any, idx: number) => {
                                        const label = Object.entries(v.attributes).map(([k, val]) => `${val}`).join(" / ");
                                        const isSelected = selectedVariant?.sku === v.sku;
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedVariant(v)}
                                                className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all ${isSelected ? 'bg-white/10 border-[#FF6F91] text-white shadow-[0_0_10px_rgba(255,111,145,0.2)]' : 'bg-transparent border-white/[0.06] text-[#B5B5C0] hover:border-white/20 hover:text-white'}`}
                                            >
                                                {label} {v.priceAdjustment ? `(+$${v.priceAdjustment})` : ""}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        {((selectedVariant && selectedVariant.stock <= 0) || (!selectedVariant && product.stock <= 0)) ? (
                            <div className="mb-6 py-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center text-red-400 font-bold tracking-widest uppercase">
                                Out of Stock
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                                <div className="flex items-center border border-white/10 rounded-full bg-white/5 p-1 w-full sm:w-32 h-14 shrink-0">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 text-white transition-colors text-lg">-</button>
                                    <span className="flex-1 text-center font-bold text-white">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 text-white transition-colors text-lg">+</button>
                                </div>
                                <AddToCartButton
                                    product={{
                                        id: product.id,
                                        name: product.name,
                                        price: product.price + (selectedVariant?.priceAdjustment || 0),
                                        image: product.images[0],
                                        category: product.category
                                    }}
                                    quantity={quantity}
                                    customization={customText + (selectedVariant ? ` [Option: ${Object.values(selectedVariant.attributes).join("/")}]` : "")}
                                />
                            </div>
                        )}

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

                {/* Reviews Section */}
                <div className="mt-20 pt-16 border-t border-white/5">
                    <h2 className="text-3xl font-extrabold text-white mb-10">Customer Reviews</h2>
                    <div className="grid lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-1 bg-[#1A1A20] p-8 rounded-2xl border border-white/[0.06] h-fit">
                            <h3 className="text-xl font-bold text-white mb-2">Write a Review</h3>
                            <p className="text-sm text-[#B5B5C0] mb-6">Share your experience with this product to help others.</p>

                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                setIsSubmittingReview(true);
                                setReviewMsg({ text: "", type: "" });
                                try {
                                    const res = await fetch(`/api/products/${product.id}/reviews`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ rating: reviewRating, comment: reviewComment })
                                    });
                                    const data = await res.json();
                                    if (res.ok) {
                                        setReviewMsg({ text: "Review submitted successfully! Refresh to see.", type: "success" });
                                        setReviewComment("");
                                        setReviewRating(5);
                                    } else {
                                        setReviewMsg({ text: data.error || "Failed to submit review.", type: "error" });
                                    }
                                } catch (error) {
                                    setReviewMsg({ text: "An error occurred.", type: "error" });
                                } finally {
                                    setIsSubmittingReview(false);
                                }
                            }} className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-[#B5B5C0] mb-2 uppercase tracking-widest">Rating (1-5)</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map(r => (
                                            <button type="button" key={r} onClick={() => setReviewRating(r)} className="focus:outline-none">
                                                <Star className={`w-6 h-6 ${r <= reviewRating ? 'fill-[#F7C873] text-[#F7C873]' : 'text-white/20'}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#B5B5C0] mb-2 uppercase tracking-widest">Comment</label>
                                    <textarea required value={reviewComment} onChange={e => setReviewComment(e.target.value)} className="w-full bg-[#0F0F12] border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#FF6F91]/50 h-32" placeholder="What did you think?"></textarea>
                                </div>
                                <button type="submit" disabled={isSubmittingReview} className="w-full bg-white/5 border border-white/10 hover:bg-[#FF6F91] hover:border-[#FF6F91] text-white font-bold py-3 rounded-xl transition-all">
                                    {isSubmittingReview ? "Submitting..." : "Submit Review"}
                                </button>
                                {reviewMsg.text && (
                                    <div className={`text-sm mt-2 ${reviewMsg.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>{reviewMsg.text}</div>
                                )}
                            </form>
                        </div>

                        <div className="lg:col-span-2 flex flex-col gap-6">
                            {product.reviewsList && product.reviewsList.length > 0 ? (
                                product.reviewsList.map((rev: any, i: number) => (
                                    <div key={i} className="bg-[#1A1A20] p-6 rounded-2xl border border-white/[0.06]">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF6F91]/20 to-[#C8A2FF]/20 flex items-center justify-center text-white font-bold border border-white/10">
                                                    {rev.userName.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white">{rev.userName}</div>
                                                    <div className="text-xs text-[#B5B5C0]">{new Date(rev.createdAt).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, idx) => (
                                                    <Star key={idx} className={`w-4 h-4 ${idx < rev.rating ? 'fill-[#F7C873] text-[#F7C873]' : 'text-white/10'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-[#B5B5C0] text-sm leading-relaxed">{rev.comment}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-[#B5B5C0] bg-[#1A1A20] rounded-2xl border border-white/[0.06]">
                                    No reviews yet. Be the first to review this product!
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="mt-20 pt-16 border-t border-white/5">
                        <h2 className="text-3xl font-extrabold text-white mb-10">You May Also Like</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map(p => (
                                <Link key={p._id} href={`/products/${p._id}`} className="group relative rounded-2xl overflow-hidden bg-[#1A1A20] border border-white/[0.06] hover:border-white/20 transition-all block">
                                    <div className="relative aspect-square overflow-hidden bg-[#0F0F12]">
                                        <Image src={p.images[0]} alt={p.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-white font-bold truncate mb-1">{p.name}</h3>
                                        <div className="text-[#F7C873] font-extrabold">${p.price.toFixed(2)}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <RecentlyViewed currentProductId={product.id} />

            </div>
        </div>
    );
}
