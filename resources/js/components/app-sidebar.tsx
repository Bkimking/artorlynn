import { Link } from '@inertiajs/react';
import { Bell, LayoutGrid, Logs, Calendar, Brain, Box, Building2, MessageCircleMore, Mail } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';

import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Products',
        href: '/admin/products',
        icon: Box,
    },
    {
        title: 'Events',
        href: '/admin/events',
        icon: Calendar,
    },
    {
        title: 'Notifications',
        href: '/admin/notifications',
        icon: Bell,
    },
    {
        title: 'Messages',
        href: '/admin/messages',
        icon: Mail,
    },
    {
        title: 'Site',
        href: '#',
        icon: Building2,
        items: [
            { title: 'Banners',      href: '/admin/site/banners' },
            { title: 'Contact Info', href: '/admin/site/contacts' },
            { title: 'FAQs',         href: '/admin/site/faqs' },
            { title: 'Gallerys',     href: '/admin/site/gallerys' },
            { title: 'Hero Section', href: '/admin/site/hero' },
            { title: 'News',         href: '/admin/site/news' },
            { title: 'Partners',     href: '/admin/site/partners' },
            { title: 'Reviews',      href: '/admin/site/reviews' },
            { title: 'Founder',      href: '/admin/site/founder' },
            { title: 'Services',     href: '/admin/site/services' },
        ],
    },
    {
        title: 'Logs',
        href: '/admin/logs',
        icon: Logs,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Project Brain',
        href: '/_laravel-brain',
        icon: Brain,
    },
    {
        title: 'Support',
        href: '#',
        icon: MessageCircleMore,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}