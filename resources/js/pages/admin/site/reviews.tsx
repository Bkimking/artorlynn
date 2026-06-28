import { Head, usePage, router } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import TextEditor from "@/components/ui/text-editor";
import { SiteLayout } from "@/layouts/site/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Eye, Plus, Trash2, X, Star, Quote, User, Camera, MessageSquareQuote, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import site from "@/routes/admin/site";

interface Review {
    id: number;
    name: string;
    email: string | null;
    position: string;
    avatar: string | null;
    rating: number;
    content: string;
    is_featured: boolean;
    date: string;
}

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
    return <div className="flex items-center gap-0.5">{[...Array(5)].map((_, i) => (
        <button key={i} type="button" onClick={() => onChange?.(i + 1)} className={cn(onChange ? "cursor-pointer hover:scale-110" : "cursor-default pointer-events-none")}>
            <Star className={cn("size-4", i < value ? "fill-amber-400 text-amber-400" : "fill-transparent text-muted-foreground/30")} />
        </button>
    ))}</div>;
}

function getInitials(name: string) { return name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join(""); }
const AVATAR_COLORS = ["from-violet-500 to-purple-600", "from-rose-500 to-pink-600", "from-amber-500 to-orange-500", "from-teal-500 to-emerald-600", "from-sky-500 to-blue-600"];
function avatarColor(name: string) { return AVATAR_COLORS[(name.charCodeAt(0) ?? 0) % AVATAR_COLORS.length]; }
function formatDate(iso: string) { return new Date(iso).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" }); }

function ReviewModal({ review, onClose, onSave, saving }: { review: Partial<Review> | null; onClose: () => void; onSave: (formData: FormData) => void; saving: boolean }) {
    const [draft, setDraft] = useState<Partial<Review>>(review || { name: "", email: "", position: "", content: "", rating: 5, is_featured: false, date: new Date().toISOString().split("T")[0], avatar: null });
    const [avatarPreview, setAvatarPreview] = useState<string | null>(review?.avatar || null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (review) {
            setDraft(review);
            setAvatarPreview(review.avatar || null);
            setAvatarFile(null);
        }
    }, [review]);

    const set = (key: keyof Review) => (val: any) => setDraft(prev => ({ ...prev, [key]: val }));
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) { setAvatarPreview(URL.createObjectURL(file)); setAvatarFile(file); }
        e.target.value = "";
    };
    const handleSubmit = () => {
        const formData = new FormData();
        formData.append("name", draft.name || "");
        formData.append("email", draft.email || "");
        formData.append("position", draft.position || "");
        formData.append("content", draft.content || "");
        formData.append("rating", (draft.rating || 5).toString());
        formData.append("is_featured", (draft.is_featured ? "1" : "0"));
        formData.append("date", draft.date || "");
        if (avatarFile) formData.append("avatar", avatarFile);
        if (draft.id) formData.append("_method", "PUT");
        onSave(formData);
    };

    const initials = getInitials(draft.name || "");
    const color = avatarColor(draft.name || "");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} /><div className="relative z-10 w-full max-w-lg flex flex-col rounded-2xl border border-sidebar-border bg-background shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-sidebar-border"><div><h3 className="text-sm font-semibold">{draft.id ? "Edit Review" : "Add Review"}</h3><p className="text-xs text-muted-foreground mt-0.5">Reviewer details and testimonial</p></div><button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:bg-sidebar transition-colors"><X className="size-4" /></button></div>
            <div className="flex-1 overflow-y-auto p-5 space-y-5 max-h-[70vh]">
                <div className="flex items-start gap-4"><div className="relative group shrink-0">{avatarPreview ? <img src={avatarPreview} alt={draft.name} className="size-16 rounded-2xl object-cover border-2 border-sidebar-border" /> : <div className={cn("size-16 rounded-2xl flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br", color)}>{initials || <User className="size-6" />}</div>}<button onClick={() => fileRef.current?.click()} className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Camera className="size-4 text-white" /></button></div><div className="flex-1 space-y-2"><input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} /><div className="space-y-1.5"><Label className="text-xs">Full Name</Label><Input value={draft.name ?? ""} onChange={e => set("name")(e.target.value)} placeholder="e.g. Amina Osei" className="h-8 text-sm" /></div><div className="space-y-1.5"><Label className="text-xs">Email Address <span className="text-muted-foreground font-normal">(optional)</span></Label><Input value={draft.email ?? ""} onChange={e => set("email")(e.target.value)} placeholder="e.g. amina@example.com" className="h-8 text-sm" /></div><div className="space-y-1.5"><Label className="text-xs">Role / Location <span className="text-muted-foreground font-normal">(optional)</span></Label><Input value={draft.position ?? ""} onChange={e => set("position")(e.target.value)} placeholder="e.g. Art Collector, Accra" className="h-8 text-sm" /></div></div></div>
                <div className="space-y-1.5"><Label className="text-xs">Rating</Label><StarRating value={draft.rating ?? 5} onChange={v => set("rating")(v)} /></div>
                <div className="space-y-1.5"><Label className="text-xs">Date <span className="text-muted-foreground font-normal">(optional)</span></Label><Input type="date" value={draft.date ?? ""} onChange={e => set("date")(e.target.value)} className="h-8 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Testimonial</Label><TextEditor value={draft.content ?? ""} onChange={val => set("content")(val)} /></div>
                <div className="flex items-center justify-between rounded-xl border border-sidebar-border bg-sidebar/30 px-3 py-2.5"><div><p className="text-sm font-medium">Featured</p><p className="text-xs text-muted-foreground">Highlight on the homepage</p></div><button onClick={() => set("is_featured")(!draft.is_featured)} className={cn("relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors", draft.is_featured ? "bg-primary" : "bg-input")}><span className={cn("pointer-events-none inline-block size-4 rounded-full bg-background shadow-lg transition-transform", draft.is_featured ? "translate-x-4" : "translate-x-0")} /></button></div>
            </div>
            <div className="px-5 py-4 border-t border-sidebar-border flex items-center justify-end gap-2"><Button variant="outline" size="sm" className="h-8 text-xs" onClick={onClose}>Cancel</Button><Button size="sm" className="h-8 text-xs" disabled={saving || !draft.name?.trim() || !draft.content?.trim()} onClick={handleSubmit}>{draft.id ? "Save Changes" : "Add Review"}</Button></div>
        </div></div>
    );
}

