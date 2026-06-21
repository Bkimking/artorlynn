import { Head, Link } from '@inertiajs/react';
import ProductDetailsLayout from '@/layouts/public/product-details-layout';
import { stripHtml } from '@/lib/stripHtml';

export default function ProductShow({ product }: { product: any }) {
    const mainImage = product.images?.[0] || null;
    const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;

    return (
        <ProductDetailsLayout>
            <Head title={`${product.title} — Art of Lynn`} />
            <article className="bg-[#f7f7f7] py-12 sm:py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 text-[#281b10]/60 hover:text-[#c9a07a] font-serif text-sm mb-8 transition-colors"
                    >
                        ← Back to shop
                    </Link>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="rounded-2xl overflow-hidden bg-white shadow-lg">
                            {mainImage ? (
                                <img src={mainImage} alt={product.title} className="w-full h-96 object-cover" />
                            ) : (
                                <div className="w-full h-96 bg-gradient-to-br from-[#e8cbb5] to-[#c9a07a] flex items-center justify-center text-[#281b10] text-4xl font-serif">
                                    {product.title.charAt(0)}
                                </div>
                            )}
                            {product.images?.length > 1 && (
                                <div className="grid grid-cols-4 gap-2 p-4">
                                    {product.images.slice(1, 5).map((img: string, i: number) => (
                                        <img key={i} src={img} alt={`${product.title} ${i+2}`} className="w-full h-20 object-cover rounded-md" />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <span className="font-serif text-xs tracking-widest uppercase text-[#c9a07a]">
                                {product.product_category?.name || 'Product'}
                            </span>
                            <h1 className="text-3xl sm:text-4xl font-serif text-[#281b10] mt-2 mb-4">
                                {product.title}
                            </h1>
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-2xl font-serif font-bold text-[#281b10]">
                                    KES {Number(product.price).toLocaleString()}
                                </span>
                                {hasDiscount && (
                                    <span className="text-sm line-through text-[#281b10]/50">
                                        KES {Number(product.compare_at_price).toLocaleString()}
                                    </span>
                                )}
                            </div>
                            <div className="prose max-w-none font-serif text-[#281b10]/70 leading-relaxed mb-6">
                                {stripHtml(product.description)}
                            </div>
                            {product.stock_quantity !== null && (
                                <p className="text-sm font-serif text-[#281b10]/60">
                                    {product.stock_quantity > 0 ? `In stock (${product.stock_quantity} available)` : 'Out of stock'}
                                </p>
                            )}
                            <div className="mt-8">
                                <a
                                    href="#contact"
                                    className="inline-block px-8 py-4 bg-[#281b10] text-[#f7f7f7] font-serif text-sm uppercase tracking-widest rounded-sm hover:bg-[#c9a07a] transition-colors"
                                >
                                    Enquire about this piece
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </ProductDetailsLayout>
    );
}