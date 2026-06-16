import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { NotificationPanelProvider, useNotificationPanel } from '@/components/app-sidebar-notification';
import type { AppLayoutProps } from '@/types';
import ToastHandler from '@/components/toast-handler';

function AppSidebarLayoutInner({ children, breadcrumbs = [] }: AppLayoutProps) {
    const { panel } = useNotificationPanel();

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
            {panel}
            <ToastHandler />
        </AppShell>
    );
}

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <NotificationPanelProvider>
            <AppSidebarLayoutInner breadcrumbs={breadcrumbs}>
                {children}
            </AppSidebarLayoutInner>
        </NotificationPanelProvider>
    );
}