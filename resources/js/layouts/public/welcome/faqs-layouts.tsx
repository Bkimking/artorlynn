import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal } from '../components/Reveal';
import { stripHtml } from '@/lib/stripHtml';

export default function FaqsLayout({ faqs = [] }: { faqs?: Array<{ id: number; question: string; answer: string }> }) {
    const [openIdx, setOpenIdx] = useState<number | null>(null);

    if (!faqs.length) return null;

    return (
        <section className="bg-[#1a0e06] py-20 sm:py-28">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <Reveal className="text-center mb-16">
                    <p className="font-serif text-[10px] tracking-[0.3em] text-[#e8cbb5]/50 uppercase mb-4">Got Questions?</p>
                    <h2 className="font-serif text-4xl sm:text-5xl font-normal text-[#f7f7f7]">
                        FAQ<em className="italic text-[#e8cbb5]">s</em>
                    </h2>
                </Reveal>

                <div className="space-y-2">
                    {faqs.map((faq, i) => {
                        const cleanAnswer = stripHtml(faq.answer);
                        return (
                            <Reveal key={faq.id} delay={i * 0.05}>
                                <div className="border border-[#e8cbb5]/10 rounded-xl overflow-hidden bg-[#281b10]/50 hover:border-[#e8cbb5]/20 transition-colors">
                                    <button
                                        onClick={() => setOpenIdx(openIdx === i ? null : i)}
                                        className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer"
                                    >
                                        <span className="font-serif text-[#f7f7f7] text-sm sm:text-base pr-4">{faq.question}</span>
                                        <motion.span
                                            animate={{ rotate: openIdx === i ? 45 : 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="text-[#e8cbb5] text-xl shrink-0 font-light"
                                        >
                                            +
                                        </motion.span>
                                    </button>
                                    <AnimatePresence initial={false}>
                                        {openIdx === i && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                                className="overflow-hidden"
                                            >
                                                <p className="px-5 sm:px-6 pb-5 font-serif text-sm text-[#f7f7f7]/60 leading-relaxed border-t border-[#e8cbb5]/8 pt-4">
                                                    {cleanAnswer}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}