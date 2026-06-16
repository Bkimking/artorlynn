import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

interface AuthUser { name: string; email: string; }

interface Banner {
    id: number;
    text: string;
    subtext: string;
    type: 'info' | 'warning' | 'success' | 'promo';
}

const BANNER_STYLES = {
    info:    'bg-blue-500 text-white',
    warning: 'bg-amber-500 text-white',
    success: 'bg-emerald-500 text-white',
    promo:   'bg-indigo-600 text-white',
} as const;

const BANNER_HEIGHT = 52;

// Stagger children
const navStagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.4 } },
};
const navItem = {
    hidden: { opacity: 0, y: -6 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

// Mobile menu item
const mobileItem = {
    hidden: { opacity: 0, x: -12 },
    show:   { opacity: 1, x: 0,  transition: { duration: 0.25, ease: 'easeOut' } },
};

export default function NavLayout({
    user,
    banners = [],
}: {
    user: AuthUser | null;
    banners?: Banner[];
}) {
    const [scrolled,    setScrolled]    = useState(false);
    const [open,        setOpen]        = useState(false);
    const [bannerVisible, setBannerVisible] = useState(true);

    // For multi-banner cycling
    const [activeBanner, setActiveBanner] = useState(0);
    const cycleRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Smooth animated top offset for the header
    const headerTop = useMotionValue(banners.length > 0 ? BANNER_HEIGHT : 0);

    // Cycle banners every 4 s when there are multiple
    useEffect(() => {
        if (banners.length <= 1) return;
        cycleRef.current = setInterval(() => {
            setActiveBanner(prev => (prev + 1) % banners.length);
        }, 4000);
        return () => { if (cycleRef.current) clearInterval(cycleRef.current); };
    }, [banners.length]);

    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY;
            const nowScrolled    = y > 40;
            const nowBannerVisible = y < 100;

            setScrolled(nowScrolled);
            setBannerVisible(nowBannerVisible);

            // Smoothly animate the header's top position (banner is always single row)
            const targetTop = nowBannerVisible && banners.length > 0 ? BANNER_HEIGHT : 0;
            animate(headerTop, targetTop, { duration: 0.35, ease: [0.4, 0, 0.2, 1] });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [banners.length, headerTop]);

    const links = [
        { href: '#services', label: 'Services' },
        { href: '#events',   label: 'Events'   },
        { href: '#about',    label: 'About'     },
        { href: '#contact',  label: 'Contact'   },
    ];

    return (
        <>
            {/* ── Banner strip ─────────────────────────────────────── */}
            <AnimatePresence>
                {bannerVisible && banners.length > 0 && (
                    <motion.div
                        key="banner-strip"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: BANNER_HEIGHT, opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden relative"
                    >
                        {/* Colour layer – animates between banner colours */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={banners[activeBanner].id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className={cn('absolute inset-0', BANNER_STYLES[banners[activeBanner].type])}
                            />
                        </AnimatePresence>

                        {/* Text layer – slides vertically */}
                        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`text-${banners[activeBanner].id}`}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                >
                                    <span className="text-sm font-medium text-white">
                                        {banners[activeBanner].text}
                                    </span>
                                    {banners[activeBanner].subtext && (
                                        <p
                                            className="text-xs mt-0.5 opacity-80 text-white"
                                            dangerouslySetInnerHTML={{ __html: banners[activeBanner].subtext }}
                                        />
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* Dots — only when multiple banners, inline below text */}
                            {banners.length > 1 && (
                                <div className="flex gap-1 mt-1">
                                    {banners.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveBanner(i)}
                                            aria-label={`Banner ${i + 1}`}
                                            className="focus:outline-none"
                                        >
                                            <motion.span
                                                animate={{
                                                    opacity: i === activeBanner ? 1 : 0.35,
                                                    width:   i === activeBanner ? 16 : 6,
                                                }}
                                                transition={{ duration: 0.25 }}
                                                className="block h-1 rounded-full bg-white"
                                                style={{ width: 6 }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Header ───────────────────────────────────────────── */}
            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0,   opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{ top: headerTop }}
                className={cn(
                    'fixed left-0 right-0 z-50 transition-colors duration-500',
                    scrolled
                        ? 'bg-[#281b10]/90 backdrop-blur-xl border-b border-[#e8cbb5]/10'
                        : 'bg-transparent border-b border-transparent',
                )}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">

                    {/* Logo */}
                    <motion.a
                        href="#"
                        className="flex items-center gap-3 no-underline group"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                        <motion.div
                            whileHover={{ rotate: 6, scale: 1.12 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                            className="w-9 h-9 rounded-full bg-gradient-to-br from-[#e8cbb5] to-[#c9a07a] flex items-center justify-center text-[#281b10] font-black text-xs font-serif"
                        >
                            AL
                        </motion.div>
                        <span className="font-serif text-[#f7f7f7] text-lg font-semibold tracking-wide hidden sm:block">
                            Art of Lynn
                        </span>
                    </motion.a>

                    {/* Desktop nav */}
                    <motion.nav
                        variants={navStagger}
                        initial="hidden"
                        animate="show"
                        className="hidden md:flex items-center gap-8"
                    >
                        {links.map(l => (
                            <motion.a
                                key={l.href}
                                href={l.href}
                                variants={navItem}
                                className="relative text-[#f7f7f7]/70 hover:text-[#e8cbb5] text-xs tracking-widest uppercase font-serif transition-colors duration-200 group"
                            >
                                {l.label}
                                {/* Underline reveal on hover */}
                                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#e8cbb5] group-hover:w-full transition-all duration-300" />
                            </motion.a>
                        ))}

                        {user && (
                            <motion.div variants={navItem}>
                                <Link
                                    href="/admin/dashboard"
                                    className="text-xs tracking-widest uppercase font-serif text-[#e8cbb5]/80 hover:text-[#e8cbb5] transition-colors duration-200 border-b border-[#e8cbb5]/30 hover:border-[#e8cbb5] pb-0.5"
                                >
                                    Dashboard
                                </Link>
                            </motion.div>
                        )}

                        <motion.a
                            href="#contact"
                            variants={navItem}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            className="px-5 py-2 border border-[#e8cbb5] text-[#e8cbb5] hover:bg-[#e8cbb5] hover:text-[#281b10] font-serif text-xs tracking-widest uppercase transition-all duration-300 rounded-sm"
                        >
                            Quotation
                        </motion.a>
                    </motion.nav>

                    {/* Hamburger */}
                    <motion.button
                        onClick={() => setOpen(!open)}
                        whileTap={{ scale: 0.9 }}
                        className="md:hidden flex flex-col gap-1.5 p-2"
                        aria-label="Menu"
                    >
                        <motion.span
                            animate={{ rotate: open ? 45 : 0, y: open ? 10 : 0 }}
                            transition={{ duration: 0.25 }}
                            className="block w-6 h-px bg-[#f7f7f7] origin-center"
                        />
                        <motion.span
                            animate={{ opacity: open ? 0 : 1, scaleX: open ? 0 : 1 }}
                            transition={{ duration: 0.2 }}
                            className="block w-6 h-px bg-[#f7f7f7]"
                        />
                        <motion.span
                            animate={{ rotate: open ? -45 : 0, y: open ? -10 : 0 }}
                            transition={{ duration: 0.25 }}
                            className="block w-6 h-px bg-[#f7f7f7] origin-center"
                        />
                    </motion.button>
                </div>

                {/* Mobile drawer */}
                <AnimatePresence>
                    {open && (
                        <motion.div
                            key="mobile-menu"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                            className="md:hidden bg-[#281b10]/98 backdrop-blur-xl border-t border-[#e8cbb5]/10 overflow-hidden"
                        >
                            <motion.div
                                variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }}
                                initial="hidden"
                                animate="show"
                                className="px-4 py-5 flex flex-col gap-1"
                            >
                                {links.map(l => (
                                    <motion.a
                                        key={l.href}
                                        href={l.href}
                                        variants={mobileItem}
                                        onClick={() => setOpen(false)}
                                        className="block py-3 text-[#f7f7f7]/80 font-serif text-sm tracking-wide border-b border-[#e8cbb5]/10"
                                    >
                                        {l.label}
                                    </motion.a>
                                ))}

                                {user && (
                                    <motion.div variants={mobileItem}>
                                        <Link
                                            href="/admin/dashboard"
                                            onClick={() => setOpen(false)}
                                            className="block py-3 text-[#e8cbb5] font-serif text-sm tracking-wide border-b border-[#e8cbb5]/10"
                                        >
                                            Dashboard
                                        </Link>
                                    </motion.div>
                                )}

                                <motion.a
                                    href="#contact"
                                    variants={mobileItem}
                                    onClick={() => setOpen(false)}
                                    whileTap={{ scale: 0.97 }}
                                    className="mt-3 inline-block px-6 py-3 border border-[#e8cbb5] text-[#e8cbb5] font-serif text-xs tracking-widest uppercase text-center"
                                >
                                    Book Now
                                </motion.a>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>
        </>
    );
}