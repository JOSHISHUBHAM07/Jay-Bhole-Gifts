"use client";

import Link from "next/link";
import { motion, useInView, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowRight, Gift, Star, Sparkles, Heart, ShoppingBag, Quote, Cake, PartyPopper, Briefcase, TreePine, Gem, Package, Users, TrendingUp } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";

// ─── Data ────────────────────────────────────────────────────────
const featuredProducts = [
  { id: "1", name: "Personalized Leather Wallet", price: 45.0, rating: 4.8, image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=500&q=80", category: "accessories", isNew: true },
  { id: "2", name: "Luxury Spa Gift Set", price: 85.0, rating: 4.9, image: "https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=500&q=80", category: "wellness" },
  { id: "3", name: "Custom Engraved Watch", price: 120.0, rating: 4.7, image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&q=80", category: "accessories" },
  { id: "4", name: "Artisan Chocolate Box", price: 35.0, rating: 4.6, image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&q=80", category: "food", isNew: true },
];
const trendingProducts = [
  { id: "5", name: "Rose Gold Birthstone Necklace", price: 65.0, rating: 4.9, image: "https://images.unsplash.com/photo-1515562141589-67f0d569b66a?w=500&q=80", category: "jewelry" },
  { id: "6", name: "Premium Coffee Blend Trio", price: 40.0, rating: 4.5, image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&q=80", category: "food" },
  { id: "7", name: "Aromatherapy Diffuser", price: 55.0, rating: 4.6, image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=500&q=80", category: "wellness", isNew: true },
  { id: "8", name: "Monogrammed Whiskey Glasses", price: 50.0, rating: 4.8, image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500&q=80", category: "home" },
];
const categories = [
  { name: "Birthday Gifts", icon: Cake, color: "#FF6F91" },
  { name: "Anniversary", icon: Heart, color: "#C8A2FF" },
  { name: "Personalized", icon: Gem, color: "#F7C873" },
  { name: "Corporate", icon: Briefcase, color: "#6FBAFF" },
  { name: "Festive", icon: TreePine, color: "#7CFFB2" },
];
const testimonials = [
  { name: "Anita S.", text: "The personalized wallet was absolutely stunning. My husband loved it! The quality exceeded all expectations.", rating: 5 },
  { name: "Ravi K.", text: "Best gift shop in Dahod — ordered a custom hamper and it was delivered beautifully packaged. Will order again!", rating: 5 },
  { name: "Priya M.", text: "The aromatherapy set was perfect for my sister's birthday. She couldn't stop raving about the fragrance!", rating: 4 },
];
const stats = [
  { label: "Happy Customers", value: 10000, suffix: "+", icon: Users, color: "#FF6F91" },
  { label: "Gifts Delivered", value: 25000, suffix: "+", icon: Package, color: "#C8A2FF" },
  { label: "Google Rating", value: 4.8, suffix: "★", icon: Star, color: "#F7C873" },
  { label: "Years in Dahod", value: 12, suffix: "+", icon: TrendingUp, color: "#7CFFB2" },
];

// ─── Utility Components ──────────────────────────────────────────

function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: "easeOut", delay }} className={className}>
      {children}
    </motion.div>
  );
}

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return <span ref={ref}>{value % 1 !== 0 ? count.toFixed(1) : count.toLocaleString()}{suffix}</span>;
}

function MagneticButton({ children, href, className = "" }: { children: React.ReactNode; href: string; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.3);
    y.set((e.clientY - cy) * 0.3);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.a ref={ref} href={href} style={{ x: springX, y: springY }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className={`inline-flex ${className}`}>
      {children}
    </motion.a>
  );
}

function FloatingIcon({ children, delay = 0, duration = 6, className = "" }: { children: React.ReactNode; delay?: number; duration?: number; className?: string }) {
  return (
    <motion.div
      animate={{ y: [0, -25, 0], rotate: [0, 5, -5, 0] }}
      transition={{ repeat: Infinity, duration, delay, ease: "easeInOut" }}
      className={`absolute pointer-events-none ${className}`}
    >
      {children}
    </motion.div>
  );
}

function SparkleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.6, 0], scale: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: Math.random() * 3 + 2, delay: Math.random() * 4, ease: "easeInOut" }}
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
        />
      ))}
    </div>
  );
}

// ─── Staggered Grid ──────────────────────────────────────────────
function StaggeredGrid({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={{ visible: { transition: { staggerChildren: 0.12 } } }} className={className}>
      {children}
    </motion.div>
  );
}

function StaggeredItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 40, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } } }}>
      {children}
    </motion.div>
  );
}

