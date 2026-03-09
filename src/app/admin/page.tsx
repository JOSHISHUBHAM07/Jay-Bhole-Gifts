"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Package, ShoppingBag, Users, DollarSign, Plus, Edit, Trash2, X, Loader2, CheckCircle, Clock, TrendingUp } from "lucide-react";

export default function AdminDashboardPage() {
    const [activeTab, setActiveTab] = useState("overview");

    const [products, setProducts] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ name: "", price: "", category: "", description: "", stock: "", images: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" });

    useEffect(() => {
        if (activeTab === "products") fetchProducts();
        if (activeTab === "orders" || activeTab === "overview") fetchOrders();
        if (activeTab === "customers") fetchUsers();
    }, [activeTab]);

    const fetchProducts = async () => { setIsLoading(true); try { const res = await fetch("/api/products"); const data = await res.json(); if (Array.isArray(data)) setProducts(data); } catch (e) { console.error(e); } finally { setIsLoading(false); } };
    const fetchOrders = async () => { setIsLoading(true); try { const res = await fetch("/api/orders"); const data = await res.json(); if (Array.isArray(data)) setOrders(data); } catch (e) { console.error(e); } finally { setIsLoading(false); } };
    const fetchUsers = async () => { setIsLoading(true); try { const res = await fetch("/api/admin/users"); const data = await res.json(); if (Array.isArray(data)) setUsers(data); } catch (e) { console.error(e); } finally { setIsLoading(false); } };
    const handleDeleteProduct = async (id: string) => { if (!confirm("Delete this product?")) return; try { const res = await fetch(`/api/products/${id}`, { method: "DELETE" }); if (res.ok) setProducts(products.filter(p => p._id !== id)); } catch (e) { console.error(e); } };
    const handleUpdateOrderStatus = async (orderId: string, currentStatus: string) => {
        const newStatus = currentStatus === "Processing" ? "Shipped" : currentStatus === "Shipped" ? "Delivered" : "Processing";
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderStatus: newStatus })
            });
            if (res.ok) {
                setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
            }
        } catch (e) {
            console.error(e);
        }
    };
    const handleAddProduct = async (e: React.FormEvent) => { e.preventDefault(); setIsSubmitting(true); try { const res = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: formData.name, price: Number(formData.price), category: formData.category, description: formData.description, stock: Number(formData.stock), images: [formData.images] }) }); if (res.ok) { setIsAddModalOpen(false); setFormData({ name: "", price: "", category: "", description: "", stock: "", images: formData.images }); fetchProducts(); } } catch (e) { console.error(e); } finally { setIsSubmitting(false); } };

    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const activeOrders = orders.filter(o => o.orderStatus !== "Delivered").length;
    const customers = Array.from(new Set(orders.map(o => o.deliveryAddress?.split(',')[0] || "Guest"))).map(name => ({ name, ordersCount: orders.filter(o => (o.deliveryAddress?.split(',')[0] || "Guest") === name).length, totalSpent: orders.filter(o => (o.deliveryAddress?.split(',')[0] || "Guest") === name).reduce((sum, o) => sum + (o.totalAmount || 0), 0) }));

    // Analytics
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(); d.setDate(d.getDate() - (6 - i));
        return {
            date: d.toLocaleDateString('en-US', { weekday: 'short' }),
            revenue: orders.filter((o: any) => {
                const od = new Date(o.createdAt);
                return od.getDate() === d.getDate() && od.getMonth() === d.getMonth() && o.paymentStatus !== "failed";
            }).reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0)
        };
    });
    const maxRevenueDay = Math.max(...last7Days.map(d => d.revenue), 100);

    const productSales: Record<string, { name: string, sold: number, image: string }> = {};
    orders.filter(o => o.paymentStatus !== "failed").forEach(o => {
        if (o.products) {
            o.products.forEach((item: any) => {
                const p = item.product || {};
                const name = p.name || 'Deleted Product';
                if (!productSales[name]) productSales[name] = { name, sold: 0, image: p.images?.[0] || '' };
                productSales[name].sold += item.quantity || 1;
            });
        }
    });
    const topProducts = Object.values(productSales).sort((a, b) => b.sold - a.sold).slice(0, 3);
    const stats = [
        { title: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: "from-[#FF6F91] to-[#FF6F91]/50" },
        { title: "Active Orders", value: activeOrders.toString(), icon: ShoppingBag, color: "from-[#C8A2FF] to-[#C8A2FF]/50" },
        { title: "Total Products", value: products.length > 0 ? products.length : "8", icon: Package, color: "from-[#F7C873] to-[#F7C873]/50" },
        { title: "Customers", value: customers.length.toString(), icon: Users, color: "from-[#6FBAFF] to-[#6FBAFF]/50" },
    ];

    const inputClass = "w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#B5B5C0]/40 focus:outline-none focus:border-[#FF6F91]/50 focus:shadow-[0_0_10px_rgba(255,111,145,0.1)] transition-all font-bold";

    const TabBtn = ({ id, label, icon: Icon }: any) => (
        <button onClick={() => setActiveTab(id)} className={`flex flex-1 md:flex-none items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === id ? "bg-white/5 text-[#FF6F91] border border-white/10" : "text-[#B5B5C0] hover:text-white hover:bg-white/5 border border-transparent"}`}>
            <Icon className="w-4 h-4" /> {label}
        </button>
    );

    return (
        <div className="bg-[#0F0F12] min-h-screen -mt-24 pt-32 pb-20">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2">Admin Dashboard</h1>
                        <p className="text-[#B5B5C0] font-medium text-lg">Manage JayBhole's store in real-time.</p>
                    </div>
                    <div className="bg-[#1A1A20] px-5 py-2.5 rounded-full border border-white/10 flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm font-bold text-white">System Online</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex overflow-x-auto hide-scrollbar bg-[#1A1A20] rounded-2xl p-2 mb-10 border border-white/[0.06] gap-1">
                    <TabBtn id="overview" label="Overview" icon={BarChart3} />
                    <TabBtn id="products" label="Products" icon={Package} />
                    <TabBtn id="orders" label="Orders" icon={ShoppingBag} />
                    <TabBtn id="customers" label="Customers" icon={Users} />
                </div>

                <AnimatePresence mode="wait">
                    {/* OVERVIEW */}
                    {/* OVERVIEW */}
                    {activeTab === "overview" && (
                        <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-8">
                            {/* Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {stats.map((stat, i) => (
                                    <div key={i} className="bg-[#1A1A20] p-7 rounded-2xl border border-white/[0.06] flex flex-col gap-5 hover:border-white/10 transition-all card-glow">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}><stat.icon className="w-6 h-6" /></div>
                                        <div><p className="text-[#B5B5C0]/60 text-xs font-bold uppercase tracking-widest mb-1">{stat.title}</p><h3 className="text-3xl font-extrabold text-white">{stat.value}</h3></div>
                                    </div>
                                ))}
                            </div>

                            {/* Analytics Grid */}
                            <div className="grid lg:grid-cols-3 gap-8">
                                {/* Revenue Chart */}
                                <div className="lg:col-span-2 bg-[#1A1A20] p-8 rounded-2xl border border-white/[0.06] flex flex-col">
                                    <h3 className="text-xl font-extrabold text-white mb-8 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-[#FF6F91]" /> 7-Day Revenue</h3>
                                    <div className="flex-1 flex items-end justify-between gap-2 h-48 mt-auto">
                                        {last7Days.map((day, idx) => (
                                            <div key={idx} className="flex flex-col items-center gap-3 w-full group">
                                                <div className="relative w-full bg-white/5 rounded-t-lg flex items-end justify-center overflow-hidden" style={{ height: '160px' }}>
                                                    <motion.div initial={{ height: 0 }} animate={{ height: `${(day.revenue / maxRevenueDay) * 100}%` }} transition={{ duration: 1, delay: idx * 0.1 }} className="w-full bg-gradient-to-t from-[#C8A2FF]/20 to-[#FF6F91] rounded-t-lg relative group-hover:from-[#C8A2FF]/40 group-hover:to-[#FF6F91] transition-all" />
                                                    <div className="absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-white bg-black/50 px-2 py-1 rounded-full">${day.revenue.toFixed(0)}</div>
                                                </div>
                                                <span className="text-xs font-bold text-[#B5B5C0] uppercase tracking-widest">{day.date}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Top Products */}
                                <div className="bg-[#1A1A20] p-8 rounded-2xl border border-white/[0.06]">
                                    <h3 className="text-xl font-extrabold text-white mb-6 flex items-center gap-2"><Package className="w-5 h-5 text-[#C8A2FF]" /> Top Sellers</h3>
                                    {topProducts.length === 0 ? <p className="text-[#B5B5C0] text-sm">Not enough data.</p> : (
                                        <div className="flex flex-col gap-4">
                                            {topProducts.map((p, i) => (
                                                <div key={i} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/[0.02]">
                                                    <div className="w-12 h-12 bg-[#0F0F12] rounded-lg overflow-hidden shrink-0">
                                                        {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <Package className="w-full h-full p-3 text-white/20" />}
                                                    </div>
                                                    <div className="flex-1 overflow-hidden">
                                                        <p className="font-bold text-white text-sm truncate">{p.name}</p>
                                                        <p className="text-xs font-bold text-[#FF6F91] mt-0.5">{p.sold} sold</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-8">
                                <div className="bg-[#1A1A20] p-8 rounded-2xl border border-white/[0.06]">
                                    <h3 className="text-xl font-extrabold text-white mb-6 flex items-center gap-2"><Clock className="w-5 h-5 text-[#F7C873]" /> Recent Orders</h3>
                                    {orders.length === 0 ? <p className="text-[#B5B5C0]">No orders.</p> : (
                                        <div className="flex flex-col gap-3">{orders.slice(0, 5).map(o => (
                                            <div key={o._id} className="flex justify-between items-center p-4 bg-[#202028] rounded-xl border border-white/[0.06] hover:border-white/10 transition-all">
                                                <div><p className="font-bold text-white text-sm">{o.deliveryAddress?.split(',')[0] || "Guest"}</p><p className="text-[10px] text-[#B5B5C0]/50 font-medium mt-1">ID: {o._id?.toString().substring(0, 8)}</p></div>
                                                <div className="text-right"><p className="font-extrabold text-[#F7C873]">${o.totalAmount?.toFixed(2)}</p><p className="text-[10px] font-bold text-[#B5B5C0]/50 uppercase tracking-widest mt-1">{o.orderStatus}</p></div>
                                            </div>
                                        ))}</div>)}
                                </div>
                                <div className="bg-gradient-to-br from-[#FF6F91] to-[#C8A2FF] p-8 rounded-2xl shadow-[0_20px_50px_rgba(255,111,145,0.2)] text-white flex flex-col justify-between relative overflow-hidden card-glow cursor-default">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[40px] translate-x-1/2 -translate-y-1/2" />
                                    <div className="relative z-10"><h3 className="text-2xl font-extrabold mb-2">Store Health</h3><p className="font-medium text-white/80 leading-relaxed">All systems running smoothly. Analytics real-time stream is active.</p></div>
                                    <div className="relative z-10 mt-8 p-5 bg-white/10 backdrop-blur rounded-xl border border-white/20">
                                        <div className="flex justify-between items-center mb-2"><span className="font-bold text-sm">Database</span><span className="flex items-center gap-1 text-xs font-bold bg-white/20 px-2 py-1 rounded-full"><CheckCircle className="w-3 h-3" /> Connected</span></div>
                                        <div className="flex justify-between items-center"><span className="font-bold text-sm">Razorpay</span><span className="flex items-center gap-1 text-xs font-bold bg-white/20 px-2 py-1 rounded-full"><CheckCircle className="w-3 h-3" /> Live</span></div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* PRODUCTS */}
                    {activeTab === "products" && (
                        <motion.div key="products" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-[#1A1A20] rounded-2xl p-6 md:p-10 border border-white/[0.06]">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-white/5 pb-6">
                                <div><h2 className="text-2xl font-extrabold text-white">Product Inventory</h2><p className="text-[#B5B5C0] text-sm mt-1">Manage your premium catalog.</p></div>
                                <button onClick={() => setIsAddModalOpen(true)} className="bg-gradient-to-r from-[#FF6F91] to-[#C8A2FF] text-white px-6 py-3.5 rounded-full font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(255,111,145,0.3)] hover:shadow-[0_0_30px_rgba(255,111,145,0.5)] hover:scale-[1.02] transition-all"><Plus className="w-4 h-4" /> Add Product</button>
                            </div>

                            {products.some(p => p.stock <= 5) && (
                                <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-4">
                                    <div className="p-2 bg-red-500/20 rounded-lg shrink-0 mt-0.5"><Package className="w-5 h-5 text-red-400" /></div>
                                    <div>
                                        <h3 className="font-extrabold text-red-400 mb-1">Inventory Alert: Low Stock</h3>
                                        <p className="text-sm text-red-400/80">The following items have critically low stock: {products.filter(p => p.stock <= 5).map(p => <strong key={p._id} className="text-red-300">{p.name} ({p.stock})</strong>).reduce((prev, curr) => <>{prev}, {curr}</>)}.</p>
                                    </div>
                                </div>
                            )}

                            {isLoading ? <div className="flex flex-col items-center justify-center py-24 text-[#B5B5C0]"><div className="w-10 h-10 border-4 border-[#FF6F91]/20 border-t-[#FF6F91] rounded-full animate-spin mb-4" /><p className="font-bold">Loading...</p></div>
                                : products.length === 0 ? <div className="bg-[#202028] rounded-2xl p-16 text-center flex flex-col items-center border border-white/[0.06] border-dashed"><Package className="w-10 h-10 text-[#FF6F91] mb-4" /><h3 className="text-xl font-extrabold text-white mb-2">No Products</h3><p className="text-[#B5B5C0] max-w-sm">Add your first product to get started.</p></div>
                                    : <div className="overflow-x-auto"><table className="w-full text-left border-collapse"><thead><tr className="text-xs font-bold uppercase tracking-widest text-[#B5B5C0]/40 border-b border-white/5"><th className="pb-4 px-4">Product</th><th className="pb-4 px-4">Category</th><th className="pb-4 px-4">Price</th><th className="pb-4 px-4">Stock</th><th className="pb-4 px-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-white/5">{products.map(p => (
                                        <tr key={p._id} className="hover:bg-white/[0.02] transition-colors group"><td className="py-5 px-4 flex items-center gap-4"><div className="w-10 h-10 rounded-lg bg-[#202028] overflow-hidden shrink-0"><img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /></div><span className="font-bold text-white group-hover:text-[#FF6F91] transition-colors">{p.name}</span></td><td className="py-5 px-4 text-[#B5B5C0] capitalize">{p.category}</td><td className="py-5 px-4 font-extrabold text-[#F7C873]">${parseFloat(p.price).toFixed(2)}</td><td className="py-5 px-4"><span className={`px-3 py-1 rounded-full text-xs font-bold border ${p.stock > 10 ? 'bg-green-500/10 text-green-400 border-green-500/20' : p.stock > 0 ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>{p.stock} in stock</span></td><td className="py-5 px-4 text-right"><div className="flex items-center justify-end gap-2"><button className="p-2 bg-white/5 border border-white/10 text-[#B5B5C0] hover:text-white rounded-lg transition-all"><Edit className="w-4 h-4" /></button><button onClick={() => handleDeleteProduct(p._id)} className="p-2 bg-white/5 border border-white/10 text-[#B5B5C0] hover:text-red-400 hover:border-red-400/30 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button></div></td></tr>
                                    ))}</tbody></table></div>}
                        </motion.div>
                    )}

                    {/* ORDERS */}
                    {activeTab === "orders" && (
                        <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-[#1A1A20] rounded-2xl p-6 md:p-10 border border-white/[0.06]">
                            <div className="border-b border-white/5 pb-6 mb-8"><h2 className="text-2xl font-extrabold text-white">Order Fulfillment</h2><p className="text-[#B5B5C0] text-sm mt-1">Review and update order statuses.</p></div>
                            {isLoading ? <div className="flex flex-col items-center justify-center py-24 text-[#B5B5C0]"><div className="w-10 h-10 border-4 border-[#FF6F91]/20 border-t-[#FF6F91] rounded-full animate-spin mb-4" /><p className="font-bold">Loading...</p></div>
                                : orders.length === 0 ? <div className="bg-[#202028] rounded-2xl p-16 text-center flex flex-col items-center border border-white/[0.06] border-dashed"><ShoppingBag className="w-10 h-10 text-[#FF6F91] mb-4" /><h3 className="text-xl font-extrabold text-white mb-2">No Orders</h3><p className="text-[#B5B5C0]">Orders will appear here after checkout.</p></div>
                                    : <div className="overflow-x-auto"><table className="w-full text-left border-collapse"><thead><tr className="text-xs font-bold uppercase tracking-widest text-[#B5B5C0]/40 border-b border-white/5"><th className="pb-4 px-4">Order ID</th><th className="pb-4 px-4">Customer</th><th className="pb-4 px-4">Amount</th><th className="pb-4 px-4">Payment</th><th className="pb-4 px-4 text-right">Status</th></tr></thead><tbody className="divide-y divide-white/5">{orders.map(o => (
                                        <tr key={o._id} className="hover:bg-white/[0.02] transition-colors"><td className="py-5 px-4 font-bold text-[#B5B5C0]">{o._id?.toString().substring(0, 8).toUpperCase()}</td><td className="py-5 px-4"><span className="font-bold text-white">{o.deliveryAddress?.split(',')[0] || "Guest"}</span></td><td className="py-5 px-4 font-extrabold text-[#F7C873]">${o.totalAmount?.toFixed(2)}</td><td className="py-5 px-4"><span className={`px-3 py-1 rounded-full text-xs font-bold border ${o.paymentStatus === 'Paid' || o.paymentStatus === 'Completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-[#FF6F91]/10 text-[#FF6F91] border-[#FF6F91]/20'}`}>{o.paymentStatus || 'Pending'}</span></td><td className="py-5 px-4 text-right"><button onClick={() => handleUpdateOrderStatus(o._id, o.orderStatus)} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${o.orderStatus === 'Processing' ? 'bg-[#FF6F91]/10 text-[#FF6F91] border-[#FF6F91]/20 hover:bg-[#FF6F91] hover:text-white' : o.orderStatus === 'Shipped' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500 hover:text-white' : 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500 hover:text-white'}`}>{o.orderStatus || 'Processing'}</button></td></tr>
                                    ))}</tbody></table></div>}
                        </motion.div>
                    )}

                    {/* CUSTOMERS */}
                    {activeTab === "customers" && (
                        <motion.div key="customers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-[#1A1A20] rounded-2xl p-6 md:p-10 border border-white/[0.06]">
                            <div className="border-b border-white/5 pb-6 mb-8"><h2 className="text-2xl font-extrabold text-white">Customer Directory</h2><p className="text-[#B5B5C0] text-sm mt-1">Registered users on JayBhole.</p></div>
                            {isLoading ? <div className="flex flex-col items-center justify-center py-24 text-[#B5B5C0]"><div className="w-10 h-10 border-4 border-[#FF6F91]/20 border-t-[#FF6F91] rounded-full animate-spin mb-4" /><p className="font-bold">Loading...</p></div>
                                : users.length === 0 ? <div className="bg-[#202028] rounded-2xl p-16 text-center flex flex-col items-center border border-white/[0.06] border-dashed"><Users className="w-10 h-10 text-[#FF6F91] mb-4" /><h3 className="text-xl font-extrabold text-white mb-2">No Registered Users</h3></div>
                                    : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{users.map((u, idx) => (
                                        <div key={idx} className="bg-[#202028] border border-white/[0.06] rounded-2xl p-6 hover:border-white/10 transition-all flex flex-col items-center text-center card-glow relative overflow-hidden">
                                            {u.role === 'admin' && <div className="absolute top-3 right-3 px-2 py-0.5 bg-[#FF6F91]/10 text-[#FF6F91] text-[10px] font-bold uppercase tracking-widest rounded">Admin</div>}
                                            <div className="w-14 h-14 bg-gradient-to-tr from-[#FF6F91] to-[#C8A2FF] rounded-full flex items-center justify-center text-white text-xl font-extrabold mb-4 shadow-[0_0_20px_rgba(255,111,145,0.3)]">{u.name.charAt(0).toUpperCase()}</div>
                                            <h3 className="font-extrabold text-white mb-1">{u.name}</h3>
                                            <p className="text-sm text-[#B5B5C0] mb-4">{u.email}</p>
                                            <div className="w-full pt-4 border-t border-white/5 flex flex-col gap-1 items-center">
                                                <span className="text-[#B5B5C0]/50 text-[10px] font-bold uppercase tracking-widest">Joined</span>
                                                <span className="font-bold text-white text-xs">{new Date(u.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))}</div>}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ADD PRODUCT MODAL */}
                <AnimatePresence>
                    {isAddModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-[#1A1A20] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-white/[0.06]">
                                <div className="border-b border-white/5 p-8 flex items-center justify-between relative overflow-hidden">
                                    <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-[#FF6F91] to-[#C8A2FF]" />
                                    <h3 className="text-xl font-extrabold text-white flex items-center gap-3"><div className="bg-[#FF6F91]/10 p-2 rounded-lg text-[#FF6F91]"><Package className="w-5 h-5" /></div> Add Product</h3>
                                    <button onClick={() => setIsAddModalOpen(false)} className="p-2 bg-white/5 text-[#B5B5C0] hover:text-white rounded-full transition-colors"><X className="w-5 h-5" /></button>
                                </div>
                                <form onSubmit={handleAddProduct} className="p-8 bg-[#0F0F12]">
                                    <div className="grid grid-cols-2 gap-5 mb-8">
                                        <div className="col-span-2"><label className="block text-xs font-bold text-[#B5B5C0]/60 mb-2 uppercase tracking-widest">Product Name</label><input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className={inputClass} placeholder="e.g. Gold Ring" /></div>
                                        <div><label className="block text-xs font-bold text-[#B5B5C0]/60 mb-2 uppercase tracking-widest">Price ($)</label><input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className={inputClass} placeholder="99.99" /></div>
                                        <div><label className="block text-xs font-bold text-[#B5B5C0]/60 mb-2 uppercase tracking-widest">Stock</label><input required type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} className={inputClass} placeholder="50" /></div>
                                        <div className="col-span-2"><label className="block text-xs font-bold text-[#B5B5C0]/60 mb-2 uppercase tracking-widest">Category</label><select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className={inputClass + " appearance-none"}><option value="" disabled>Select...</option><option value="accessories">Accessories</option><option value="jewelry">Jewelry</option><option value="wellness">Wellness</option><option value="food">Food</option><option value="home">Home</option></select></div>
                                        <div className="col-span-2"><label className="block text-xs font-bold text-[#B5B5C0]/60 mb-2 uppercase tracking-widest">Description</label><textarea required rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className={inputClass + " resize-none"} placeholder="Details..." /></div>
                                    </div>
                                    <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                                        <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-3 rounded-full font-bold text-[#B5B5C0] hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
                                        <button type="submit" disabled={isSubmitting} className="px-8 py-3 rounded-full font-bold bg-gradient-to-r from-[#FF6F91] to-[#C8A2FF] text-white shadow-[0_0_20px_rgba(255,111,145,0.3)] hover:shadow-[0_0_30px_rgba(255,111,145,0.5)] transition-all disabled:opacity-70 flex items-center">{isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save"}</button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
