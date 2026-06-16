import { Head, useForm } from "@inertiajs/react";
import { AppInputPage } from "@/components/app-input-page";
import { InputFormLayout } from "@/components/input-form-layout";
import { InputPreviewLayout } from "@/components/input-preview-layout";
import { Product, ProductCategory } from "@/types";
import { ChangeEvent, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, cn } from "@/lib/utils";
import { Plus, Eye } from "lucide-react";
import { CategoryManagerModal } from "@/components/category-manager-modal";
import TextEditor from "@/components/ui/text-editor";
import products from "@/routes/products";

interface Props {
    categories: ProductCategory[];
}

export default function ProductCreate({ categories: initialCategories }: Props) {
    const [categories, setCategories] = useState<ProductCategory[]>(initialCategories);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalView, setModalView] = useState<'list' | 'create'>('list');

    const { data, setData, post, processing, errors } = useForm({
        product_category_id: initialCategories[0]?.id || '',
        title: '',
        slug: '',
        description: '',
        price: '',
        compare_at_price: '',
        stock_quantity: 0,
        images: [] as File[],
        status: 'draft',
        is_featured: false,
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
        post(products.store().url);
    };

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    };

    const openCategoryManager = (view: 'list' | 'create') => {
        setModalView(view);
        setModalOpen(true);
    };

    return (
        <>
            <Head title="Create Product" />

            <AppInputPage>
                {/* ── LEFT: Form ───────────────────────────────────── */}
                <form onSubmit={handleSubmit} className="flex-1 flex min-w-0">
                    <InputFormLayout
                        title="Product Content"
                        description="Main details about the product."
                        backHref="/admin/products"
                        backLabel="Back to Products"
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
                                    onClick={() => setData('status', 'published')}
                                    className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                                >
                                    Publish Product
                                </button>
                            </>
                        }
                    >
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                        Product Title
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
                                        placeholder="E.g. Wireless Headset"
                                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                                    />
                                    {errors.title && <p className="text-[10px] text-destructive">{errors.title}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] flex items-center gap-2 font-bold uppercase tracking-widest text-muted-foreground">
                                        Category
                                        <button type="button" onClick={() => openCategoryManager('create')} className="hover:text-primary transition-colors">
                                            <Plus className="h-4 w-4" />
                                        </button>
                                        <button type="button" onClick={() => openCategoryManager('list')} className="hover:text-primary transition-colors">
                                            <Eye className="h-4 w-4" />
                                        </button>
                                    </label>
                                    <select
                                        value={data.product_category_id}
                                        onChange={e => setData('product_category_id', e.target.value)}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {errors.product_category_id && <p className="text-[10px] text-destructive">{errors.product_category_id}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                        Price
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                        <input
                                            type="number"
                                            value={data.price}
                                            onChange={e => setData('price', e.target.value)}
                                            className="w-full rounded-md border border-input bg-transparent pl-7 pr-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                                        />
                                    </div>
                                    {errors.price && <p className="text-[10px] text-destructive">{errors.price}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                        Sale Price (Optional)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                        <input
                                            type="number"
                                            value={data.compare_at_price}
                                            onChange={e => setData('compare_at_price', e.target.value)}
                                            className="w-full rounded-md border border-input bg-transparent pl-7 pr-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                        Stock Quantity
                                    </label>
                                    <input
                                        type="number"
                                        value={data.stock_quantity}
                                        onChange={e => setData('stock_quantity', parseInt(e.target.value))}
                                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                                    />
                                    {errors.stock_quantity && <p className="text-[10px] text-destructive">{errors.stock_quantity}</p>}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    Description
                                </label>
                                <TextEditor 
                                    value={data.description}
                                    onChange={(content) => setData('description', content)}
                                    placeholder="Write a detailed description of the product..."
                                />
                                {errors.description && <p className="text-[10px] text-destructive">{errors.description}</p>}
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    Product Images
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
                                        <span className="text-[10px] font-semibold text-muted-foreground group-hover:text-primary uppercase tracking-tighter">Add Image</span>
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
                    <div className="p-10 flex flex-col gap-8 max-w-2xl mx-auto">
                        <div className="space-y-4">
                            <div className="flex justify-between items-end border-b pb-4">
                                <div className="space-y-1">
                                    <Badge variant="outline" className="text-[10px] uppercase tracking-widest">{categories.find(c => String(c.id) === String(data.product_category_id))?.name || 'Category'}</Badge>
                                    <h1 className="text-3xl font-black tracking-tighter uppercase">{data.title || 'Product Title'}</h1>
                                </div>
                                <div className="text-right">
                                    {data.compare_at_price && (
                                        <p className="text-sm text-muted-foreground line-through decoration-destructive italic">{formatCurrency(data.compare_at_price)}</p>
                                    )}
                                    <p className="text-3xl font-black text-primary">{formatCurrency(data.price || 0)}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {previews.length > 0 ? (
                                    previews.map((p, i) => (
                                        <div key={i} className={cn(
                                            "aspect-square rounded-xl border-2 border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                                            i === 0 && "col-span-2 aspect-video"
                                        )}>
                                            <img src={p} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-2 aspect-video rounded-xl border-2 border-dashed border-black/20 flex items-center justify-center bg-accent/10">
                                        <p className="text-xs font-semibold text-black/30 tracking-widest">NO IMAGES UPLOADED</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] border-b-2 border-black w-fit pb-1">Product Lore</h3>
                                <div 
                                    className="text-sm leading-relaxed text-muted-foreground prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: data.description || 'Fill in the description to see it here...' }}
                                />
                            </div>

                            <div className="flex items-center gap-4 pt-4">
                                <Badge variant="secondary" className="px-4 py-1 rounded-full border border-black/10">
                                    {data.stock_quantity} IN STOCK
                                </Badge>
                                <Badge className="px-4 py-1 rounded-full uppercase">
                                    {data.status}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </InputPreviewLayout>
            </AppInputPage>

            <CategoryManagerModal 
                open={modalOpen} 
                onOpenChange={setModalOpen}
                initialView={modalView}
                onCategoriesUpdated={setCategories}
            />
        </>
    );
}

ProductCreate.layout = {
    breadcrumbs: [
        { title: 'Products', href: '/admin/products' },
        { title: 'Create', href: '/admin/products/create' },
    ],
};
