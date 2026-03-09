"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
    const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const subtotal = cartTotal;
    const shipping = subtotal > 100 ? 0 : 15;
    const total = subtotal + shipping;

    if (!mounted) return null; // Avoid hydration mismatch

    if (cartItems.length === 0) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#0F0F12] -mt-24 pt-24">
            <div className="w-24 h-24 bg-[#1A1A20] border border-white/[0.06] rounded-2xl flex items-center justify-center mb-6"><ShoppingBag className="w-10 h-10 text-[#FF6F91]" /></div>
            <h1 className="text-3xl font-extrabold text-white mb-3">Your cart is empty</h1>
            <p className="text-[#B5B5C0] mb-8 max-w-md text-center">Discover our premium collection and find the perfect gift.</p>
            <Link href="/products" className="bg-gradient-to-r from-[#FF6F91] to-[#C8A2FF] text-white px-8 py-4 rounded-full font-bold shadow-[0_0_20px_rgba(255,111,145,0.3)] hover:scale-105 transition-all flex items-center gap-2">Start Shopping <ArrowRight className="w-4 h-4" /></Link>
        </div>
    );

    return (
        <div className="bg-[#0F0F12] min-h-screen -mt-24 pt-32 pb-20">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-12">Shopping Cart</h1>
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <AnimatePresence>
                            {cartItems.map((item) => (
                                <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }} className="group flex flex-col md:flex-row gap-4 items-center bg-[#1A1A20] p-4 rounded-2xl border border-white/[0.06] hover:border-white/10 transition-all relative">
                                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-[#202028] shrink-0">
                                        <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <Link href={`/products/${item.product.id}`} className="font-bold text-white hover:text-[#FF6F91] transition-colors">{item.product.name}</Link>
                                        <p className="text-sm text-[#B5B5C0] mt-0.5">${item.product.price.toFixed(2)}</p>
                                        {item.customization && <span className="text-[10px] font-bold bg-[#FF6F91]/10 text-[#FF6F91] border border-[#FF6F91]/20 px-2 py-0.5 rounded-full mt-1 inline-block">Engraving: "{item.customization}"</span>}
                                    </div>
                                    <div className="flex items-center border border-white/10 rounded-full bg-white/5 h-10 px-1">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-white text-sm">-</button>
                                        <span className="w-8 text-center font-bold text-white text-sm">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-white text-sm">+</button>
                                    </div>
                                    <span className="font-extrabold text-[#F7C873] text-lg w-24 text-right">${(item.product.price * item.quantity).toFixed(2)}</span>
                                    <button onClick={() => removeFromCart(item.id)} className="w-9 h-9 bg-white/5 border border-white/10 text-[#B5B5C0] hover:text-red-400 rounded-full flex items-center justify-center hover:border-red-400/30 hover:bg-red-400/10 transition-all" aria-label="Remove">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#1A1A20] rounded-2xl p-8 sticky top-32 border border-white/[0.06]">
                            <h2 className="text-xl font-extrabold text-white mb-6 border-b border-white/5 pb-4">Order Summary</h2>
                            <div className="flex flex-col gap-4 text-[#B5B5C0] mb-6">
                                <div className="flex justify-between"><span>Subtotal</span><span className="font-bold text-white">${subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>Shipping</span>{shipping === 0 ? <span className="font-bold text-green-400 text-sm">Free</span> : <span className="font-bold text-white">${shipping.toFixed(2)}</span>}</div>
                            </div>
                            <div className="flex justify-between items-center mb-8 pt-4 border-t border-white/5">
                                <span className="text-sm font-bold text-[#B5B5C0] uppercase tracking-widest">Total</span>
                                <span className="text-3xl font-extrabold text-[#F7C873]">${total.toFixed(2)}</span>
                            </div>
                            <Link href="/checkout" className="w-full bg-gradient-to-r from-[#FF6F91] to-[#C8A2FF] text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,111,145,0.3)] hover:shadow-[0_0_30px_rgba(255,111,145,0.5)] transition-all hover:scale-[1.02] mb-4">
                                Checkout <ArrowRight className="w-4 h-4" />
                            </Link>
                            <div className="flex items-center justify-center gap-2 text-xs text-[#B5B5C0]/50 font-medium">
                                <ShieldCheck className="w-3.5 h-3.5 text-[#F7C873]" /> Encrypted via Razorpay
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
