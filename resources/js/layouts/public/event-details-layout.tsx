import { usePage } from '@inertiajs/react';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import NavLayout from '@/layouts/public/nav-layout';
import FooterLayout from '@/layouts/public/footer-layout';

interface PageProps extends InertiaPageProps {
    banners: any;
    contact: any;
    services: any;
}

export default function EventDetailsLayout({ children }: { children: React.ReactNode }) {
    const { auth, banners, contact, services } = usePage<PageProps>().props;

    return (
        <div className="font-serif antialiased">
            <NavLayout user={auth.user} banners={banners} />
            <main className="pt-16 sm:pt-20 min-h-screen">
                {children}
            </main>
            <FooterLayout contact={contact} services={services} />
        </div>
    );
}