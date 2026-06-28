import { Head, usePage, router } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import TextEditor from "@/components/ui/text-editor";
import { SiteLayout } from "@/layouts/site/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Eye, ImagePlus, X, Briefcase, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import site from "@/routes/admin/site";
import axios from "axios";

interface Service {
    id: number;
    title: string;
    description: string;
    category: string;
    image: string | null;
}

type ViewMode = "grid" | "list";

// CategoryCombobox component (unchanged)
function CategoryCombobox({ value, onChange, placeholder }: { value: string; onChange: (val: string) => void; placeholder?: string }) {
    const [options, setOptions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('/admin/products/categories');
                const names = res.data?.map((cat: any) => cat.name) || [];
                setOptions(names);
            } catch (error) {
                console.error("Failed to fetch product categories", error);
                setOptions([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className="relative">
            <input
                list="service-categories-datalist"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder || "Select or type category..."}
                className="w-full h-8 text-sm rounded-md border border-input bg-background pl-3 pr-3 focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <datalist id="service-categories-datalist">
                {!isLoading && options.map((opt) => <option key={opt} value={opt} />)}
            </datalist>
        </div>
    );
}

// ServiceModal component – slightly adjusted to use FormData on save
function ServiceModal({ open, initial, onClose, onSave, saving }: { open: boolean; initial: Partial<Service> | null; onClose: () => void; onSave: (formData: FormData) => void; saving: boolean }) {
    const [title, setTitle] = useState(initial?.title ?? "");
    const [desc, setDesc] = useState(initial?.description ?? "");
    const [category, setCategory] = useState(initial?.category ?? "");
    const [imagePreview, setImagePreview] = useState<string | null>(initial?.image ?? null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const prevOpen = useRef(false);

    useEffect(() => {
        if (open && !prevOpen.current) {
            setTitle(initial?.title ?? "");
            setDesc(initial?.description ?? "");
            setCategory(initial?.category ?? "");
            setImagePreview(initial?.image ?? null);
            setImageFile(null);
        }
        prevOpen.current = open;
    }, [open, initial]);

    const handleSave = () => {
        if (!title.trim()) return;
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", desc);
        formData.append("category", category);
        if (imageFile) formData.append("image", imageFile);
        if (initial?.id) formData.append("_method", "PUT");
        onSave(formData);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            setImageFile(file);
        }
        e.target.value = "";
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{initial?.id ? "Edit Service" : "Create Service"}</DialogTitle>
                    <DialogDescription className="sr-only">Add or edit a service item</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label className="text-xs">Cover Image <span className="text-muted-foreground font-normal">(optional)</span></Label>
                        {imagePreview ? (
                            <div className="relative rounded-xl overflow-hidden border border-sidebar-border group">
                                <img src={imagePreview} alt="Service" className="w-full h-36 object-cover" />
                                <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); }} className="absolute top-2 right-2 size-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X className="size-3.5" /></button>
                            </div>
                        ) : (
                            <button type="button" onClick={() => document.getElementById('service-image-input')?.click()} className="w-full h-32 rounded-xl border border-dashed border-sidebar-border bg-sidebar/40 hover:bg-sidebar hover:border-primary/40 transition-all flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                <ImagePlus className="size-6 opacity-50" />
                                <span className="text-xs">Click to upload image</span>
                                <span className="text-[10px] opacity-60">PNG, JPG, WEBP · optional</span>
                            </button>
                        )}
                        <input id="service-image-input" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </div>
                    <div className="space-y-1.5"><Label className="text-xs">Title <span className="text-destructive">*</span></Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Digital Advertising" className="h-9" /></div>
                    <div className="space-y-1.5"><Label className="text-xs">Category</Label><CategoryCombobox value={category} onChange={setCategory} placeholder="Select or type category..." /></div>
                    <div className="space-y-1.5"><Label className="text-xs">Description</Label><TextEditor value={desc} onChange={setDesc} /></div>
                </div>
                <DialogFooter className="gap-2"><Button variant="outline" size="sm" onClick={onClose}>Cancel</Button><Button size="sm" onClick={handleSave} disabled={saving || !title.trim()}>{initial?.id ? "Save Changes" : "Create Service"}</Button></DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function Services() {
    const getData = (input: any) => Array.isArray(input) ? input : input?.data || [];
    const { props } = usePage<{ services: Service[]; toast?: any }>();
    const [services, setServices] = useState<Service[]>(getData(props.services));
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Service | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [search, setSearch] = useState("");
    const [filterCat, setFilterCat] = useState<string>("all");
    const [saving, setSaving] = useState(false);

    // Sync local state when props change
    useEffect(() => {
        setServices(getData(props.services));
    }, [props.services]);

    const categories = ["all", ...Array.from(new Set(services.map(s => s.category).filter(Boolean)))];
    const filtered = services.filter(s => {
        const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase());
        const matchCat = filterCat === "all" || s.category === filterCat;
        return matchSearch && matchCat;
    });

    const openCreate = () => { setEditing(null); setModalOpen(true); };
    const openEdit = (s: Service) => { setEditing(s); setModalOpen(true); };
    const closeModal = () => { setModalOpen(false); setEditing(null); };

    const saveService = (formData: FormData) => {
        setSaving(true);
        const url = editing ? site.services.update({ id: editing.id }).url : site.services.store().url;
        router.post(url, formData, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ["services"] });
                closeModal();
            },
            onFinish: () => setSaving(false),
        });
    };

    const handleDelete = (id: number) => {
        router.post(site.services.destroy({ id }).url, {
            _method: "DELETE",
        }, {
            preserveScroll: true,
            onSuccess: () => router.reload({ only: ["services"] }),
        });
    };

    // Left panel JSX (uses services, filtered)
    const list = (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border">
                <div><h2 className="text-sm font-medium">Services</h2><p className="text-xs text-muted-foreground mt-0.5">{services.length} service{services.length !== 1 ? "s" : ""}</p></div>
                <Button size="sm" onClick={openCreate} className="h-7 gap-1.5 text-xs"><Plus className="size-3.5" /> Create</Button>
            </div>
            <div className="px-3 py-2.5 border-b border-sidebar-border space-y-2">
                <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search services…" className="h-7 text-xs" />
                {categories.length > 2 && <div className="flex gap-1.5 flex-wrap">{categories.map(c => <button key={c} onClick={() => setFilterCat(c)} className={cn("px-2.5 py-0.5 rounded-full text-[11px] font-medium border transition-all", filterCat === c ? "bg-primary text-primary-foreground border-primary" : "border-sidebar-border text-muted-foreground hover:bg-sidebar")}>{c === "all" ? "All" : c}</button>)}</div>}
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
                        <Briefcase className="size-8 opacity-30" />
                        <p className="text-sm">{services.length === 0 ? "No services yet" : "No results"}</p>
                        {services.length === 0 && <Button size="sm" variant="outline" onClick={openCreate} className="mt-1 h-7 text-xs gap-1"><Plus className="size-3" /> Create your first service</Button>}
                    </div>
                )}
                {filtered.map(s => (
                    <div key={s.id} className="group flex items-center gap-3 p-3 rounded-xl border border-sidebar-border bg-background hover:border-primary/30 hover:bg-primary/5 transition-all">
                        <div className="size-10 rounded-lg shrink-0 overflow-hidden bg-sidebar border border-sidebar-border flex items-center justify-center">
                            {s.image ? <img src={s.image} alt={s.title} className="size-full object-cover" /> : <Briefcase className="size-4 text-muted-foreground/50" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{s.title}</p>
                            <div className="mt-0.5">
                                {s.category ? <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">{s.category}</span> : <span className="text-[11px] text-muted-foreground">No category</span>}
                            </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-sidebar transition-all" title="Edit"><Pencil className="size-3.5" /></button>
                            <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all" title="Delete"><Trash2 className="size-3.5" /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const detail = (
        <div className="flex flex-col h-full">
            <div className="px-5 py-3 border-b border-sidebar-border flex items-center gap-3">
                <Eye className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Live Preview</span>
                <Badge variant="secondary" className="text-[10px]">{filtered.length} shown</Badge>
                <div className="ml-auto flex items-center gap-1 rounded-lg border border-sidebar-border p-0.5">
                    <button onClick={() => setViewMode("grid")} className={cn("p-1 rounded-md transition-all", viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}><LayoutGrid className="size-3.5" /></button>
                    <button onClick={() => setViewMode("list")} className={cn("p-1 rounded-md transition-all", viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}><List className="size-3.5" /></button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
                <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">What we offer</p>
                    <h2 className="text-2xl font-semibold">Our Services</h2>
                    <p className="text-sm text-muted-foreground mt-1">Everything you need to grow your brand online.</p>
                </div>
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2 border border-dashed border-sidebar-border rounded-2xl"><Briefcase className="size-8 opacity-30" /><p className="text-sm">No services to preview</p></div>
                ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filtered.map(s => (
                            <div key={s.id} className="rounded-2xl border border-sidebar-border bg-background overflow-hidden group hover:shadow-sm transition-shadow">
                                <div className="h-36 bg-gradient-to-br from-sidebar to-sidebar/60 flex items-center justify-center overflow-hidden">
                                    {s.image ? <img src={s.image} alt={s.title} className="w-full h-full object-cover" /> : <Briefcase className="size-10 text-muted-foreground/20" />}
                                </div>
                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h3 className="text-sm font-semibold leading-tight">{s.title}</h3>
                                        {s.category && <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">{s.category}</span>}
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3" dangerouslySetInnerHTML={{ __html: s.description || "<em>No description</em>" }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map(s => (
                            <div key={s.id} className="flex gap-4 rounded-2xl border border-sidebar-border bg-background p-4 hover:shadow-sm transition-shadow">
                                <div className="size-14 rounded-xl shrink-0 overflow-hidden bg-sidebar border border-sidebar-border flex items-center justify-center">
                                    {s.image ? <img src={s.image} alt={s.title} className="size-full object-cover" /> : <Briefcase className="size-6 text-muted-foreground/30" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-sm font-semibold">{s.title}</h3>
                                        {s.category && <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">{s.category}</span>}
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2" dangerouslySetInnerHTML={{ __html: s.description || "<em>No description</em>" }} />
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
            <Head title="Services" />
            <SiteLayout list={list} detail={detail} />
            <ServiceModal open={modalOpen} initial={editing} onClose={closeModal} onSave={saveService} saving={saving} />
        </>
    );
}

Services.layout = {
    breadcrumbs: [
        { title: "Dashboard", href: "/admin/dashboard" },
        { title: "Site", href: "#" },
        { title: "Services", href: "/admin/site/services" },
    ],
};