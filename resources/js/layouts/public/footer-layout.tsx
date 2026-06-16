import { useState } from 'react';

interface ContactData {
    email_1?: string;
    phone_1?: string;
    city?: string; county?: string; country?: string;
    facebook?: string; twitter?: string; instagram?: string;
    youtube?: string; tiktok?: string; telegram?: string;
    whatsApp?: string; linkedin?: string;
}

interface ServiceData {
    id: number;
    title: string;
}

const SOCIAL_DEFS = [
    { key: 'instagram', label: 'Instagram', icon: '📸', baseUrl: 'https://instagram.com/' },
    { key: 'facebook',  label: 'Facebook',  icon: '📘', baseUrl: 'https://facebook.com/' },
    { key: 'youtube',   label: 'YouTube',   icon: '▶',  baseUrl: 'https://youtube.com/@' },
    { key: 'tiktok',    label: 'TikTok',    icon: '🎵', baseUrl: 'https://tiktok.com/@' },
    { key: 'twitter',   label: 'Twitter/X', icon: '𝕏',  baseUrl: 'https://x.com/' },
    { key: 'linkedin',  label: 'LinkedIn',  icon: '💼', baseUrl: 'https://linkedin.com/in/' },
    { key: 'telegram',  label: 'Telegram',  icon: '✈',  baseUrl: 'https://t.me/' },
    { key: 'whatsApp',  label: 'WhatsApp',  icon: '💬', baseUrl: 'https://wa.me/' },
];

function buildSocialUrl(baseUrl: string, handle: string): string {
    const cleaned = handle.replace(/^@/, '').trim();
    if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
        return cleaned;
    }
    return `${baseUrl}${cleaned}`;
}

