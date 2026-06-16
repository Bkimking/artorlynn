import { motion } from 'framer-motion';
import { Reveal } from './components/Reveal';
import { stripHtml } from '@/lib/stripHtml';

const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};
const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.13 } },
};

export default function ServicesLayout({ services = [] }: { services?: Array<{ id: number; title: string; description: string; category: string; image?: string }> }) {
    if (!services.length) return null;

    return (
        <section id="services" className="bg-[#f7f7f7] py-20 sm:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal className="text-center mb-16">
                    <p className="font-serif text-[10px] tracking-[0.3em] text-[#281b10]/50 uppercase mb-4">What We Offer</p>
                    <h2 className="font-serif text-4xl sm:text-5xl font-normal text-[#281b10]">
                        Our <em className="italic text-[#c9a07a]">Services</em>
                    </h2>
                    <p className="mt-4 text-[#281b10]/60 font-serif text-base max-w-xl mx-auto">
                        Each service is a crafted experience, not just a shoot.
                    </p>
                </Reveal>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-80px' }}
                >
                    {services.map((service, i) => (
                        <motion.article key={service.id} variants={fadeUp} className="group">
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#281b10] via-[#3d2012] to-[#1a0e06] aspect-[4/3] mb-5">
                                {service.image && (
                                    <img src={`/storage/${service.image}`} alt={service.title} className="w-full h-full object-cover" />
                                )}
                                
                            </div>

                            <div className="flex items-center gap-3 mb-3">
                                <span className="font-serif text-xs text-[#281b10]/50">Book anytime</span>
                                <span className="w-1 h-1 rounded-full bg-[#281b10]/30" />
                                <span className="text-xs font-serif bg-[#281b10]/8 text-[#281b10] px-2.5 py-0.5 rounded-full border border-[#281b10]/10">
                                    {service.category ?? 'Service'}
                                </span>
                            </div>
                            <h3 className="font-serif text-xl font-normal text-[#281b10] mb-2 group-hover:text-[#c9a07a] transition-colors duration-300">
                                {service.title}
                            </h3>
                            <p className="font-serif text-sm text-[#281b10]/60 leading-relaxed mb-4">
                                {stripHtml(service.description)}
                            </p>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e8cbb5] to-[#c9a07a] flex items-center justify-center text-[#281b10] font-bold text-[10px] font-serif shrink-0">
                                    AL
                                </div>
                                <div>
                                    <p className="font-serif text-xs font-semibold text-[#281b10]">Art of Lynn Studio</p>
                                    <p className="font-serif text-[10px] text-[#281b10]/50">Creative Direction</p>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}