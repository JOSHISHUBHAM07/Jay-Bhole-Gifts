"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, ShieldCheck, ShoppingBag, MapPin } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
    const router = useRouter();
    const { cartItems, cartTotal, clearCart } = useCart();
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderId, setOrderId] = useState("");
    const [formData, setFormData] = useState({ name: "", email: "", street: "", city: "", zip: "" });
    const [mounted, setMounted] = useState(false);

    // Address Book
    const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>("new");

    // Promo code state
    const [promoCode, setPromoCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [promoMessage, setPromoMessage] = useState({ text: "", type: "" });

    useEffect(() => { setMounted(true); const s = document.createElement("script"); s.src = "https://checkout.razorpay.com/v1/checkout.js"; s.async = true; document.body.appendChild(s); }, []);

    // Redirect to cart if empty on mount
    useEffect(() => {
        if (mounted && cartItems.length === 0 && !orderComplete) {
            router.push("/cart");
        }
    }, [mounted, cartItems, orderComplete, router]);

    // Fetch user addresses
    useEffect(() => {
        async function fetchAddresses() {
            try {
                const res = await fetch("/api/user/addresses");
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        setSavedAddresses(data);
                        const defaultOne = data.find(a => a.isDefault);
                        if (defaultOne) {
                            setSelectedAddressId(defaultOne._id);
                            setFormData({ name: defaultOne.name, email: "", street: defaultOne.street, city: defaultOne.city, zip: defaultOne.zip });
                        }
                    }
                }
            } catch (e) {
                console.error("Failed to load addresses", e);
            }
        }
        if (mounted) fetchAddresses();
    }, [mounted]);

    const shipping = cartTotal > 100 ? 0 : 15;
    const finalTotal = Math.max(0, cartTotal + shipping - discount);

    const applyPromo = (e: React.FormEvent) => {
        e.preventDefault();
        const code = promoCode.trim().toUpperCase();
        if (code === "GIFT10") {
            setDiscount(cartTotal * 0.10);
            setPromoMessage({ text: "10% discount applied!", type: "success" });
        } else if (code === "AURA20") {
            setDiscount(20);
            setPromoMessage({ text: "$20 flat discount applied!", type: "success" });
        } else {
            setDiscount(0);
            setPromoMessage({ text: "Invalid or expired promo code.", type: "error" });
        }
    };

    // Map Cart items to Order schema format
    const orderProducts = cartItems.map(item => ({
        product: item.product.id,
        quantity: item.quantity,
        customization: item.customization || ""
    }));

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault(); setIsProcessing(true);
        try {
            const orderRes = await fetch("/api/razorpay", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount: finalTotal }) });
            const orderData = await orderRes.json();
            if (!orderData.id) throw new Error("Failed to create order");
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
                amount: orderData.amount, currency: "INR", name: "JayBhole Gift Shop", description: "Premium Gifting Purchase", order_id: orderData.id,
                handler: async function (response: any) {
                    setIsProcessing(true);
                    const captureRes = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ razorpay_payment_id: response.razorpay_payment_id, razorpay_order_id: response.razorpay_order_id, razorpay_signature: response.razorpay_signature, user: "661234abcd567890ef123456", products: orderProducts, totalAmount: finalTotal, deliveryAddress: `${formData.street}, ${formData.city}, ${formData.zip}` }) });
                    const dbOrder = await captureRes.json(); setIsProcessing(false);
                    if (captureRes.ok) {
                        setOrderId(dbOrder._id || `JB-${Math.floor(Math.random() * 1000000)}`);
                        setOrderComplete(true);
                        clearCart();
                    } else { alert("Payment verification failed"); }
                },
                prefill: { name: formData.name, email: formData.email },
                theme: { color: "#FF6F91" },
            };
            const rzp = new (window as any).Razorpay(options);
            rzp.on("payment.failed", (r: any) => { alert(`Payment Failed: ${r.error.description}`); setIsProcessing(false); });
            rzp.open();
        } catch (error) { console.error(error); alert("Error initializing payment."); setIsProcessing(false); }
    };

    if (orderComplete) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#0F0F12] -mt-24 pt-24">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }} className="w-24 h-24 bg-[#FF6F91]/10 text-[#FF6F91] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,111,145,0.2)]">
                <CheckCircle2 className="w-12 h-12" />
            </motion.div>
            <h1 className="text-4xl font-extrabold text-white mb-3">Order Confirmed!</h1>
            <p className="text-[#B5B5C0] mb-4 text-center max-w-lg">Thank you for your purchase. We're getting your premium gifts ready!</p>
            <div className="bg-[#1A1A20] px-6 py-3 rounded-full border border-white/10 mb-10"><p className="text-white font-bold">Order ID: <span className="text-[#FF6F91]">#{orderId}</span></p></div>
            <Link href="/products" className="bg-gradient-to-r from-[#FF6F91] to-[#C8A2FF] text-white px-8 py-4 rounded-full font-bold shadow-[0_0_20px_rgba(255,111,145,0.3)] hover:scale-105 transition-all flex items-center gap-2"><ShoppingBag className="w-5 h-5" /> Continue Shopping</Link>
        </div>
    );

    const inputClass = "w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#B5B5C0]/40 focus:outline-none focus:border-[#FF6F91]/50 focus:shadow-[0_0_10px_rgba(255,111,145,0.1)] transition-all font-medium";

    return (
        <div className="bg-[#0F0F12] min-h-screen -mt-24 pt-32 pb-20">
            <div className="container mx-auto px-4 md:px-6 max-w-5xl">
                <h1 className="text-4xl font-extrabold text-white mb-12 text-center">Secure Checkout</h1>

                {/* Progress */}
                <div className="flex items-center justify-center mb-14 max-w-md mx-auto">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-[#FF6F91] text-white shadow-[0_0_15px_rgba(255,111,145,0.4)]' : 'bg-white/5 border border-white/10 text-[#B5B5C0]'}`}>1</div>
                    <div className={`flex-1 h-0.5 mx-4 rounded-full ${step >= 2 ? 'bg-gradient-to-r from-[#FF6F91] to-[#C8A2FF]' : 'bg-white/5'}`} />
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-[#FF6F91] text-white shadow-[0_0_15px_rgba(255,111,145,0.4)]' : 'bg-white/5 border border-white/10 text-[#B5B5C0]'}`}>2</div>
                </div>

                <div className="bg-[#1A1A20] rounded-2xl border border-white/[0.06] overflow-hidden relative">
                    {isProcessing && (
                        <div className="absolute inset-0 bg-[#0F0F12]/80 backdrop-blur z-50 flex flex-col items-center justify-center">
                            <div className="w-14 h-14 border-4 border-[#FF6F91]/20 border-t-[#FF6F91] rounded-full animate-spin mb-4" />
                            <p className="font-bold text-white text-lg">Processing Payment...</p>
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="s1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8 md:p-12">
                                <h2 className="text-2xl font-extrabold text-white mb-8 flex items-center gap-2"><MapPin className="w-5 h-5 text-[#FF6F91]" /> Shipping Information</h2>

                                {savedAddresses.length > 0 && (
                                    <div className="mb-8 p-6 bg-[#202028] rounded-xl border border-white/[0.06]">
                                        <h3 className="text-sm font-bold text-[#B5B5C0] uppercase tracking-widest mb-4">Saved Addresses</h3>
                                        <div className="flex flex-col gap-3">
                                            {savedAddresses.map(addr => (
                                                <div
                                                    key={addr._id}
                                                    onClick={() => {
                                                        setSelectedAddressId(addr._id);
                                                        setFormData({ name: addr.name, email: formData.email, street: addr.street, city: addr.city, zip: addr.zip });
                                                    }}
                                                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-4 ${selectedAddressId === addr._id ? 'bg-white/10 border-[#FF6F91]' : 'bg-transparent border-white/10 hover:border-white/30'}`}
                                                >
                                                    <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${selectedAddressId === addr._id ? 'border-[#FF6F91]' : 'border-white/30'}`}>
                                                        {selectedAddressId === addr._id && <div className="w-2.5 h-2.5 bg-[#FF6F91] rounded-full" />}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white text-sm">{addr.name}</h4>
                                                        <p className="text-[#B5B5C0] text-sm mt-1">{addr.street}, {addr.city} {addr.zip}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            <div
                                                onClick={() => { setSelectedAddressId("new"); setFormData({ name: "", email: formData.email, street: "", city: "", zip: "" }); }}
                                                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${selectedAddressId === "new" ? 'bg-white/10 border-[#FF6F91]' : 'bg-transparent border-white/10 hover:border-white/30'}`}
                                            >
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedAddressId === "new" ? 'border-[#FF6F91]' : 'border-white/30'}`}>
                                                    {selectedAddressId === "new" && <div className="w-2.5 h-2.5 bg-[#FF6F91] rounded-full" />}
                                                </div>
                                                <span className="font-bold text-white text-sm">Use a new address</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <AnimatePresence mode="wait">
                                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                                        {selectedAddressId === "new" && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 overflow-hidden">
                                                <div className="md:col-span-2"><label className="block text-xs font-bold text-[#B5B5C0]/60 mb-2 uppercase tracking-widest">Full Name</label><input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" className={inputClass} /></div>
                                                <div className="md:col-span-2"><label className="block text-xs font-bold text-[#B5B5C0]/60 mb-2 uppercase tracking-widest">Email (Required for tracking)</label><input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" className={inputClass} /></div>
                                                <div className="md:col-span-2"><label className="block text-xs font-bold text-[#B5B5C0]/60 mb-2 uppercase tracking-widest">Street</label><input required type="text" value={formData.street} onChange={e => setFormData({ ...formData, street: e.target.value })} placeholder="123 Gifting St" className={inputClass} /></div>
                                                <div><label className="block text-xs font-bold text-[#B5B5C0]/60 mb-2 uppercase tracking-widest">City</label><input required type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} placeholder="Dahod" className={inputClass} /></div>
                                                <div><label className="block text-xs font-bold text-[#B5B5C0]/60 mb-2 uppercase tracking-widest">ZIP</label><input required type="text" value={formData.zip} onChange={e => setFormData({ ...formData, zip: e.target.value })} placeholder="389151" className={inputClass} /></div>
                                            </motion.div>
                                        )}
                                        {selectedAddressId !== "new" && (
                                            <div className="md:col-span-2"><label className="block text-xs font-bold text-[#B5B5C0]/60 mb-2 uppercase tracking-widest">Confirm your Email (For tracking notifications)</label><input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" className={inputClass} /></div>
                                        )}
                                        <div className="md:col-span-2 pt-6 border-t border-white/5 flex justify-end">
                                            <button type="submit" className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-bold hover:bg-[#FF6F91] hover:border-[#FF6F91] hover:shadow-[0_0_20px_rgba(255,111,145,0.3)] transition-all flex items-center gap-2">Continue <ChevronRight className="w-4 h-4" /></button>
                                        </div>
                                    </form>
                                </AnimatePresence>
                            </motion.div>
                        )}
                        {step === 2 && (
                            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="p-8 md:p-12">
                                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                                    <h2 className="text-2xl font-extrabold text-white">Payment</h2>
                                    <button onClick={() => setStep(1)} className="text-xs font-bold text-[#FF6F91] bg-[#FF6F91]/10 px-4 py-2 rounded-full hover:bg-[#FF6F91]/20 transition-colors">Edit Address</button>
                                </div>
                                <form onSubmit={handlePayment}>
                                    <div className="bg-[#202028] p-6 rounded-xl border border-white/[0.06] mb-8">
                                        <div className="flex items-center gap-2 mb-4 text-white font-bold"><ShieldCheck className="w-5 h-5 text-[#FF6F91]" /> Secure Checkout via Razorpay</div>
                                        <p className="text-[#B5B5C0] text-sm mb-4">We process payments securely through Razorpay's trusted gateway.</p>

                                        {/* Promo Code Input */}
                                        <div className="flex items-center gap-2 mb-6 pb-6 border-b border-white/[0.06]">
                                            <input
                                                type="text"
                                                placeholder="Enter Promo Code"
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value)}
                                                className="flex-1 px-4 py-3 bg-[#1A1A20] border border-white/10 rounded-xl text-white placeholder:text-[#B5B5C0]/40 focus:outline-none focus:border-[#FF6F91]/50 text-sm font-bold uppercase"
                                            />
                                            <button
                                                type="button"
                                                onClick={applyPromo}
                                                className="bg-white/5 border border-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-[#FF6F91] hover:border-[#FF6F91] transition-all text-sm whitespace-nowrap"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                        {promoMessage.text && (
                                            <div className={`text-sm mb-6 ${promoMessage.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                                                {promoMessage.text}
                                            </div>
                                        )}

                                        <div className="bg-[#1A1A20] rounded-xl p-4 flex flex-col gap-3 border border-white/[0.06]">
                                            <div className="flex justify-between items-center text-[#B5B5C0] text-sm">
                                                <span>Subtotal</span>
                                                <span>${cartTotal.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[#B5B5C0] text-sm">
                                                <span>Shipping</span>
                                                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                                            </div>
                                            {discount > 0 && (
                                                <div className="flex justify-between items-center text-green-400 text-sm font-bold">
                                                    <span>Discount</span>
                                                    <span>-${discount.toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className="w-full h-px bg-white/[0.06] my-1" />
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-[#B5B5C0]">Final Total</span>
                                                <span className="text-2xl font-extrabold text-[#F7C873]">${finalTotal.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-[#202028] p-4 rounded-xl border border-white/[0.06] mb-8">
                                        <span className="text-xs text-[#B5B5C0]/60 font-bold uppercase tracking-widest">Shipping To</span>
                                        <p className="font-bold text-white mt-1">{formData.name}</p>
                                        <p className="text-sm text-[#B5B5C0]">{formData.street}, {formData.city} {formData.zip}</p>
                                    </div>
                                    <button type="submit" disabled={isProcessing} className="w-full bg-gradient-to-r from-[#FF6F91] to-[#C8A2FF] text-white px-10 py-5 rounded-full font-bold text-lg shadow-[0_0_30px_rgba(255,111,145,0.3)] hover:shadow-[0_0_50px_rgba(255,111,145,0.5)] transition-all flex items-center justify-center gap-2 hover:scale-[1.02]">
                                        Pay Securely <ChevronRight className="w-5 h-5" />
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