const NAV_LINKS = [
    { label: 'About', href: '#founder' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Events', href: '#events' },
    { label: 'Shop', href: '#products' },
    { label: 'News', href: '#news' },
    { label: 'FAQs', href: '#faqs' },
    { label: 'Contact', href: '#contact' },
];

export default function FooterLayout({
    contact,
    services = [],
}: {
    contact?: ContactData;
    services?: ServiceData[];
}) {
    const [email, setEmail] = useState('');
    const [done, setDone] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const submitNewsletter = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const { default: axios } = await import('axios');
            const res = await axios.post('/newsletter/subscribe', { email });
            setDone(true);
            setMessage(res.data.message || 'Subscribed successfully!');
            setEmail('');
            setTimeout(() => {
                setDone(false);
                setMessage('');
            }, 6000);
        } catch (err: any) {
            if (err.response?.data?.message) {
                setMessage(err.response.data.message);
            } else {
                setMessage('An error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const activeSocials = SOCIAL_DEFS.filter(s => contact?.[s.key as keyof ContactData]);
    const location = [contact?.city, contact?.county, contact?.country].filter(Boolean).join(', ') || null;

    return (
        <footer className="bg-[#0d0805]">
            {/* Newsletter strip */}
            <div className="border-b border-[#e8cbb5]/8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <p className="font-serif text-[10px] tracking-[0.3em] text-[#e8cbb5]/60 uppercase mb-2">Stay in the Loop</p>
                        <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#f7f7f7]">
                            Subscribe to Our <em className="italic text-[#e8cbb5]">Newsletter</em>
                        </h3>
                        <p className="font-serif text-sm text-[#f7f7f7]/40 mt-2 max-w-md">
                            New artwork, behind-the-scenes stories, upcoming exhibitions, and exclusive offers.
                        </p>
                    </div>
                    <form onSubmit={submitNewsletter} className="flex flex-col w-full md:w-auto max-w-sm gap-2">
                        <div className="flex w-full">
                            <input
                                disabled={loading}
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="flex-1 px-4 py-3 bg-[#281b10]/60 border border-[#e8cbb5]/15 border-r-0 text-[#f7f7f7] font-serif text-sm outline-none rounded-l-lg placeholder:text-[#f7f7f7]/30 focus:border-[#e8cbb5]/40 transition-colors disabled:opacity-50"
                            />
                            <button
                                disabled={loading || done}
                                type="submit"
                                className="px-5 py-3 bg-[#e8cbb5] text-[#281b10] font-serif text-xs tracking-[0.15em] uppercase font-bold hover:bg-[#f7f7f7] transition-colors rounded-r-lg whitespace-nowrap disabled:opacity-75 disabled:hover:bg-[#e8cbb5]"
                            >
                                {loading ? '...' : done ? '✓ Done' : 'Subscribe'}
                            </button>
                        </div>
                        {message && (
                            <p className={`text-xs font-serif ${done ? 'text-green-400' : 'text-red-400'}`}>
                                {message}
                            </p>
                        )}
                    </form>
                </div>
            </div>

            {/* Main footer body */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-14">

                    {/* Brand column */}
                    <div className="col-span-2 sm:col-span-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#e8cbb5] to-[#c9a07a] flex items-center justify-center text-[#281b10] font-black text-xs font-serif">AL</div>
                            <span className="font-serif text-[#f7f7f7] text-lg font-semibold tracking-wide">Art of Lynn</span>
                        </div>
                        <p className="font-serif text-xs text-[#f7f7f7]/40 leading-relaxed mb-3 max-w-[200px]">
                            Visual artistry — illustrations, commissions, and coloring books. Color. Feel. Express.
                        </p>
                        {contact?.email_1 && (
                            <a href={`mailto:${contact.email_1}`} className="block font-serif text-xs text-[#e8cbb5]/60 hover:text-[#e8cbb5] transition-colors mb-1">{contact.email_1}</a>
                        )}
                        {contact?.phone_1 && (
                            <a href={`tel:${contact.phone_1}`} className="block font-serif text-xs text-[#e8cbb5]/60 hover:text-[#e8cbb5] transition-colors mb-1">{contact.phone_1}</a>
                        )}
                        {location && (
                            <p className="font-serif text-xs text-[#f7f7f7]/30 mt-1">{location}</p>
                        )}
                        {activeSocials.length > 0 && (
                            <div className="flex gap-2 flex-wrap mt-5">
                                {activeSocials.map(s => (
                                    <a
                                        key={s.key}
                                        href={buildSocialUrl(s.baseUrl, contact![s.key as keyof ContactData] as string)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={s.label}
                                        className="w-8 h-8 rounded-full bg-[#e8cbb5]/8 border border-[#e8cbb5]/12 flex items-center justify-center text-xs hover:bg-[#e8cbb5]/20 transition-colors"
                                    >
                                        {s.icon}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Services column — dynamic from DB, hidden if empty */}
                    {services.length > 0 && (
                        <div>
                            <h4 className="font-serif text-[10px] tracking-[0.25em] text-[#e8cbb5] uppercase mb-5">Services</h4>
                            <ul className="space-y-3">
                                {services.map(s => (
                                    <li key={s.id}>
                                        <a href="#services" className="font-serif text-xs text-[#f7f7f7]/60 hover:text-[#f7f7f7] transition-colors duration-200">
                                            {s.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Navigate column */}
                    <div>
                        <h4 className="font-serif text-[10px] tracking-[0.25em] text-[#e8cbb5] uppercase mb-5">Navigate</h4>
                        <ul className="space-y-3">
                            {NAV_LINKS.map((lk, i) => (
                                <li key={i}>
                                    <a href={lk.href} className="font-serif text-xs text-[#f7f7f7]/60 hover:text-[#f7f7f7] transition-colors duration-200">
                                        {lk.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Connect column — only shown if socials exist */}
                    {activeSocials.length > 0 && (
                        <div>
                            <h4 className="font-serif text-[10px] tracking-[0.25em] text-[#e8cbb5] uppercase mb-5">Connect</h4>
                            <ul className="space-y-3">
                                {activeSocials.map(s => (
                                    <li key={s.key}>
                                        <a
                                            href={buildSocialUrl(s.baseUrl, contact![s.key as keyof ContactData] as string)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-serif text-xs text-[#f7f7f7]/60 hover:text-[#f7f7f7] transition-colors duration-200 flex items-center gap-2"
                                        >
                                            <span>{s.icon}</span>
                                            <span>{s.label}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-[#e8cbb5]/15 to-transparent mb-8" />

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="font-serif text-xs text-[#f7f7f7]/30">
                        © {new Date().getFullYear()} Art of Lynn. Color. Feel. Express.
                    </p>
                    <p className="font-serif text-[10px] text-[#f7f7f7]/20 tracking-wide">
                        Developed by <a href="https://codewithsky.co.ke" target="_blank" rel="noopener noreferrer" className="hover:text-[#e8cbb5] transition-colors">Codewithsky</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}