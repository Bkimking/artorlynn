import { Head, usePage, router } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import TextEditor from "@/components/ui/text-editor";
import { SiteLayout } from "@/layouts/site/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Eye, Plus, Trash2, Newspaper, ImagePlus, X, Calendar, Tag, GripVertical, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import site from "@/routes/admin/site";
import axios from "axios";

interface NewsPost {
    id: number;
    title: string;
    category: string;
    published_date: string;
    content: string;
    image: string | null;
    is_published: boolean;
    is_featured: boolean;
}

// CategoryCombobox (unchanged)
function CategoryCombobox({ value, onChange, placeholder }: { value: string; onChange: (val: string) => void; placeholder?: string }) {
    const [options, setOptions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [servicesRes, productsRes, eventsRes] = await Promise.all([
                    axios.get('/admin/site/services').catch(() => ({ data: { data: [] } })),
                    axios.get('/admin/products').catch(() => ({ data: { data: [] } })),
                    axios.get('/admin/events').catch(() => ({ data: { data: [] } })),
                ]);
                const serviceTitles = servicesRes.data?.data?.map((s: any) => s.title) || [];
                const productTitles = productsRes.data?.data?.map((p: any) => p.title) || [];
                const eventTitles = eventsRes.data?.data?.map((e: any) => e.title) || [];
                const all = [...new Set([...serviceTitles, ...productTitles, ...eventTitles, "Announcement"])];
                setOptions(all);
            } catch (error) {
                console.error("Failed to fetch category options", error);
                setOptions(["Announcement"]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOptions();
    }, []);

    return (
        <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
                list="news-categories-datalist"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder || "Select or type category..."}
                className="w-full pl-8 pr-3 h-8 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <datalist id="news-categories-datalist">
                {!isLoading && options.map((opt) => <option key={opt} value={opt} />)}
            </datalist>
        </div>
    );
}

function formatDate(iso: string) {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" });
}

