"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Package, Heart, Settings, LogOut, ShoppingBag, ChevronRight, Clock, Mail, Phone } from "lucide-react";

const orders = [
    { id: "JB-2834", date: "Mar 04, 2026", total: "$130.00", status: "Delivered", items: 3 },
    { id: "JB-2811", date: "Feb 28, 2026", total: "$85.00", status: "Shipped", items: 1 },
    { id: "JB-2790", date: "Feb 20, 2026", total: "$230.00", status: "Processing", items: 4 },
];
const wishlist = [
    { name: "Rose Gold Necklace", price: "$65.00", image: "https://images.unsplash.com/photo-1599643478514-4a11f2f01fbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=60" },
    { name: "Engraved Watch", price: "$120.00", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=60" },
];

const tabs = [
    { id: "orders", label: "My Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "settings", label: "Settings", icon: Settings },
];

const statusColors: { [key: string]: string } = {
    Delivered: "bg-green-500/10 text-green-400 border-green-500/20",
    Shipped: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Processing: "bg-[#FF6F91]/10 text-[#FF6F91] border-[#FF6F91]/20",
};

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("orders");

    return (
        <div className="bg-[#0F0F12] min-h-screen -mt-24 pt-32 pb-20">
            <div className="container mx-auto px-4 md:px-6 max-w-6xl">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center gap-6 mb-14">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#FF6F91] to-[#C8A2FF] flex items-center justify-center text-white text-3xl font-extrabold shadow-[0_0_30px_rgba(255,111,145,0.3)]">
                        J
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-extrabold text-white">Welcome back, John</h1>
                        <p className="text-[#B5B5C0] font-medium mt-1">johndoe@gmail.com · Member since 2024</p>
                    </div>
                    <button className="md:ml-auto flex items-center gap-2 text-sm font-bold text-[#B5B5C0] bg-white/5 border border-white/10 px-5 py-3 rounded-full hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/5 transition-all">
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>

                <div className="grid md:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <aside className="md:col-span-1">
                        <div className="bg-[#1A1A20] rounded-2xl border border-white/[0.06] p-4 sticky top-28">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all mb-1 ${activeTab === tab.id
                                            ? "bg-white/5 text-[#FF6F91]"
                                            : "text-[#B5B5C0] hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    <tab.icon className="w-5 h-5" /> {tab.label}
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* Content */}
                    <div className="md:col-span-3">
                        {activeTab === "orders" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1A1A20] rounded-2xl border border-white/[0.06] overflow-hidden">
                                <div className="p-6 border-b border-white/5">
                                    <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><Clock className="w-5 h-5 text-[#FF6F91]" /> Order History</h2>
                                </div>
                                {orders.map((o) => (
                                    <div key={o.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                                        <div className="flex flex-col gap-1 mb-3 md:mb-0">
                                            <span className="font-extrabold text-white">#{o.id}</span>
                                            <span className="text-xs text-[#B5B5C0]">{o.date} · {o.items} items</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-extrabold text-[#F7C873]">{o.total}</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[o.status]}`}>{o.status}</span>
                                            <button className="w-8 h-8 bg-white/5 rounded-full border border-white/10 text-[#B5B5C0] hover:text-white flex items-center justify-center transition-all">
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {activeTab === "wishlist" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1A1A20] rounded-2xl border border-white/[0.06] overflow-hidden">
                                <div className="p-6 border-b border-white/5">
                                    <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><Heart className="w-5 h-5 text-[#FF6F91]" /> My Wishlist</h2>
                                </div>
                                {wishlist.length === 0 ? (
                                    <div className="p-12 text-center text-[#B5B5C0]">No items yet.</div>
                                ) : (
                                    <div className="p-6 grid sm:grid-cols-2 gap-4">
                                        {wishlist.map((w, i) => (
                                            <div key={i} className="flex gap-4 items-center bg-[#202028] p-4 rounded-xl border border-white/[0.06] hover:border-white/10 transition-all">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#1A1A20]"><img src={w.image} alt={w.name} className="w-full h-full object-cover" /></div>
                                                <div className="flex-1"><h3 className="font-bold text-white text-sm">{w.name}</h3><p className="text-[#F7C873] font-extrabold text-sm mt-1">{w.price}</p></div>
                                                <button className="px-3 py-2 bg-white/5 border border-white/10 text-white font-bold text-xs rounded-full hover:bg-[#FF6F91] hover:border-[#FF6F91] transition-all"><ShoppingBag className="w-3.5 h-3.5" /></button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === "settings" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1A1A20] rounded-2xl border border-white/[0.06] overflow-hidden">
                                <div className="p-6 border-b border-white/5">
                                    <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><Settings className="w-5 h-5 text-[#FF6F91]" /> Account Settings</h2>
                                </div>
                                <form className="p-6 grid md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
                                    <div>
                                        <label className="block text-xs font-bold text-[#B5B5C0]/60 mb-2 uppercase tracking-widest">Full Name</label>
                                        <input defaultValue="John Doe" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FF6F91]/50 transition-all font-bold" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[#B5B5C0]/60 mb-2 uppercase tracking-widest">Email</label>
                                        <input defaultValue="johndoe@gmail.com" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FF6F91]/50 transition-all font-bold" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[#B5B5C0]/60 mb-2 uppercase tracking-widest">Phone</label>
                                        <input defaultValue="+91 12345 67890" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FF6F91]/50 transition-all font-bold" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[#B5B5C0]/60 mb-2 uppercase tracking-widest">City</label>
                                        <input defaultValue="Dahod" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FF6F91]/50 transition-all font-bold" />
                                    </div>
                                    <div className="md:col-span-2 pt-6 border-t border-white/5 flex justify-end">
                                        <button className="bg-gradient-to-r from-[#FF6F91] to-[#C8A2FF] text-white px-8 py-4 rounded-full font-bold shadow-[0_0_20px_rgba(255,111,145,0.3)] hover:shadow-[0_0_30px_rgba(255,111,145,0.5)] hover:scale-[1.02] transition-all">Save Changes</button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
