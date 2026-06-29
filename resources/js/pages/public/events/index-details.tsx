import { Head, Link } from '@inertiajs/react';
import EventDetailsLayout from '@/layouts/public/event-details-layout';
import { format } from 'date-fns';
import { stripHtml } from '@/lib/stripHtml';
import { useState } from 'react';
import { X } from 'lucide-react';

const WHATSAPP_NUMBER = '+254797893254';

function RegistrationModal({
    eventName,
    onClose,
}: {
    eventName: string;
    onClose: () => void;
}) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = () => {
        if (!fullName.trim() || !email.trim()) return;

        const message = `Hello Art of Lynn, I would like to register for the event *${eventName}*.\n\nFull Name: ${fullName}\nEmail: ${email}\n\nHow do I register?`;
        const encoded = encodeURIComponent(message);
        const url = `https://wa.me/${WHATSAPP_NUMBER.replace(/\s/g, '')}?text=${encoded}`;

        window.open(url, '_blank', 'noopener,noreferrer');
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#281b10]/60 backdrop-blur-sm px-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-[#f7f7f7] rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[#281b10]/40 hover:text-[#281b10] transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="font-serif text-2xl text-[#281b10] mb-1">Register for Event</h2>
                <p className="text-sm text-[#281b10]/60 font-serif mb-6">{eventName}</p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[#281b10]/50 mb-1.5">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Jane Doe"
                            className="w-full border border-[#281b10]/20 rounded-sm px-4 py-2.5 font-serif text-[#281b10] bg-white focus:outline-none focus:border-[#c9a07a] transition-colors placeholder:text-[#281b10]/30"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[#281b10]/50 mb-1.5">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="jane@example.com"
                            className="w-full border border-[#281b10]/20 rounded-sm px-4 py-2.5 font-serif text-[#281b10] bg-white focus:outline-none focus:border-[#c9a07a] transition-colors placeholder:text-[#281b10]/30"
                        />
                    </div>
                </div>

                <p className="text-xs text-[#281b10]/40 font-serif mt-4">
                    You'll be redirected to WhatsApp to complete your registration.
                </p>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 border border-[#281b10]/20 text-[#281b10]/60 font-serif text-sm uppercase tracking-widest rounded-sm hover:border-[#281b10]/40 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!fullName.trim() || !email.trim()}
                        className="flex-1 px-4 py-2.5 bg-[#25D366] text-white font-serif text-sm uppercase tracking-widest rounded-sm hover:bg-[#1ebe5d] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {/* WhatsApp icon inline SVG */}
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.524 5.849L.057 23.804a.5.5 0 0 0 .609.637l6.148-1.61A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 0 1-5.031-1.388l-.36-.214-3.733.979.995-3.63-.235-.373A9.808 9.808 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
                        </svg>
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function EventShow({ event }: { event: any }) {
    const mainImage = event.images?.[0] || null;
    const [showModal, setShowModal] = useState(false);

    return (
        <EventDetailsLayout>
            <Head title={`${event.title} — Art of Lynn`} />

            {showModal && (
                <RegistrationModal
                    eventName={event.title}
                    onClose={() => setShowModal(false)}
                />
            )}

            <article className="bg-[#f7f7f7] py-12 sm:py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <Link
                        href="/events"
                        className="inline-flex items-center gap-2 text-[#281b10]/60 hover:text-[#c9a07a] font-serif text-sm mb-8 transition-colors"
                    >
                        ← Back to events
                    </Link>

                    {mainImage && (
                        <div className="rounded-2xl overflow-hidden mb-8 shadow-lg">
                            <img src={mainImage} alt={event.title} className="w-full h-64 sm:h-96 object-cover" />
                        </div>
                    )}

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#281b10] leading-tight">
                        {event.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-[#281b10]/60 mt-3 mb-6">
                        <span>{format(new Date(event.event_date), 'PPP')}</span>
                        {event.location_name && (
                            <>
                                <span className="w-1 h-1 rounded-full bg-[#281b10]/30" />
                                <span>{event.location_name}</span>
                            </>
                        )}
                        <span className="ml-auto text-xs uppercase tracking-wider bg-[#e8cbb5]/20 text-[#281b10] px-3 py-1 rounded-full">
                            {event.status}
                        </span>
                    </div>

                    <div className="prose prose-lg max-w-none font-serif text-[#281b10]/80 leading-relaxed">
                        {stripHtml(event.description)}
                    </div>

                    {event.ticket_price && (
                        <div className="mt-8 p-6 bg-[#281b10] text-[#f7f7f7] rounded-2xl flex flex-wrap justify-between items-center gap-4">
                            <div>
                                <span className="text-xs uppercase tracking-wider text-[#e8cbb5]/60">Ticket Price</span>
                                <p className="text-2xl font-serif">KES {Number(event.ticket_price).toLocaleString()}</p>
                            </div>
                            {event.registration_open && (
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="px-6 py-3 bg-[#e8cbb5] text-[#281b10] font-serif text-sm uppercase tracking-widest rounded-sm hover:bg-[#f7f7f7] transition-colors"
                                >
                                    Register Now
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </article>
        </EventDetailsLayout>
    );
}