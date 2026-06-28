import { Head, usePage, router } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import TextEditor from "@/components/ui/text-editor";
import { SiteLayout } from "@/layouts/site/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Eye, Trash2, Upload, ImageIcon, GripVertical, LayoutGrid, LayoutList, FileImage, Video, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import site from "@/routes/admin/site";

interface GalleryItem {
    id: number;
    image: string | null;
    video: string | null;
    type: 'image' | 'gif' | 'video';
    name: string;
    description: string;
    is_gif: boolean;
    is_featured: boolean;
    is_visible: boolean;
}

type ViewMode = "grid" | "list";

export default function Gallerys() {
    const getData = (input: any) => Array.isArray(input) ? input : input?.data || [];
    const { props } = usePage<{ items: GalleryItem[]; toast?: any }>();
    const [items, setItems] = useState<GalleryItem[]>(getData(props.items));
    const [selected, setSelected] = useState<number | null>(getData(props.items)?.[0]?.id ?? null);
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const fileRef = useRef<HTMLInputElement>(null);
    const [saving, setSaving] = useState(false);
    const [localToast, setLocalToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Separate state for pending media replacements (editing)
    const [pendingImage, setPendingImage] = useState<File | null>(null);
    const [pendingVideo, setPendingVideo] = useState<File | null>(null);

    const selectedItem = items.find(i => i.id === selected);

    useEffect(() => {
        const fresh = getData(props.items);
        setItems(fresh);
        if (selected && !fresh.find(i => i.id === selected)) {
            setSelected(fresh[0]?.id ?? null);
        }
        // Clear local toast when page reloads (new props)
        setLocalToast(null);
    }, [props.items]);

    const updateLocalItem = (id: number, patch: Partial<GalleryItem>) => {
        setItems(prev => prev.map(i => (i.id === id ? { ...i, ...patch } : i)));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        files.forEach(file => {
            const formData = new FormData();
            const isVideo = file.type.startsWith('video/');

            if (isVideo) {
                formData.append("video", file);
                formData.append("type", "video");
                formData.append("name", file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
                formData.append("description", "");
                formData.append("is_featured", "0");
                formData.append("is_visible", "0");
                formData.append("is_gif", "0");
            } else {
                formData.append("image", file);
                formData.append("type", file.type === "image/gif" ? "gif" : "image");
                formData.append("name", file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
                formData.append("description", "");
                formData.append("is_featured", "0");
                formData.append("is_visible", "0");
                formData.append("is_gif", file.type === "image/gif" ? "1" : "0");
            }

            router.post(site.gallerys.store().url, formData, {
                preserveScroll: true,
                onSuccess: () => {
                    setLocalToast(null);
                    router.reload({ only: ["items"] });
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0];
                    setLocalToast({
                        type: 'error',
                        message: firstError || 'Upload failed. File may be too large.',
                    });
                },
            });
        });
        e.target.value = "";
    };

    const deleteItem = (id: number) => {
        router.post(site.gallerys.destroy({ id }).url, {
            _method: "DELETE",
        }, {
            preserveScroll: true,
            onSuccess: () => router.reload({ only: ["items"] }),
        });
    };

    const saveItem = () => {
    if (!selectedItem) return;
    setSaving(true);

    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('name', selectedItem.name || '');
    formData.append('description', selectedItem.description || '');
    formData.append('is_featured', selectedItem.is_featured ? '1' : '0');
    formData.append('is_visible', selectedItem.is_visible ? '1' : '0');
    formData.append('is_gif', selectedItem.is_gif ? '1' : '0');
    if (pendingImage) formData.append('image', pendingImage);
    if (pendingVideo) formData.append('video', pendingVideo);

    router.post(site.gallerys.update({ id: selectedItem.id }).url, formData, {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
            setPendingImage(null);
            setPendingVideo(null);
            router.reload({ only: ['items'] });
        },
        onError: (errors) => {
            const first = Object.values(errors)[0];
            console.error('Update failed:', first);
        },
        onFinish: () => setSaving(false),
    });
};

    // Left panel list (unchanged, but we add localToast display in the edit panel)
    const list = (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border shrink-0">
                <div>
                    <h2 className="text-sm font-medium">Gallery</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {items.length} item{items.length !== 1 ? "s" : ""}
                        {items.filter(i => i.is_gif).length > 0 && <> · {items.filter(i => i.is_gif).length} GIF{items.filter(i => i.is_gif).length !== 1 ? "s" : ""}</>}
                        {items.filter(i => i.type === 'video').length > 0 && <> · {items.filter(i => i.type === 'video').length} video{items.filter(i => i.type === 'video').length !== 1 ? "s" : ""}</>}
                    </p>
                </div>
                <Button size="sm" onClick={() => fileRef.current?.click()} className="h-7 gap-1.5 text-xs">
                    <Upload className="size-3.5" /> Upload
                </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ scrollbarWidth: "none" }}>
                {items.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
                        <ImageIcon className="size-8 opacity-30" />
                        <p className="text-sm">No media yet</p>
                        <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 border-dashed" onClick={() => fileRef.current?.click()}>
                            <Upload className="size-3.5" /> Upload your first media
                        </Button>
                    </div>
                )}
                {items.map(item => (
                    <div
                        key={item.id}
                        onClick={() => { setSelected(item.id); setPendingImage(null); setPendingVideo(null); }}
                        className={cn(
                            "group flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all",
                            selected === item.id
                                ? "border-primary/40 bg-primary/5 shadow-sm"
                                : "border-sidebar-border bg-background hover:bg-sidebar/50"
                        )}
                    >
                        <GripVertical className="size-3.5 text-muted-foreground/40 shrink-0" />
                        <div className="relative shrink-0">
                            {item.type === 'video' ? (
                                <video src={item.video!} className="size-12 rounded-lg object-cover border border-sidebar-border" muted />
                            ) : (
                                <img src={item.image!} alt={item.name} className="size-12 rounded-lg object-cover border border-sidebar-border" />
                            )}
                            {item.is_gif && <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[8px] font-bold px-1 rounded-sm leading-4">GIF</span>}
                            {item.type === 'video' && <Play className="absolute bottom-0 right-0 size-3 text-white bg-black/50 rounded-full p-0.5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.name || <span className="text-muted-foreground italic">Untitled</span>}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                                {!!item.is_gif && <span className="text-[9px] font-bold bg-primary text-primary-foreground px-1 rounded-sm">GIF</span>}
                                {!!item.is_featured && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Featured</Badge>}
                                {item.description && <span className="text-[11px] text-muted-foreground truncate">Has description</span>}
                                {item.type === 'video' && <Badge variant="outline" className="text-[9px] px-1 py-0">Video</Badge>}
                            </div>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}
                            className="shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                        >
                            <Trash2 className="size-3.5" />
                        </button>
                    </div>
                ))}
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*,image/gif,video/mp4,video/webm,video/quicktime"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                />
                <button
                    onClick={() => fileRef.current?.click()}
                    className="w-full rounded-xl border-2 border-dashed border-sidebar-border hover:border-primary/40 hover:bg-primary/5 transition-all py-5 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground group"
                >
                    <FileImage className="size-6 transition-transform group-hover:scale-110 duration-200" />
                    <span className="text-xs">Drop images, GIFs or videos here</span>
                    <span className="text-[11px] text-muted-foreground/70">PNG, JPG, WebP, GIF, MP4, WebM supported</span>
                </button>
            </div>
            {selectedItem && (
                <div className="shrink-0 border-t border-sidebar-border bg-sidebar/30 p-4 space-y-4 overflow-y-auto max-h-[52%]" style={{ scrollbarWidth: "none" }}>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Edit Item</p>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Name</Label>
                        <Input
                            value={selectedItem.name}
                            onChange={e => updateLocalItem(selectedItem.id, { name: e.target.value })}
                            placeholder="e.g. Bloom Series I"
                            className="h-8 text-sm"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Description <span className="text-muted-foreground font-normal">(optional)</span></Label>
                        <TextEditor
                            key={selectedItem.id}
                            value={selectedItem.description}
                            onChange={val => updateLocalItem(selectedItem.id, { description: val })}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Replace Media <span className="text-muted-foreground font-normal">(optional)</span></Label>
                        <Input
                            type="file"
                            accept="image/*,image/gif,video/mp4,video/webm"
                            onChange={e => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                if (file.type.startsWith('video/')) {
                                    setPendingVideo(file);
                                    // Optionally show a preview?
                                } else {
                                    setPendingImage(file);
                                }
                            }}
                            className="h-8 text-sm"
                        />
                        {(pendingImage || pendingVideo) && (
                            <p className="text-[11px] text-emerald-600">
                                New media selected – will be replaced on save.
                            </p>
                        )}
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-sidebar-border bg-background px-3 py-2.5">
                        <div>
                            <p className="text-sm font-medium">Featured</p>
                            <p className="text-xs text-muted-foreground">Highlight in gallery</p>
                        </div>
                        <Switch
                            checked={selectedItem.is_featured}
                            onCheckedChange={v => updateLocalItem(selectedItem.id, { is_featured: v })}
                        />
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-sidebar-border bg-background px-3 py-2.5">
                        <div>
                            <p className="text-sm font-medium">Visible</p>
                            <p className="text-xs text-muted-foreground">Show in gallery</p>
                        </div>
                        <Switch
                            checked={selectedItem.is_visible}
                            onCheckedChange={v => updateLocalItem(selectedItem.id, { is_visible: v })}
                        />
                    </div>

                    {/* Local toast for errors that don't come from backend (e.g., 413) */}
                    {localToast && (
                        <div className={cn(
                            "text-xs px-3 py-2 rounded-lg",
                            localToast.type === 'error'
                                ? "bg-destructive/10 text-destructive"
                                : "bg-green-500/10 text-green-600"
                        )}>
                            {localToast.message}
                        </div>
                    )}

                    <Button className="w-full h-8 text-sm" onClick={saveItem} disabled={saving}>
                        {saving ? "Saving..." : "Save Gallery"}
                    </Button>
                </div>
            )}
        </div>
    );

    const detail = (
        <div className="flex flex-col h-full">
            <div className="px-5 py-3 border-b border-sidebar-border flex items-center gap-2 shrink-0">
                <Eye className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Live Preview</span>
                <div className="ml-auto flex items-center gap-1.5">
                    <Badge variant="secondary" className="text-[10px]">{items.length} item{items.length !== 1 ? "s" : ""}</Badge>
                    <div className="flex rounded-lg border border-sidebar-border overflow-hidden">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={cn("p-1.5 transition-colors", viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-sidebar")}
                        >
                            <LayoutGrid className="size-3" />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={cn("p-1.5 transition-colors", viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-sidebar")}
                        >
                            <LayoutList className="size-3" />
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
                        <ImageIcon className="size-8 opacity-30" />
                        <p className="text-sm">Upload media to see your gallery</p>
                    </div>
                ) : viewMode === "grid" ? (
                    <div className="columns-2 gap-3 space-y-3">
                        {items.filter(i => i.is_visible !== false).map(item => (
                            <div
                                key={item.id}
                                className={cn(
                                    "break-inside-avoid rounded-xl overflow-hidden border border-sidebar-border bg-background relative",
                                    item.is_featured && "ring-2 ring-primary/30"
                                )}
                            >
                                {item.type === 'video' ? (
                                    <video src={item.video!} className="w-full object-cover" controls muted loop playsInline />
                                ) : (
                                    <img src={item.image!} alt={item.name} className="w-full object-cover" />
                                )}
                               {(item.name || item.description || !!item.is_gif || !!item.is_featured) && (
                                    <div className="px-3 py-2.5">
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs font-medium truncate flex-1">{item.name}</p>
                                            {!!item.is_gif && <span className="text-[9px] font-bold bg-primary text-primary-foreground px-1 rounded-sm">GIF</span>}
                                            {!!item.is_featured && <Badge variant="secondary" className="text-[9px] px-1 py-0">★</Badge>}
                                            {item.type === 'video' && <Badge variant="outline" className="text-[9px] px-1 py-0">Video</Badge>}
                                        </div>
                                        {item.description && (
                                            <div
                                                className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed"
                                                dangerouslySetInnerHTML={{ __html: item.description }}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {items.filter(i => i.is_visible !== false).map(item => (
                            <div
                                key={item.id}
                                className={cn(
                                    "flex items-start gap-4 p-3 rounded-xl border border-sidebar-border bg-background",
                                    item.is_featured && "ring-2 ring-primary/30"
                                )}
                            >
                                <div className="size-14 rounded-lg overflow-hidden border border-sidebar-border shrink-0 bg-sidebar">
                                    {item.type === 'video' ? (
                                        <video src={item.video!} className="size-full object-cover" muted />
                                    ) : (
                                        <img src={item.image!} alt={item.name} className="size-full object-cover" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium truncate">{item.name || "Untitled"}</p>
                                        {item.is_gif && <span className="text-[9px] font-bold bg-primary text-primary-foreground px-1 rounded-sm shrink-0">GIF</span>}
                                        {item.is_featured && <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">Featured</Badge>}
                                        {item.type === 'video' && <Badge variant="outline" className="text-[9px] px-1 py-0">Video</Badge>}
                                    </div>
                                    {item.description ? (
                                        <div
                                            className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: item.description }}
                                        />
                                    ) : (
                                        <p className="text-xs text-muted-foreground/50 mt-1 italic">No description</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            <Head title="Gallery" />
            <SiteLayout list={list} detail={detail} />
        </>
    );
}

Gallerys.layout = {
    breadcrumbs: [
        { title: "Dashboard", href: "/admin/dashboard" },
        { title: "Site", href: "#" },
        { title: "Gallery", href: "/admin/site/gallerys" },
    ],
};