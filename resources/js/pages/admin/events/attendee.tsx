import { Head, Link, useForm, router } from "@inertiajs/react";
import EventsLayout from "@/layouts/events/layout";
import { useState, useEffect } from "react";
import { AppEvent, Attendee } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "sonner";
import axios from "axios";

interface Props {
    event: AppEvent;
    attendees: {
        data: Attendee[];
        links: any;
    }
}

export default function EventsAttendee({ event, attendees }: Props) {
    const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(attendees.data[0] || null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    const filteredAttendees = attendees.data.filter(a => 
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.ticket_id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const { data, setData, post, processing, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        amount_paid: event.ticket_price,
        status: 'confirmed' as const,
        notes: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/events/${event.id}/attendees`, {
            onSuccess: () => {
                setIsAddModalOpen(false);
                reset();
                toast.success('Attendee added successfully');
            }
        });
    };

    const handleCheckIn = (ticketId: string) => {
        router.patch(`/admin/check-in/${ticketId}`, {}, {
            onSuccess: () => {
                toast.success('Check-in successful!');
            },
            onError: (errors) => {
                toast.error(errors.message || 'Check-in failed');
            },
            preserveScroll: true,
            preserveState: true,
        });
    };

    // Improved Scanner Logic
    useEffect(() => {
        let html5QrCode: Html5Qrcode | null = null;

        if (isScannerOpen) {
            // Wait for Dialog to mount the "reader" element
            const timer = setTimeout(() => {
                const element = document.getElementById("reader");
                if (!element) return;

                html5QrCode = new Html5Qrcode("reader");
                const config = { fps: 10, qrbox: { width: 250, height: 250 } };

                html5QrCode.start(
                    { facingMode: "environment" }, 
                    config, 
                    async (decodedText) => {
                        await html5QrCode?.stop();
                        setIsScannerOpen(false);
                        await handleCheckIn(decodedText);
                    },
                    undefined
                ).catch((err) => {
                    console.error("Scanner failed", err);
                    toast.error("Camera error: " + err);
                    setIsScannerOpen(false);
                });
            }, 500);

            return () => {
                clearTimeout(timer);
                if (html5QrCode?.isScanning) {
                    html5QrCode.stop().catch(console.error);
                }
            };
        }
    }, [isScannerOpen]);

    return (
        <>
            <Head title={`Attendees - ${event.title}`} />
            <EventsLayout
                list={
                    <>
                        {/* ── Header ───────────────────────────────────── */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between border-b border-sidebar-border px-4 py-3">
                            <h1 className="text-sm font-semibold text-foreground">Attendees ({event.tickets_sold})</h1>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsScannerOpen(true)}
                                    className="gap-2 h-8 text-[11px] font-bold uppercase tracking-wider"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16h.01"/><path d="M16 12h1"/><path d="M21 12h.01"/><path d="M12 21v-1"/></svg>
                                    Scan
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="gap-1 h-8 text-[11px] font-bold uppercase tracking-wider"
                                >
                                    Add Attendee
                                </Button>
                            </div>
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
                                    placeholder="Search attendees..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-md border border-input bg-transparent py-1.5 pl-8 pr-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                                />
                            </div>
                        </div>

                        {/* ── List ─────────────────────────────────────── */}
                        <div className="flex-1 overflow-y-auto">
                            {filteredAttendees.length > 0 ? (
                                <div className="divide-y divide-sidebar-border">
                                    {filteredAttendees.map((attendee) => (
                                        <button
                                            key={attendee.id}
                                            onClick={() => setSelectedAttendee(attendee)}
                                            className={cn(
                                                "w-full text-left p-4 hover:bg-accent/50 transition-colors flex flex-col gap-1",
                                                selectedAttendee?.id === attendee.id && "bg-accent"
                                            )}
                                        >
                                            <div className="flex justify-between items-start">
                                                <span className="text-sm font-medium truncate">{attendee.name}</span>
                                                <Badge className={cn(
                                                    "text-[10px] px-1.5 py-0",
                                                    attendee.checked_in ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-muted text-muted-foreground"
                                                )}>
                                                    {attendee.checked_in ? 'Checked In' : 'Pending'}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                                <span className="font-mono">{attendee.ticket_id}</span>
                                                <span>•</span>
                                                <span className="truncate">{attendee.email}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-muted-foreground font-medium text-xs">
                                    No attendees found
                                </div>
                            )}
                        </div>
                    </>
                }
                detail={
                    selectedAttendee ? (
                        <div className="flex flex-1 flex-col p-8 space-y-10 animate-in fade-in duration-500">
                            <div className="flex justify-between items-start border-b border-sidebar-border pb-8">
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-3xl font-bold tracking-tight">{selectedAttendee.name}</h2>
                                        <Badge variant="outline" className="h-5 text-[10px]">{selectedAttendee.status}</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8Z"/><path d="M16 11v6"/><path d="M12 11v6"/><path d="M8 11v6"/><path d="M2 13h20"/></svg>
                                        Ticket ID: <span className="font-mono font-bold text-foreground">{selectedAttendee.ticket_id}</span>
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {!selectedAttendee.checked_in && (
                                        <Button
                                            onClick={() => handleCheckIn(selectedAttendee.ticket_id)}
                                            className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20"
                                        >
                                            Check-in
                                        </Button>
                                    )}
                                    <Button variant="outline" onClick={() => window.print()} className="gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
                                        Print
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                <div className="lg:col-span-7 space-y-8">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-1.5 p-4 rounded-xl border border-sidebar-border bg-accent/10">
                                            <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Email</Label>
                                            <p className="text-sm font-semibold truncate">{selectedAttendee.email}</p>
                                        </div>
                                        <div className="space-y-1.5 p-4 rounded-xl border border-sidebar-border bg-accent/10">
                                            <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Phone</Label>
                                            <p className="text-sm font-semibold">{selectedAttendee.phone || '—'}</p>
                                        </div>
                                        <div className="space-y-1.5 p-4 rounded-xl border border-sidebar-border bg-accent/10">
                                            <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Amount Paid</Label>
                                            <p className="text-sm font-bold text-green-600">{formatCurrency(selectedAttendee.amount_paid)}</p>
                                        </div>
                                        <div className="space-y-1.5 p-4 rounded-xl border border-sidebar-border bg-accent/10">
                                            <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Registration Date</Label>
                                            <p className="text-sm font-semibold">{formatDate(selectedAttendee.created_at)}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Attendance</Label>
                                        {selectedAttendee.checked_in ? (
                                            <div className="flex items-center gap-4 p-5 rounded-2xl bg-green-500/5 border border-green-500/10 text-green-700">
                                                <div className="size-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold">Checked In</p>
                                                    <p className="text-xs opacity-80">{new Date(selectedAttendee.checked_in_at!).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-4 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-amber-700">
                                                <div className="size-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold">Pending Arrival</p>
                                                    <p className="text-xs opacity-80">Attendee has not scanned their ticket yet.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Admin Notes</Label>
                                        <div className="p-4 rounded-xl border border-dashed text-sm italic text-muted-foreground min-h-[100px] bg-accent/5">
                                            {selectedAttendee.notes || 'No administrative notes for this attendee.'}
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-5">
                                    <div className="sticky top-8 flex flex-col items-center justify-center p-10 border-2 border-sidebar-border rounded-3xl bg-white dark:bg-neutral-900 shadow-2xl shadow-neutral-500/5">
                                        <div className="w-full text-center mb-8">
                                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Member Pass</h3>
                                            <p className="text-lg font-bold mt-1">Art of Lynn</p>
                                        </div>
                                        
                                        {selectedAttendee.qr_code_url ? (
                                            <div className="relative group">
                                                <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-primary/5 rounded-2xl blur-xl opacity-50 transition-opacity group-hover:opacity-100" />
                                                <div className="relative p-3 bg-white rounded-xl border-4 border-white shadow-xl">
                                                    <img 
                                                        src={selectedAttendee.qr_code_url} 
                                                        alt="QR Code" 
                                                        className="size-48"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="size-48 bg-muted rounded-2xl flex items-center justify-center border-4 border-white shadow-inner">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-10"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16h.01"/><path d="M16 12h1"/><path d="M21 12h.01"/><path d="M12 21v-1"/></svg>
                                            </div>
                                        )}
                                        
                                        <div className="mt-10 text-center space-y-1">
                                            <p className="text-xs font-mono font-bold tracking-widest text-muted-foreground uppercase">{selectedAttendee.ticket_id}</p>
                                            <p className="text-[10px] text-muted-foreground italic">Encoded Secure Token</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-muted-foreground animate-in fade-in duration-700">
                             <div className="p-4 rounded-full bg-accent/30">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-30">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                </svg>
                             </div>
                            <p className="text-sm font-medium">Select an attendee to view pass details</p>
                        </div>
                    )
                }
            />

            {/* ── Add Attendee Modal ───────────────────────────────────── */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <h2 className="text-lg font-bold tracking-tight">Manual Ticket Provision</h2>
                        <p className="text-xs text-muted-foreground">Register an attendee and dispatch their digital pass.</p>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-5 py-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" placeholder="John Doe" value={data.name} onChange={e => setData('name', e.target.value)} required />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="john@example.com" value={data.email} onChange={e => setData('email', e.target.value)} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="phone">Phone (Opt)</Label>
                                <Input id="phone" placeholder="+1..." value={data.phone} onChange={e => setData('phone', e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="amount">Registration Fee</Label>
                                <Input id="amount" type="number" step="0.01" value={data.amount_paid} onChange={e => setData('amount_paid', e.target.value)} required />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="notes">Internal Notes</Label>
                            <Input id="notes" placeholder="VIP, Guest List, etc." value={data.notes} onChange={e => setData('notes', e.target.value)} />
                        </div>
                        <DialogFooter className="pt-6">
                            <Button type="submit" className="w-full h-11 text-xs font-bold uppercase tracking-widest" disabled={processing}>
                                {processing ? 'Generating Pass...' : 'Confirm & Dispatch Pass'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ── Scanner Modal ────────────────────────────────────────── */}
            <Dialog open={isScannerOpen} onOpenChange={setIsScannerOpen}>
                <DialogContent className="sm:max-w-[500px] border-black bg-black p-0 overflow-hidden">
                    <div className="relative aspect-square w-full">
                        <div id="reader" className="w-full h-full"></div>
                        <div className="absolute inset-0 border-[60px] border-black/40 pointer-events-none flex items-center justify-center">
                            <div className="size-full border-2 border-primary/50 rounded-2xl relative">
                                <div className="absolute -top-1 -left-1 size-6 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                                <div className="absolute -top-1 -right-1 size-6 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                                <div className="absolute -bottom-1 -left-1 size-6 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                                <div className="absolute -bottom-1 -right-1 size-6 border-b-4 border-r-4 border-primary rounded-br-lg" />
                            </div>
                        </div>
                        <div className="absolute bottom-10 inset-x-0 text-center">
                            <p className="text-white text-xs font-bold uppercase tracking-widest drop-shadow-md">Align Digital Pass QR</p>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-4 right-4 text-white hover:bg-white/20"
                            onClick={() => setIsScannerOpen(false)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

EventsAttendee.layout = {
    breadcrumbs: [
        { title: 'Events', href: '/admin/events' },
        { title: 'Attendees', href: '#' }
    ],
};