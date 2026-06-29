import { Head, Link, useForm } from "@inertiajs/react";
import EventsLayout from "@/layouts/events/layout";
import { useState } from "react";
import { AppEvent } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate, formatCurrency } from "@/lib/utils";

interface Props {
    events: {
        data: AppEvent[];
    }
}

export default function EventsIndex({ events }: Props) {
    const { delete: destroy, processing } = useForm();
    const [selectedEvent, setSelectedEvent] = useState<AppEvent | null>(events.data[0] || null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredEvents = events.data.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this event?')) {
            destroy(`/admin/events/${id}`, {
                onSuccess: () => setSelectedEvent(null)
            });
        }
    };

    return (
        <>
            <Head title="Events" />
            <EventsLayout
                list={
                    <>
                        {/* ── Header ───────────────────────────────────── */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between border-b border-sidebar-border px-4 py-3">
                            <h1 className="text-sm font-semibold text-foreground">Events</h1>
                            <Link
                                href="/admin/events/create"
                                className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                Create Event
                            </Link>
                        </div>
 
                        {/* ── Search ───────────────────────────────────── */}
                        <div className="border-b border-sidebar-border px-4 py-2">
                            <div className="relative">
                                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search events..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-md border border-input bg-transparent py-1.5 pl-8 pr-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                                />
                            </div>
                        </div>
  
                        {/* ── List ─────────────────────────────────────── */}
                        <div className="flex-1 overflow-y-auto">
                            {filteredEvents.length > 0 ? (
                                <div className="divide-y divide-sidebar-border">
                                    {filteredEvents.map((event) => (
                                        <button
                                            key={event.id}
                                            onClick={() => setSelectedEvent(event)}
                                            className={cn(
                                                "w-full text-left p-4 hover:bg-accent/50 transition-colors flex flex-col gap-1",
                                                selectedEvent?.id === event.id && "bg-accent"
                                            )}
                                        >
                                            <div className="flex justify-between items-start">
                                                <span className="text-sm font-medium truncate">{event.title}</span>
                                                <Badge className="text-[10px] px-1.5 py-0">{event.status}</Badge>
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                                <span>{formatDate(event.event_date)}</span>
                                                <span>•</span>
                                                <span>{event.location_name}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-muted-foreground">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-30">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                    <p className="text-xs">No events found</p>
                                </div>
                            )}
                        </div>
                    </>
                }
                detail={
                    selectedEvent ? (
                        <div className="flex flex-1 flex-col p-8 space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-bold">{selectedEvent.title}</h2>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                                        {selectedEvent.location_name}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/admin/events/${selectedEvent.id}/attendees`}
                                        className="rounded-md border border-input px-3 py-1.5 text-xs font-medium hover:bg-accent"
                                    >
                                        Attendee
                                    </Link>
                                    <Link
                                        href={`/admin/events/${selectedEvent.id}/edit`}
                                        className="rounded-md border border-input px-3 py-1.5 text-xs font-medium hover:bg-accent"
                                    >
                                        Edit Event
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(selectedEvent.id)}
                                        disabled={processing}
                                        className="rounded-md bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="rounded-lg border p-3 flex flex-col gap-1">
                                    <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-widest">Date</span>
                                    <span className="text-sm font-bold truncate">{formatDate(selectedEvent.event_date)}</span>
                                </div>
                                <div className="rounded-lg border p-3 flex flex-col gap-1">
                                    <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-widest">Tickets</span>
                                    <span className="text-sm font-bold">{selectedEvent.tickets_sold} / {selectedEvent.max_capacity || '∞'}</span>
                                </div>
                                <div className="rounded-lg border p-3 flex flex-col gap-1">
                                    <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-widest">Price</span>
                                    <span className="text-sm font-bold">{formatCurrency(selectedEvent.ticket_price)}</span>
                                </div>
                                <div className="rounded-lg border p-3 flex flex-col gap-1">
                                    <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-widest">Status</span>
                                    <Badge className="w-fit">{selectedEvent.status}</Badge>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">About the Event</h3>
                                <div
                                    className="text-sm leading-relaxed border rounded-lg p-4 bg-accent/20 h-32 overflow-y-auto"
                                    dangerouslySetInnerHTML={{ __html: selectedEvent.description || '' }}
                                />
                            </div>

                            {selectedEvent.images && selectedEvent.images.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Gallery</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {selectedEvent.images.map((img, i) => (
                                            <div key={i} className="aspect-square rounded-lg border overflow-hidden bg-muted">
                                                <img src={img} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedEvent.google_maps_url && (
                                <a
                                    href={selectedEvent.google_maps_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-xs text-primary hover:underline"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                    View on Google Maps
                                </a>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-20">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <p className="text-xs">Select an event to view details</p>
                        </div>
                    )
                }
            />
        </>
    );
}

EventsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Events',
            href: '/admin/events',
        },
    ],
};