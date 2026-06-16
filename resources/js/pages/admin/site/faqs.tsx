import { Head, usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import TextEditor from "@/components/ui/text-editor";
import { SiteLayout } from "@/layouts/site/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Eye, Trash2, ChevronUp, ChevronDown, HelpCircle, Plus, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import site from "@/routes/admin/site";
import axios from "axios";

interface FAQ {
    id: number;
    question: string;
    answer: string;
    sorted_order: number;
    is_visible: boolean;
}

export default function Faqs() {
    const getData = (input: any) => Array.isArray(input) ? input : input?.data || [];
    const { props } = usePage<{ faqs: FAQ[]; toast?: any }>();
    const [faqs, setFaqs] = useState<FAQ[]>(getData(props.faqs));
    const [selected, setSelected] = useState<number | null>(getData(props.faqs)?.[0]?.id ?? null);
    const [expandedPreview, setExpandedPreview] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);

    const selectedFaq = faqs.find(f => f.id === selected);

    // Sync local state when props change
    useEffect(() => {
        const fresh = getData(props.faqs);
        setFaqs(fresh);
        if (selected && !fresh.find(f => f.id === selected)) {
            setSelected(fresh[0]?.id ?? null);
        }
    }, [props.faqs]);

    // Update local state only (instant UI update)
    const updateLocalFaq = (id: number, patch: Partial<FAQ>) => {
        setFaqs(prev => prev.map(f => (f.id === id ? { ...f, ...patch } : f)));
    };

    const saveFaq = async () => {
        if (!selectedFaq) return;
        setSaving(true);
        // Send the whole selectedFaq (which has a real DB ID)
        await router.put(site.faqs.update({ id: selectedFaq.id }).url, selectedFaq, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => router.reload({ only: ["faqs"] }),
        });
        setSaving(false);
    };

    const addFaq = () => {
        router.post(site.faqs.store().url, {
            question: "New FAQ",
            answer: "answer",
            is_visible: false,
        }, {
            preserveScroll: true,
            onSuccess: () => router.reload({ only: ["faqs"] }),
            onError: (errors) => console.error("Failed to add FAQ", errors),
        });
    };

    const deleteFaq = (id: number) => {
        router.delete(site.faqs.destroy({ id }).url, {
            preserveScroll: true,
            onSuccess: () => router.reload({ only: ["faqs"] }),
        });
    };

    const moveUp = (id: number) => {
        const idx = faqs.findIndex(f => f.id === id);
        if (idx <= 0) return;
        const newOrder = [...faqs];
        [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
        setFaqs(newOrder);
        axios.post(site.faqs.reorder().url, { order: newOrder.map(f => f.id) });
    };

    const moveDown = (id: number) => {
        const idx = faqs.findIndex(f => f.id === id);
        if (idx >= faqs.length - 1) return;
        const newOrder = [...faqs];
        [newOrder[idx], newOrder[idx + 1]] = [newOrder[idx + 1], newOrder[idx]];
        setFaqs(newOrder);
        axios.post(site.faqs.reorder().url, { order: newOrder.map(f => f.id) });
    };

    const list = (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border">
                <div><h2 className="text-sm font-medium">FAQs</h2><p className="text-xs text-muted-foreground mt-0.5">{faqs.length} question{faqs.length !== 1 ? "s" : ""}</p></div>
                <HelpCircle className="size-4 text-muted-foreground" />
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {faqs.map((faq, idx) => {
                    const isFirst = idx === 0, isLast = idx === faqs.length - 1, isSelected = selected === faq.id;
                    return (
                        <div key={faq.id} onClick={() => setSelected(faq.id)} className={cn("group relative rounded-xl border cursor-pointer transition-all", isSelected ? "border-primary/40 bg-primary/5 shadow-sm" : "border-sidebar-border bg-background hover:bg-sidebar/50")}>
                            <div className="flex items-start gap-2 p-3">
                                <div className="flex flex-col shrink-0 -my-0.5">
                                    {!isFirst && <button onClick={(e) => { e.stopPropagation(); moveUp(faq.id); }} className="p-0.5 rounded text-muted-foreground/50 hover:text-foreground hover:bg-sidebar transition-all"><ChevronUp className="size-3.5" /></button>}
                                    {!isLast && <button onClick={(e) => { e.stopPropagation(); moveDown(faq.id); }} className="p-0.5 rounded text-muted-foreground/50 hover:text-foreground hover:bg-sidebar transition-all"><ChevronDown className="size-3.5" /></button>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{faq.question || <span className="text-muted-foreground italic">Untitled question</span>}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{faq.answer.replace(/<[^>]+>/g, "") || "No answer yet"}</p>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 tabular-nums">#{idx + 1}</Badge>
                                    <button onClick={(e) => { e.stopPropagation(); deleteFaq(faq.id); }} className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"><Trash2 className="size-3.5" /></button>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <button onClick={addFaq} disabled={saving} className="w-full rounded-xl border-2 border-dashed border-sidebar-border hover:border-primary/40 hover:bg-primary/5 transition-all py-4 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground group"><Plus className="size-4 transition-transform group-hover:rotate-90 duration-200" /> Add FAQ</button>
            </div>
            {selectedFaq && (
                <div className="border-t border-sidebar-border bg-sidebar/30 p-4 space-y-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Edit FAQ</p>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Question</Label>
                        <Input 
                            value={selectedFaq.question} 
                            onChange={e => updateLocalFaq(selectedFaq.id, { question: e.target.value })} 
                            placeholder="What would a customer ask?" 
                            className="h-8 text-sm" 
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Answer</Label>
                        <TextEditor 
                            value={selectedFaq.answer} 
                            onChange={val => updateLocalFaq(selectedFaq.id, { answer: val })} 
                        />
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-sidebar-border bg-background px-3 py-2.5">
                        <div>
                            <p className="text-sm font-medium">Visible on site</p>
                            <p className="text-xs text-muted-foreground">Show this FAQ on the public page</p>
                        </div>
                        <Switch 
                            checked={selectedFaq.is_visible} 
                            onCheckedChange={checked => updateLocalFaq(selectedFaq.id, { is_visible: checked })} 
                        />
                    </div>
                    <Button className="w-full h-8 text-sm" onClick={saveFaq} disabled={saving}>
                        Save FAQ
                    </Button>
                </div>
            )}
            {!selectedFaq && faqs.length === 0 && <div className="p-4 border-t border-sidebar-border"><p className="text-xs text-muted-foreground text-center">Add your first FAQ using the card above.</p></div>}
        </div>
    );

    const detail = (
        <div className="flex flex-col h-full">
            <div className="px-5 py-3 border-b border-sidebar-border flex items-center gap-2">
                <Eye className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Live Preview</span>
                <Badge variant="secondary" className="text-[10px] ml-auto">{faqs.filter(f => f.is_visible).length} visible</Badge>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
                <div><h3 className="text-xl font-bold mb-1">Frequently Asked Questions</h3><p className="text-sm text-muted-foreground">Everything you need to know.</p></div>
                {faqs.filter(f => f.is_visible).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2"><HelpCircle className="size-8 opacity-30" /><p className="text-sm">No visible FAQs yet</p></div>
                ) : (
                    <div className="space-y-2">{faqs.filter(f => f.is_visible).map(faq => {
                        const isOpen = expandedPreview === faq.id;
                        return (
                            <div key={faq.id} className={cn("rounded-xl border border-sidebar-border bg-background overflow-hidden transition-all", isOpen && "shadow-sm")}>
                                <button className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-sidebar/40 transition-colors" onClick={() => setExpandedPreview(isOpen ? null : faq.id)}>
                                    <span className="text-sm font-medium">{faq.question || <span className="text-muted-foreground italic">Untitled question</span>}</span>
                                    <ChevronRight className={cn("size-4 text-muted-foreground shrink-0 transition-transform duration-200", isOpen && "rotate-90")} />
                                </button>
                                {isOpen && faq.answer && <div className="px-4 pb-4 pt-0 text-sm text-muted-foreground leading-relaxed border-t border-sidebar-border/50 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: faq.answer }} />}
                            </div>
                        );
                    })}</div>
                )}
                <div className="rounded-xl border border-sidebar-border bg-sidebar/30 px-4 py-3 text-[11px] text-muted-foreground">💡 Click a question above to toggle its answer in the preview. Use the arrow buttons in the editor to reorder FAQs.</div>
            </div>
        </div>
    );

    return (
        <>
            <Head title="FAQs" />
            <SiteLayout list={list} detail={detail} />
        </>
    );
}

Faqs.layout = {
    breadcrumbs: [
        { title: "Dashboard", href: "/admin/dashboard" },
        { title: "Site", href: "#" },
        { title: "FAQs", href: "/admin/site/faqs" },
    ],
};