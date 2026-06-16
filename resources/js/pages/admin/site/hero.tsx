import { Head, usePage, router } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import TextEditor from "@/components/ui/text-editor";
import { SiteLayout } from "@/layouts/site/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Eye, ImagePlus, Trash2, AlertCircle, CheckCircle2, LayoutTemplate, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import site from "@/routes/admin/site";

const MIN_IMAGES = 6;
const MAX_IMAGES = 20;

interface HeroImage {
    url: string;
    alt: string;
}

interface HeroData {
    title: string;
    description: string;
    image: HeroImage[];
}

export default function Hero() {
    const { props } = usePage<{ hero: HeroData; toast?: any }>();
    const [title, setTitle] = useState(props.hero?.title || "");
    const [description, setDescription] = useState(props.hero?.description || "");
    const [existingImages, setExistingImages] = useState<HeroImage[]>(props.hero?.image || []);
    const [newImages, setNewImages] = useState<{ file: File; alt: string }[]>([]);
    const [saving, setSaving] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const imageCount = existingImages.length + newImages.length;
    const isUnderMin = imageCount < MIN_IMAGES;
    const isOverMax = imageCount > MAX_IMAGES;
    const isValid = imageCount >= MIN_IMAGES && imageCount <= MAX_IMAGES;

    // Sync when props change (after save reload)
    useEffect(() => {
        if (props.hero) {
            setTitle(props.hero.title || "");
            setDescription(props.hero.description || "");
            setExistingImages(props.hero.image || []);
            setNewImages([]);
        }
    }, [props.hero]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const remaining = MAX_IMAGES - imageCount;
        const toAdd = files.slice(0, remaining);
        const newItems = toAdd.map(file => ({
            file,
            alt: file.name.replace(/\.[^/.]+$/, ""),
        }));
        setNewImages(prev => [...prev, ...newItems]);
        e.target.value = "";
    };

    const removeExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeNewImage = (index: number) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
    };

    const updateExistingAlt = (index: number, alt: string) => {
        setExistingImages(prev => prev.map((img, i) => i === index ? { ...img, alt } : img));
    };

    const updateNewAlt = (index: number, alt: string) => {
        setNewImages(prev => prev.map((item, i) => i === index ? { ...item, alt } : item));
    };

    const saveHero = () => {
        if (!isValid) return;
        setSaving(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("existing_images", JSON.stringify(existingImages));

        newImages.forEach(item => {
            formData.append("images[]", item.file);
            formData.append("alts[]", item.alt);
        });

        formData.append("_method", "PUT");

        router.post(site.hero.update().url, formData, {
            preserveScroll: true,
            onSuccess: () => router.reload({ only: ["hero"] }),
            onError: (errors) => {
                console.error("Save failed:", errors);
                setSaving(false);
            },
            onFinish: () => setSaving(false),
        });
    };

    const validationColor = isUnderMin ? "text-amber-600" : isOverMax ? "text-destructive" : "text-emerald-600";

    const list = (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border">
                <div><h2 className="text-sm font-medium">Hero Section</h2><p className="text-xs text-muted-foreground mt-0.5">Title, description & image grid</p></div>
                <LayoutTemplate className="size-4 text-muted-foreground" />
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
                <div className="space-y-1.5"><Label className="text-xs">Hero Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter a compelling headline..." className="h-8 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Description</Label><TextEditor value={description} onChange={setDescription} /></div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between"><Label className="text-xs">Image Grid</Label><span className={cn("text-[11px] font-medium flex items-center gap-1", validationColor)}>{isValid ? <CheckCircle2 className="size-3" /> : <AlertCircle className="size-3" />}{imageCount} / {MAX_IMAGES}{isUnderMin && ` — need ${MIN_IMAGES - imageCount} more`}{isOverMax && " — limit reached"}</span></div>
                    <div className="h-1.5 rounded-full bg-sidebar overflow-hidden"><div className={cn("h-full rounded-full transition-all duration-300", isValid ? "bg-emerald-500" : isUnderMin ? "bg-amber-400" : "bg-destructive")} style={{ width: `${Math.min((imageCount / MAX_IMAGES) * 100, 100)}%` }} /></div>
                    <p className="text-[11px] text-muted-foreground">Add between {MIN_IMAGES} and {MAX_IMAGES} images for the hero grid.</p>
                    <div className="space-y-2">
                        {/* Existing images */}
                        {existingImages.map((img, idx) => (
                            <div key={idx} className="group flex items-center gap-3 p-2 rounded-xl border border-sidebar-border bg-background hover:bg-sidebar/40 transition-colors">
                                <GripVertical className="size-3.5 text-muted-foreground/40 shrink-0" />
                                <img src={img.url} alt={img.alt} className="size-10 rounded-lg object-cover shrink-0 border border-sidebar-border" />
                                <Input value={img.alt} onChange={e => updateExistingAlt(idx, e.target.value)} placeholder="Image alt text..." className="h-7 text-xs flex-1" />
                                <span className="text-[10px] text-muted-foreground/50 shrink-0">#{idx + 1}</span>
                                <button onClick={() => removeExistingImage(idx)} className={cn("shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded-md transition-all", "text-muted-foreground hover:text-destructive hover:bg-destructive/10", imageCount <= MIN_IMAGES && "cursor-not-allowed opacity-30 hover:text-muted-foreground hover:bg-transparent")} disabled={imageCount <= MIN_IMAGES} title={imageCount <= MIN_IMAGES ? `Minimum ${MIN_IMAGES} images required` : "Remove image"}><Trash2 className="size-3.5" /></button>
                            </div>
                        ))}
                        {/* New images to be uploaded */}
                        {newImages.map((item, idx) => (
                            <div key={`new-${idx}`} className="group flex items-center gap-3 p-2 rounded-xl border border-sidebar-border bg-background hover:bg-sidebar/40 transition-colors">
                                <GripVertical className="size-3.5 text-muted-foreground/40 shrink-0" />
                                <img src={URL.createObjectURL(item.file)} alt={item.alt} className="size-10 rounded-lg object-cover shrink-0 border border-sidebar-border" />
                                <Input value={item.alt} onChange={e => updateNewAlt(idx, e.target.value)} placeholder="Image alt text..." className="h-7 text-xs flex-1" />
                                <span className="text-[10px] text-muted-foreground/50 shrink-0">New</span>
                                <button onClick={() => removeNewImage(idx)} className="shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"><Trash2 className="size-3.5" /></button>
                            </div>
                        ))}
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
                    <Button variant="outline" size="sm" className="w-full h-9 border-dashed gap-2 text-xs" onClick={() => fileRef.current?.click()} disabled={isOverMax}><ImagePlus className="size-4" />{isOverMax ? "Maximum images reached" : "Upload Images"}</Button>
                </div>
            </div>
            <div className="p-4 border-t border-sidebar-border">
                {!isValid && <p className="text-[11px] text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1.5"><AlertCircle className="size-3 shrink-0" />{isUnderMin ? `Add ${MIN_IMAGES - imageCount} more image${MIN_IMAGES - imageCount !== 1 ? "s" : ""} before saving` : `Remove ${imageCount - MAX_IMAGES} image${imageCount - MAX_IMAGES !== 1 ? "s" : ""} before saving`}</p>}
                <Button className="w-full h-8 text-sm" disabled={!isValid || !title.trim() || saving} onClick={saveHero}>{saving ? "Saving..." : "Save Hero"}</Button>
            </div>
        </div>
    );

    const detail = (
        <div className="flex flex-col h-full">
            <div className="px-5 py-3 border-b border-sidebar-border flex items-center gap-2"><Eye className="size-4 text-muted-foreground" /><span className="text-sm font-medium">Live Preview</span><Badge variant="secondary" className="text-[10px] ml-auto">{imageCount} image{imageCount !== 1 ? "s" : ""}</Badge></div>
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
                <div className="rounded-xl border border-sidebar-border overflow-hidden bg-background">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-sidebar-border"><span className="font-semibold text-sm">Artof Lynn</span><div className="flex gap-4 text-xs text-muted-foreground"><span>Services</span><span>Events</span><span>About</span><span>Contact</span><Button size="sm" className="h-6 text-xs px-3">Book now</Button></div></div>
                    <div className="px-8 pt-10 pb-6">
                        <h1 className="text-2xl font-bold leading-tight mb-3">{title || <span className="text-muted-foreground italic">Your hero title…</span>}</h1>
                        {description ? <div className="text-sm text-muted-foreground leading-relaxed max-w-lg prose prose-sm" dangerouslySetInnerHTML={{ __html: description }} /> : <p className="text-sm text-muted-foreground italic">Your description will appear here…</p>}
                        <div className="flex gap-3 mt-5"><Button size="sm" className="h-8 text-xs px-4">Explore Gallery</Button><Button size="sm" variant="outline" className="h-8 text-xs px-4">Book a Session</Button></div>
                    </div>
                    {(existingImages.length > 0 || newImages.length > 0) && (
                        <div className="px-5 pb-5">
                            <div className="grid grid-cols-3 gap-2">
                                {[...existingImages, ...newImages.map(m => ({ url: URL.createObjectURL(m.file), alt: m.alt }))].slice(0, 9).map((img, i) => (
                                    <div key={i} className="aspect-square rounded-lg overflow-hidden border border-sidebar-border"><img src={img.url} alt={img.alt} className="size-full object-cover" /></div>
                                ))}
                                {imageCount > 9 && <div className="aspect-square rounded-lg bg-sidebar flex items-center justify-center border border-sidebar-border"><span className="text-sm font-medium text-muted-foreground">+{imageCount - 9}</span></div>}
                            </div>
                        </div>
                    )}
                </div>
                <div className={cn("rounded-xl border px-4 py-3 flex items-start gap-3", isValid ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30" : "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30")}>
                    {isValid ? <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" /> : <AlertCircle className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />}
                    <div><p className={cn("text-xs font-medium", isValid ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300")}>{isValid ? "Image grid looks great!" : "Image grid needs attention"}</p><p className="text-[11px] text-muted-foreground mt-0.5">{imageCount} of {MIN_IMAGES}–{MAX_IMAGES} required images added.{isUnderMin && ` Add ${MIN_IMAGES - imageCount} more to meet the minimum.`}</p></div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Head title="Hero" />
            <SiteLayout list={list} detail={detail} />
        </>
    );
}

Hero.layout = {
    breadcrumbs: [
        { title: "Dashboard", href: "/admin/dashboard" },
        { title: "Site", href: "#" },
        { title: "Hero", href: "/admin/site/hero" },
    ],
};