// PostModal (unchanged)
function PostModal({ post, onClose, onSave, saving }: { post: Partial<NewsPost> | null; onClose: () => void; onSave: (formData: FormData) => void; saving: boolean }) {
    const [draft, setDraft] = useState<Partial<NewsPost>>(post || { title: "", category: "", published_date: "", content: "", image: null, is_published: true, is_featured: false });
    const [imagePreview, setImagePreview] = useState<string | null>(post?.image || null);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (post) {
            setDraft(post);
            setImagePreview(post.image || null);
        }
    }, [post]);

    const set = (key: keyof NewsPost) => (val: any) => setDraft(prev => ({ ...prev, [key]: val }));

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImagePreview(URL.createObjectURL(file));
        setDraft(prev => ({ ...prev, image: file as any }));
        e.target.value = "";
    };

    const handleSubmit = () => {
        const formData = new FormData();
        Object.entries(draft).forEach(([key, val]) => {
            if (key === "image" && val instanceof File) {
                formData.append("image", val);
            } else if (key === "image") {
                return;
            } else if (key === "is_featured" || key === "is_published") {
                formData.append(key, val ? "1" : "0");
            } else if (val !== undefined && val !== null) {
                formData.append(key, String(val));
            }
        });
        if (draft.id) formData.append("_method", "PUT");
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-sidebar-border bg-background shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-sidebar-border shrink-0">
                    <div><h3 className="text-sm font-semibold">{draft.id ? "Edit Post" : "New Post"}</h3><p className="text-xs text-muted-foreground mt-0.5">Fill in the post details below</p></div>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:bg-sidebar transition-colors"><X className="size-4" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                    <div className="space-y-2">
                        <Label className="text-xs">Cover Image <span className="text-muted-foreground font-normal">(optional)</span></Label>
                        {imagePreview ? (
                            <div className="relative group rounded-xl overflow-hidden border border-sidebar-border">
                                <img src={imagePreview} alt="Cover" className="w-full h-36 object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button size="sm" variant="secondary" className="h-7 text-xs gap-1" onClick={() => fileRef.current?.click()}><ImagePlus className="size-3" /> Change</Button>
                                    <Button size="sm" variant="destructive" className="h-7 text-xs gap-1" onClick={() => { setImagePreview(null); setDraft(prev => ({ ...prev, image: null })); }}><Trash2 className="size-3" /> Remove</Button>
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => fileRef.current?.click()} className="w-full h-24 rounded-xl border-2 border-dashed border-sidebar-border hover:border-primary/40 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground">
                                <ImagePlus className="size-5" /><span className="text-xs">Upload cover image</span>
                            </button>
                        )}
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </div>
                    <div className="space-y-1.5"><Label className="text-xs">Title</Label><Input value={draft.title ?? ""} onChange={e => set("title")(e.target.value)} placeholder="Post headline..." className="h-8 text-sm" /></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5"><Label className="text-xs">Category</Label><CategoryCombobox value={draft.category ?? ""} onChange={v => set("category")(v)} placeholder="Select or type category..." /></div>
                        <div className="space-y-1.5"><Label className="text-xs">Date</Label><div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" /><Input type="date" value={draft.published_date ?? ""} onChange={e => set("published_date")(e.target.value)} className="pl-8 h-8 text-sm" /></div></div>
                    </div>
                    <div className="space-y-1.5"><Label className="text-xs">Body</Label><TextEditor value={draft.content ?? ""} onChange={val => set("content")(val)} /></div>
                    <div className="flex items-center justify-between rounded-xl border border-sidebar-border bg-background px-3 py-2.5"><div><p className="text-sm font-medium">Featured</p><p className="text-xs text-muted-foreground">Featured post shows up prominently</p></div><Switch checked={draft.is_featured ?? false} onCheckedChange={v => set("is_featured")(v)} /></div>
                    <div className="flex items-center justify-between rounded-xl border border-sidebar-border bg-sidebar/30 px-3 py-2.5"><div><p className="text-sm font-medium">Published</p><p className="text-xs text-muted-foreground">Show this post on the site</p></div><Switch checked={draft.is_published ?? false} onCheckedChange={v => set("is_published")(v)} /></div>
                </div>
                <div className="px-5 py-4 border-t border-sidebar-border flex items-center justify-end gap-2 shrink-0">
                    <Button variant="outline" size="sm" className="h-8 text-xs" onClick={onClose}>Cancel</Button>
                    <Button size="sm" className="h-8 text-xs" disabled={saving || !draft.title?.trim()} onClick={handleSubmit}>{draft.id ? "Save Changes" : "Publish Post"}</Button>
                </div>
            </div>
        </div>
    );
}

