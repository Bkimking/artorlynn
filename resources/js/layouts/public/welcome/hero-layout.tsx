// layouts/public/welcome/hero-layout.tsx

import { useEffect, useRef, useState } from 'react';
import { motion, useAnimationFrame, useMotionValue, useTransform } from 'framer-motion';
import { stripHtml } from '@/lib/stripHtml';

const DEFAULT_HERO = {
    title: "Where Art\nBreathes\nThrough the Lens",
    description: "Visual storytelling rooted in African identity. Portraits, fashion, brand photography, and fine art — all crafted with soul.",
    location: "Kenya · Est. 2026",
};

// Fixed row heights (px) for each card — creates genuine size variation
const CARD_HEIGHTS = [220, 160, 190, 170, 210, 155, 200, 165, 185, 175, 215, 160];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.13 } } };
const fadeUp  = { hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } } };

// A single infinitely-scrolling column
function ScrollColumn({
    items,
    direction,       // -1 = scroll up, +1 = scroll down
    baseSpeed,       // px per second at rest
    hovered,
    isImg,
    active,
    onCardClick,
    colIndex,
    globalOffset,    // offset so columns start at different positions
}: {
    items: any[];
    direction: -1 | 1;
    baseSpeed: number;
    hovered: boolean;
    isImg: boolean;
    active: number | null;
    onCardClick: (i: number) => void;
    colIndex: number;
    globalOffset: number;
}) {
    const offset = useMotionValue(globalOffset);
    const speed  = hovered ? baseSpeed * 1.9 : baseSpeed;

    // Double the items so we can loop seamlessly
    const doubled = [...items, ...items];

    // Total height of one set
    const totalH = items.reduce((sum, _, i) => sum + (CARD_HEIGHTS[i % CARD_HEIGHTS.length] + 10), 0);

    useAnimationFrame((_, delta) => {
        const px = (delta / 1000) * speed * direction;
        let next = offset.get() + px;
        // Wrap: when scrolled past one full set, reset
        if (direction === -1 && next <= -totalH) next += totalH;
        if (direction ===  1 && next >= 0)       next -= totalH;
        offset.set(next);
    });

    return (
        <motion.div
            style={{ y: offset, gap: 10, display: 'flex', flexDirection: 'column' }}
            className="flex flex-col"
        >
            {doubled.map((item: any, i: number) => {
                const realIdx   = i % items.length;
                const cardH     = CARD_HEIGHTS[realIdx % CARD_HEIGHTS.length];
                const label     = isImg ? (item.alt || '') : item.label;
                const url       = isImg ? item.url : null;
                const isActive  = active === realIdx && i < items.length;

                return (
                    <motion.div
                        key={i}
                        className={`
                            relative flex-shrink-0 overflow-hidden rounded-2xl cursor-pointer group w-full
                            ${!isImg ? `bg-gradient-to-br ${item.bg}` : 'bg-[#1a0e06]'}
                        `}
                        style={{
                            height: cardH,
                            ...(isImg ? {
                                backgroundImage: `url(/storage/${url})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            } : {}),
                        }}
                        animate={{
                            filter: isActive ? 'brightness(1.15)' : 'brightness(0.78)',
                        }}
                        whileHover={{ filter: 'brightness(1.18)', scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => onCardClick(realIdx)}
                    >
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent z-10" />

                        {/* Active ring */}
                        {isActive && (
                            <div
                                className="absolute inset-0 rounded-2xl z-20 pointer-events-none"
                                style={{ boxShadow: 'inset 0 0 0 2px rgba(232,203,181,0.7)' }}
                            />
                        )}

                        {/* Label on hover */}
                        {label && (
                            <div className="absolute bottom-3 left-3 z-30">
                                <span className="text-[#e8cbb5] text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-serif opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    {label}
                                </span>
                            </div>
                        )}

                        {/* Fallback texture */}
                        {!isImg && (
                            <div
                                className="absolute inset-0 opacity-[0.06] z-0"
                                style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(232,203,181,0.4) 8px, rgba(232,203,181,0.4) 9px)' }}
                            />
                        )}
                    </motion.div>
                );
            })}
        </motion.div>
    );
}

export default function HeroLayout({ hero }: { hero?: any }) {
    const [active,  setActive]  = useState<number | null>(null);
    const [hovered, setHovered] = useState(false);

    const images = hero?.image && Array.isArray(hero.image) && hero.image.length > 0 ? hero.image : null;

    const rawDescription = hero?.description || DEFAULT_HERO.description;
    const cleanDescription = stripHtml(rawDescription);
    const title    = hero?.title ? hero.title.split('\n') : DEFAULT_HERO.title.split('\n');
    const location = hero?.location || DEFAULT_HERO.location;

    const allItems = images ?? DEFAULT_HERO.tiles;
    const count    = allItems.length;
    const isImg    = images !== null;

    // Split items across 3 columns round-robin
    const cols = 3;
    const columns: any[][] = Array.from({ length: cols }, () => []);
    allItems.forEach((item: any, i: number) => columns[i % cols].push(item));
    // Pad shorter columns with repeats so they all have enough to loop
    const minPerCol = 4;
    columns.forEach((col, ci) => {
        while (col.length < minPerCol) col.push(...columns[ci].slice(0, minPerCol - col.length));
    });

    // col 0: up, col 1: down, col 2: up — outer cols rise, middle falls
    const directions: (-1 | 1)[] = [-1, 1, -1];
    const speeds = [38, 32, 42]; // slightly different speeds for organic feel
    // Start middle column offset so it begins lower (already scrolled down a bit)
    const globalOffsets = [0, -160, -80];

    return (
        <section className="bg-[#281b10] flex items-center relative overflow-hidden pt-16 sm:pt-20">
            {/* Grain */}
            <div
                className="absolute inset-0 opacity-30 pointer-events-none z-0"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")` }}
            />
            <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-[#e8cbb5]/5 rounded-full blur-[120px] pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start relative z-10 w-full">

                {/* ── Left: Text ── */}
                <motion.div variants={stagger} initial="hidden" animate="show" className="order-2 lg:order-1 lg:py-16">
                    <motion.p variants={fadeUp} className="font-serif text-[10px] tracking-[0.3em] text-[#e8cbb5] uppercase mb-5">
                        {location}
                    </motion.p>
                    <motion.h1
                        variants={fadeUp}
                        className="font-serif text-[clamp(40px,5.5vw,72px)] font-normal text-[#f7f7f7] leading-[1.08] mb-7 tracking-tight"
                    >
                        {title.map((line: string, idx: number) => (
                            <span key={idx}>{line}{idx !== title.length - 1 && <br />}</span>
                        ))}
                    </motion.h1>
                    <motion.p variants={fadeUp} className="text-[#f7f7f7]/55 font-serif text-base sm:text-lg leading-relaxed max-w-md mb-10">
                        {cleanDescription}
                    </motion.p>
                    <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                        <a href="#services" className="px-8 py-3.5 bg-[#e8cbb5] text-[#281b10] font-serif text-xs tracking-[0.14em] uppercase font-bold hover:bg-[#f7f7f7] transition-colors duration-300 rounded-sm">
                            Explore Services
                        </a>
                        <a href="#contact" className="px-8 py-3.5 border border-[#f7f7f7]/30 text-[#f7f7f7] font-serif text-xs tracking-[0.14em] uppercase hover:border-[#e8cbb5] hover:text-[#e8cbb5] transition-all duration-300 rounded-sm">
                            Get in Touch
                        </a>
                    </motion.div>
                    {count > 0 && (
                        <motion.p variants={fadeUp} className="mt-8 text-[11px] text-[#e8cbb5]/40 font-serif tracking-widest uppercase">
                            {count} frame{count !== 1 ? 's' : ''} in portfolio
                        </motion.p>
                    )}
                </motion.div>

                {/* ── Right: Scrolling columns ── */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.9, delay: 0.25, ease: 'easeOut' }}
                    className="order-1 lg:order-2 relative"
                    style={{ height: '66vh', overflow: 'hidden' }}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    {/* Top fade */}
                    <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
                        style={{ height: '80px', background: 'linear-gradient(to bottom, #281b10, transparent)' }} />
                    {/* Bottom fade */}
                    <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
                        style={{ height: '140px', background: 'linear-gradient(to top, #281b10, transparent)' }} />

                    {/* 3 scrolling columns */}
                    <div className="grid grid-cols-3 gap-2.5 h-full">
                        {columns.map((colItems, ci) => (
                            <ScrollColumn
                                key={ci}
                                items={colItems}
                                direction={directions[ci]}
                                baseSpeed={speeds[ci]}
                                hovered={hovered}
                                isImg={isImg}
                                active={active}
                                onCardClick={setActive}
                                colIndex={ci}
                                globalOffset={globalOffsets[ci]}
                            />
                        ))}
                    </div>
                </motion.div>

            </div>
        </section>
    );
}