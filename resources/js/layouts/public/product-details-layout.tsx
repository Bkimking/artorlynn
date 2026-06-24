import { usePage } from '@inertiajs/react';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import NavLayout from '@/layouts/public/nav-layout';
import FooterLayout from '@/layouts/public/footer-layout';
import ContactLayout from '@/layouts/public/welcome/contact-layout';

interface PageProps extends InertiaPageProps {
    banners: any;
    contact: any;
    services: any;
}

export default function ProductDetailsLayout({
    children,
    prefillService,
    prefillMessage,
}: {
    children: React.ReactNode;
    prefillService?: string;
    prefillMessage?: string;
}) {
    const { auth, banners, contact, services } = usePage<PageProps>().props;

    return (
        <div className="font-serif antialiased">
            <NavLayout user={auth.user} banners={banners} />
            <main className="pt-16 sm:pt-20 min-h-screen">
                {children}
            </main>
            <ContactLayout
                contact={contact}
                services={services}
                prefillService={prefillService}
                prefillMessage={prefillMessage}
            />
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