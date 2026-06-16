import { ReactNode } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Bell, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import AppSidebarLayout from "@/layouts/app/app-sidebar-layout";

interface NotificationLayoutProps {
    children: ReactNode;
    breadcrumbs?: { title: string; href: string }[];
}

export default function NotificationLayout({ children, breadcrumbs = [] }: NotificationLayoutProps) {
    const { url } = usePage();
    const isSettings = url.includes('/settings');

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col flex-1 overflow-hidden h-full">
                {/* Tab bar */}
                <div className="flex shrink-0 items-center gap-1 border-b border-border px-6 bg-background">
                    <Link
                        href="/admin/notifications"
                        className={cn(
                            'relative flex items-center gap-2 px-1 py-3.5 text-sm font-medium transition-colors mr-4',
                            !isSettings
                                ? 'text-foreground'
                                : 'text-muted-foreground hover:text-foreground',
                        )}
                    >
                        <Bell className="h-4 w-4" />
                        Inbox
                        {!isSettings && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full bg-primary" />
                        )}
                    </Link>
                    <Link
                        href="/admin/notifications/settings"
                        className={cn(
                            'relative flex items-center gap-2 px-1 py-3.5 text-sm font-medium transition-colors',
                            isSettings
                                ? 'text-foreground'
                                : 'text-muted-foreground hover:text-foreground',
                        )}
                    >
                        <Settings className="h-4 w-4" />
                        Preferences
                        {isSettings && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full bg-primary" />
                        )}
                    </Link>
                </div>

                {/* Page content */}
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>
        </AppSidebarLayout>
    );
}