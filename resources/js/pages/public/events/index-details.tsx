import { Head, Link } from '@inertiajs/react';
import EventDetailsLayout from '@/layouts/public/event-details-layout';
import { format } from 'date-fns';
import { stripHtml } from '@/lib/stripHtml';

export default function EventShow({ event }: { event: any }) {
    const mainImage = event.images?.[0] || null;

    return (
        <EventDetailsLayout>
            <Head title={`${event.title} — Art of Lynn`} />
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
                            {event.registration_open && event.google_maps_url && (
                                <a
                                    href={event.google_maps_url}
                                    target="_blank"
                                    rel="noopener"
                                    className="px-6 py-3 bg-[#e8cbb5] text-[#281b10] font-serif text-sm uppercase tracking-widest rounded-sm hover:bg-[#f7f7f7] transition-colors"
                                >
                                    Register Now
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </article>
        </EventDetailsLayout>
    );
}