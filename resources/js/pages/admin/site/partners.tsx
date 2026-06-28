import { Head, usePage, router } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import { SiteLayout } from "@/layouts/site/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Eye, Plus, Trash2, X, ImagePlus, Handshake, ExternalLink, GripVertical, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import site from "@/routes/admin/site";

interface Partner {
    id: number;
    name: string;
    logo: string | null;
    website_url: string | null;
    partnership_tier: "gold" | "silver" | "community";
}

const TIERS = [
    { value: "gold", label: "Gold", classes: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" },
    { value: "silver", label: "Silver", classes: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
    { value: "community", label: "Community", classes: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300" },
] as const;

function getInitials(name: string) {
    return name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");
}

function PartnerModal({ partner, onClose, onSave, saving }: { partner: Partial<Partner> | null; onClose: () => void; onSave: (formData: FormData) => void; saving: boolean }) {
    const [draft, setDraft] = useState<Partial<Partner>>(partner || { name: "", website_url: "", partnership_tier: "community", logo: null });
    const [logoPreview, setLogoPreview] = useState<string | null>(partner?.logo || null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (partner) {
            setDraft(partner);
            setLogoPreview(partner.logo || null);
            setLogoFile(null);
        }
    }, [partner]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setLogoPreview(URL.createObjectURL(file));
        setLogoFile(file);
        e.target.value = "";
    };

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append("name", draft.name || "");
        formData.append("website_url", draft.website_url || "");
        formData.append("partnership_tier", draft.partnership_tier || "community");
        if (logoFile) formData.append("logo", logoFile);
        if (draft.id) formData.append("_method", "PUT");
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-md flex flex-col rounded-2xl border border-sidebar-border bg-background shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-sidebar-border">
                    <div><h3 className="text-sm font-semibold">{draft.id ? "Edit Partner" : "Add Partner"}</h3><p className="text-xs text-muted-foreground mt-0.5">Logo, name, and optional link</p></div>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:bg-sidebar transition-colors"><X className="size-4" /></button>
                </div>
                <div className="p-5 space-y-5">
                    <div className="space-y-2"><Label className="text-xs">Logo <span className="text-muted-foreground font-normal">(optional)</span></Label>
                        <div className="flex items-center gap-4">
                            <div className="relative group shrink-0">
                                {logoPreview ? <img src={logoPreview} alt={draft.name} className="size-16 rounded-xl object-cover border border-sidebar-border" /> : <div className="size-16 rounded-xl bg-gradient-to-br from-sidebar to-sidebar-border flex items-center justify-center text-muted-foreground font-semibold text-lg border border-sidebar-border">{getInitials(draft.name || "") || <Handshake className="size-6 opacity-40" />}</div>}
                                <button onClick={() => fileRef.current?.click()} className="absolute inset-0 rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><ImagePlus className="size-4 text-white" /></button>
                            </div>
                            <div className="flex-1 space-y-1.5">
                                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                                <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5 w-full" onClick={() => fileRef.current?.click()}><ImagePlus className="size-3.5" />{logoPreview ? "Change Logo" : "Upload Logo"}</Button>
                                {logoPreview && <button onClick={() => { setLogoPreview(null); setLogoFile(null); setDraft(prev => ({ ...prev, logo: null })); }} className="text-[11px] text-muted-foreground hover:text-destructive transition-colors w-full text-center">Remove logo</button>}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-1.5"><Label className="text-xs">Company Name</Label><Input value={draft.name ?? ""} onChange={e => setDraft(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g. Kenya Cultural Centre" className="h-8 text-sm" /></div>
                    <div className="space-y-1.5"><Label className="text-xs">Website URL <span className="text-muted-foreground font-normal">(optional)</span></Label><div className="relative"><Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" /><Input value={draft.website_url ?? ""} onChange={e => setDraft(prev => ({ ...prev, website_url: e.target.value }))} placeholder="https://example.com" className="pl-8 h-8 text-sm" /></div></div>
                    <div className="space-y-1.5"><Label className="text-xs">Partnership Tier</Label><div className="grid grid-cols-3 gap-2">{TIERS.map(t => (<button key={t.value} type="button" onClick={() => setDraft(prev => ({ ...prev, partnership_tier: t.value }))} className={cn("h-8 rounded-lg text-xs font-medium border transition-all", draft.partnership_tier === t.value ? t.classes + " border-transparent" : "border-sidebar-border bg-background text-muted-foreground hover:bg-sidebar")}>{t.label}</button>))}</div></div>
                </div>
                <div className="px-5 py-4 border-t border-sidebar-border flex items-center justify-end gap-2"><Button variant="outline" size="sm" className="h-8 text-xs" onClick={onClose}>Cancel</Button><Button size="sm" className="h-8 text-xs" disabled={saving || !draft.name?.trim()} onClick={handleSubmit}>{draft.id ? "Save Changes" : "Add Partner"}</Button></div>
            </div>
        </div>
    );
}

export default function Partners() {
    const getData = (input: any) => Array.isArray(input) ? input : input?.data || [];
    const { props } = usePage<{ partners: Partner[]; toast?: any }>();
    const [partners, setPartners] = useState<Partner[]>(getData(props.partners));
    const [modal, setModal] = useState<Partial<Partner> | null>(null);
    const [saving, setSaving] = useState(false);

    // Sync local partners state with props after any mutation
    useEffect(() => {
        const fresh = getData(props.partners);
        setPartners(fresh);
    }, [props.partners]);

    const openAdd = () => setModal({ name: "", website_url: "", partnership_tier: "community", logo: null });
    const openEdit = (partner: Partner) => setModal({ ...partner });

    const savePartner = (formData: FormData) => {
        setSaving(true);
        const url = formData.has("_method") ? site.partners.update({ id: modal!.id! }).url : site.partners.store().url;
        router.post(url, formData, {
            preserveScroll: true,
            onSuccess: () => {
                setModal(null);
                router.reload({ only: ["partners"] }); // Reload to get fresh data and backend toast
            },
            onFinish: () => setSaving(false),
        });
    };

    const deletePartner = (id: number) => {
        router.post(site.partners.destroy({ id }).url, {
            _method: "DELETE",
        }, {
            preserveScroll: true,
            onSuccess: () => router.reload({ only: ["partners"] }),
        });
    };

    const byTier = (tier: Partner["partnership_tier"]) => partners.filter(p => p.partnership_tier === tier);

    const list = (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border">
                <div><h2 className="text-sm font-medium">Partners</h2><p className="text-xs text-muted-foreground mt-0.5">{partners.length} partner{partners.length !== 1 ? "s" : ""}</p></div>
                <Button size="sm" onClick={openAdd} className="h-7 gap-1.5 text-xs"><Plus className="size-3.5" /> Add Partner</Button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {partners.length === 0 && <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2"><Handshake className="size-8 opacity-30" /><p className="text-sm">No partners yet</p></div>}
                {partners.map(partner => {
                    const tier = TIERS.find(t => t.value === partner.partnership_tier)!;
                    return (
                        <div key={partner.id} className="group flex items-center gap-3 p-2.5 rounded-xl border border-sidebar-border bg-background hover:bg-sidebar/40 transition-colors">
                            <GripVertical className="size-3.5 text-muted-foreground/40 shrink-0" />
                            {partner.logo ? <img src={partner.logo} alt={partner.name} className="size-10 rounded-lg object-cover border border-sidebar-border shrink-0" /> : <div className="size-10 rounded-lg bg-sidebar border border-sidebar-border flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">{getInitials(partner.name)}</div>}
                            <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{partner.name}</p><div className="flex items-center gap-2 mt-0.5"><span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-md", tier.classes)}>{tier.label}</span>{partner.website_url && <span className="text-[11px] text-muted-foreground truncate">{partner.website_url.replace(/^https?:\/\//, "")}</span>}</div></div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"><button onClick={() => openEdit(partner)} className="px-2 py-1 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-sidebar transition-colors">Edit</button><button onClick={() => deletePartner(partner.id)} className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 className="size-3.5" /></button></div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const detail = (
        <div className="flex flex-col h-full">
            <div className="px-5 py-3 border-b border-sidebar-border flex items-center gap-2"><Eye className="size-4 text-muted-foreground" /><span className="text-sm font-medium">Site Preview</span><Badge variant="secondary" className="text-[10px] ml-auto">{partners.length} partners</Badge></div>
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {partners.length === 0 ? <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2"><Handshake className="size-8 opacity-30" /><p className="text-sm">Add partners to see the preview</p></div> : (
                    <>
                        <div><h3 className="text-lg font-bold mb-1">Our Partners</h3><p className="text-sm text-muted-foreground">Organizations and brands we collaborate with.</p></div>
                        {TIERS.map(tier => {
                            const tierPartners = byTier(tier.value);
                            if (tierPartners.length === 0) return null;
                            return (
                                <div key={tier.value}>
                                    <div className="flex items-center gap-2 mb-3"><span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-md", tier.classes)}>{tier.label}</span><div className="flex-1 h-px bg-sidebar-border" /></div>
                                    <div className="grid grid-cols-2 gap-3">{tierPartners.map(partner => (
                                        <div key={partner.id} className="flex items-center gap-3 rounded-xl border border-sidebar-border bg-background px-4 py-3 hover:bg-sidebar/40 transition-colors cursor-pointer group">
                                            {partner.logo ? <img src={partner.logo} alt={partner.name} className="size-9 rounded-lg object-cover border border-sidebar-border shrink-0" /> : <div className="size-9 rounded-lg bg-sidebar border border-sidebar-border flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">{getInitials(partner.name)}</div>}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{partner.name}</p>
                                                {partner.website_url && (
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        <Globe className="size-3 text-muted-foreground shrink-0" />
                                                        <span className="text-[11px] text-muted-foreground truncate">
                                                            {partner.website_url.replace(/^https?:\/\//, "")}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            {partner.website_url && (<a href={partner.website_url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-muted-foreground truncate flex items-center gap-1 hover:text-primary transition-colors">
                                                <ExternalLink className="size-3 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                            </a>)}
                                        </div>
                                    ))}</div>
                                </div>
                            );
                        })}
                    </>
                )}
            </div>
        </div>
    );

    return (
        <>
            <Head title="Partners" />
            <SiteLayout list={list} detail={detail} />
            {modal && <PartnerModal partner={modal} onClose={() => setModal(null)} onSave={savePartner} saving={saving} />}
        </>
    );
}

Partners.layout = {
    breadcrumbs: [
        { title: "Dashboard", href: "/admin/dashboard" },
        { title: "Site", href: "#" },
        { title: "Partners", href: "/admin/site/partners" },
    ],
};