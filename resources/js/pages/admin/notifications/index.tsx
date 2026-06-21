import { Head, router } from "@inertiajs/react";
import { dashboard } from '@/routes';
import { formatDistanceToNow } from 'date-fns';
import { Bell, BellOff, MessageSquare, Star, UserPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import notifications from "@/routes/notifications";
import NotificationLayout from "@/layouts/notifications/layouts";

interface Notification {
    id: string;
    data: {
        type: string;
        label: string;
        payload: any;
    };
    read_at: string | null;
    created_at: string;
}

function safeDistance(dateStr: string) {
    try {
        return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
    } catch {
        return '';
    }
}

function getIcon(type: string) {
    switch (type) {
        case 'CONTACT_MESSAGE': return <MessageSquare className="size-4 text-blue-500" />;
        case 'NEW_REVIEW':      return <Star className="size-4 text-amber-500" />;
        case 'NEWS_SUBSCRIBED': return <UserPlus className="size-4 text-emerald-500" />;
        default:                return <Bell className="size-4 text-muted-foreground" />;
    }
}

const breadcrumbs = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Notifications', href: '#' },
];

export default function Notifications({ notifications: notifPage }: { notifications: { data: Notification[], links: any } }) {
    const markAsRead = (id: string) => {
        router.post(notifications.read(id).url, {}, { preserveScroll: true });
    };

    const markAllAsRead = () => {
        router.post(notifications.readAll().url, {}, { preserveScroll: true });
    };

    const unread = notifPage.data.filter(n => !n.read_at);
    const read   = notifPage.data.filter(n => n.read_at);

    return (
        <>
            <Head title="Notifications" />

            <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto w-full">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight">Inbox</h2>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {unread.length > 0 ? `${unread.length} unread notification${unread.length !== 1 ? 's' : ''}` : 'All caught up'}
                        </p>
                    </div>
                    {unread.length > 0 && (
                        <Button variant="outline" size="sm" onClick={markAllAsRead} className="h-8 px-3 text-xs">
                            Mark all as read
                        </Button>
                    )}
                </div>

                {notifPage.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 rounded-xl border-2 border-dashed border-muted bg-muted/20">
                        <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
                            <BellOff className="size-5 text-muted-foreground" />
                        </div>
                        <p className="font-medium text-foreground">All caught up!</p>
                        <p className="text-sm text-muted-foreground mt-1">No notifications at the moment.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {/* ── Unread ── */}
                        {unread.length > 0 && (
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 mb-2">
                                    New
                                </p>
                                <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
                                    {unread.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className="group relative flex items-start gap-4 p-4 bg-primary/5 hover:bg-primary/8 transition-colors"
                                        >
                                            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-background border border-border shadow-sm">
                                                {getIcon(notification.data.type)}
                                            </div>

                                            <div className="flex flex-1 flex-col gap-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold">{notification.data.label}</span>
                                                        <Badge className="h-1.5 w-1.5 rounded-full p-0 bg-primary shrink-0" />
                                                    </div>
                                                    <time className="text-[11px] text-muted-foreground shrink-0">
                                                        {safeDistance(notification.created_at)}
                                                    </time>
                                                </div>

                                                <div className="text-sm text-muted-foreground">
                                                    {notification.data.type === 'CONTACT_MESSAGE' && (
                                                        <span>New inquiry from <strong className="text-foreground">{notification.data.payload?.name}</strong>{notification.data.payload?.service && <> regarding <em>{notification.data.payload.service}</em></>}.</span>
                                                    )}
                                                    {notification.data.type === 'NEW_REVIEW' && (
                                                        <span><strong className="text-foreground">{notification.data.payload?.name}</strong> left a {notification.data.payload?.rating}-star review.</span>
                                                    )}
                                                    {notification.data.type === 'NEWS_SUBSCRIBED' && (
                                                        <span><strong className="text-foreground">{notification.data.payload?.email}</strong> joined your mailing list.</span>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={() => markAsRead(notification.id)}
                                                    className="mt-1 text-[11px] font-semibold text-primary hover:underline self-start"
                                                >
                                                    Dismiss
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Read ── */}
                        {read.length > 0 && (
                            <div>
                                {unread.length > 0 && (
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 mb-2">
                                        Earlier
                                    </p>
                                )}
                                <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
                                    {read.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className="group relative flex items-start gap-4 p-4 hover:bg-muted/40 transition-colors"
                                        >
                                            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-muted border border-border">
                                                {getIcon(notification.data.type)}
                                            </div>

                                            <div className="flex flex-1 flex-col gap-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-sm font-medium text-muted-foreground">{notification.data.label}</span>
                                                    <time className="text-[11px] text-muted-foreground/60 shrink-0">
                                                        {safeDistance(notification.created_at)}
                                                    </time>
                                                </div>

                                                <div className="text-sm text-muted-foreground/70">
                                                    {notification.data.type === 'CONTACT_MESSAGE' && (
                                                        <span>New inquiry from <strong>{notification.data.payload?.name}</strong>{notification.data.payload?.service && <> regarding <em>{notification.data.payload.service}</em></>}.</span>
                                                    )}
                                                    {notification.data.type === 'NEW_REVIEW' && (
                                                        <span><strong>{notification.data.payload?.name}</strong> left a {notification.data.payload?.rating}-star review.</span>
                                                    )}
                                                    {notification.data.type === 'NEWS_SUBSCRIBED' && (
                                                        <span><strong>{notification.data.payload?.email}</strong> joined your mailing list.</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

Notifications.layout  = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Notifications', href: '/admin/notifications' },
    ],
};