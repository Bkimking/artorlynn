import { usePage } from '@inertiajs/react';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import NavLayout from '@/layouts/public/nav-layout';
import FooterLayout from '@/layouts/public/footer-layout';
import ContactLayout from '@/layouts/public/welcome/contact-layout';
import { Link } from '@inertiajs/react';
import { stripHtml } from '@/lib/stripHtml';

interface PageProps extends InertiaPageProps {
    banners: any;
    contact: any;
    services: any;
    news: any[];
}

export default function NewsIndexLayout({ children }: { children?: React.ReactNode }) {
    const { auth, banners, contact, services, news } = usePage<PageProps>().props;

    return (
        <div className="font-serif antialiased">
            <NavLayout user={auth.user} banners={banners} />
            <main className="pt-16 sm:pt-20 bg-[#f7f7f7] min-h-screen">
                {children || (
                    <section className="py-12 sm:py-20">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h1 className="text-3xl sm:text-4xl font-serif text-[#281b10] text-center mb-2">
                                Latest <em className="italic text-[#c9a07a]">News</em>
                            </h1>
                            <p className="text-[#281b10]/60 text-center font-serif mb-10">
                                Stories from the studio and beyond.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {news.map((item) => (
                                    <article key={item.id} className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow">
                                        {item.image && (
                                            <div className="h-48 overflow-hidden">
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                            </div>
                                        )}
                                        <div className="p-5">
                                            <div className="text-xs text-[#281b10]/50 mb-2">
                                                {new Date(item.published_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                            <h3 className="font-serif text-xl text-[#281b10] mb-2 hover:text-[#c9a07a] transition-colors">
                                                <Link href={`/news/${item.id}`}>{item.title}</Link>
                                            </h3>
                                            <p className="font-serif text-sm text-[#281b10]/60 leading-relaxed mb-4">
                                                {stripHtml(item.content).substring(0, 120)}...
                                            </p>
                                            <Link href={`/news/${item.id}`} className="font-serif text-sm text-[#c9a07a] hover:text-[#281b10] transition-colors">
                                                Read more →
                                            </Link>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>
            <ContactLayout contact={contact} services={services} />
            <FooterLayout contact={contact} services={services} />
            <style>{`
                html { scroll-behavior: smooth; }
                ::selection { background: rgba(232,203,181,0.3); color: #281b10; }
                ::-webkit-scrollbar { width: 5px; }
                ::-webkit-scrollbar-track { background: #0d0805; }
                ::-webkit-scrollbar-thumb { background: rgba(232,203,181,0.25); border-radius: 3px; }
            `}</style>
        </div>
    );
}