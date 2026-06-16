import { Head, Link, useForm } from "@inertiajs/react";
import ProductsLayout from "@/layouts/products/layout";
import { useState } from "react";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";

interface Props {
    products: {
        data: Product[];
    }
}

export default function ProductsIndex({ products }: Props) {
    const { delete: destroy, processing } = useForm();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(products.data[0] || null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProducts = products.data.filter(product => 
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            // @ts-ignore
            destroy(route('products.destroy', id), {
                onSuccess: () => setSelectedProduct(null)
            });
        }
    };

    return (
        <>
            <Head title="Products" />
            <ProductsLayout
                list={
                    <>
                        {/* ── Header ───────────────────────────────────── */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between border-b border-sidebar-border px-4 py-3">
                            <h1 className="text-sm font-semibold text-foreground">Products</h1>
                            <Link
                                href="/admin/products/create"
                                className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                Create Product
                            </Link>
                        </div>
 
                        {/* ── Search ───────────────────────────────────── */}
                        <div className="border-b border-sidebar-border px-4 py-2">
                            <div className="relative">
                                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-md border border-input bg-transparent py-1.5 pl-8 pr-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                                />
                            </div>
                        </div>
 
                        {/* ── List ─────────────────────────────────────── */}
                        <div className="flex-1 overflow-y-auto">
                            {filteredProducts.length > 0 ? (
                                <div className="divide-y divide-sidebar-border">
                                    {filteredProducts.map((product) => (
                                        <button
                                            key={product.id}
                                            onClick={() => setSelectedProduct(product)}
                                            className={cn(
                                                "w-full text-left p-4 hover:bg-accent/50 transition-colors flex flex-col gap-1",
                                                selectedProduct?.id === product.id && "bg-accent"
                                            )}
                                        >
                                            <div className="flex justify-between items-start">
                                                <span className="text-sm font-medium truncate">{product.title}</span>
                                                <span className="text-sm font-semibold">{formatCurrency(product.price)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={product.status === 'published' ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0">
                                                    {product.status}
                                                </Badge>
                                                <span className="text-[11px] text-muted-foreground">
                                                    Stock: {product.stock_quantity}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-muted-foreground">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-30">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                    <p className="text-xs">No products found</p>
                                </div>
                            )}
                        </div>
                    </>
                }
                detail={
                    selectedProduct ? (
                        <div className="flex flex-1 flex-col p-8 space-y-6">
                             <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedProduct.title}</h2>
                                    <p className="text-sm text-muted-foreground">Slug: {selectedProduct.slug}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/admin/products/${selectedProduct.id}/edit`}
                                        className="rounded-md border border-input px-3 py-1.5 text-xs font-medium hover:bg-accent"
                                    >
                                        Edit Product
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(selectedProduct.id)}
                                        disabled={processing}
                                        className="rounded-md bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="rounded-lg border p-3 flex flex-col gap-1">
                                    <span className="text-[10px] uppercase font-semibold text-muted-foreground uppercase tracking-widest">Price</span>
                                    <span className="text-lg font-bold">{formatCurrency(selectedProduct.price)}</span>
                                </div>
                                <div className="rounded-lg border p-3 flex flex-col gap-1">
                                    <span className="text-[10px] uppercase font-semibold text-muted-foreground uppercase tracking-widest">Stock</span>
                                    <span className="text-lg font-bold">{selectedProduct.stock_quantity}</span>
                                </div>
                                <div className="rounded-lg border p-3 flex flex-col gap-1">
                                    <span className="text-[10px] uppercase font-semibold text-muted-foreground uppercase tracking-widest">Status</span>
                                    <Badge className="w-fit">{selectedProduct.status}</Badge>
                                </div>
                             </div>

                             <div className="space-y-2">
                                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Description</h3>
                                <div
                                    className="text-sm leading-relaxed border rounded-lg p-4 bg-accent/20 h-48 overflow-y-auto"
                                    dangerouslySetInnerHTML={{ __html: selectedProduct.description || '' }}
                                />
                             </div>

                             {selectedProduct.images && selectedProduct.images.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground border-b w-fit pb-1">Product Gallery</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {selectedProduct.images.map((img, i) => (
                                            <div key={i} className="aspect-square rounded-lg border-2 border-black overflow-hidden bg-muted group relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                                <img src={`/storage/${img}`} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                             )}
                        </div>
                    ) : (
                        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-20">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <p className="text-xs">Select a product to view details</p>
                        </div>
                    )
                }
            />
        </>
    );
}

ProductsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Products',
            href: '/admin/products',
        },
    ],
};
