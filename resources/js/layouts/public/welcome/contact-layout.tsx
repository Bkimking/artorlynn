import { useState } from 'react';
import { motion } from 'framer-motion';
import { Reveal } from '../components/Reveal';
import axios from 'axios';

interface ContactData {
    email_1?: string; email_2?: string; email_3?: string;
    phone_1?: string; phone_2?: string; phone_3?: string;
    city?: string; county?: string; country?: string; street_address?: string;
    about_location?: string; map_embed_url?: string;
    facebook?: string; twitter?: string; instagram?: string;
    youtube?: string; tiktok?: string; telegram?: string; whatsApp?: string; linkedin?: string;
}

const SOCIAL_DEFS = [
    { key: 'instagram', label: 'Instagram', icon: '📸', baseUrl: 'https://instagram.com/' },
    { key: 'facebook', label: 'Facebook', icon: '📘', baseUrl: 'https://facebook.com/' },
    { key: 'youtube', label: 'YouTube', icon: '▶', baseUrl: 'https://youtube.com/@' },
    { key: 'tiktok', label: 'TikTok', icon: '🎵', baseUrl: 'https://tiktok.com/@' },
    { key: 'twitter', label: 'Twitter/X', icon: '𝕏', baseUrl: 'https://x.com/' },
    { key: 'linkedin', label: 'LinkedIn', icon: '💼', baseUrl: 'https://linkedin.com/in/' },
    { key: 'telegram', label: 'Telegram', icon: '✈', baseUrl: 'https://t.me/' },
    { key: 'whatsApp', label: 'WhatsApp', icon: '💬', baseUrl: 'https://wa.me/' },
];

function buildSocialUrl(baseUrl: string, handle: string): string {
    const cleaned = handle.replace(/^@/, '').trim();
    if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
        return cleaned;
    }
    return `${baseUrl}${cleaned}`;
}

// Default art services shown when none come from DB
const DEFAULT_SERVICES = [
    'Custom Illustration',
    'Portrait Drawing',
    'Coloring Book Art',
    'Character Design',
    'Fine Art Print',
    'Commission Piece',
];

