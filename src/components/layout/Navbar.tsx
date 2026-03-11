"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ShoppingCart, Search, Menu, X, Gift, LogOut, LayoutDashboard, UserCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Gifts" },
  { href: "/products?category=personalized", label: "Personalized" },
  { href: "/products?category=trending", label: "Trending" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cartCount } = useCart();
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClick);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? "bg-[#0F0F12]/95 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-3"
        : "bg-transparent py-5"
        }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 z-50 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF6F91] to-[#C8A2FF] flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-[0_0_25px_rgba(255,111,145,0.5)] transition-shadow duration-500">
            <Gift className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Jay<span className="text-gradient">Bhole</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="relative px-4 py-2 text-sm font-medium text-[#B5B5C0] hover:text-white transition-colors duration-300 group"
            >
              {link.label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-[#FF6F91] to-[#C8A2FF] rounded-full group-hover:w-3/4 transition-all duration-300" />
            </Link>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-2 z-50">
          <div className="relative hidden sm:block">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search gifts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => !searchQuery && setSearchOpen(false)}
                  className="w-48 bg-white/5 border border-white/10 text-white rounded-l-xl px-4 py-2 text-sm focus:outline-none focus:border-[#FF6F91]/50 placeholder:text-[#B5B5C0]/50"
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="bg-white/5 border border-white/10 border-l-0 text-[#B5B5C0] hover:text-white px-3 py-2 rounded-r-xl transition-all h-[38px]">
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="p-2.5 text-[#B5B5C0] hover:text-white hover:bg-white/5 rounded-xl transition-all">
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Session-aware Auth State */}
          {mounted && session?.user ? (
            <div className="relative hidden sm:block" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-3 py-2 rounded-xl font-semibold hover:bg-white/10 transition-all text-sm"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#FF6F91] to-[#C8A2FF] flex items-center justify-center text-white text-xs font-bold">
                  {session.user.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="max-w-[80px] truncate">{session.user.name?.split(" ")[0]}</span>
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 bg-[#1A1A20] border border-white/10 rounded-2xl p-2 shadow-2xl"
                  >
                    <Link href="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-[#B5B5C0] hover:text-white hover:bg-white/5 rounded-xl transition-all">
                      <UserCircle className="w-4 h-4" /> My Profile
                    </Link>
                    {(session.user as any).role === "admin" && (
                      <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-[#B5B5C0] hover:text-white hover:bg-white/5 rounded-xl transition-all">
                        <LayoutDashboard className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-white/[0.06] mt-1 pt-1">
                      <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#FF6F91] hover:border-[#FF6F91] hover:shadow-[0_0_20px_rgba(255,111,145,0.3)] transition-all text-sm"
            >
              Sign In
            </Link>
          )}

          <Link
            href="/cart"
            className="p-2.5 text-[#B5B5C0] hover:text-white hover:bg-white/5 rounded-xl transition-all relative"
          >
            <ShoppingCart className="w-5 h-5" />
            <AnimatePresence>
              {mounted && cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute top-1 right-1 w-4 h-4 bg-[#FF6F91] text-white text-[10px] flex items-center justify-center rounded-full font-bold shadow-[0_0_10px_rgba(255,111,145,0.5)]"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="p-2.5 text-[#B5B5C0] hover:text-white hover:bg-white/5 rounded-xl transition-all md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 glassmorphism p-6 flex flex-col gap-1 md:hidden"
          >
            <form onSubmit={handleSearchSubmit} className="flex items-center mb-4">
              <input
                type="text"
                placeholder="Search gifts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1A1A20] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6F91]/50 placeholder:text-[#B5B5C0]/50"
              />
              <button type="submit" className="ml-2 bg-white/5 border border-white/10 p-3 rounded-xl"><Search className="w-5 h-5 text-[#B5B5C0]" /></button>
            </form>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-semibold text-[#B5B5C0] hover:text-white px-4 py-3 rounded-xl hover:bg-white/5 transition-all"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-white/10 mt-2 pt-4 flex flex-col gap-2">
              {session?.user ? (
                <>
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-[#B5B5C0] hover:text-white hover:bg-white/5 rounded-xl transition-all">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF6F91] to-[#C8A2FF] flex items-center justify-center text-white text-sm font-bold">
                      {session.user.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{session.user.name}</p>
                      <p className="text-xs text-[#B5B5C0]/60">View Profile</p>
                    </div>
                  </Link>
                  <button onClick={() => { signOut({ callbackUrl: "/" }); setMobileMenuOpen(false); }} className="flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-sm font-semibold">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF6F91] to-[#C8A2FF] text-white px-6 py-3.5 rounded-xl font-bold">
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
