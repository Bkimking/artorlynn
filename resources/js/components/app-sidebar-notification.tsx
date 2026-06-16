import * as React from 'react';
import { X, Bell, Mail, Check, CheckCheck, Trash2, Circle, MessageSquare, Star, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { router, usePage } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';

// ─── Types ───────────────────────────────────────────────────────────────────

export type NotificationPanelTab = 'notifications' | 'mail';

interface DatabaseNotification {
    id: string;
    data: {
        type: string;
        label: string;
        payload: Record<string, any>;
    };
    read_at: string | null;
    created_at: string;
}

interface ContactSubmission {
    id: number;
    msg_id: string;
    name: string;
    email: string;
    service: string | null;
    message: string;
    status: 'unread' | 'read' | 'replied' | 'archived';
    created_at: string;
    replies: Array<{ id: number; direction: string; body: string; replied_at: string }>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getNotificationIcon(type: string) {
    switch (type) {
        case 'CONTACT_MESSAGE': return <MessageSquare className="h-3.5 w-3.5 text-blue-500" />;
        case 'NEW_REVIEW':      return <Star className="h-3.5 w-3.5 text-amber-500" />;
        case 'NEWS_SUBSCRIBED': return <UserPlus className="h-3.5 w-3.5 text-emerald-500" />;
        default:                return <Bell className="h-3.5 w-3.5 text-muted-foreground" />;
    }
}

function getInitials(name: string) {
    return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

function safeDistance(dateStr: string) {
    try {
        return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
    } catch {
        return '';
    }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function EmptyState({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground select-none">
            <div className="rounded-full border-2 border-dashed border-muted-foreground/25 p-5">
                <Icon className="h-8 w-8 opacity-40" />
            </div>
            <p className="text-sm font-medium">{label}</p>
        </div>
    );
}

function NotificationCard({
    item,
    onMarkRead,
}: {
    item: DatabaseNotification;
    onMarkRead: (id: string) => void;
}) {
    const isUnread = !item.read_at;

    return (
        <div
            className={cn(
                'group relative flex gap-3 rounded-lg px-3 py-3 transition-colors',
                isUnread
                    ? 'bg-primary/5 hover:bg-primary/8 dark:bg-primary/10 dark:hover:bg-primary/15'
                    : 'hover:bg-muted/40',
            )}
        >
            {isUnread && (
                <span className="absolute right-3 top-3.5">
                    <Circle className="h-2 w-2 fill-primary text-primary" />
                </span>
            )}

            {/* Icon avatar */}
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted border border-border">
                {getNotificationIcon(item.data.type)}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 pr-4">
                <p className="truncate text-sm font-semibold leading-tight">{item.data.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.data.type === 'CONTACT_MESSAGE' && item.data.payload?.name
                        ? `New inquiry from ${item.data.payload.name}${item.data.payload.service ? ` · ${item.data.payload.service}` : ''}`
                        : item.data.type === 'NEW_REVIEW' && item.data.payload?.name
                        ? `${item.data.payload.name} left a ${item.data.payload.rating}-star review`
                        : item.data.type === 'NEWS_SUBSCRIBED' && item.data.payload?.email
                        ? `${item.data.payload.email} joined your mailing list`
                        : item.data.label}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground/60">{safeDistance(item.created_at)}</p>
            </div>

            {/* Actions — shown on hover */}
            {isUnread && (
                <div className="absolute right-3 bottom-2.5 hidden gap-1 group-hover:flex">
                    <button
                        onClick={() => onMarkRead(item.id)}
                        className="rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                        title="Mark as read"
                    >
                        <Check className="h-3.5 w-3.5" />
                    </button>
                </div>
            )}
        </div>
    );
}

function MailCard({
    item,
    onMarkRead,
}: {
    item: ContactSubmission;
    onMarkRead: (id: number) => void;
}) {
    const isUnread = item.status === 'unread';
    const lastMsg = item.replies.length > 0
        ? item.replies[item.replies.length - 1].body
        : item.message;
    const preview = lastMsg.replace(/<[^>]*>/g, '').slice(0, 80);

    return (
        <div
            className={cn(
                'group relative flex gap-3 rounded-lg px-3 py-3 transition-colors cursor-pointer',
                isUnread
                    ? 'bg-blue-500/5 hover:bg-blue-500/10 dark:bg-blue-500/10 dark:hover:bg-blue-500/15'
                    : 'hover:bg-muted/40',
            )}
            onClick={() => router.visit('/admin/messages')}
        >
            {isUnread && (
                <span className="absolute right-3 top-3.5">
                    <Circle className="h-2 w-2 fill-blue-500 text-blue-500" />
                </span>
            )}

            {/* Initials avatar */}
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted border border-border text-xs font-semibold text-foreground">
                {getInitials(item.name)}
            </div>

            <div className="min-w-0 flex-1 pr-4">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                    <p className="truncate text-sm font-semibold leading-tight">{item.name}</p>
                </div>
                <p className="truncate text-xs font-medium text-foreground/70">
                    {item.service || item.email}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1 leading-relaxed">{preview}</p>
                <p className="mt-1 text-[11px] text-muted-foreground/60">{safeDistance(item.created_at)}</p>
            </div>

            {isUnread && (
                <div className="absolute right-3 bottom-2.5 hidden gap-1 group-hover:flex">
                    <button
                        onClick={(e) => { e.stopPropagation(); onMarkRead(item.id); }}
                        className="rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                        title="Mark as read"
                    >
                        <Check className="h-3.5 w-3.5" />
                    </button>
                </div>
            )}
        </div>
    );
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface NotificationPanelContextValue {
    isOpen: boolean;
    activeTab: NotificationPanelTab;
    open: (tab?: NotificationPanelTab) => void;
    close: () => void;
    toggle: (tab: NotificationPanelTab) => void;
    unreadNotifications: number;
    unreadMails: number;
    panel: React.ReactNode;
}

const NotificationPanelContext = React.createContext<NotificationPanelContextValue | null>(null);

export function useNotificationPanel() {
    const ctx = React.useContext(NotificationPanelContext);
    if (!ctx) throw new Error('useNotificationPanel must be used inside NotificationPanelProvider');
    return ctx;
}

export function NotificationPanelProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState<NotificationPanelTab>('notifications');

    // Pull live data from Inertia shared props
    const { props } = usePage<{
        auth: {
            notifications?: DatabaseNotification[];
            submissions?: ContactSubmission[];
        };
    }>();

    const notifications: DatabaseNotification[] = props.auth?.notifications ?? [];
    // Sort submissions by last activity: latest reply time, or original created_at
    const rawSubmissions: ContactSubmission[] = props.auth?.submissions ?? [];
    const submissions = [...rawSubmissions].sort((a, b) => {
        const aTime = a.replies.length > 0
            ? new Date(a.replies[a.replies.length - 1].replied_at).getTime()
            : new Date(a.created_at).getTime();
        const bTime = b.replies.length > 0
            ? new Date(b.replies[b.replies.length - 1].replied_at).getTime()
            : new Date(b.created_at).getTime();
        return bTime - aTime;
    });

    const unreadNotifications = notifications.filter(n => !n.read_at).length;
    const unreadMails = submissions.filter(s => s.status === 'unread').length;

    const open = (tab: NotificationPanelTab = 'notifications') => {
        setActiveTab(tab);
        setIsOpen(true);
    };
    const close = () => setIsOpen(false);
    const toggle = (tab: NotificationPanelTab) => {
        if (isOpen && activeTab === tab) close();
        else open(tab);
    };

    const handleMarkNotificationRead = (id: string) => {
        router.patch(`/admin/notifications/${id}/read`, {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleMarkAllNotificationsRead = () => {
        router.post('/admin/notifications/read-all', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleMarkMailRead = (id: number) => {
        router.patch(`/admin/messages/${id}/read`, {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const panel = (
        <AppSidebarNotification
            isOpen={isOpen}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onClose={close}
            notifications={notifications}
            submissions={submissions}
            onMarkNotificationRead={handleMarkNotificationRead}
            onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
            onMarkMailRead={handleMarkMailRead}
        />
    );

    return (
        <NotificationPanelContext.Provider value={{ isOpen, activeTab, open, close, toggle, unreadNotifications, unreadMails, panel }}>
            {children}
        </NotificationPanelContext.Provider>
    );
}

// ─── Main Panel (with the requested fix) ──────────────────────────────────────

interface AppSidebarNotificationProps {
    isOpen: boolean;
    activeTab: NotificationPanelTab;
    onTabChange: (tab: NotificationPanelTab) => void;
    onClose: () => void;
    notifications: DatabaseNotification[];
    submissions: ContactSubmission[];
    onMarkNotificationRead: (id: string) => void;
    onMarkAllNotificationsRead: () => void;
    onMarkMailRead: (id: number) => void;
}

export function AppSidebarNotification({
    isOpen,
    activeTab,
    onTabChange,
    onClose,
    notifications,
    submissions,
    onMarkNotificationRead,
    onMarkAllNotificationsRead,
    onMarkMailRead,
}: AppSidebarNotificationProps) {
    const unreadNotifications = notifications.filter(n => !n.read_at).length;
    const unreadMails = submissions.filter(s => s.status === 'unread').length;

    React.useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    return (
        <>
            {/* Mobile backdrop */}
            <div
                className={cn(
                    'fixed inset-0 z-40 bg-background/60 backdrop-blur-sm transition-opacity duration-300 md:hidden',
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
                )}
                onClick={onClose}
            />

            <aside
                className={cn(
                    'sticky top-0 flex flex-col h-screen shrink-0',
                    'transition-[width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
                    isOpen ? 'w-[320px] sm:w-[360px]' : 'w-0',
                    'overflow-hidden',
                    'border-l border-sidebar-border/50 bg-sidebar',
                )}
                aria-hidden={!isOpen}
            >
                {/* Header */}
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border/50 px-4 transition-[height] group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <h2 className="text-sm font-semibold tracking-tight">
                        {activeTab === 'notifications' ? 'Notifications' : 'Messages'}
                    </h2>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            title="Mark all as read"
                            onClick={activeTab === 'notifications' ? onMarkAllNotificationsRead : undefined}
                        >
                            <CheckCheck className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={onClose}
                            title="Close panel"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex shrink-0 border-b border-sidebar-border/50">
                    {(['notifications', 'mail'] as const).map((tab) => {
                        const isActive = activeTab === tab;
                        const count = tab === 'notifications' ? unreadNotifications : unreadMails;
                        return (
                            <button
                                key={tab}
                                onClick={() => onTabChange(tab)}
                                className={cn(
                                    'relative flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'text-foreground'
                                        : 'text-muted-foreground hover:text-foreground',
                                )}
                            >
                                {tab === 'notifications' ? <Bell className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                                <span>{tab === 'notifications' ? 'Notifications' : 'Mail'}</span>
                                {count > 0 && (
                                    <Badge
                                        className={cn(
                                            'h-4 min-w-4 rounded-full px-1 text-[10px] font-bold leading-none',
                                            tab === 'notifications'
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-blue-500 text-white',
                                        )}
                                    >
                                        {count}
                                    </Badge>
                                )}
                                {isActive && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full bg-primary" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <ScrollArea className="flex-1">
                    <div className="p-2">
                        {activeTab === 'notifications' ? (
                            // Notifications tab (unchanged)
                            notifications.length === 0 ? (
                                <EmptyState icon={Bell} label="You're all caught up!" />
                            ) : (
                                <div className="space-y-0.5">
                                    {notifications.some(n => !n.read_at) && (
                                        <>
                                            <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                                                New
                                            </p>
                                            {notifications.filter(n => !n.read_at).map(item => (
                                                <NotificationCard
                                                    key={item.id}
                                                    item={item}
                                                    onMarkRead={onMarkNotificationRead}
                                                />
                                            ))}
                                        </>
                                    )}
                                    {notifications.some(n => n.read_at) && (
                                        <>
                                            <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                                                Earlier
                                            </p>
                                            {notifications.filter(n => n.read_at).map(item => (
                                                <NotificationCard
                                                    key={item.id}
                                                    item={item}
                                                    onMarkRead={onMarkNotificationRead}
                                                />
                                            ))}
                                        </>
                                    )}
                                </div>
                            )
                        ) : (
                            // ── MAIL TAB: show top 5 most recent messages (by last activity) ──
                            (() => {
                                // submissions is already sorted by last activity desc
                                const displayItems = submissions.slice(0, 5);
                                if (displayItems.length === 0) {
                                    return <EmptyState icon={Mail} label="No messages yet" />;
                                }
                                return (
                                    <div className="space-y-0.5">
                                        {displayItems.map(item => (
                                            <MailCard
                                                key={item.id}
                                                item={item}
                                                onMarkRead={onMarkMailRead}
                                            />
                                        ))}
                                    </div>
                                );
                            })()
                        )}
                    </div>
                </ScrollArea>

                {/* Footer */}
                <div className="shrink-0 border-t border-sidebar-border/50 p-3">
                    <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                        <a href={activeTab === 'notifications' ? '/admin/notifications' : '/admin/messages'}>
                            View all {activeTab === 'notifications' ? 'notifications' : 'messages'}
                        </a>
                    </Button>
                </div>
            </aside>
        </>
    );
}