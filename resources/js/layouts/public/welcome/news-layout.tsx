// layouts/public/welcome/news-layout.tsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal } from '../components/reveal';
import { stripHtml } from '@/lib/stripHtml';

interface NewsItem {
    id: number;
    title: string;
    content: string;
    category?: string;
    image?: string;
    published_date: string;
    is_featured: boolean;
}

export default function NewsLayout({ featuredNews = [], latestNews = [] }: { featuredNews?: NewsItem[]; latestNews?: NewsItem[] }) {
    const [featuredIndex, setFeaturedIndex] = useState(0);
    const [latestStart, setLatestStart] = useState(0);

    // Auto carousel for featured news
    useEffect(() => {
        if (featuredNews.length <= 1) return;
        const interval = setInterval(() => {
            setFeaturedIndex((prev) => (prev + 1) % featuredNews.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [featuredNews.length]);

    if (!featuredNews.length && !latestNews.length) return null;

    const currentFeatured = featuredNews[featuredIndex];

    return (
        <section className="bg-[#f7f7f7] py-20 sm:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal className="text-center mb-16">
                    <p className="font-serif text-[10px] tracking-[0.3em] text-[#281b10]/50 uppercase mb-4">Latest Stories</p>
                    <h2 className="font-serif text-4xl sm:text-5xl font-normal text-[#281b10]">
                        News & <em className="italic text-[#c9a07a]">Updates</em>
                    </h2>
                </Reveal>

                {/* Featured News Carousel */}
                {featuredNews.length > 0 && (
                    <div className="mb-16 relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentFeatured.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-[#281b10]/8"
                            >
                                <div className="grid md:grid-cols-2 gap-6">
                                    {currentFeatured.image && (
                                        <div className="h-64 md:h-full overflow-hidden">
                                            <img
                                                src={`/storage/${currentFeatured.image}`}
                                                alt={currentFeatured.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6 md:p-8">
                                        <div className="flex items-center gap-3 text-sm text-[#281b10]/50 mb-4">
                                            <span>{new Date(currentFeatured.published_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                            {currentFeatured.category && (
                                                <>
                                                    <span className="w-1 h-1 rounded-full bg-[#281b10]/30" />
                                                    <span className="uppercase tracking-wider text-[10px]">{currentFeatured.category}</span>
                                                </>
                                            )}
                                        </div>
                                        <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#281b10] mb-4">
                                            {currentFeatured.title}
                                        </h3>
                                        <p className="font-serif text-[#281b10]/60 leading-relaxed mb-6">
                                            {stripHtml(currentFeatured.content).substring(0, 150)}...
                                        </p>
                                        <a
                                            href={`/news/${currentFeatured.id}`}
                                            className="inline-flex items-center gap-2 font-serif text-sm text-[#c9a07a] hover:text-[#281b10] transition-colors"
                                        >
                                            Continue reading →
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Dots indicator */}
                        {featuredNews.length > 1 && (
                            <div className="flex justify-center gap-2 mt-6">
                                {featuredNews.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setFeaturedIndex(idx)}
                                        className={`w-2 h-2 rounded-full transition-all ${idx === featuredIndex ? 'bg-[#c9a07a] w-4' : 'bg-[#281b10]/30'
                                            }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Latest News Grid */}
                {latestNews.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {latestNews.map((news) => (
                            <article key={news.id} className="bg-white rounded-xl overflow-hidden border border-[#281b10]/8 hover:shadow-md transition-shadow group">
                                {news.image && (
                                    <div className="h-48 overflow-hidden">
                                        <img
                                            src={`/storage/${news.image}`}
                                            alt={news.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                )}
                                <div className="p-5">
                                    <div className="flex items-center gap-2 text-xs text-[#281b10]/50 mb-3">
                                        <span>{new Date(news.published_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        {news.category && (
                                            <>
                                                <span className="w-1 h-1 rounded-full bg-[#281b10]/30" />
                                                <span className="uppercase tracking-wider">{news.category}</span>
                                            </>
                                        )}
                                    </div>
                                    <h3 className="font-serif text-lg font-normal text-[#281b10] mb-2 group-hover:text-[#c9a07a] transition-colors">
                                        {news.title}
                                    </h3>
                                    <p className="font-serif text-sm text-[#281b10]/60 leading-relaxed mb-4">
                                        {stripHtml(news.content).substring(0, 100)}...
                                    </p>
                                    <a
                                        href={`/news/${news.id}`}
                                        className="font-serif text-xs text-[#c9a07a] hover:text-[#281b10] transition-colors inline-flex items-center gap-1"
                                    >
                                        Read more →
                                    </a>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}