"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Package, ArrowRight, Sparkles, Home, Truck } from "lucide-react";
import { Suspense } from "react";

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId") || "";

    return (
        <div className="min-h-screen bg-[#0F0F12] -mt-24 pt-24 flex items-center justify-center px-4">
            <div className="max-w-lg w-full text-center">

                {/* Animated Success Icon */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                    className="relative inline-flex items-center justify-center w-28 h-28 mb-8 mx-auto"
                >
                    <div className="absolute inset-0 bg-green-500/10 rounded-full animate-ping opacity-50" />
                    <div className="relative w-28 h-28 bg-gradient-to-tr from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                        <CheckCircle className="w-14 h-14 text-white" />
                    </div>
                </motion.div>

                {/* Confetti dots */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                            background: ["#FF6F91", "#C8A2FF", "#F7C873", "#7CFFB2", "#FF6F91", "#C8A2FF", "#F7C873", "#7CFFB2"][i],
                            left: `${10 + i * 10}%`,
                            top: "20%",
                        }}
                        initial={{ y: 0, opacity: 1 }}
                        animate={{ y: [0, -60, 20, -30, 0], opacity: [1, 1, 1, 0] }}
                        transition={{ delay: 0.3 + i * 0.07, duration: 1.5 }}
                    />
                ))}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <span className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/20 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
                        <Sparkles className="w-4 h-4" /> Order Confirmed!
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
                        Thank you for your order!
                    </h1>
                    <p className="text-[#B5B5C0] text-lg mb-8">
                        Your gift is on its way to making someone happy. You'll receive a confirmation email shortly.
                    </p>
                </motion.div>

                {/* Order Details Box */}
                {orderId && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55 }}
                        className="bg-[#1A1A20] border border-white/[0.06] rounded-2xl p-6 mb-8 text-left"
                    >
                        <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06] mb-4">
                            <Package className="w-5 h-5 text-[#FF6F91]" />
                            <h2 className="font-bold text-white">Order Summary</h2>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#B5B5C0]">Order ID</p>
                                <p className="font-bold text-white font-mono text-sm">{orderId.slice(-12).toUpperCase()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-[#B5B5C0]">Estimated Delivery</p>
                                <p className="font-bold text-white text-sm">3–5 Business Days</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Timeline Steps */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65 }}
                    className="bg-[#1A1A20] border border-white/[0.06] rounded-2xl p-6 mb-8"
                >
                    <h3 className="font-bold text-white text-left mb-4 text-sm">What happens next?</h3>
                    {[
                        { icon: CheckCircle, text: "Order confirmed & payment received", done: true },
                        { icon: Package, text: "We're preparing your gift with love", done: false },
                        { icon: Truck, text: "Your package will be dispatched soon", done: false },
                    ].map((step, i) => (
                        <div key={i} className={`flex items-center gap-3 ${i < 2 ? "mb-4" : ""}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${step.done ? "bg-green-500/20 text-green-400" : "bg-white/5 text-[#B5B5C0]/40"}`}>
                                <step.icon className="w-4 h-4" />
                            </div>
                            <span className={`text-sm ${step.done ? "text-white font-medium" : "text-[#B5B5C0]/60"}`}>{step.text}</span>
                        </div>
                    ))}
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75 }}
                    className="flex flex-col sm:flex-row gap-3"
                >
                    {orderId && (
                        <Link
                            href={`/track?orderId=${orderId}`}
                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF6F91] to-[#C8A2FF] text-white px-6 py-4 rounded-xl font-bold shadow-[0_0_20px_rgba(255,111,145,0.3)] hover:shadow-[0_0_30px_rgba(255,111,145,0.5)] hover:scale-[1.02] transition-all"
                        >
                            <Truck className="w-5 h-5" /> Track My Order
                        </Link>
                    )}
                    <Link
                        href="/products"
                        className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-6 py-4 rounded-xl font-bold hover:bg-white/10 transition-all"
                    >
                        <Home className="w-4 h-4" /> Continue Shopping <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>

                {/* Profile Link */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.85 }}
                    className="mt-6 text-sm text-[#B5B5C0]/60"
                >
                    View all your orders in your{" "}
                    <Link href="/profile" className="text-[#FF6F91] font-bold hover:underline">Profile Dashboard</Link>.
                </motion.p>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0F0F12] flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#FF6F91]/30 border-t-[#FF6F91] rounded-full animate-spin" /></div>}>
            <OrderSuccessContent />
        </Suspense>
    );
}
