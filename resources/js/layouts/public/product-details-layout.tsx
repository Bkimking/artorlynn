import { usePage } from '@inertiajs/react';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import NavLayout from '@/layouts/public/nav-layout';
import FooterLayout from '@/layouts/public/footer-layout';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Reveal } from './components/Reveal';
import { format } from 'date-fns';
import { stripHtml } from '@/lib/stripHtml';

interface PageProps extends InertiaPageProps {
    banners: any;
    contact: any;
    services: any;
}

export default function ProductDetailsLayout({ children }: { children: React.ReactNode }) {
    const { auth, banners, contact, services } = usePage<PageProps>().props;

    return (
        <div className="font-serif antialiased">
            <NavLayout user={auth.user} banners={banners} />
            
            <FooterLayout contact={contact} services={services} />
        </div>
    );
}