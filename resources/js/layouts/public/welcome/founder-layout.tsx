import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { stripHtml } from '../../../lib/stripHtml';

export default function FounderLayout({ founder }: { founder?: { name: string; position: string; content: string; avatar?: string } }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-100px' });

    if (!founder) return null;

    const avatarUrl = founder.avatar ? `/storage/${founder.avatar}` : null;

    return (
        <section id="about" className="bg-[#281b10] py-20 sm:py-28 relative overflow-hidden">
            <div className="absolute top-10 left-1/2 -translate-x-1/2 text-[220px] text-[#e8cbb5]/3 font-serif leading-none pointer-events-none select-none">"</div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="relative"
                    >
                        <div className="relative aspect-[3/4] max-w-sm mx-auto lg:mx-0 rounded-2xl overflow-hidden border border-[#e8cbb5]/15 bg-gradient-to-br from-[#3d2012] to-[#1a0e06]">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt={founder.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-8xl">🪷</div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#281b10]/60 to-transparent" />
                        </div>
                        <div className="absolute top-4 left-4 right-[-12px] bottom-[-12px] border border-[#e8cbb5]/20 rounded-2xl -z-10" />
                        <div className="absolute bottom-[-12px] right-0 sm:right-[-12px] bg-[#e8cbb5] text-[#281b10] px-4 py-2.5 font-serif text-xs tracking-[0.15em] uppercase font-bold rounded-sm shadow-lg">
                            {founder.position ?? 'Founder & Visionary'}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
                    >
                        <p className="font-serif text-[10px] tracking-[0.3em] text-[#e8cbb5] uppercase mb-6">A Word from the Founder</p>
                        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#f7f7f7] leading-tight mb-8">
                            "{stripHtml(founder.content)}"
                        </h2>
                        <div className="border-t border-[#e8cbb5]/15 pt-7 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#e8cbb5] to-[#c9a07a] flex items-center justify-center font-serif font-black text-sm text-[#281b10]">
                                {founder.name?.charAt(0) || 'F'}
                            </div>
                            <div>
                                <p className="font-serif text-[#f7f7f7] font-semibold text-sm">{founder.name}</p>
                                <p className="font-serif text-[#e8cbb5]/60 text-xs tracking-wide">{founder.position}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}