// ─── Page ────────────────────────────────────────────────────────
export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="bg-[#0F0F12] -mt-24 overflow-hidden">
      {/* ═══════════════ HERO ═══════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-[#FF6F91]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-[#C8A2FF]/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F7C873]/5 rounded-full blur-[150px]" />

        <SparkleField />

        {/* Floating 3D Icons */}
        <FloatingIcon delay={0} duration={7} className="top-[15%] left-[8%] hidden md:block">
          <div className="w-16 h-16 rounded-2xl bg-[#FF6F91]/10 border border-[#FF6F91]/20 flex items-center justify-center backdrop-blur-sm"><Gift className="w-8 h-8 text-[#FF6F91]" /></div>
        </FloatingIcon>
        <FloatingIcon delay={1.5} duration={8} className="top-[20%] right-[10%] hidden md:block">
          <div className="w-14 h-14 rounded-2xl bg-[#C8A2FF]/10 border border-[#C8A2FF]/20 flex items-center justify-center backdrop-blur-sm"><Sparkles className="w-7 h-7 text-[#C8A2FF]" /></div>
        </FloatingIcon>
        <FloatingIcon delay={0.5} duration={9} className="bottom-[25%] left-[12%] hidden md:block">
          <div className="w-12 h-12 rounded-xl bg-[#F7C873]/10 border border-[#F7C873]/20 flex items-center justify-center backdrop-blur-sm"><Star className="w-6 h-6 text-[#F7C873]" /></div>
        </FloatingIcon>
        <FloatingIcon delay={2} duration={6} className="bottom-[20%] right-[8%] hidden md:block">
          <div className="w-14 h-14 rounded-2xl bg-[#7CFFB2]/10 border border-[#7CFFB2]/20 flex items-center justify-center backdrop-blur-sm"><Heart className="w-7 h-7 text-[#7CFFB2]" /></div>
        </FloatingIcon>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2 rounded-full text-sm text-[#B5B5C0] font-medium mb-8 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-[#F7C873]" /> Premium Gifting Experience in Dahod
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 leading-[1.1] tracking-tight">
            Find the <span className="text-gradient">Perfect</span>
            <br />Gift for Everyone
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="text-lg md:text-xl text-[#B5B5C0] max-w-2xl mx-auto mb-12 leading-relaxed">
            Discover thoughtfully curated gifts that create lasting memories. From personalized treasures to luxury collections — make every moment magical. ✨
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <MagneticButton href="/products" className="group items-center gap-2 bg-gradient-to-r from-[#FF6F91] to-[#C8A2FF] text-white px-10 py-5 rounded-full font-bold text-lg shadow-[0_0_30px_rgba(255,111,145,0.4)] hover:shadow-[0_0_50px_rgba(255,111,145,0.6)] transition-shadow">
              <Gift className="w-5 h-5" /> Explore Gifts
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>
            <MagneticButton href="/products?category=personalized" className="items-center gap-2 bg-white/5 border border-white/10 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-md">
              Personalized Gifts
            </MagneticButton>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#0F0F12] to-transparent pointer-events-none" />
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 md:px-6">
          <StaggeredGrid className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <StaggeredItem key={stat.label}>
                <div className="bg-[#1A1A20] rounded-2xl border border-white/[0.06] p-7 text-center hover:border-white/10 transition-all card-glow group">
                  <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ background: `${stat.color}15`, color: stat.color }}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-white mb-1">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </h3>
                  <p className="text-xs font-bold text-[#B5B5C0]/50 uppercase tracking-widest">{stat.label}</p>
                </div>
              </StaggeredItem>
            ))}
          </StaggeredGrid>
        </div>
      </section>

      {/* ═══════════════ CATEGORIES ═══════════════ */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-[#FF6F91] font-bold text-sm uppercase tracking-widest mb-3">Browse by Occasion</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white">Gift Categories</h2>
          </AnimatedSection>

          <StaggeredGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {categories.map((cat) => (
              <StaggeredItem key={cat.name}>
                <motion.div whileHover={{ y: -8, scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Link href={`/products?category=${cat.name.split(' ')[0].toLowerCase()}`} className="block bg-[#1A1A20] border border-white/[0.06] rounded-2xl p-6 text-center hover:border-white/20 transition-all group cursor-pointer relative overflow-hidden">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" style={{ boxShadow: `inset 0 0 40px ${cat.color}10, 0 0 30px ${cat.color}15` }} />
                    <div className="relative z-10">
                      <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110" style={{ background: `${cat.color}15`, color: cat.color }}>
                        <cat.icon className="w-7 h-7" />
                      </div>
                      <h3 className="font-bold text-white text-sm">{cat.name}</h3>
                    </div>
                  </Link>
                </motion.div>
              </StaggeredItem>
            ))}
          </StaggeredGrid>
        </div>
      </section>

      {/* ═══════════════ FEATURED ═══════════════ */}
      <section className="py-24 bg-[#1A1A20]/50 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-4">
            <div>
              <p className="text-[#C8A2FF] font-bold text-sm uppercase tracking-widest mb-3">Handpicked for You</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white">Featured Gifts</h2>
            </div>
            <Link href="/products" className="text-[#B5B5C0] hover:text-white font-bold flex items-center gap-2 group transition-colors">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimatedSection>

          <StaggeredGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <StaggeredItem key={product.id}>
                <ProductCard {...product} />
              </StaggeredItem>
            ))}
          </StaggeredGrid>
        </div>
      </section>

      {/* ═══════════════ SPECIAL OFFER ═══════════════ */}
      <section className="py-24 relative overflow-hidden">
        <AnimatedSection>
          <div className="container mx-auto px-4 md:px-6">
            <div className="relative bg-gradient-to-r from-[#FF6F91] to-[#C8A2FF] rounded-3xl p-12 md:p-16 overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[60px] translate-x-1/3 -translate-y-1/3" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-black/10 rounded-full blur-[40px] -translate-x-1/3 translate-y-1/3" />
              <motion.div animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 30, ease: "linear" }} className="absolute top-1/2 right-1/4 w-40 h-40 border border-white/10 rounded-full pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <p className="text-white/80 font-bold text-sm uppercase tracking-widest mb-3">Limited Time Offer</p>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">20% OFF on<br />Personalized Gifts</h2>
                  <p className="text-white/80 text-lg max-w-md">Make it uniquely theirs. Use code <span className="font-bold text-white bg-white/20 px-3 py-1 rounded-lg">GIFT20</span> at checkout.</p>
                </div>
                <MagneticButton href="/products?category=personalized" className="bg-white text-[#FF6F91] px-10 py-5 rounded-full font-bold text-lg hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all shrink-0">
                  Shop Now
                </MagneticButton>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ═══════════════ TRENDING ═══════════════ */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-4">
            <div>
              <p className="text-[#F7C873] font-bold text-sm uppercase tracking-widest mb-3">What's Hot Right Now</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white">Trending Gifts</h2>
            </div>
            <Link href="/products?category=trending" className="text-[#B5B5C0] hover:text-white font-bold flex items-center gap-2 group transition-colors">
              See All Trending <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimatedSection>

          <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory">
            {trendingProducts.map((product, i) => (
              <AnimatedSection key={product.id} delay={i * 0.1} className="min-w-[280px] md:min-w-[300px] snap-start">
                <ProductCard {...product} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="py-24 bg-[#1A1A20]/50 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-[#C8A2FF] font-bold text-sm uppercase tracking-widest mb-3">Happy Customers</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white">What People Say</h2>
          </AnimatedSection>

          <StaggeredGrid className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <StaggeredItem key={i}>
                <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300 }} className="bg-[#202028] border border-white/[0.06] rounded-2xl p-8 hover:border-white/10 transition-all relative overflow-hidden group h-full">
                  <div className="absolute top-4 right-4 text-white/5 group-hover:text-white/10 transition-colors"><Quote className="w-12 h-12" /></div>
                  <div className="flex gap-1 mb-4">{Array.from({ length: t.rating }).map((_, i) => (<Star key={i} className="w-4 h-4 fill-[#F7C873] text-[#F7C873]" />))}</div>
                  <p className="text-[#B5B5C0] leading-relaxed mb-6 text-sm">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF6F91] to-[#C8A2FF] flex items-center justify-center text-white text-sm font-bold">{t.name.charAt(0)}</div>
                    <span className="font-bold text-white text-sm">{t.name}</span>
                  </div>
                </motion.div>
              </StaggeredItem>
            ))}
          </StaggeredGrid>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F12] via-[#1A1A20] to-[#0F0F12]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF6F91]/5 rounded-full blur-[150px]" />
        <motion.div animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 40, ease: "linear" }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-white/[0.03] rounded-full pointer-events-none" />
        <motion.div animate={{ rotate: [360, 0] }} transition={{ repeat: Infinity, duration: 50, ease: "linear" }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-white/[0.02] rounded-full pointer-events-none" />

        <AnimatedSection className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Join the <span className="text-gradient">JayBhole</span> Family
          </h2>
          <p className="text-[#B5B5C0] text-lg max-w-lg mx-auto mb-12">
            Be the first to know about new collections, exclusive offers, and gift-giving inspiration.
          </p>
          <MagneticButton href="/products" className="items-center gap-3 bg-gradient-to-r from-[#FF6F91] to-[#C8A2FF] text-white px-12 py-5 rounded-full font-bold text-lg shadow-[0_0_30px_rgba(255,111,145,0.4)] hover:shadow-[0_0_50px_rgba(255,111,145,0.6)] transition-shadow">
            <ShoppingBag className="w-5 h-5" /> Start Shopping
          </MagneticButton>
        </AnimatedSection>
      </section>
    </div>
  );
}
