"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Heart, Award, Truck, Users, MapPin, Star, Sparkles, Gift, Shield } from "lucide-react";
import Link from "next/link";

const values = [
    { icon: Heart, title: "Crafted with Love", desc: "Every gift is chosen and wrapped with genuine care for your special moments.", color: "#FF6F91" },
    { icon: Award, title: "Premium Quality", desc: "We source only the finest materials and partner with trusted artisans.", color: "#F7C873" },
    { icon: Truck, title: "Swift Delivery", desc: "Fast and reliable delivery across Dahod and surrounding areas.", color: "#C8A2FF" },
    { icon: Shield, title: "Satisfaction Guaranteed", desc: "Not happy? We'll make it right with easy returns and exchanges.", color: "#7CFFB2" },
];

const milestones = [
    { year: "2012", title: "Founded in Dahod", desc: "Started as a small shop opposite Govardhan Nath Haweli." },
    { year: "2016", title: "Expanded Catalog", desc: "Added personalized gifting and corporate solutions." },
    { year: "2020", title: "Went Digital", desc: "Launched our online store during the pandemic." },
    { year: "2024", title: "10,000+ Customers", desc: "Reached a milestone of happy customers across Gujarat." },
];

function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });
    return <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay }} className={className}>{children}</motion.div>;
}

export default function AboutPage() {
    return (
        <div className="bg-[#0F0F12] -mt-24 pt-32 pb-20">
            {/* Hero */}
            <section className="relative overflow-hidden pb-24">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#FF6F91]/8 rounded-full blur-[150px] pointer-events-none" />
                <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2 rounded-full text-sm text-[#B5B5C0] font-medium mb-8 backdrop-blur-md">
                        <Gift className="w-4 h-4 text-[#FF6F91]" /> Our Story
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
                        About <span className="text-gradient">JayBhole</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="text-lg text-[#B5B5C0] max-w-2xl mx-auto leading-relaxed">
                        For over 12 years, we've been Dahod's most trusted destination for thoughtful, premium gifts. Every celebration deserves something unforgettable.
                    </motion.p>
                </div>
            </section>

            {/* Animated SVG Divider */}
            <div className="relative h-16 -mt-8">
                <svg viewBox="0 0 1200 80" fill="none" className="w-full h-full" preserveAspectRatio="none">
                    <motion.path d="M0 40 Q300 0 600 40 T1200 40 V80 H0 Z" fill="#1A1A20" fillOpacity="0.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }} />
                </svg>
            </div>

            {/* Values */}
            <section className="py-24 bg-[#1A1A20]/50">
                <div className="container mx-auto px-4 md:px-6">
                    <AnimatedSection className="text-center mb-16">
                        <p className="text-[#F7C873] font-bold text-sm uppercase tracking-widest mb-3">Why Choose Us</p>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white">Our Values</h2>
                    </AnimatedSection>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((v, i) => (
                            <AnimatedSection key={v.title} delay={i * 0.1}>
                                <motion.div whileHover={{ y: -8 }} className="bg-[#202028] border border-white/[0.06] rounded-2xl p-8 text-center hover:border-white/10 transition-all h-full group card-glow">
                                    <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110" style={{ background: `${v.color}15`, color: v.color }}>
                                        <v.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="font-extrabold text-white text-lg mb-3">{v.title}</h3>
                                    <p className="text-[#B5B5C0] text-sm leading-relaxed">{v.desc}</p>
                                </motion.div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-24 relative">
                <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                    <AnimatedSection className="text-center mb-16">
                        <p className="text-[#C8A2FF] font-bold text-sm uppercase tracking-widest mb-3">Our Journey</p>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white">Milestones</h2>
                    </AnimatedSection>
                    <div className="relative">
                        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#FF6F91]/50 via-[#C8A2FF]/50 to-transparent" />
                        {milestones.map((m, i) => (
                            <AnimatedSection key={m.year} delay={i * 0.15} className={`relative flex items-center gap-8 mb-12 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                                <div className={`flex-1 ${i % 2 === 0 ? "text-right" : "text-left"}`}>
                                    <div className="bg-[#1A1A20] border border-white/[0.06] rounded-2xl p-6 hover:border-white/10 transition-all">
                                        <h3 className="font-extrabold text-white text-lg mb-1">{m.title}</h3>
                                        <p className="text-[#B5B5C0] text-sm">{m.desc}</p>
                                    </div>
                                </div>
                                <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-tr from-[#FF6F91] to-[#C8A2FF] flex items-center justify-center text-white text-xs font-extrabold shadow-[0_0_20px_rgba(255,111,145,0.3)] z-10">
                                    {m.year.slice(2)}
                                </div>
                                <div className="flex-1" />
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Location */}
            <section className="py-24 bg-[#1A1A20]/50">
                <div className="container mx-auto px-4 md:px-6">
                    <AnimatedSection className="bg-[#202028] border border-white/[0.06] rounded-3xl p-10 md:p-14 flex flex-col md:flex-row gap-10 items-center">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin className="w-5 h-5 text-[#FF6F91]" />
                                <p className="text-[#FF6F91] font-bold text-sm uppercase tracking-widest">Visit Us</p>
                            </div>
                            <h2 className="text-3xl font-extrabold text-white mb-4">Our Store in Dahod</h2>
                            <p className="text-[#B5B5C0] leading-relaxed mb-6">Opp Govardhan Nath Haweli, Hamidi Moholla, Desaiwad, Dahod, Gujarat 389151</p>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 bg-[#F7C873]/10 text-[#F7C873] px-3 py-1.5 rounded-full text-xs font-bold"><Star className="w-3.5 h-3.5 fill-current" /> 4.8 on Google</div>
                                <span className="text-[#B5B5C0]/40 text-sm">200+ reviews</span>
                            </div>
                        </div>
                        <div className="w-full md:w-80 h-60 rounded-2xl overflow-hidden bg-[#1A1A20] border border-white/[0.06] flex items-center justify-center">
                            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 4 }} className="text-center">
                                <MapPin className="w-12 h-12 text-[#FF6F91] mx-auto mb-3" />
                                <p className="text-white font-bold">Dahod, Gujarat</p>
                                <p className="text-[#B5B5C0] text-sm">389151</p>
                            </motion.div>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 text-center">
                <AnimatedSection>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Ready to start gifting?</h2>
                    <Link href="/products" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF6F91] to-[#C8A2FF] text-white px-10 py-5 rounded-full font-bold text-lg shadow-[0_0_30px_rgba(255,111,145,0.4)] hover:shadow-[0_0_50px_rgba(255,111,145,0.6)] hover:scale-105 transition-all">
                        <Sparkles className="w-5 h-5" /> Explore Our Collection
                    </Link>
                </AnimatedSection>
            </section>
        </div>
    );
}
