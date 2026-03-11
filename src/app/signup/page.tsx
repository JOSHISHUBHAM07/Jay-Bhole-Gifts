"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Mail, Lock, User, Phone, Sparkles, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            setLoading(false);
            return;
        }

        try {
            // 1. Register the user
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, phone, password }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Something went wrong during registration.");
                setLoading(false);
                return;
            }

            // 2. Automatically log them in after registration
            const loginRes = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (loginRes?.error) {
                setError("Account created! Please go to the Login page to sign in.");
                setLoading(false);
            } else {
                router.push("/profile");
                router.refresh();
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);
        setError("");
        try {
            await signIn("google", { callbackUrl: "/profile" });
        } catch (err) {
            setError("Google sign-in failed. Please try again.");
            setGoogleLoading(false);
        }
    };

    const inputClass = "w-full pl-12 pr-12 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-[#B5B5C0]/30 focus:outline-none focus:border-[#FF6F91]/50 focus:shadow-[0_0_10px_rgba(255,111,145,0.1)] transition-all";

    return (
        <div className="min-h-screen flex bg-[#0F0F12] -mt-24 pt-24 flex-row-reverse">
            {/* Right Side: Graphic */}
            <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-[#C8A2FF]/10 via-[#FF6F91]/5 to-transparent" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C8A2FF]/15 rounded-full blur-[120px]" />

                <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#FF6F91]/10 rounded-2xl transform -rotate-12 border border-white/5" />
                <motion.div animate={{ y: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }} className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-[#C8A2FF]/10 rounded-[2rem] transform rotate-12 border border-white/5" />

                <div className="relative z-10 p-12 max-w-lg text-right flex flex-col items-end">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#C8A2FF] to-[#FF6F91] flex items-center justify-center text-white shadow-[0_0_30px_rgba(200,162,255,0.3)] mb-8">
                        <Sparkles className="w-7 h-7" />
                    </div>
                    <motion.h1 initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-5xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white">
                        Join the <br /> <span className="text-gradient">JayBhole Club.</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg text-[#B5B5C0] leading-relaxed text-right">
                        Discover premium personalized gifts, earn rewards on every purchase, and never forget an important occasion.
                    </motion.p>
                </div>
            </div>

            {/* Left Side: Form */}
            <div className="flex-[1.2] flex flex-col items-center justify-center p-8 relative overflow-y-auto">
                <Link href="/" className="absolute top-28 left-8 text-sm font-medium text-[#B5B5C0] hover:text-white flex items-center gap-2 group transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
                </Link>

                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md my-16">
                    <div className="text-center mb-10 mt-10">
                        <h2 className="text-3xl font-extrabold text-white mb-3">Create an Account</h2>
                        <p className="text-[#B5B5C0]">Welcome! Set up your account to start gifting.</p>
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <p className="text-sm">{error}</p>
                        </motion.div>
                    )}

                    {/* Google Sign Up Button */}
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={googleLoading || loading}
                        className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white px-6 py-4 rounded-xl font-bold hover:bg-white/10 hover:border-white/20 transition-all mb-6 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {googleLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        )}
                        {googleLoading ? "Signing up..." : "Continue with Google"}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-xs font-bold text-[#B5B5C0]/40 uppercase tracking-widest">Or sign up with email</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Registration Form */}
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-xs font-bold text-[#B5B5C0]/60 mb-2 uppercase tracking-widest">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User className="h-5 w-5 text-[#B5B5C0]/40" /></div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    required
                                    className={inputClass}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#B5B5C0]/60 mb-2 uppercase tracking-widest">Email address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-[#B5B5C0]/40" /></div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className={inputClass}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#B5B5C0]/60 mb-2 uppercase tracking-widest">Phone Number <span className="text-[#B5B5C0]/30">(Optional)</span></label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Phone className="h-5 w-5 text-[#B5B5C0]/40" /></div>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+91 98765 43210"
                                    className={inputClass}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#B5B5C0]/60 mb-2 uppercase tracking-widest">Password <span className="text-[#B5B5C0]/30">(min. 6 chars)</span></label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-[#B5B5C0]/40" /></div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className={inputClass}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#B5B5C0]/40 hover:text-[#B5B5C0] transition-colors">
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading || googleLoading}
                            className="w-full bg-gradient-to-r from-[#C8A2FF] to-[#FF6F91] text-white px-6 py-4 rounded-xl font-bold shadow-[0_0_20px_rgba(200,162,255,0.3)] hover:shadow-[0_0_30px_rgba(200,162,255,0.5)] hover:scale-[1.02] transition-all mt-4 disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating Account...</>
                            ) : "Sign Up"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-[#B5B5C0]/60">
                        Already have an account?{" "}
                        <Link href="/login" className="font-bold text-[#FF6F91] hover:underline">Sign in instead</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
