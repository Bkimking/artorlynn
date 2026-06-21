import { Head, Link } from '@inertiajs/react';
import NewsDetailsLayout from '@/layouts/public/news-details-layout';
import { stripHtml } from '@/lib/stripHtml';

export default function NewsShow({ news }: { news: any }) {
    return (
        <NewsDetailsLayout>
            <Head title={`${news.title} — Art of Lynn`} />
            <article className="bg-[#f7f7f7] py-12 sm:py-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    <Link
                        href="/news"
                        className="inline-flex items-center gap-2 text-[#281b10]/60 hover:text-[#c9a07a] font-serif text-sm mb-8 transition-colors"
                    >
                        ← Back to news
                    </Link>

                    {news.image && (
                        <div className="rounded-2xl overflow-hidden mb-8 shadow-lg">
                            <img src={news.image} alt={news.title} className="w-full h-64 sm:h-80 object-cover" />
                        </div>
                    )}

                    <div className="flex items-center gap-3 text-sm text-[#281b10]/50 mb-4">
                        <span>{new Date(news.published_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        {news.category && (
                            <>
                                <span className="w-1 h-1 rounded-full bg-[#281b10]/30" />
                                <span className="uppercase tracking-wider text-xs">{news.category}</span>
                            </>
                        )}
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#281b10] leading-tight mb-6">
                        {news.title}
                    </h1>

                    <div className="prose prose-lg max-w-none font-serif text-[#281b10]/80 leading-relaxed">
                        {stripHtml(news.content)}
                    </div>
                </div>
            </article>
        </NewsDetailsLayout>
    );
}