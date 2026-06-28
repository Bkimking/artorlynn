import { motion } from 'framer-motion';
import { Reveal } from '../components/reveal';
import { stripHtml } from '@/lib/stripHtml';
import { Link } from '@inertiajs/react';

const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};
const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.13 } },
};

export default function ProductLayout({ products = [] }: { products?: Array<{ 
    id: number; slug: string; title: string; description: string; price: number; compare_at_price?: number; product_category?: { name: string }; images?: string[] }> }) {
    if (!products.length) return null;

    return (
        <section id="products" className="bg-[#f7f7f7] py-20 sm:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal className="text-center mb-16">
                    <p className="font-serif text-[10px] tracking-[0.3em] text-[#281b10]/50 uppercase mb-4">Take It Home</p>
                    <h2 className="font-serif text-4xl sm:text-5xl font-normal text-[#281b10]">
                        Shop & <em className="italic text-[#c9a07a]">Collect</em>
                    </h2>
                </Reveal>

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-3 gap-6"
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-80px' }}
                >
                    {products.map((product) => (
                        <motion.div
                            key={product.id}
                            variants={fadeUp}
                            className="bg-white rounded-2xl p-8 border border-[#281b10]/8 hover:border-[#c9a07a]/40 hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <Link href={`/products/${product.slug}`} className="block">
                                {product.images?.[0] ? (
                                    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-5">
                                        <img
                                            src={product.images[0]}
                                            alt={product.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#e8cbb5] to-[#c9a07a] flex items-center justify-center mb-5">
                                        <div className="w-5 h-5 rounded bg-[#281b10]/30" />
                                    </div>
                                )}
                                <span className="font-serif text-[9px] tracking-[0.25em] text-[#c9a07a] uppercase mb-3 block">
                                    {product.product_category?.name ?? 'Product'}
                                </span>
                                <h3 className="font-serif text-xl text-[#281b10] mb-2 group-hover:text-[#c9a07a] transition-colors">
                                    {product.title}
                                </h3>
                                <p className="font-serif text-sm text-[#281b10]/60 leading-relaxed mb-5">
                                    {stripHtml(product.description)}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="font-serif text-base font-semibold text-[#281b10]">
                                        KES {Number(product.price).toLocaleString()}
                                    </span>
                                    <span className="font-serif text-xs text-[#c9a07a] hover:text-[#281b10] transition-colors tracking-wide">
                                        View →
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}