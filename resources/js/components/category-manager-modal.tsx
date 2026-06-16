import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Check, X, Loader2 } from "lucide-react";
import { ProductCategory } from "@/types";
import { cn } from "@/lib/utils";
import axios from "axios";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialView?: 'list' | 'create';
    onCategoriesUpdated: (categories: ProductCategory[]) => void;
}

export function CategoryManagerModal({ open, onOpenChange, initialView = 'list', onCategoriesUpdated }: Props) {
    const [view, setView] = useState<'list' | 'create' | 'edit'>(initialView);
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        id: null as number | null,
        name: '',
        slug: ''
    });

    useEffect(() => {
        if (open) {
            fetchCategories();
            setView(initialView);
        }
    }, [open, initialView]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/admin/products/categories');
            setCategories(response.data);
            onCategoriesUpdated(response.data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (name: string) => {
        return name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleNameChange = (name: string) => {
        setFormData(prev => ({
            ...prev,
            name,
            slug: generateSlug(name)
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            if (view === 'create') {
                await axios.post('/admin/products/categories', formData);
            } else {
                await axios.put(`/admin/products/categories/${formData.id}`, formData);
            }
            fetchCategories();
            setView('list');
            setFormData({ id: null, name: '', slug: '' });
        } catch (error) {
            console.error("Failed to save category", error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure? Products in this category might be affected.")) return;
        setActionLoading(true);
        try {
            await axios.delete(`/admin/products/categories/${id}`, { data: { id } });
            fetchCategories();
        } catch (error) {
            console.error("Failed to delete category", error);
        } finally {
            setActionLoading(false);
        }
    };

    const startEdit = (cat: ProductCategory) => {
        setFormData({
            id: cat.id,
            name: cat.name,
            slug: cat.slug
        });
        setView('edit');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] overflow-hidden p-0 gap-0">
                <DialogHeader className="p-6 border-b">
                    <DialogTitle className="text-xl font-black uppercase tracking-tighter flex items-center justify-between">
                        {view === 'list' && "Product Categories"}
                        {view === 'create' && "New Category"}
                        {view === 'edit' && "Edit Category"}
                        
                        {view !== 'list' && (
                            <button 
                                onClick={() => setView('list')}
                                className="text-[10px] font-bold text-muted-foreground hover:text-foreground transition-colors"
                            >
                                BACK TO LIST
                            </button>
                        )}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col min-h-[300px] max-h-[500px]">
                    {view === 'list' ? (
                        <div className="flex-1 flex flex-col">
                            <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    {categories.length} Categories Found
                                </span>
                                <button 
                                    onClick={() => {
                                        setFormData({ id: null, name: '', slug: '' });
                                        setView('create');
                                    }}
                                    className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-[10px] font-black uppercase tracking-tighter text-primary-foreground hover:bg-primary/90 transition-colors"
                                >
                                    <Plus className="h-3 w-3" />
                                    Add New
                                </button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto">
                                {loading ? (
                                    <div className="flex items-center justify-center h-40">
                                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                    </div>
                                ) : categories.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-40 text-muted-foreground italic">
                                        No categories yet.
                                    </div>
                                ) : (
                                    <div className="divide-y">
                                        {categories.map((cat) => (
                                            <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-accent/30 transition-colors group">
                                                <div>
                                                    <h4 className="text-sm font-bold">{cat.name}</h4>
                                                    <p className="text-[10px] text-muted-foreground font-mono">{cat.slug}</p>
                                                </div>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => startEdit(cat)}
                                                        className="p-1.5 hover:bg-black hover:text-white rounded-md transition-all"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(cat.id)}
                                                        className="p-1.5 hover:bg-destructive hover:text-destructive-foreground rounded-md transition-all"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category Name</label>
                                <input 
                                    autoFocus
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    placeholder="e.g. Fine Art Prints"
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Slug</label>
                                <input 
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData(p => ({ ...p, slug: e.target.value }))}
                                    className="w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm text-muted-foreground focus:outline-none font-mono"
                                    required
                                />
                                <p className="text-[9px] text-muted-foreground italic">Auto-generated for SEO</p>
                            </div>
                            
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-black uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none"
                                >
                                    {actionLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                                    {view === 'create' ? "Create Category" : "Save Changes"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setView('list')}
                                    className="px-4 py-2 text-xs font-black uppercase tracking-widest border-2 border-black rounded-md hover:bg-accent transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
