import { motion } from 'framer-motion';

export default function PartnerLayout({ partners = [] }: { partners?: Array<{ id: number; name: string; logo?: string; website_url?: string }> }) {
    if (!partners.length) return null;

    return (
        <div className="bg-[#1a0e06] py-6 sm:py-8 overflow-hidden border-y border-[#e8cbb5]/8">
            <motion.div
                className="flex gap-12 sm:gap-16 items-center whitespace-nowrap"
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
                {[...partners, ...partners].map((partner, i) => (
                    <a
                        key={i}
                        href={partner.website_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#e8cbb5]/40 font-serif text-xs sm:text-sm tracking-[0.2em] uppercase shrink-0 hover:text-[#e8cbb5]/70 transition-colors cursor-pointer"
                    >
                        {partner.name}
                    </a>
                ))}
            </motion.div>
        </div>
    );
}