export default function Reviews() {
    const getData = (input: any) => Array.isArray(input) ? input : input?.data || [];
    const { props } = usePage<{ reviews: Review[]; toast?: any }>();
    const [reviews, setReviews] = useState<Review[]>(getData(props.reviews));
    const [selected, setSelected] = useState<number>(getData(props.reviews)?.[0]?.id ?? 0);
    const [modal, setModal] = useState<Partial<Review> | null>(null);
    const [saving, setSaving] = useState(false);

    const selectedReview = reviews.find(r => r.id === selected);

    useEffect(() => {
        const fresh = getData(props.reviews);
        setReviews(fresh);
        if (selected && !fresh.find(r => r.id === selected)) {
            setSelected(fresh[0]?.id ?? 0);
        }
    }, [props.reviews]);

    const openAdd = () => setModal({ name: "", email: "", position: "", content: "", rating: 5, is_featured: false, date: new Date().toISOString().split("T")[0], avatar: null });
    const openEdit = (r: Review) => setModal({ ...r });

    const saveReview = (formData: FormData) => {
        setSaving(true);
        const url = formData.has("_method") ? site.reviews.update({ id: modal!.id! }).url : site.reviews.store().url;
        router.post(url, formData, {
            preserveScroll: true,
            onSuccess: () => {
                setModal(null);
                router.reload({ only: ["reviews"] });
            },
            onFinish: () => setSaving(false),
        });
    };

    const deleteReview = (id: number) => {
        router.post(site.reviews.destroy({ id }).url, {
            _method: "DELETE",
        }, {
            preserveScroll: true,
            onSuccess: () => router.reload({ only: ["reviews"] }),
        });
    };

    const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "—";

    const list = (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border"><div><h2 className="text-sm font-medium">Reviews</h2><p className="text-xs text-muted-foreground mt-0.5">{reviews.length} review{reviews.length !== 1 ? "s" : ""}{reviews.length > 0 && ` · avg ${avgRating}★`}</p></div><Button size="sm" onClick={openAdd} className="h-7 gap-1.5 text-xs"><Plus className="size-3.5" /> Add</Button></div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {reviews.length === 0 && <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2"><MessageSquareQuote className="size-8 opacity-30" /><p className="text-sm">No reviews yet</p></div>}
                {reviews.map(review => (
                    <div key={review.id} onClick={() => setSelected(review.id)} className={cn("group flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all", selected === review.id ? "border-primary/40 bg-primary/5 shadow-sm" : "border-sidebar-border bg-background hover:bg-sidebar/50")}>
                        {review.avatar ? <img src={review.avatar} alt={review.name} className="size-9 rounded-full object-cover border border-sidebar-border shrink-0" /> : <div className={cn("size-9 rounded-full flex items-center justify-center text-white text-xs font-bold bg-gradient-to-br shrink-0", avatarColor(review.name))}>{getInitials(review.name)}</div>}
                        <div className="flex-1 min-w-0"><div className="flex items-center gap-1.5"><p className="text-sm font-medium truncate flex-1">{review.name}</p>{review.is_featured && <CheckCircle2 className="size-3.5 text-primary shrink-0" />}</div><div className="flex items-center gap-2 mt-0.5"><StarRating value={review.rating} />{review.date && <span className="text-[11px] text-muted-foreground">{formatDate(review.date)}</span>}</div><p className="text-xs text-muted-foreground mt-1 line-clamp-1 leading-relaxed">{review.content.replace(/<[^>]+>/g, "")}</p></div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"><button onClick={e => { e.stopPropagation(); openEdit(review); }} className="px-2 py-1 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-sidebar transition-colors">Edit</button><button onClick={e => { e.stopPropagation(); deleteReview(review.id); }} className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 className="size-3.5" /></button></div>
                    </div>
                ))}
            </div>
        </div>
    );

    const detail = (
        <div className="flex flex-col h-full">
            <div className="px-5 py-3 border-b border-sidebar-border flex items-center gap-2"><Eye className="size-4 text-muted-foreground" /><span className="text-sm font-medium">Review Detail</span>{selectedReview && <button onClick={() => openEdit(selectedReview)} className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors">Edit</button>}</div>
            {selectedReview ? (
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="flex items-center gap-4">{selectedReview.avatar ? <img src={selectedReview.avatar} alt={selectedReview.name} className="size-16 rounded-2xl object-cover border-2 border-sidebar-border" /> : <div className={cn("size-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl bg-gradient-to-br", avatarColor(selectedReview.name))}>{getInitials(selectedReview.name)}</div>}<div className="flex-1"><div className="flex items-center gap-2"><h2 className="text-lg font-bold">{selectedReview.name}</h2>{selectedReview.is_featured && <Badge variant="secondary" className="text-[10px] gap-1 px-1.5"><CheckCircle2 className="size-2.5" /> Featured</Badge>}</div><div className="flex flex-col gap-0.5 mt-0.5">{selectedReview.email && <p className="text-xs text-primary font-medium">{selectedReview.email}</p>}{selectedReview.position && <p className="text-sm text-muted-foreground">{selectedReview.position}</p>}</div><div className="flex items-center gap-3 mt-2"><StarRating value={selectedReview.rating} />{selectedReview.date && <span className="text-xs text-muted-foreground">{formatDate(selectedReview.date)}</span>}</div></div></div>
                    <div className="relative"><Quote className="absolute -top-1 -left-1 size-8 text-primary/10 rotate-180" /><div className="pl-6 text-base leading-relaxed text-foreground prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: selectedReview.content }} /></div>
                    <div className="rounded-xl border border-sidebar-border bg-sidebar/30 px-4 py-3 flex items-center gap-6"><div className="text-center"><p className="text-2xl font-bold tabular-nums">{selectedReview.rating}.0</p><p className="text-[11px] text-muted-foreground">Rating</p></div><div className="h-8 w-px bg-sidebar-border" /><div className="text-center"><p className="text-2xl font-bold">{selectedReview.is_featured ? "Yes" : "No"}</p><p className="text-[11px] text-muted-foreground">Featured</p></div><div className="h-8 w-px bg-sidebar-border" /><div className="text-center flex-1"><p className="text-sm font-semibold">{selectedReview.date ? formatDate(selectedReview.date) : "—"}</p><p className="text-[11px] text-muted-foreground">Date</p></div></div>
                    <div><p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">As seen on site</p><div className="rounded-xl border border-sidebar-border bg-background p-5 space-y-4"><Quote className="size-6 text-primary/30" /><p className="text-sm leading-relaxed italic" dangerouslySetInnerHTML={{ __html: selectedReview.content.replace(/<[^>]+>/g, " ").substring(0, 200) + (selectedReview.content.length > 200 ? "…" : "") }} /><div className="flex items-center gap-3 pt-2 border-t border-sidebar-border">{selectedReview.avatar ? <img src={selectedReview.avatar} alt={selectedReview.name} className="size-8 rounded-full object-cover border border-sidebar-border" /> : <div className={cn("size-8 rounded-full flex items-center justify-center text-white text-xs font-bold bg-gradient-to-br", avatarColor(selectedReview.name))}>{getInitials(selectedReview.name)}</div>}<div><p className="text-sm font-semibold">{selectedReview.name}</p>{selectedReview.position && <p className="text-xs text-muted-foreground">{selectedReview.position}</p>}</div><div className="ml-auto"><StarRating value={selectedReview.rating} /></div></div></div></div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground"><div className="text-center space-y-2"><MessageSquareQuote className="size-8 opacity-30 mx-auto" /><p className="text-sm">Select a review to see details</p></div></div>
            )}
        </div>
    );

    return (
        <>
            <Head title="Reviews" />
            <SiteLayout list={list} detail={detail} />
            {modal && <ReviewModal review={modal} onClose={() => setModal(null)} onSave={saveReview} saving={saving} />}
        </>
    );
}

Reviews.layout = {
    breadcrumbs: [
        { title: "Dashboard", href: "/admin/dashboard" },
        { title: "Site", href: "#" },
        { title: "Reviews", href: "/admin/site/reviews" },
    ],
};
