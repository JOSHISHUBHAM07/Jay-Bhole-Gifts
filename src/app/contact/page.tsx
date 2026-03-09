"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Mail, Phone, Send, Clock, Instagram, MessageCircle, CheckCircle } from "lucide-react";

function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });
    return <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay }} className={className}>{children}</motion.div>;
}

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
    };

    const inputClass = "w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#B5B5C0]/30 focus:outline-none focus:border-[#FF6F91]/50 focus:shadow-[0_0_10px_rgba(255,111,145,0.1)] transition-all font-medium";

    return (
        <div className="bg-[#0F0F12] -mt-24 pt-32 pb-20">
            {/* Hero */}
            <section className="relative overflow-hidden pb-16">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#C8A2FF]/8 rounded-full blur-[150px] pointer-events-none" />
                <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
                    <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
                        Get in <span className="text-gradient">Touch</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-[#B5B5C0] max-w-xl mx-auto">
                        Have a question or a custom gifting request? We'd love to hear from you.
                    </motion.p>
                </div>
            </section>

            <div className="container mx-auto px-4 md:px-6 max-w-6xl">
                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Contact Info */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {[
                            { icon: MapPin, color: "#FF6F91", title: "Visit Us", lines: ["Opp Govardhan Nath Haweli", "Hamidi Moholla, Desaiwad", "Dahod, Gujarat 389151"] },
                            { icon: Clock, color: "#F7C873", title: "Business Hours", lines: ["Mon - Sat: 10:00 AM - 9:00 PM", "Sunday: 11:00 AM - 7:00 PM"] },
                            { icon: Phone, color: "#C8A2FF", title: "Call Us", lines: ["+91 12345 67890"] },
                            { icon: Mail, color: "#7CFFB2", title: "Email", lines: ["hello@jaybholegiftshop.com"] },
                        ].map((item, i) => (
                            <AnimatedSection key={item.title} delay={i * 0.1}>
                                <div className="bg-[#1A1A20] border border-white/[0.06] rounded-2xl p-6 flex gap-4 hover:border-white/10 transition-all group card-glow">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" style={{ background: `${item.color}15`, color: item.color }}>
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white mb-1">{item.title}</h3>
                                        {item.lines.map((l, j) => <p key={j} className="text-[#B5B5C0] text-sm">{l}</p>)}
                                    </div>
                                </div>
                            </AnimatedSection>
                        ))}

                        <AnimatedSection delay={0.4}>
                            <div className="flex gap-3">
                                <a href="https://www.instagram.com/jay_bhole_gift_shopdahod/?hl=en" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[#1A1A20] border border-white/[0.06] rounded-2xl p-4 text-[#B5B5C0] font-bold text-sm hover:text-[#FF6F91] hover:border-[#FF6F91]/20 transition-all">
                                    <Instagram className="w-5 h-5" /> Instagram
                                </a>
                                <a href="https://wa.me/911234567890" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[#1A1A20] border border-white/[0.06] rounded-2xl p-4 text-[#B5B5C0] font-bold text-sm hover:text-green-400 hover:border-green-400/20 transition-all">
                                    <MessageCircle className="w-5 h-5" /> WhatsApp
                                </a>
                            </div>
                        </AnimatedSection>
                    </div>

                    {/* Contact Form */}
                    <AnimatedSection delay={0.2} className="lg:col-span-3">
                        <div className="bg-[#1A1A20] border border-white/[0.06] rounded-2xl p-8 md:p-10 relative overflow-hidden">
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#FF6F91] to-[#C8A2FF]" />

                            {submitted ? (
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }} className="w-20 h-20 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                                        <CheckCircle className="w-10 h-10" />
                                    </motion.div>
                                    <h3 className="text-2xl font-extrabold text-white mb-2">Message Sent!</h3>
                                    <p className="text-[#B5B5C0]">We'll get back to you within 24 hours.</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                    <h2 className="text-2xl font-extrabold text-white mb-2">Send us a message</h2>
                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-bold text-[#B5B5C0]/60 mb-2 uppercase tracking-widest">Name</label>
                                            <input required type="text" placeholder="Your name" className={inputClass} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-[#B5B5C0]/60 mb-2 uppercase tracking-widest">Email</label>
                                            <input required type="email" placeholder="you@email.com" className={inputClass} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[#B5B5C0]/60 mb-2 uppercase tracking-widest">Subject</label>
                                        <select required defaultValue="" className={inputClass + " appearance-none"}>
                                            <option value="" disabled>Select a topic...</option>
                                            <option value="order">Order Inquiry</option>
                                            <option value="custom">Custom Gift Request</option>
                                            <option value="corporate">Corporate Gifting</option>
                                            <option value="feedback">Feedback</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[#B5B5C0]/60 mb-2 uppercase tracking-widest">Message</label>
                                        <textarea required rows={5} placeholder="Tell us what you need..." className={inputClass + " resize-none"} />
                                    </div>
                                    <button type="submit" className="w-full bg-gradient-to-r from-[#FF6F91] to-[#C8A2FF] text-white py-4 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(255,111,145,0.3)] hover:shadow-[0_0_30px_rgba(255,111,145,0.5)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                                        <Send className="w-5 h-5" /> Send Message
                                    </button>
                                </form>
                            )}
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </div>
    );
}
