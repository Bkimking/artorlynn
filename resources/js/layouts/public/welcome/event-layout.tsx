import { motion } from 'framer-motion';
import { Reveal } from '../components/reveal';
import { format } from 'date-fns';
import { stripHtml } from '@/lib/stripHtml';
import { Link } from '@inertiajs/react';

const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};
const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.13 } },
};

export default function EventLayout({ events = [] }: {
    events?: Array<{
        id: number; slug: string; title: string; description: string; event_date: string; location_name: string; status: string;
        images?: string[];
    }>
}) {
    if (!events.length) return null;

    return (
        <section id="events" className="bg-[#1a0e06] py-20 sm:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal className="text-center mb-16">
                    <p className="font-serif text-[10px] tracking-[0.3em] text-[#e8cbb5]/50 uppercase mb-4">Moments We Capture</p>
                    <h2 className="font-serif text-4xl sm:text-5xl font-normal text-[#f7f7f7]">
                        Event <em className="italic text-[#e8cbb5]">Coverage</em>
                    </h2>
                    <p className="mt-4 text-[#f7f7f7]/50 font-serif text-base max-w-xl mx-auto">
                        From intimate ceremonies to grand galas — we're there for it all.
                    </p>
                </Reveal>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-80px' }}
                >
                    {events.map((event, i) => (
                        
                        <motion.article
                            key={event.id}
                            variants={fadeUp}
                            className="relative overflow-hidden rounded-2xl  group aspect-[3/4] sm:aspect-[4/5]"
                        >
                            <Link href={`/events/${event.slug}`} className="block w-full h-full">
                            {event.images?.[0] ? (
                                <img
                                    src={event.images[0]}
                                    alt={event.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-[#2d1508] to-[#1a0e06]" />
                            )}
                            <motion.div className="absolute inset-0 bg-[#e8cbb5]/5" whileHover={{ opacity: 0 }} />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1a0e06]/95 via-[#1a0e06]/30 to-transparent" />

                            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="font-serif text-[10px] text-[#e8cbb5]/70">
                                        {event.event_date ? format(new Date(event.event_date), 'MMM d, yyyy') : 'Date TBA'}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-[#e8cbb5]/40" />
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#e8cbb5] to-[#c9a07a] flex items-center justify-center text-[#281b10] font-bold text-[8px] font-serif">
                                        AL
                                    </div>
                                    <span className="font-serif text-[10px] text-[#f7f7f7]/70">Art of Lynn</span>
                                </div>
                                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#f7f7f7] leading-tight">
                                    {event.title}
                                </h3>
                                <p className="font-serif text-xs text-[#f7f7f7]/60 mt-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-h-0 group-hover:max-h-20 overflow-hidden">
                                    {stripHtml(event.description)}
                                </p>
                            </div>

                            <div className="absolute top-4 right-4">
                                <span className="font-serif text-[10px] tracking-widest uppercase bg-[#e8cbb5]/15 border border-[#e8cbb5]/20 text-[#e8cbb5] px-2.5 py-1 rounded-full backdrop-blur-sm">
                                    {event.status === 'upcoming' ? 'Upcoming' : event.status}
                                </span>
                            </div>
                            </Link>
                        </motion.article>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}