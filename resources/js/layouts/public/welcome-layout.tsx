import { usePage } from '@inertiajs/react';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import NavLayout from '@/layouts/public/nav-layout';
import FooterLayout from '@/layouts/public/footer-layout';
import HeroLayout from '@/layouts/public/welcome/hero-layout';
import PartnerLayout from '@/layouts/public/welcome/partner-layout';
import ServicesLayout from '@/layouts/public/welcome/services-layout';
import EventLayout from '@/layouts/public/welcome/event-layout';
import ProductLayout from '@/layouts/public/welcome/product-layout';
import FounderLayout from '@/layouts/public/welcome/founder-layout';
import TestimonialLayout from '@/layouts/public/welcome/testimonial-layout';
import FaqsLayout from '@/layouts/public/welcome/faqs-layouts';
import ContactLayout from '@/layouts/public/welcome/contact-layout';
import NewsLayout from '@/layouts/public/welcome/news-layout';

interface PageProps extends InertiaPageProps {
    auth: { user: any };
    banners: any[];
    faqs: any[];
    hero: any;
    partners: any[];
    services: any[];
    events: any[];
    products: any[];
    founder: any;
    testimonials: any[];
    news: {
        featured: any[];
        latest: any[];
    };
    contact: any;
}

export default function WelcomeLayout() {
    const { auth, banners, faqs, hero, partners, services, events, products, founder, testimonials, news, contact } = usePage<PageProps>().props;

    return (
        <div className="font-serif antialiased">
            <NavLayout user={auth.user} banners={banners} />
            <HeroLayout hero={hero} />
            <PartnerLayout partners={partners} />
            <ServicesLayout services={services} />
            <EventLayout events={events} />
            <ProductLayout products={products} />
            <FounderLayout founder={founder} />
            <TestimonialLayout testimonials={testimonials} />
            <FaqsLayout faqs={faqs} />
            <NewsLayout featuredNews={news.featured} latestNews={news.latest} />
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