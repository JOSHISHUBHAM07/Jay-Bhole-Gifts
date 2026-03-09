"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Mail, Lock, User, Sparkles } from "lucide-react";
import { signIn } from "next-auth/react";

export default function SignupPage() {
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
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                <Link href="/" className="absolute top-28 left-8 text-sm font-medium text-[#B5B5C0] hover:text-white flex items-center gap-2 group transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
                </Link>

                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
                    <div className="text-center mb-10 mt-10">
                        <h2 className="text-3xl font-extrabold text-white mb-3">Create an Account</h2>
                        <p className="text-[#B5B5C0]">Welcome! Set up your account to start gifting.</p>
                    </div>

                    <button onClick={() => signIn("google", { callbackUrl: "/profile" })} className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white px-6 py-4 rounded-xl font-bold hover:bg-white/10 hover:border-white/20 transition-all mb-8">
                        <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                        </svg>
                        Sign up with Google
                    </button>

                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0F0F12] px-4 text-[#B5B5C0]/50 font-bold tracking-wider">Or register with email</span></div>
                    </div>

                    <form className="flex flex-col gap-4" onSubmit={e => e.preventDefault()}>
                        <div>
                            <label className="block text-xs font-bold text-[#B5B5C0]/60 mb-2 uppercase tracking-widest">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User className="h-5 w-5 text-[#B5B5C0]/40" /></div>
                                <input type="text" placeholder="John Doe" className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-[#B5B5C0]/30 focus:outline-none focus:border-[#FF6F91]/50 focus:shadow-[0_0_10px_rgba(255,111,145,0.1)] transition-all" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#B5B5C0]/60 mb-2 uppercase tracking-widest">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-[#B5B5C0]/40" /></div>
                                <input type="email" placeholder="you@example.com" className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-[#B5B5C0]/30 focus:outline-none focus:border-[#FF6F91]/50 focus:shadow-[0_0_10px_rgba(255,111,145,0.1)] transition-all" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#B5B5C0]/60 mb-2 uppercase tracking-widest">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-[#B5B5C0]/40" /></div>
                                <input type="password" placeholder="Create a strong password" className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-[#B5B5C0]/30 focus:outline-none focus:border-[#FF6F91]/50 focus:shadow-[0_0_10px_rgba(255,111,145,0.1)] transition-all" />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-gradient-to-r from-[#C8A2FF] to-[#FF6F91] text-white px-6 py-4 rounded-xl font-bold shadow-[0_0_20px_rgba(200,162,255,0.3)] hover:shadow-[0_0_30px_rgba(200,162,255,0.5)] hover:scale-[1.02] transition-all mt-4">
                            Create Account
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