export default function ContactLayout({
    contact,
    services = [],
}: {
    contact?: ContactData;
    services?: Array<{ id: number; title: string }>;
}) {
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [form, setForm] = useState({ name: '', email: '', service: '', message: '' });

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        try {
            await axios.post('/contact', form);
            setSent(true);
            setForm({ name: '', email: '', service: '', message: '' });
            setTimeout(() => setSent(false), 5000);
        } catch (err: any) {
            if (err.response?.data?.message) {
                setErrorMsg(err.response.data.message);
            } else {
                setErrorMsg('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-3 bg-[#281b10]/40 border border-[#e8cbb5]/15 focus:border-[#e8cbb5]/50 text-[#f7f7f7] font-serif text-sm outline-none rounded-lg transition-colors placeholder:text-[#f7f7f7]/30 disabled:opacity-50";

    const emails = [contact?.email_1, contact?.email_2, contact?.email_3].filter(Boolean) as string[];
    const phones = [contact?.phone_1, contact?.phone_2, contact?.phone_3].filter(Boolean) as string[];

    const displayEmails = emails.length ? emails : ['brian01kimathi@gmail.com'];
    const displayPhones = phones.length ? phones : ['0743208307'];
    const location = [contact?.city, contact?.county, contact?.country].filter(Boolean).join(', ') || null;
    const hours = 'Mon–Sat · 9am–6pm EAT';

    const serviceOptions = services.length ? services.map(s => s.title) : DEFAULT_SERVICES;

    const socials = SOCIAL_DEFS
        .map(s => ({ ...s, url: contact?.[s.key as keyof ContactData] as string | undefined }))
        .filter(s => s.url)
        .map(s => ({ ...s, url: buildSocialUrl(s.baseUrl, s.url!) }));

    return (
        <section id="contact" className="bg-[#281b10] py-20 sm:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                <Reveal>
                    <p className="font-serif text-[10px] tracking-[0.3em] text-[#e8cbb5] uppercase mb-5">Let's Create Together</p>
                    <h2 className="font-serif text-4xl sm:text-5xl font-normal text-[#f7f7f7] leading-tight mb-6">
                        Start a <em className="italic text-[#e8cbb5]">Conversation</em>
                    </h2>
                    <p className="font-serif text-[#f7f7f7]/60 leading-loose text-base mb-10">
                        Whether it's a custom illustration, a commission piece, or a coloring book —
                        even just a quotation to get started — we'd love to bring your vision to life.
                    </p>

                    <div className="space-y-5">
                        <div className="flex gap-4">
                            <span className="font-serif text-[10px] tracking-[0.2em] uppercase text-[#e8cbb5]/60 w-20 shrink-0 pt-0.5">Email</span>
                            <div className="flex flex-col gap-1">
                                {displayEmails.map((em, i) => (
                                    <a key={i} href={`mailto:${em}`} className="font-serif text-[#f7f7f7]/80 text-sm hover:text-[#e8cbb5] transition-colors">{em}</a>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <span className="font-serif text-[10px] tracking-[0.2em] uppercase text-[#e8cbb5]/60 w-20 shrink-0 pt-0.5">Phone</span>
                            <div className="flex flex-col gap-1">
                                {displayPhones.map((ph, i) => (
                                    <a key={i} href={`tel:${ph}`} className="font-serif text-[#f7f7f7]/80 text-sm hover:text-[#e8cbb5] transition-colors">{ph}</a>
                                ))}
                            </div>
                        </div>
                        {location && (
                            <div className="flex gap-4">
                                <span className="font-serif text-[10px] tracking-[0.2em] uppercase text-[#e8cbb5]/60 w-20 shrink-0 pt-0.5">Location</span>
                                <span className="font-serif text-[#f7f7f7]/80 text-sm">{location}</span>
                            </div>
                        )}
                        <div className="flex gap-4">
                            <span className="font-serif text-[10px] tracking-[0.2em] uppercase text-[#e8cbb5]/60 w-20 shrink-0 pt-0.5">Hours</span>
                            <span className="font-serif text-[#f7f7f7]/80 text-sm">{hours}</span>
                        </div>
                        {socials.length > 0 && (
                            <div className="flex gap-4">
                                <span className="font-serif text-[10px] tracking-[0.2em] uppercase text-[#e8cbb5]/60 w-20 shrink-0 pt-0.5">Socials</span>
                                <div className="flex gap-2 flex-wrap">
                                    {socials.map(s => (
                                        <a key={s.key} href={s.url} target="_blank" rel="noopener noreferrer"
                                            aria-label={s.key}
                                            className="w-8 h-8 rounded-full bg-[#e8cbb5]/8 border border-[#e8cbb5]/12 flex items-center justify-center text-xs hover:bg-[#e8cbb5]/20 transition-colors">
                                            {s.icon}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Reveal>

                <Reveal delay={0.15}>
                    <form onSubmit={submit} className="space-y-4">
                        {errorMsg && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <p className="text-red-400 text-xs font-serif">{errorMsg}</p>
                            </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input disabled={loading} className={inputClass} placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                            <input disabled={loading} className={inputClass} type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                        </div>
                        <select disabled={loading} className={`${inputClass} appearance-none`} value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
                            <option value="" className="bg-[#281b10]">Select a Service</option>
                            {serviceOptions.map((name, i) => (
                                <option key={i} className="bg-[#281b10]">{name}</option>
                            ))}
                            <option className="bg-[#281b10]">Other</option>
                        </select>
                        <textarea disabled={loading} className={`${inputClass} resize-none`} rows={5} placeholder="Tell us about your project..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
                        <motion.button
                            disabled={loading || sent}
                            type="submit"
                            whileHover={!(loading || sent) ? { scale: 1.02 } : {}}
                            whileTap={!(loading || sent) ? { scale: 0.98 } : {}}
                            className={`w-full sm:w-auto px-10 py-3.5 font-serif text-xs tracking-[0.16em] uppercase font-bold transition-all duration-300 rounded-sm disabled:opacity-75 ${sent ? 'bg-green-700/30 text-green-400 border border-green-700/40' : 'bg-[#e8cbb5] text-[#281b10] hover:bg-[#f7f7f7]'}`}
                        >
                            {loading ? 'Sending...' : sent ? '✓ Message Sent' : 'Send Message'}
                        </motion.button>
                    </form>
                </Reveal>
            </div>
        </section>
    );
}