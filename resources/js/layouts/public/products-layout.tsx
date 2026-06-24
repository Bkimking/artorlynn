import { usePage } from '@inertiajs/react';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import NavLayout from '@/layouts/public/nav-layout';
import FooterLayout from '@/layouts/public/footer-layout';
import ProductLayout from '@/layouts/public/welcome/product-layout';
import ContactLayout from '@/layouts/public/welcome/contact-layout';

interface PageProps extends InertiaPageProps {
    banners: any;
    contact: any;
    services: any;
    products: any[];
}

export default function ProductsLayout({ children }: { children?: React.ReactNode }) {
    const { auth, banners, contact, services, products } = usePage<PageProps>().props;

    return (
        <div className="font-serif antialiased">
            <NavLayout user={auth.user} banners={banners} />
            <main className="pt-16 sm:pt-20">
                {children || <ProductLayout products={products} />}
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