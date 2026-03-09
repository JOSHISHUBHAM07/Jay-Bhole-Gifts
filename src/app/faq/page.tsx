"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronDown, HelpCircle, Search, MessageCircle } from "lucide-react";
import Link from "next/link";

const faqCategories = [
    {
        title: "Ordering & Payment",
        questions: [
            { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, UPI, net banking, and Razorpay wallets. All payments are processed securely through Razorpay's encrypted gateway." },
            { q: "Can I modify or cancel my order?", a: "You can modify or cancel your order within 2 hours of placement. After 2 hours, the order enters processing. Please contact us immediately if you need changes." },
            { q: "Do you offer gift wrapping?", a: "Yes! All our gifts come beautifully wrapped at no extra charge. You can also add a personalized message card during checkout." },
        ],
    },
    {
        title: "Shipping & Delivery",
        questions: [
            { q: "How long does delivery take?", a: "Local delivery within Dahod takes 1-2 days. Gujarat-wide delivery takes 3-5 business days. Pan-India delivery takes 5-7 business days." },
            { q: "Is free shipping available?", a: "Yes! We offer free shipping on all orders above ₹500. Orders below ₹500 have a flat ₹50 shipping fee." },
            { q: "Can I track my order?", a: "Absolutely! Once your order is shipped, you'll receive a tracking link via email and SMS. You can also track it on our Track Order page." },
        ],
    },
    {
        title: "Personalization",
        questions: [
            { q: "What items can be personalized?", a: "Most items in our 'Personalized' category can be customized — wallets, watches, jewelry, mugs, frames, and more. Look for the 'Personalize' option on the product page." },
            { q: "How long does personalization take?", a: "Personalized items take an additional 1-2 business days for preparation. We ensure each piece is crafted with precision." },
            { q: "Can I preview my personalization?", a: "Currently, you can enter your text during checkout. Our team will send you a preview image via email before engraving/printing." },
        ],
    },
    {
        title: "Returns & Refunds",
        questions: [
            { q: "What is your return policy?", a: "We offer a 30-day return policy for unused items in their original packaging. Personalized items cannot be returned unless there's a defect." },
            { q: "How do I initiate a return?", a: "Contact our support team via the Contact page or WhatsApp. We'll arrange a pickup and process your refund within 7 business days." },
            { q: "Do refunds go back to the original payment?", a: "Yes, refunds are processed to the original payment method. Bank refunds may take 5-10 business days to appear in your account." },
        ],
    },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <motion.div layout className="border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/10 transition-colors">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-6 text-left group">
                <span className="font-bold text-white group-hover:text-[#FF6F91] transition-colors pr-4">{question}</span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#B5B5C0] shrink-0">
                    <ChevronDown className="w-4 h-4" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <div className="px-6 pb-6 pt-0 text-[#B5B5C0] text-sm leading-relaxed border-t border-white/5 mt-0 pt-4">{answer}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });
    return <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay }} className={className}>{children}</motion.div>;
}

export default function FAQPage() {
    const [search, setSearch] = useState("");
    const filteredCategories = faqCategories.map(cat => ({
        ...cat,
        questions: cat.questions.filter(q => q.q.toLowerCase().includes(search.toLowerCase()) || q.a.toLowerCase().includes(search.toLowerCase())),
    })).filter(cat => cat.questions.length > 0);

    return (
        <div className="bg-[#0F0F12] -mt-24 pt-32 pb-20">
            <section className="relative overflow-hidden pb-16">
                <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#F7C873]/8 rounded-full blur-[150px] pointer-events-none" />
                <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
                    <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
                        Frequently Asked <span className="text-gradient">Questions</span>
                    </motion.h1>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative max-w-lg mx-auto mt-8">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B5B5C0]/40" />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search questions..." className="w-full pl-14 pr-6 py-4 bg-[#1A1A20] border border-white/10 rounded-full text-white placeholder:text-[#B5B5C0]/30 focus:outline-none focus:border-[#FF6F91]/50 focus:shadow-[0_0_15px_rgba(255,111,145,0.1)] transition-all font-medium" />
                    </motion.div>
                </div>
            </section>

            <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                {filteredCategories.map((cat, i) => (
                    <AnimatedSection key={cat.title} delay={i * 0.1} className="mb-12">
                        <h2 className="text-2xl font-extrabold text-white mb-6 flex items-center gap-2">
                            <HelpCircle className="w-6 h-6 text-[#FF6F91]" /> {cat.title}
                        </h2>
                        <div className="flex flex-col gap-3">
                            {cat.questions.map((faq) => <FAQItem key={faq.q} question={faq.q} answer={faq.a} />)}
                        </div>
                    </AnimatedSection>
                ))}

                {filteredCategories.length === 0 && (
                    <div className="text-center py-20">
                        <HelpCircle className="w-12 h-12 text-[#FF6F91] mx-auto mb-4" />
                        <h3 className="text-xl font-extrabold text-white mb-2">No results found</h3>
                        <p className="text-[#B5B5C0]">Try different keywords or <Link href="/contact" className="text-[#FF6F91] font-bold hover:underline">contact us</Link>.</p>
                    </div>
                )}

                <AnimatedSection className="mt-16 bg-gradient-to-r from-[#FF6F91] to-[#C8A2FF] rounded-3xl p-10 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-60 h-60 bg-white/10 rounded-full blur-[40px] translate-x-1/3 -translate-y-1/3" />
                    <div className="relative z-10">
                        <h3 className="text-2xl font-extrabold text-white mb-3">Still have questions?</h3>
                        <p className="text-white/80 mb-6">Our team is happy to help with any custom requests.</p>
                        <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-[#FF6F91] px-8 py-4 rounded-full font-bold hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-105 transition-all">
                            <MessageCircle className="w-5 h-5" /> Contact Us
                        </Link>
                    </div>
                </AnimatedSection>
            </div>
        </div>
    );
}