export default function News() {
    const getData = (input: any) => Array.isArray(input) ? input : input?.data || [];
    const { props } = usePage<{ posts: NewsPost[]; toast?: any }>();
    const [posts, setPosts] = useState<NewsPost[]>(getData(props.posts));
    const [selected, setSelected] = useState<number>(getData(props.posts)?.[0]?.id ?? 0);
    const [modal, setModal] = useState<Partial<NewsPost> | null>(null);
    const [saving, setSaving] = useState(false);

    const selectedPost = posts.find(p => p.id === selected);

    // Sync local state when props change
    useEffect(() => {
        const fresh = getData(props.posts);
        setPosts(fresh);
        if (selected && !fresh.find(p => p.id === selected)) {
            setSelected(fresh[0]?.id ?? 0);
        }
    }, [props.posts]);

    const openAdd = () => setModal({ title: "", category: "", published_date: new Date().toISOString().split("T")[0], content: "", image: null, is_published: true, is_featured: false });
    const openEdit = (post: NewsPost) => setModal({ ...post });

    const savePost = (formData: FormData) => {
        setSaving(true);
        const url = formData.has("_method") ? site.news.update({ id: modal!.id! }).url : site.news.store().url;
        router.post(url, formData, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ["posts"] });
                setModal(null);
            },
            onFinish: () => setSaving(false),
        });
    };

    const deletePost = (id: number) => {
        router.post(site.news.destroy({ id }).url, {
            _method: "DELETE",
        }, {
            preserveScroll: true,
            onSuccess: () => router.reload({ only: ["posts"] }),
        });
    };

    const list = (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border">
                <div><h2 className="text-sm font-medium">News</h2><p className="text-xs text-muted-foreground mt-0.5">{posts.length} post{posts.length !== 1 ? "s" : ""}{posts.filter(p => p.is_featured).length > 0 && <> · {posts.filter(p => p.is_featured).length} featured</>}</p></div>
                <Button size="sm" onClick={openAdd} className="h-7 gap-1.5 text-xs"><Plus className="size-3.5" /> New Post</Button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {posts.length === 0 && <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2"><Newspaper className="size-8 opacity-30" /><p className="text-sm">No posts yet</p></div>}
                {posts.map(post => (
                    <div key={post.id} onClick={() => setSelected(post.id)} className={cn("group flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all", selected === post.id ? "border-primary/40 bg-primary/5 shadow-sm" : "border-sidebar-border bg-background hover:bg-sidebar/50")}>
                        <GripVertical className="size-4 text-muted-foreground/40 mt-0.5 shrink-0" />
                        {post.image ? <img src={post.image} alt={post.title} className="size-10 rounded-lg object-cover border border-sidebar-border shrink-0" /> : <div className="size-10 rounded-lg bg-sidebar border border-sidebar-border flex items-center justify-center shrink-0"><Newspaper className="size-4 text-muted-foreground/50" /></div>}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2"><p className="text-sm font-medium truncate">{post.title || "Untitled"}</p>{post.is_featured && <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">Featured</Badge>}</div>
                            <div className="flex items-center gap-2 mt-1">{post.category && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{post.category}</Badge>}{post.published_date && <span className="text-[11px] text-muted-foreground">{formatDate(post.published_date)}</span>}<span className={cn("text-[10px] font-medium ml-auto", post.is_published ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>{post.is_published ? "Live" : "Draft"}</span></div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={e => { e.stopPropagation(); openEdit(post); }} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-sidebar transition-all text-[10px] font-medium px-2">Edit</button>
                            <button onClick={e => { e.stopPropagation(); deletePost(post.id); }} className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"><Trash2 className="size-3.5" /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const detail = (
        <div className="flex flex-col h-full">
            <div className="px-5 py-3 border-b border-sidebar-border flex items-center gap-2"><Eye className="size-4 text-muted-foreground" /><span className="text-sm font-medium">Post Preview</span>{selectedPost && <button onClick={() => openEdit(selectedPost)} className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">Edit <ExternalLink className="size-3" /></button>}</div>
            {selectedPost ? (
                <div className="flex-1 overflow-y-auto">{selectedPost.image && <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-52 object-cover" />}<div className="p-6 space-y-4"><div className="flex items-center gap-2 flex-wrap">{selectedPost.category && <Badge variant="secondary">{selectedPost.category}</Badge>}{selectedPost.published_date && <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="size-3" /> {formatDate(selectedPost.published_date)}</span>}{selectedPost.is_featured && <Badge variant="secondary" className="bg-primary/10 text-primary">Featured</Badge>}<span className={cn("text-xs font-medium ml-auto flex items-center gap-1", selectedPost.is_published ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}><span className={cn("size-1.5 rounded-full inline-block", selectedPost.is_published ? "bg-emerald-500" : "bg-muted-foreground")} />{selectedPost.is_published ? "Published" : "Draft"}</span></div><h1 className="text-xl font-bold leading-tight">{selectedPost.title}</h1>{selectedPost.content ? <div className="text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: selectedPost.content }} /> : <p className="text-sm text-muted-foreground italic">No body content yet.</p>}</div></div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground"><div className="text-center space-y-2"><Newspaper className="size-8 opacity-30 mx-auto" /><p className="text-sm">Select a post to preview</p></div></div>
            )}
        </div>
    );

    return (
        <>
            <Head title="News" />
            <SiteLayout list={list} detail={detail} />
            {modal && <PostModal post={modal} onClose={() => setModal(null)} onSave={savePost} saving={saving} />}
        </>
    );
}

News.layout = {
    breadcrumbs: [
        { title: "Dashboard", href: "/admin/dashboard" },
        { title: "Site", href: "#" },
        { title: "News", href: "/admin/site/news" },
    ],
};