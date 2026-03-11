"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, Truck, CheckCircle, Clock, MapPin, ArrowRight } from "lucide-react";

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState("");
    const [tracking, setTracking] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    // result contains the fetched order details
    const [result, setResult] = useState<any>(null);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        setResult(null);
        if (!orderId.trim()) return;

        setTracking(true);
        fetchOrderDetails(orderId.trim());
    };

    const fetchOrderDetails = async (idToTrack: string) => {
        try {
            const res = await fetch(`/api/orders/${idToTrack}`);
            const data = await res.json();

            if (!res.ok) {
                setErrorMsg(data.error || "Order not found");
                setResult(null);
            } else {
                setResult(data);
            }
        } catch (error) {
            setErrorMsg("Something went wrong");
        } finally {
            setTracking(false);
        }
    };

    // Auto-refresh the current tracking result every 10 seconds
    useEffect(() => {
        if (!result || !orderId.trim()) return;
        const interval = setInterval(() => {
            fetchOrderDetails(orderId.trim());
        }, 10000);
        return () => clearInterval(interval);
    }, [result, orderId]);

    return (
        <div className="bg-[#0F0F12] -mt-24 pt-32 pb-20 min-h-screen">
            <div className="container mx-auto px-4 md:px-6 max-w-2xl">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
                        Track Your <span className="text-gradient">Order</span>
                    </h1>
                    <p className="text-[#B5B5C0] text-lg">Enter your order ID to see the real-time status.</p>
                </motion.div>

                {/* Search */}
                <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} onSubmit={handleTrack} className="flex flex-col gap-3 mb-12">
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B5B5C0]/40" />
                            <input
                                type="text" value={orderId} onChange={(e) => setOrderId(e.target.value)}
                                placeholder="e.g. JB-2834"
                                className="w-full pl-14 pr-6 py-5 bg-[#1A1A20] border border-white/10 rounded-2xl text-white placeholder:text-[#B5B5C0]/30 focus:outline-none focus:border-[#FF6F91]/50 focus:shadow-[0_0_15px_rgba(255,111,145,0.1)] transition-all font-bold text-lg"
                            />
                        </div>
                        <button type="submit" disabled={tracking} className="bg-gradient-to-r from-[#FF6F91] to-[#C8A2FF] text-white px-8 py-5 rounded-2xl font-bold shadow-[0_0_20px_rgba(255,111,145,0.3)] hover:shadow-[0_0_30px_rgba(255,111,145,0.5)] hover:scale-[1.02] transition-all flex items-center gap-2 shrink-0">
                            {tracking ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><ArrowRight className="w-5 h-5" /> Track</>}
                        </button>
                    </div>
                    <AnimatePresence>
                        {errorMsg && (
                            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-red-400 text-sm font-bold text-center mt-2">
                                {errorMsg}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </motion.form>

                {/* Results */}
                <AnimatePresence>
                    {result && (
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-[#1A1A20] border border-white/[0.06] rounded-2xl p-8 md:p-10">
                            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                                <div>
                                    <p className="text-xs font-bold text-[#B5B5C0]/50 uppercase tracking-widest mb-1">Order ID</p>
                                    <p className="text-xl font-extrabold text-white">#{result._id?.substring(0, 8).toUpperCase() || orderId.toUpperCase()}</p>
                                </div>
                                <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${result.orderStatus === 'delivered' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : result.orderStatus === 'shipped' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-[#FF6F91]/10 text-[#FF6F91] border border-[#FF6F91]/20'}`}>
                                    {result.orderStatus || 'Processing'}
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="relative pl-8 mt-8">
                                <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#FF6F91] via-[#C8A2FF] to-white/10" />
                                {result.timeline && result.timeline.length > 0 ? (
                                    result.timeline.map((step: any, i: number) => {
                                        const statusLower = step.status?.toLowerCase() || "";
                                        const Icon = statusLower.includes('placed') ? Package
                                            : statusLower.includes('shipped') ? Truck
                                                : statusLower.includes('delivered') ? CheckCircle
                                                    : Clock;
                                        return (
                                            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} className="relative flex items-start gap-5 pb-8 last:pb-0">
                                                <div className="absolute -left-8 w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 bg-gradient-to-tr from-[#FF6F91] to-[#C8A2FF] shadow-[0_0_15px_rgba(255,111,145,0.3)] border border-white/10">
                                                    <Icon className="w-4 h-4 text-white" />
                                                </div>
                                                <div className="pt-1">
                                                    <h3 className="font-bold text-white text-lg">{step.status}</h3>
                                                    <p className="text-sm text-[#B5B5C0] mt-1 pr-4">{step.description}</p>
                                                    <p className="text-xs font-bold tracking-widest uppercase text-[#B5B5C0]/40 mt-3">{new Date(step.date).toLocaleString()}</p>
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                ) : (
                                    [
                                        { status: "Order Placed", time: new Date(result.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }), done: true, icon: Package },
                                        { status: "Processing", time: result.orderStatus !== "cancelled" ? "In Progress" : "—", done: result.orderStatus !== "cancelled", icon: Clock },
                                        { status: "Shipped", time: ["shipped", "delivered"].includes(result.orderStatus?.toLowerCase()) ? "Done" : "—", done: ["shipped", "delivered"].includes(result.orderStatus?.toLowerCase()), icon: Truck },
                                        { status: "Out for Delivery", time: result.orderStatus?.toLowerCase() === "delivered" ? "Done" : "—", done: result.orderStatus?.toLowerCase() === "delivered", icon: MapPin },
                                        { status: "Delivered", time: result.orderStatus?.toLowerCase() === "delivered" ? "Done" : "—", done: result.orderStatus?.toLowerCase() === "delivered", icon: CheckCircle },
                                    ].map((step, i) => (
                                        <motion.div key={step.status} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} className={`relative flex items-start gap-5 pb-8 last:pb-0 ${step.done ? "" : "opacity-40"}`}>
                                            <div className={`absolute -left-8 w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${step.done ? "bg-gradient-to-tr from-[#FF6F91] to-[#C8A2FF] shadow-[0_0_15px_rgba(255,111,145,0.3)]" : "bg-[#202028] border border-white/10"}`}>
                                                <step.icon className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="pt-1">
                                                <h3 className="font-bold text-white">{step.status}</h3>
                                                <p className="text-xs text-[#B5B5C0] mt-0.5">{step.time}</p>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
