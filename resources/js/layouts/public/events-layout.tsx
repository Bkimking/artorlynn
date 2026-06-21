import { usePage } from '@inertiajs/react';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import NavLayout from '@/layouts/public/nav-layout';
import FooterLayout from '@/layouts/public/footer-layout';
import EventLayout from '@/layouts/public/welcome/event-layout';

interface PageProps extends InertiaPageProps {
    banners: any;
    contact: any;
    services: any;
    events: any[];
}

export default function EventsLayout({ children }: { children?: React.ReactNode }) {
    const { auth, banners, contact, services, events } = usePage<PageProps>().props;

    return (
        <div className="font-serif antialiased">
            <NavLayout user={auth.user} banners={banners} />
            <main className="pt-16 sm:pt-20">
                {children || <EventLayout events={events} />}
            </main>
            <FooterLayout contact={contact} services={services} />
        </div>
    );
}