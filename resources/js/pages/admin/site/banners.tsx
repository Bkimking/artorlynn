// pages/admin/site/banners.tsx
import { Head, usePage, router, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import TextEditor from "@/components/ui/text-editor";
import { SiteLayout } from "@/layouts/site/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Megaphone, Eye, EyeOff, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import site from "@/routes/admin/site";

interface Banner {
    id: number;
    text: string;
    subtext: string;
    is_visible: boolean;
    type: "info" | "warning" | "success" | "promo";
}

const BANNER_TYPES = [
    { value: "info", label: "Info", classes: "bg-blue-500 text-white" },
    { value: "warning", label: "Warning", classes: "bg-amber-500 text-white" },
    { value: "success", label: "Success", classes: "bg-emerald-500 text-white" },
    { value: "promo", label: "Promo", classes: "bg-indigo-600 text-white" },
] as const;

export default function Banners() {
    const getData = (input: any) => Array.isArray(input) ? input : input?.data || [];
    const { props } = usePage<{ banners: Banner[]; toast?: { message: string; type: string } }>();
    const [banners, setBanners] = useState<Banner[]>(getData(props.banners));
    const [selectedId, setSelectedId] = useState<number | null>(banners[0]?.id ?? null);

    // Form for adding a new banner (only used in addBanner)
    const { data: addData, setData: setAddData, post, processing } = useForm({
        text: "New Banner",
        subtext: "",
        type: "info" as Banner["type"],
        is_visible: false,
    });

    const selectedBanner = banners.find(b => b.id === selectedId);

    // Sync local banners state with props after any reload
    useEffect(() => {
        const freshBanners = getData(props.banners);
        setBanners(freshBanners);
        if (selectedId && !freshBanners.find(b => b.id === selectedId)) {
            setSelectedId(freshBanners[0]?.id ?? null);
        }
    }, [props.banners]);

    // Helper to update a banner in the local state (immediate UI update)
    const updateLocalBanner = (id: number, patch: Partial<Banner>) => {
        setBanners(prev => prev.map(b => (b.id === id ? { ...b, ...patch } : b)));
    };

    const addBanner = () => {
        post(site.banners.store().url, {
            preserveScroll: true,
            onSuccess: () => router.reload({ only: ["banners"] }),
            onError: (errors) => console.error("Banner creation failed:", errors),
        });
    };

    const saveBanner = () => {
        if (!selectedBanner) return;
        router.put(site.banners.update({ id: selectedBanner.id }).url, selectedBanner, {
            preserveScroll: true,
            onSuccess: () => router.reload({ only: ["banners"] }),
        });
    };

    const deleteBanner = (id: number) => {
        router.delete(site.banners.destroy({ id }).url, {
            preserveScroll: true,
            onSuccess: () => router.reload({ only: ["banners"] }),
        });
    };

    // Left panel list
    const list = (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border">
                <div>
                    <h2 className="text-sm font-medium">Banners</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">{banners.length} banner{banners.length !== 1 ? "s" : ""}</p>
                </div>
                <Button size="sm" onClick={addBanner} disabled={processing} className="h-7 gap-1.5 text-xs">
                    <Plus className="size-3.5" /> Add Banner
                </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {banners.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
                        <Megaphone className="size-8 opacity-30" />
                        <p className="text-sm">No banners yet</p>
                    </div>
                )}
                {banners.map(banner => {
                    const typeInfo = BANNER_TYPES.find(t => t.value === banner.type)!;
                    return (
                        <div
                            key={banner.id}
                            onClick={() => setSelectedId(banner.id)}
                            className={cn(
                                "group flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                                selectedId === banner.id
                                    ? "border-primary/40 bg-primary/5 shadow-sm"
                                    : "border-sidebar-border bg-background hover:bg-sidebar/50"
                            )}
                        >
                            <GripVertical className="size-4 text-muted-foreground/40 mt-0.5 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{banner.text || "Untitled banner"}</p>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{typeInfo.label}</Badge>
                                    <span className={cn("text-[10px] font-medium flex items-center gap-1", banner.is_visible ? "text-emerald-600" : "text-muted-foreground")}>
                                        {banner.is_visible ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                                        {banner.is_visible ? "Live" : "Hidden"}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); deleteBanner(banner.id); }}
                                className="shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                            >
                                <Trash2 className="size-3.5" />
                            </button>
                        </div>
                    );
                })}
            </div>
            {/* Edit panel – uses selectedBanner directly, updates local state on change */}
            {selectedBanner && (
                <div className="border-t border-sidebar-border bg-sidebar/30 p-4 space-y-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Edit Banner</p>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Banner Text</Label>
                        <Input
                            value={selectedBanner.text}
                            onChange={e => updateLocalBanner(selectedBanner.id, { text: e.target.value })}
                            placeholder="Enter banner message..."
                            className="h-8 text-sm"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Sub Text <span className="text-muted-foreground font-normal">(optional)</span></Label>
                        <TextEditor
                            key={selectedBanner.id}
                            value={selectedBanner.subtext}
                            onChange={val => updateLocalBanner(selectedBanner.id, { subtext: val })}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Banner Type</Label>
                        <div className="grid grid-cols-4 gap-1.5">
                            {BANNER_TYPES.map(t => (
                                <button
                                    key={t.value}
                                    type="button"
                                    onClick={() => updateLocalBanner(selectedBanner.id, { type: t.value })}
                                    className={cn(
                                        "h-7 rounded-lg text-[11px] font-medium border transition-all",
                                        selectedBanner.type === t.value
                                            ? t.classes + " border-transparent"
                                            : "border-sidebar-border bg-background text-muted-foreground hover:bg-sidebar"
                                    )}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-sidebar-border bg-background px-3 py-2.5">
                        <div>
                            <p className="text-sm font-medium">Visible on site</p>
                            <p className="text-xs text-muted-foreground">Show this banner on public</p>
                        </div>
                        <Switch
                            checked={selectedBanner.is_visible}
                            onCheckedChange={v => updateLocalBanner(selectedBanner.id, { is_visible: v })}
                        />
                    </div>
                    <Button className="w-full h-8 text-sm" onClick={saveBanner} disabled={processing}>
                        Save Banner
                    </Button>
                </div>
            )}
        </div>
    );

    // Right panel – live preview (uses banners state, updates instantly)
    const detail = (
        <div className="flex flex-col h-full">
            <div className="px-5 py-3 border-b border-sidebar-border flex items-center gap-2">
                <Eye className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Live Preview</span>
                <Badge variant="secondary" className="text-[10px] ml-auto">{banners.filter(b => b.is_visible).length} live</Badge>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
                <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Site Header</p>
                    <div className="rounded-xl border border-sidebar-border overflow-hidden">
                        {banners.filter(b => b.is_visible).length === 0 ? (
                            <div className="px-4 py-2.5 bg-muted/50 text-center text-xs text-muted-foreground">
                                No visible banners — toggle one to "Live" to see it here
                            </div>
                        ) : (
                            banners.filter(b => b.is_visible).map(b => {
                                const typeInfo = BANNER_TYPES.find(t => t.value === b.type)!;
                                return (
                                    <div key={b.id} className={cn("px-4 py-2.5 text-center text-sm font-medium", typeInfo.classes)}>
                                        {b.text || "(empty)"}
                                        {b.subtext && <p className="text-xs mt-0.5 opacity-80" dangerouslySetInnerHTML={{ __html: b.subtext }} />}
                                    </div>
                                );
                            })
                        )}
                        <div className="flex items-center justify-between px-5 py-3 bg-background border-t border-sidebar-border">
                            <span className="font-semibold text-sm">Artof Lynn</span>
                            <div className="flex gap-4 text-xs text-muted-foreground">
                                <span>Services</span><span>Events</span><span>About</span><span>Contact</span>
                                <Button size="sm" className="h-6 text-xs px-3">Book now</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">All Banners</p>
                    <div className="space-y-2">
                        {banners.map(b => {
                            const typeInfo = BANNER_TYPES.find(t => t.value === b.type)!;
                            return (
                                <div key={b.id} className={cn("rounded-xl px-4 py-3 flex items-center gap-3 transition-opacity", typeInfo.classes, !b.is_visible && "opacity-35")}>
                                    <Megaphone className="size-4 shrink-0" />
                                    <span className="flex-1 text-sm font-medium">{b.text || "(empty)"}</span>
                                    <span className="text-xs opacity-80">{b.is_visible ? "LIVE" : "HIDDEN"}</span>
                                </div>
                            );
                        })}
                        {banners.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No banners added yet</p>}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Head title="Banners" />
            <SiteLayout list={list} detail={detail} />
        </>
    );
}

Banners.layout = {
    breadcrumbs: [
        { title: "Dashboard", href: "/admin/dashboard" },
        { title: "Site", href: "#" },
        { title: "Banners", href: "/admin/site/banners" },
    ],
};
