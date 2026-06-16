import { Head, useForm } from "@inertiajs/react";
import { AppInputPage } from "@/components/app-input-page";
import { InputFormLayout } from "@/components/input-form-layout";
import { InputPreviewLayout } from "@/components/input-preview-layout";
import { ChangeEvent, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import TextEditor from "@/components/ui/text-editor";
import events from "@/routes/events";

export default function EventsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        slug: '',
        description: '',
        event_date: '',
        location_name: '',
        google_maps_url: '',
        ticket_price: '',
        max_capacity: '',
        images: [] as File[],
        status: 'draft',
        registration_open: true,
    });

    const [previews, setPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setData('images', [...data.images, ...files]);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews([...previews, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        const newImages = [...data.images];
        newImages.splice(index, 1);
        setData('images', newImages);

        const newPreviews = [...previews];
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(events.store().url);
    };

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    };

    return (
        <>
            <Head title="Create Event" />

            <AppInputPage>
                {/* ── LEFT: Form ───────────────────────────────────── */}
                <form onSubmit={handleSubmit} className="flex-1 flex min-w-0">
                    <InputFormLayout
                        title="Event Content"
                        description="Main details about the event."
                        backHref="/admin/events"
                        backLabel="Back to Events"
                        actions={
                            <>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    onClick={() => setData('status', 'draft')}
                                    className="inline-flex items-center gap-1.5 rounded-md border border-sidebar-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors disabled:opacity-50"
                                >
                                    Draft
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    onClick={() => setData('status', 'upcoming')}
                                    className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                                >
                                    Publish Event
                                </button>
                            </>
                        }
                    >
                        <div className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    Event Title
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={e => {
                                        setData(d => ({
                                            ...d,
                                            title: e.target.value,
                                            slug: generateSlug(e.target.value)
                                        }));
                                    }}
                                    placeholder="E.g. Summer Art Showcase"
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                                />
                                {errors.title && <p className="text-[10px] text-destructive">{errors.title}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                        Date & Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={data.event_date}
                                        onChange={e => setData('event_date', e.target.value)}
                                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                                    />
                                    {errors.event_date && <p className="text-[10px] text-destructive">{errors.event_date}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                        Ticket Price
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                        <input
                                            type="number"
                                            value={data.ticket_price}
                                            onChange={e => setData('ticket_price', e.target.value)}
                                            className="w-full rounded-md border border-input bg-transparent pl-7 pr-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                                        />
                                    </div>
                                    {errors.ticket_price && <p className="text-[10px] text-destructive">{errors.ticket_price}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                        Location Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.location_name}
                                        onChange={e => setData('location_name', e.target.value)}
                                        placeholder="E.g. Main Gallery"
                                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                                    />
                                    {errors.location_name && <p className="text-[10px] text-destructive">{errors.location_name}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                        Max Capacity
                                    </label>
                                    <input
                                        type="number"
                                        value={data.max_capacity}
                                        onChange={e => setData('max_capacity', e.target.value)}
                                        placeholder="Leave empty for unlimited"
                                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    Google Maps URL
                                </label>
                                <input
                                    type="url"
                                    value={data.google_maps_url}
                                    onChange={e => setData('google_maps_url', e.target.value)}
                                    placeholder="https://maps.google.com/..."
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    Description
                                </label>
                                <TextEditor 
                                    value={data.description}
                                    onChange={(content) => setData('description', content)}
                                    placeholder="Tell people about your event..."
                                />
                                {errors.description && <p className="text-[10px] text-destructive">{errors.description}</p>}
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    Event Gallery
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {previews.map((preview, index) => (
                                        <div key={index} className="relative aspect-square rounded-lg border overflow-hidden bg-muted group">
                                            <img src={preview} alt="" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-accent transition-all group"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground group-hover:text-primary transition-colors"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
                                        <span className="text-[10px] font-semibold text-muted-foreground group-hover:text-primary uppercase tracking-tighter">Add Photo</span>
                                    </button>
                                </div>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </InputFormLayout>
                </form>

                {/* ── RIGHT: Preview ───────────────────────────────── */}
                <InputPreviewLayout
                    label="LIVE PREVIEW"
                >
                    <div className="p-10 flex flex-col gap-6 max-w-2xl mx-auto">
                        <div className="space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">{data.title || 'Event Title'}</h1>
                                    <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em]">
                                        {data.event_date ? formatDate(data.event_date) : 'Select a date'}
                                    </p>
                                </div>
                                <Badge className="rounded-none px-4 py-1 uppercase tracking-widest">{data.status}</Badge>
                            </div>

                            <div className="aspect-video w-full rounded-2xl border-4 border-black overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-muted">
                                {previews[0] ? (
                                    <img src={previews[0]} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <p className="text-xs font-black text-black/20 tracking-widest uppercase">Hero Image Preview</p>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                <div className="space-y-1">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Coordinates</h3>
                                    <p className="text-sm font-bold uppercase">{data.location_name || 'TBA'}</p>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Admission</h3>
                                    <p className="text-sm font-bold uppercase">{data.ticket_price ? formatCurrency(data.ticket_price) : 'FREE'}</p>
                                </div>
                            </div>

                            <div className="space-y-2 pt-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest border-b-2 border-black w-fit pb-1">Transmission</h3>
                                <div 
                                    className="text-sm leading-relaxed text-muted-foreground italic prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: data.description || 'Fill in the description field to see the transmission here...' }}
                                />
                            </div>

                            {previews.length > 1 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4">
                                    {previews.slice(1).map((p, i) => (
                                        <div key={i} className="aspect-square rounded-lg border-2 border-black overflow-hidden">
                                            <img src={p} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </InputPreviewLayout>
            </AppInputPage>
        </>
    );
}

EventsCreate.layout = {
    breadcrumbs: [
        { title: 'Events', href: '/admin/events' },
        { title: 'Create', href: '/admin/events/create' },
    ],
};
