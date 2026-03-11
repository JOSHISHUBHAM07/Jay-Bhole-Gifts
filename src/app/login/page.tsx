"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Mail, Lock, Gift, AlertCircle, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                // NextAuth wraps errors, provide user-friendly messages
                if (res.error.includes("No account found")) {
                    setError("No account found with this email. Please sign up first.");
                } else if (res.error.includes("Incorrect password")) {
                    setError("Incorrect password. Please try again.");
                } else if (res.error.includes("Google Sign-In")) {
                    setError("This account uses Google Sign-In. Please use the Google button below.");
                } else {
                    setError("Invalid email or password. Please try again.");
                }
                setLoading(false);
            } else if (res?.ok) {
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
        <div className="min-h-screen flex bg-[#0F0F12] -mt-24 pt-24">
            {/* Left Side: Graphic */}
            <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF6F91]/10 via-[#C8A2FF]/5 to-transparent" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6F91]/15 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C8A2FF]/15 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 p-12 max-w-lg">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF6F91] to-[#C8A2FF] flex items-center justify-center text-white shadow-[0_0_30px_rgba(255,111,145,0.3)] mb-8">
                        <Gift className="w-7 h-7" />
                    </div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white">
                        The Art of <br /> <span className="text-gradient">Gifting.</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg text-[#B5B5C0] leading-relaxed">
                        Sign in to access your order history, track deliveries, and unlock exclusive curated gifts.
                    </motion.p>
                    <div className="mt-16 flex items-center gap-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map((i) => (
                                <img key={i} src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="User" className="w-10 h-10 rounded-full border-2 border-[#0F0F12] bg-[#202028]" />
                            ))}
                        </div>
                        <p className="text-sm font-medium text-[#B5B5C0]/60">Join 10,000+ members</p>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                <Link href="/" className="absolute top-28 left-8 text-sm font-medium text-[#B5B5C0] hover:text-white flex items-center gap-2 group transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
                </Link>

                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-extrabold text-white mb-3">Welcome Back</h2>
                        <p className="text-[#B5B5C0]">Sign in to continue to JayBhole.</p>
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <p className="text-sm">{error}</p>
                        </motion.div>
                    )}

                    {/* Google Sign In Button */}
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
                        {googleLoading ? "Signing in..." : "Continue with Google"}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-xs font-bold text-[#B5B5C0]/40 uppercase tracking-widest">Or sign in with email</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Credentials Form */}
                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
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
                            <label className="block text-xs font-bold text-[#B5B5C0]/60 mb-2 uppercase tracking-widest">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-[#B5B5C0]/40" /></div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
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
                            className="w-full bg-gradient-to-r from-[#FF6F91] to-[#C8A2FF] text-white px-6 py-4 rounded-xl font-bold shadow-[0_0_20px_rgba(255,111,145,0.3)] hover:shadow-[0_0_30px_rgba(255,111,145,0.5)] hover:scale-[1.02] transition-all mt-2 disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                            ) : "Sign In"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-[#B5B5C0]/60">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="font-bold text-[#FF6F91] hover:underline">Sign up for free</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
