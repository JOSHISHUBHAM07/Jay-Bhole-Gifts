"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShoppingBag, X } from "lucide-react";

interface Toast {
    id: number;
    message: string;
    type: "success" | "error" | "info";
}

interface ToastContextType {
    showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => { } });
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 80, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 80, scale: 0.9 }}
                            transition={{ type: "spring", damping: 20, stiffness: 300 }}
                            className="pointer-events-auto bg-[#202028] border border-white/10 rounded-2xl px-5 py-4 shadow-2xl flex items-center gap-3 min-w-[280px] max-w-[400px]"
                        >
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${toast.type === "success" ? "bg-green-500/15 text-green-400" :
                                    toast.type === "error" ? "bg-red-500/15 text-red-400" :
                                        "bg-[#FF6F91]/15 text-[#FF6F91]"
                                }`}>
                                {toast.type === "success" ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                            </div>
                            <p className="text-sm font-bold text-white flex-1">{toast.message}</p>
                            <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="text-[#B5B5C0]/40 hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}
