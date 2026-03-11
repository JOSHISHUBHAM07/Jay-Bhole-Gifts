"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Search, Filter, ChevronDown, Clock, Truck, CheckCircle, XCircle, RotateCcw, Loader2 } from "lucide-react";
import Link from "next/link";

const statusConfig: Record<string, { color: string; icon: React.ElementType }> = {
    Processing: { color: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: Clock },
    Shipped: { color: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: Truck },
    Delivered: { color: "bg-green-500/10 text-green-400 border-green-500/20", icon: CheckCircle },
    Cancelled: { color: "bg-red-500/10 text-red-400 border-red-500/20", icon: XCircle },
    Return: { color: "bg-orange-500/10 text-orange-400 border-orange-500/20", icon: RotateCcw },
};

const statusFlow = ["Processing", "Shipped", "Delivered"];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/orders")
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setOrders(data);
                    setFiltered(data);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        let result = orders;
        if (statusFilter !== "All") result = result.filter(o => o.orderStatus === statusFilter);
        if (search) result = result.filter(o =>
            o._id?.toLowerCase().includes(search.toLowerCase()) ||
            o.deliveryAddress?.toLowerCase().includes(search.toLowerCase())
        );
        setFiltered(result);
    }, [search, statusFilter, orders]);

    const updateStatus = async (orderId: string, currentStatus: string) => {
        const idx = statusFlow.indexOf(currentStatus);
        if (idx === -1 || idx === statusFlow.length - 1) return;
        const newStatus = statusFlow[idx + 1];

        setUpdating(orderId);
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderStatus: newStatus }),
            });
            if (res.ok) {
                setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
            }
        } catch (e) { console.error(e); }
        finally { setUpdating(null); }
    };

    const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
    const counts = orders.reduce((acc: Record<string, number>, o) => { acc[o.orderStatus] = (acc[o.orderStatus] || 0) + 1; return acc; }, {});

    return (
        <div className="min-h-screen bg-[#0F0F12] -mt-24 pt-32 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-4xl font-extrabold text-white">Order Management</h1>
                        <p className="text-[#B5B5C0] mt-1">Manage all customer orders in one place.</p>
                    </div>
                    <Link href="/admin" className="text-sm text-[#B5B5C0] hover:text-white flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl transition-all">
                        ← Back to Admin
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Total Orders", value: orders.length, color: "#C8A2FF" },
                        { label: "Processing", value: counts["Processing"] || 0, color: "#F7C873" },
                        { label: "Shipped", value: counts["Shipped"] || 0, color: "#7CFFB2" },
                        { label: "Total Revenue", value: `₹${totalRevenue.toFixed(0)}`, color: "#FF6F91" },
                    ].map(s => (
                        <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1A1A20] border border-white/[0.06] rounded-2xl p-5">
                            <p className="text-sm text-[#B5B5C0] mb-1">{s.label}</p>
                            <p className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B5B5C0]/40" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by order ID or address..."
                            className="w-full pl-11 pr-4 py-3 bg-[#1A1A20] border border-white/10 rounded-xl text-white placeholder:text-[#B5B5C0]/30 focus:outline-none focus:border-[#FF6F91]/50 transition-all text-sm"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="px-4 py-3 bg-[#1A1A20] border border-white/10 rounded-xl text-white focus:outline-none text-sm"
                    >
                        <option value="All">All Statuses</option>
                        {Object.keys(statusConfig).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                {/* Orders Table */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-[#FF6F91]/30 border-t-[#FF6F91] rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <Package className="w-12 h-12 text-[#FF6F91] mx-auto mb-4" />
                        <h3 className="text-xl font-extrabold text-white mb-2">No orders found</h3>
                        <p className="text-[#B5B5C0]">Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {filtered.map((order, i) => {
                            const statusCfg = statusConfig[order.orderStatus] || statusConfig["Processing"];
                            const StatusIcon = statusCfg.icon;
                            const canAdvance = statusFlow.indexOf(order.orderStatus) < statusFlow.length - 1;

                            return (
                                <motion.div
                                    key={order._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="bg-[#1A1A20] border border-white/[0.06] hover:border-white/10 rounded-2xl p-5 flex flex-col md:flex-row gap-4 items-start md:items-center transition-all"
                                >
                                    {/* Order ID & Date */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Package className="w-4 h-4 text-[#FF6F91]" />
                                            <span className="font-bold text-white text-sm font-mono">{order._id?.slice(-8).toUpperCase() || "N/A"}</span>
                                        </div>
                                        <p className="text-xs text-[#B5B5C0]">
                                            {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                                            {" "}&bull;{" "}
                                            {order.products?.length || 0} item{(order.products?.length || 0) !== 1 ? "s" : ""}
                                        </p>
                                    </div>

                                    {/* Delivery Address */}
                                    <div className="flex-[2] hidden md:block">
                                        <p className="text-sm text-[#B5B5C0] truncate max-w-[240px]">{order.deliveryAddress || "Address not provided"}</p>
                                    </div>

                                    {/* Amount */}
                                    <div className="text-right md:text-center w-24">
                                        <p className="font-extrabold text-[#F7C873]">₹{(order.totalAmount || 0).toFixed(2)}</p>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="shrink-0">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${statusCfg.color}`}>
                                            <StatusIcon className="w-3.5 h-3.5" />
                                            {order.orderStatus}
                                        </span>
                                    </div>

                                    {/* Action */}
                                    <div className="shrink-0">
                                        <button
                                            disabled={!canAdvance || updating === order._id}
                                            onClick={() => updateStatus(order._id, order.orderStatus)}
                                            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white text-xs font-bold rounded-xl hover:bg-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed min-w-[120px] justify-center"
                                        >
                                            {updating === order._id ? (
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            ) : canAdvance ? (
                                                <>Advance → {statusFlow[statusFlow.indexOf(order.orderStatus) + 1]}</>
                                            ) : (
                                                "Final State"
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
