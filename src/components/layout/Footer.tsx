import Link from "next/link";
import { Instagram, Mail, MapPin, Phone, Send, Gift } from "lucide-react";

export default function Footer() {
    return (
        <footer className="relative bg-[#0A0A0E] pt-20 pb-8 overflow-hidden">
            {/* Top glow border */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FF6F91]/50 to-transparent" />
            {/* Decorative orbs */}
            <div className="absolute top-10 left-10 w-64 h-64 bg-[#FF6F91]/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-[#C8A2FF]/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Info */}
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF6F91] to-[#C8A2FF] flex items-center justify-center text-white font-bold shadow-lg">
                                <Gift className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white">JayBhole</span>
                        </Link>
                        <p className="text-[#B5B5C0] mt-2 text-sm leading-relaxed">
                            Discover the perfect gifts for your loved ones in Dahod. We craft moments of joy with our premium, personalized selection.
                        </p>
                        <div className="flex items-center gap-3 mt-4">
                            <a href="https://www.instagram.com/jay_bhole_gift_shopdahod/?hl=en" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#B5B5C0] hover:bg-[#FF6F91] hover:text-white hover:border-[#FF6F91] hover:shadow-[0_0_15px_rgba(255,111,145,0.3)] transition-all duration-300">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="https://www.google.com/search?q=jay+bhole+gift+shop+dahod" target="_blank" rel="noopener noreferrer" className="h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#B5B5C0] hover:bg-[#FF6F91] hover:text-white hover:border-[#FF6F91] hover:shadow-[0_0_15px_rgba(255,111,145,0.3)] transition-all duration-300 px-4 text-xs font-bold">
                                Google Reviews
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-white text-lg mb-6">Quick Links</h3>
                        <ul className="flex flex-col gap-3 text-[#B5B5C0] text-sm">
                            <li><Link href="/products" className="hover:text-[#FF6F91] transition-colors">All Products</Link></li>
                            <li><Link href="/about" className="hover:text-[#FF6F91] transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-[#FF6F91] transition-colors">Contact Us</Link></li>
                            <li><Link href="/faq" className="hover:text-[#FF6F91] transition-colors">FAQs</Link></li>
                            <li><Link href="/track" className="hover:text-[#FF6F91] transition-colors">Track Order</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="font-bold text-white text-lg mb-6">Categories</h3>
                        <ul className="flex flex-col gap-3 text-[#B5B5C0] text-sm">
                            <li><Link href="/products?category=birthdays" className="hover:text-[#FF6F91] transition-colors">Birthdays</Link></li>
                            <li><Link href="/products?category=anniversaries" className="hover:text-[#FF6F91] transition-colors">Anniversaries</Link></li>
                            <li><Link href="/products?category=personalized" className="hover:text-[#FF6F91] transition-colors">Personalized</Link></li>
                            <li><Link href="/products?category=corporate" className="hover:text-[#FF6F91] transition-colors">Corporate Gifting</Link></li>
                            <li><Link href="/products?category=hampers" className="hover:text-[#FF6F91] transition-colors">Gift Hampers</Link></li>
                        </ul>
                    </div>

                    {/* Contact & Newsletter */}
                    <div>
                        <h3 className="font-bold text-white text-lg mb-6">Stay Updated</h3>
                        <p className="text-[#B5B5C0] text-sm mb-4">Subscribe for exclusive deals and gift inspiration.</p>
                        <div className="flex gap-2 mb-8">
                            <input
                                type="email"
                                placeholder="Your email..."
                                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-[#B5B5C0]/50 focus:outline-none focus:border-[#FF6F91]/50 focus:shadow-[0_0_10px_rgba(255,111,145,0.1)] transition-all"
                            />
                            <button className="px-4 py-3 bg-gradient-to-r from-[#FF6F91] to-[#C8A2FF] text-white rounded-xl hover:shadow-[0_0_20px_rgba(255,111,145,0.4)] transition-all">
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                        <ul className="flex flex-col gap-3 text-[#B5B5C0] text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-[#FF6F91] shrink-0 mt-0.5" />
                                <span>Opp govardhan nath haweli, Hamidi Moholla, Desaiwad, Dahod, Gujarat 389151</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-[#FF6F91] shrink-0" />
                                <span>hello@jaybholegiftshop.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#B5B5C0]/60">
                    <p>&copy; 2026 JayBhole Gift Shop. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="hover:text-[#FF6F91] transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-[#FF6F91] transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
