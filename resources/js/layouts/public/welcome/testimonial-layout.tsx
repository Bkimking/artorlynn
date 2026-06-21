import { useState } from 'react';
import { motion } from 'framer-motion';
import { Reveal } from '../components/Reveal';
import { stripHtml } from '@/lib/stripHtml';

interface Testimonial {
    id: number;
    name: string;
    position: string;
    content: string;
    avatar?: string;
    rating?: number;
}

import { Variants } from 'framer-motion';

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};
const stagger: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.13 } },
};

export default function TestimonialLayout({ testimonials = [] }: { testimonials?: Array<Testimonial> }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [form, setForm] = useState({ name: '', email: '', position: '', rating: 5, content: '' });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const submitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const formData = new FormData();
            formData.append('name', form.name);
            if (form.email) formData.append('email', form.email);
            if (form.position) formData.append('position', form.position);
            formData.append('rating', form.rating.toString());
            if (form.content) formData.append('content', form.content);
            if (avatarFile) formData.append('avatar', avatarFile);

            const { default: axios } = await import('axios');
            const res = await axios.post('/testimonials', formData);

            setMessage(res.data.message || 'Review submitted successfully!');
            setForm({ name: '', email: '', position: '', rating: 5, content: '' });
            setAvatarFile(null);

            setTimeout(() => {
                setIsModalOpen(false);
                setMessage('');
            }, 3000);
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    if (!testimonials.length) return null;

    return (
        <section className="bg-[#f7f7f7] py-20 sm:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal className="text-center mb-16">
                    <p className="font-serif text-[10px] tracking-[0.3em] text-[#281b10]/50 uppercase mb-4">Kind Words</p>
                    <h2 className="font-serif text-4xl sm:text-5xl font-normal text-[#281b10]">
                        What Clients <em className="italic text-[#c9a07a]">Say</em>
                    </h2>
                </Reveal>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-80px' }}
                >
                    {testimonials.map((t) => (
                        <motion.div
                            key={t.id}
                            variants={fadeUp}
                            className="bg-white rounded-2xl p-8 border border-[#281b10]/8 relative"
                        >
                            <div className="absolute top-6 right-8 text-5xl text-[#e8cbb5]/40 font-serif leading-none">"</div>
                            <p className="font-serif text-[#281b10]/75 leading-relaxed text-base mb-6 relative z-10">
                                {stripHtml(t.content).substring(0, 100)}
                            </p>
                            <div className="flex items-center gap-3 border-t border-[#281b10]/8 pt-5">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e8cbb5] to-[#c9a07a] flex items-center justify-center font-serif font-bold text-xs text-[#281b10] shrink-0">
                                    {t.avatar ? (
                                        <img src={`/storage/${t.avatar}`} alt={t.name} className="w-full h-full object-cover rounded-full" />
                                    ) : (
                                        t.avatar ? t.avatar.charAt(0) : t.name?.charAt(0) ?? 'C'
                                    )}
                                </div>
                                <div>
                                    <p className="font-serif text-sm font-semibold text-[#281b10]">{t.name}</p>
                                    <p className="font-serif text-xs text-[#281b10]/50">{t.position}</p>
                                </div>
                                {t.rating && (
                                    <div className="flex items-center gap-1 ml-auto">
                                        {[...Array(5)].map((_, i) => (
                                            <span
                                                key={i}
                                                className={`text-sm ${i < t.rating! ? 'text-[#c9a07a]' : 'text-[#281b10]/30'}`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="mt-16 text-center">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-8 py-3.5 bg-[#e8cbb5] text-[#281b10] font-serif text-sm tracking-[0.15em] uppercase font-bold hover:bg-[#c9a07a] transition-colors rounded-sm"
                    >
                        Leave a Review
                    </button>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[#281b10] w-full max-w-lg rounded-2xl p-6 sm:p-8 relative border border-[#e8cbb5]/20 max-h-[90vh] overflow-y-auto"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-5 text-[#e8cbb5]/60 hover:text-[#e8cbb5] text-xl"
                            >
                                ✕
                            </button>
                            <h3 className="font-serif text-2xl text-[#f7f7f7] mb-6">Write a Review</h3>

                            <form onSubmit={submitReview} className="space-y-4">
                                {message && (
                                    <div className={`p-3 text-xs font-serif rounded-lg border ${message.includes('success') ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                        {message}
                                    </div>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input disabled={loading} required type="text" placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-[#f7f7f7]/5 border border-[#e8cbb5]/15 text-[#f7f7f7] font-serif text-sm rounded-lg outline-none focus:border-[#e8cbb5]/50 placeholder-[#f7f7f7]/30" />

                                    <input disabled={loading} required type="email" placeholder="Your Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 bg-[#f7f7f7]/5 border border-[#e8cbb5]/15 text-[#f7f7f7] font-serif text-sm rounded-lg outline-none focus:border-[#e8cbb5]/50 placeholder-[#f7f7f7]/30" />
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <input disabled={loading} type="text" placeholder="Your Role (optional)" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} className="w-full px-4 py-3 bg-[#f7f7f7]/5 border border-[#e8cbb5]/15 text-[#f7f7f7] font-serif text-sm rounded-lg outline-none focus:border-[#e8cbb5]/50 placeholder-[#f7f7f7]/30" />

                                    <div>
                                        <label className="text-[#f7f7f7]/60 font-serif text-xs px-1 block mb-2">Rating</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map(r => (
                                                <button
                                                    key={r}
                                                    type="button"
                                                    disabled={loading}
                                                    onClick={() => setForm({ ...form, rating: r })}
                                                    className={`text-2xl ${r <= form.rating ? 'text-[#c9a07a]' : 'text-[#f7f7f7]/20'} hover:scale-110 transition-transform`}
                                                >
                                                    ★
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <textarea disabled={loading} rows={4} placeholder="Your testimonial... (optional)" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="w-full px-4 py-3 bg-[#f7f7f7]/5 border border-[#e8cbb5]/15 text-[#f7f7f7] font-serif text-sm rounded-lg outline-none focus:border-[#e8cbb5]/50 placeholder-[#f7f7f7]/30 resize-none"></textarea>

                                    <div>
                                        <label className="text-[#f7f7f7]/60 font-serif text-xs px-1 block mb-2">Avatar (optional)</label>
                                        <input disabled={loading} type="file" accept="image/*" onChange={e => setAvatarFile(e.target.files?.[0] || null)} className="w-full font-serif text-sm text-[#f7f7f7]/60 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-serif file:bg-[#e8cbb5] file:text-[#281b10] hover:file:bg-[#c9a07a] cursor-pointer" />
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <button
                                        disabled={loading}
                                        type="submit"
                                        className="w-full px-8 py-3.5 bg-[#e8cbb5] text-[#281b10] font-serif text-sm tracking-[0.15em] uppercase font-bold hover:bg-[#c9a07a] transition-colors rounded-sm disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        </section>
    );
}
