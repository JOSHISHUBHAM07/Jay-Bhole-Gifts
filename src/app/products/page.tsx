"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, SlidersHorizontal, ChevronDown, Sparkles } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";

const allProducts = [
    { id: "1", name: "Personalized Leather Wallet", price: 45.0, rating: 4.8, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60", category: "accessories", isNew: true },
    { id: "2", name: "Luxury Spa Gift Set", price: 85.0, rating: 4.9, image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60", category: "wellness" },
    { id: "3", name: "Custom Engraved Watch", price: 120.0, rating: 4.7, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60", category: "accessories" },
    { id: "4", name: "Artisan Chocolate Box", price: 35.0, rating: 4.6, image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60", category: "food", isNew: true },
    { id: "5", name: "Rose Gold Birthstone Necklace", price: 65.0, rating: 4.9, image: "https://images.unsplash.com/photo-1599643478514-4a11f2f01fbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60", category: "jewelry" },
    { id: "6", name: "Premium Coffee Blend Trio", price: 40.0, rating: 4.5, image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60", category: "food" },
    { id: "7", name: "Aromatherapy Diffuser", price: 55.0, rating: 4.6, image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60", category: "wellness", isNew: true },
    { id: "8", name: "Monogrammed Whiskey Glasses", price: 50.0, rating: 4.8, image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60", category: "home" },
];

const categories = ["All", "Accessories", "Wellness", "Food", "Jewelry", "Home", "Personalized", "Trending"];
const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Newest Arrivals", "Customer Rating"];

function ProductListingContent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get("category") || "all";
    const [activeCategory, setActiveCategory] = useState(categories.find(c => c.toLowerCase() === initialCategory.toLowerCase()) || "All");
    const [activeSort, setActiveSort] = useState("Featured");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [liveProducts, setLiveProducts] = useState<any[]>([]);

    // Fetch live products
    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                if (Array.isArray(data)) {
                    const formatted = data.map((p: any) => ({
                        id: p._id,
                        name: p.name,
                        price: p.price,
                        rating: p.rating || 4.8,
                        image: p.images && p.images.length > 0 ? p.images[0] : "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&q=80",
                        category: p.category,
                        isNew: p.isPopular
                    }));
                    setLiveProducts(formatted);
                }
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
        }
        fetchProducts();
    }, []);

    const sourceProducts = liveProducts.length > 0 ? liveProducts : allProducts;

    const filteredProducts = sourceProducts.filter((p) => {
        if (activeCategory === "All") return true;
        if (activeCategory === "Trending") return p.rating > 4.7;
        if (activeCategory.toLowerCase() === "personalized") return p.name.toLowerCase().includes("personalized") || p.name.toLowerCase().includes("custom");
        return p.category.toLowerCase() === activeCategory.toLowerCase();
    });

    return (
        <div className="bg-[#0F0F12] min-h-screen -mt-24 pt-32 pb-20">
            <div className="container mx-auto px-4 md:px-6">
                {/* Header */}
                <div className="mb-14">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
                        {activeCategory === "All" ? "Explore All Gifts" : `${activeCategory} Collection`}
                    </h1>
                    <p className="text-[#B5B5C0] text-lg max-w-xl">Curated with love, designed to delight.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden flex items-center justify-between">
                        <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex items-center gap-2 font-bold bg-[#1A1A20] border border-white/10 px-5 py-3 rounded-xl text-white text-sm">
                            <Filter className="w-4 h-4 text-[#FF6F91]" /> Filters
                        </button>
                        <div className="relative group">
                            <button className="flex items-center gap-2 font-bold bg-[#1A1A20] border border-white/10 px-5 py-3 rounded-xl text-white text-sm">
                                Sort: {activeSort} <ChevronDown className="w-4 h-4 text-[#C8A2FF]" />
                            </button>
                            <div className="absolute right-0 top-full mt-2 w-56 bg-[#202028] border border-white/10 shadow-2xl rounded-xl overflow-hidden opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-20">
                                {sortOptions.map((opt) => (
                                    <button key={opt} onClick={() => setActiveSort(opt)} className={`block w-full text-left px-4 py-3 text-sm font-medium border-b border-white/5 last:border-0 ${activeSort === opt ? 'text-[#FF6F91] bg-white/5' : 'text-[#B5B5C0] hover:bg-white/5 hover:text-white'}`}>{opt}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className={`lg:w-1/4 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-[#1A1A20] rounded-2xl border border-white/[0.06] p-6 sticky top-28">
                            <div className="flex items-center gap-2 font-bold text-white text-lg mb-6 border-b border-white/5 pb-4">
                                <SlidersHorizontal className="w-5 h-5 text-[#FF6F91]" /> Filter By
                            </div>
                            <div className="mb-8">
                                <h3 className="font-bold mb-4 text-xs uppercase tracking-widest text-[#B5B5C0]/60">Categories</h3>
                                <ul className="flex flex-col gap-1">
                                    {categories.map((cat) => (
                                        <li key={cat}>
                                            <button onClick={() => setActiveCategory(cat)} className={`text-sm w-full text-left px-4 py-2.5 rounded-xl font-medium transition-all ${activeCategory === cat ? 'bg-white/5 text-[#FF6F91] font-bold' : 'text-[#B5B5C0] hover:bg-white/5 hover:text-white'}`}>
                                                {cat}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold mb-4 text-xs uppercase tracking-widest text-[#B5B5C0]/60">Price Range</h3>
                                {["Under $50", "$50 - $100", "$100 - $200", "Over $200"].map((range) => (
                                    <label key={range} className="flex items-center gap-3 cursor-pointer px-4 py-2">
                                        <input type="checkbox" className="peer appearance-none w-4 h-4 rounded border border-white/20 bg-transparent checked:bg-[#FF6F91] checked:border-[#FF6F91] transition-all" />
                                        <span className="text-sm text-[#B5B5C0]">{range}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Desktop Toolbar */}
                        <div className="hidden lg:flex items-center justify-between mb-8 bg-[#1A1A20] px-6 py-4 rounded-2xl border border-white/[0.06]">
                            <div className="flex gap-3 items-center">
                                <span className="text-[#B5B5C0]/60 text-sm font-medium">{filteredProducts.length} items</span>
                                {['Trending', 'New Arrivals'].map((tag) => (
                                    <button key={tag} className="px-4 py-2 text-xs font-bold bg-white/5 text-[#B5B5C0] hover:text-white hover:bg-[#FF6F91] rounded-full transition-all flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> {tag}
                                    </button>
                                ))}
                            </div>
                            <div className="relative group">
                                <button className="flex items-center gap-2 text-sm font-bold text-[#B5B5C0] bg-white/5 px-5 py-2 rounded-full hover:text-white transition-all">
                                    Sort: {activeSort} <ChevronDown className="w-4 h-4 text-[#FF6F91]" />
                                </button>
                                <div className="absolute right-0 top-full mt-2 w-56 bg-[#202028] border border-white/10 shadow-2xl rounded-xl overflow-hidden opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-20">
                                    {sortOptions.map((opt) => (
                                        <button key={opt} onClick={() => setActiveSort(opt)} className={`block w-full text-left px-4 py-3 text-sm font-medium border-b border-white/5 last:border-0 ${activeSort === opt ? 'text-[#FF6F91] bg-white/5' : 'text-[#B5B5C0] hover:bg-white/5 hover:text-white'}`}>{opt}</button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {filteredProducts.map((product) => (
                                    <motion.div key={product.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }}>
                                        <ProductCard {...product} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {filteredProducts.length === 0 && (
                                <div className="col-span-full py-24 text-center flex flex-col items-center justify-center bg-[#1A1A20] rounded-2xl border border-white/[0.06] border-dashed">
                                    <Filter className="w-10 h-10 text-[#FF6F91] mb-4" />
                                    <h3 className="text-xl font-extrabold text-white mb-2">No products found</h3>
                                    <p className="text-[#B5B5C0] max-w-sm">Try adjusting your filters.</p>
                                    <button onClick={() => setActiveCategory("All")} className="mt-6 bg-white/5 border border-white/10 text-white px-6 py-3 rounded-full font-bold hover:bg-[#FF6F91] hover:border-[#FF6F91] transition-all">Clear all</button>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0F0F12] flex justify-center items-center"><div className="w-12 h-12 border-4 border-[#FF6F91]/20 border-t-[#FF6F91] rounded-full animate-spin" /></div>}>
            <ProductListingContent />
        </Suspense>
    );
}
