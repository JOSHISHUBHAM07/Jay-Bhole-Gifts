import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CursorGlow from "@/components/effects/CursorGlow";
import ScrollProgress from "@/components/effects/ScrollProgress";
import PageTransition from "@/components/effects/PageTransition";
import { ToastProvider } from "@/components/effects/Toast";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JayBhole Gift Shop | Premium Gifting Experience",
  description: "Modern, glossy, highly animated online gift shop serving Dahod.",
};

import { CartProvider } from "@/context/CartContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth bg-[#0F0F12]">
      <body
        className={`${outfit.variable} antialiased min-h-screen flex flex-col font-sans bg-[#0F0F12] text-white`}
      >
        <CartProvider>
          <ToastProvider>
            <CursorGlow />
            <ScrollProgress />
            <Navbar />
            <main className="flex-1 pt-24">
              <PageTransition>
                {children}
              </PageTransition>
            </main>
            <Footer />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
