import { Head, Link } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn, formatDate } from '@/lib/utils';
import { 
    Box, 
    Calendar, 
    Bell, 
    Mail, 
    History, 
    FileText, 
    Users, 
    Image, 
    MessageSquare, 
    Star, 
    Layout, 
    Briefcase,
    ShieldCheck,
    ChevronRight,
    Search
} from 'lucide-react';

interface Props {
    stats: {
        products: number;
        events: number;
    };
    unread: {
        notifications: any[];
        notifications_count: number;
        messages: any[];
        messages_count: number;
    };
    site: {
        banners: any[];
        contacts: any[];
        faqs: any[];
        hero: any;
        galleries: any[];
        news: any[];
        partners: any[];
        reviews: any[];
        services: any[];
        founder: any;
    };
    activity_logs: any[];
}

export default function Dashboard({ stats, unread, site, activity_logs }: Props) {
    return (
        <>
            <Head title="Dashboard Overview" />
            <div className="flex flex-col gap-6 p-6 overflow-y-auto">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">Admin Overview</h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                       <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                       System Operational
                    </div>
                </div>

                {/* ── Top Stats Row ─────────────────────────────────── */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="hover:border-primary/20 transition-all shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                            <Box className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.products}</div>
                            <p className="text-xs text-muted-foreground mt-1">Live in store</p>
                        </CardContent>
                    </Card>
                    <Card className="hover:border-primary/20 transition-all shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.events}</div>
                            <p className="text-xs text-muted-foreground mt-1">Scheduled events</p>
                        </CardContent>
                    </Card>
                    <Card className="hover:border-blue-500/20 transition-all shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Messages</CardTitle>
                            <Mail className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-500">{unread.messages_count}</div>
                            <p className="text-xs text-muted-foreground mt-1">Unread inquiries</p>
                        </CardContent>
                    </Card>
                    <Card className="hover:border-amber-500/20 transition-all shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
                            <Bell className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-500">{unread.notifications_count}</div>
                            <p className="text-xs text-muted-foreground mt-1">Recent unread</p>
                        </CardContent>
                    </Card>
                </div>

                {/* ── Inbox & Site Overview Row ────────────────────── */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Communications Hub */}
                    <Card className="h-fit">
                        <CardHeader className="border-b bg-muted/5 py-4 px-6 flex flex-row items-center justify-between">
                            <CardTitle className="text-base font-semibold">Communications Hub</CardTitle>
                            <Badge variant="outline" className="font-normal">Real-time sync</Badge>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Tabs defaultValue="messages" className="w-full">
                                <TabsList className="bg-transparent border-b rounded-none w-full justify-start h-auto p-0 px-6">
                                    <TabsTrigger value="messages" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3 px-4 text-sm">
                                        Messages {unread.messages_count > 0 && `(${unread.messages_count})`}
                                    </TabsTrigger>
                                    <TabsTrigger value="alerts" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3 px-4 text-sm">
                                        Alerts {unread.notifications_count > 0 && `(${unread.notifications_count})`}
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="messages" className="m-0 p-0">
                                    <div className="divide-y">
                                        {unread.messages.length > 0 ? unread.messages.map(msg => (
                                            <Link key={msg.id} href={`/admin/messages/${msg.id}`} className="block p-4 hover:bg-muted/30 transition-colors">
                                                <div className="flex justify-between items-start gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-sm truncate">{msg.name}</p>
                                                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{msg.message}</p>
                                                    </div>
                                                    <time className="text-[10px] uppercase text-muted-foreground whitespace-nowrap">{formatDate(msg.created_at)}</time>
                                                </div>
                                            </Link>
                                        )) : (
                                            <div className="p-12 text-center text-muted-foreground text-sm flex flex-col items-center gap-2">
                                                <Mail className="h-8 w-8 opacity-20" />
                                                Inbox is empty
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3 border-t bg-muted/5 text-center">
                                        <Link href="/admin/messages" className="text-xs font-semibold text-primary hover:underline inline-flex items-center">
                                            View all messages <ChevronRight className="h-3 w-3 ml-0.5" />
                                        </Link>
                                    </div>
                                </TabsContent>
                                <TabsContent value="alerts" className="m-0 p-0">
                                    <div className="divide-y">
                                        {unread.notifications.length > 0 ? unread.notifications.map(n => (
                                            <div key={n.id} className="p-4 hover:bg-muted/30 transition-colors">
                                                <div className="flex gap-3">
                                                    <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                                                    <p className="text-sm leading-tight">{n.data?.label || 'New Notification'}</p>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="p-12 text-center text-muted-foreground text-sm flex flex-col items-center gap-2">
                                                <Bell className="h-8 w-8 opacity-20" />
                                                No unread alerts
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3 border-t bg-muted/5 text-center">
                                        <Link href="/admin/notifications" className="text-xs font-semibold text-primary hover:underline inline-flex items-center">
                                            Manage center <ChevronRight className="h-3 w-3 ml-0.5" />
                                        </Link>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>

                    {/* Timeline Activity */}
                    <Card className="h-fit">
                        <CardHeader className="border-b bg-muted/5 py-4 px-6">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <History className="h-4 w-4" /> Trace History
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 max-h-[440px] overflow-y-auto">
                            <div className="p-6 relative space-y-6 before:absolute before:left-[31px] before:top-8 before:h-[calc(100%-60px)] before:w-px before:bg-border">
                                {activity_logs.map(log => (
                                    <div key={log.id} className="flex gap-4 relative z-10">
                                        <div className={cn(
                                            "h-4 w-4 mt-1.5 rounded-full border-2 bg-background shrink-0",
                                            log.description.includes('Created') ? "border-emerald-500" : 
                                            log.description.includes('Deleted') ? "border-red-500" : "border-primary"
                                        )} />
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">{log.description}</p>
                                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                                <span className="font-semibold text-foreground/70">{log.causer?.name || 'System'}</span>
                                                <span>•</span>
                                                <span>{formatDate(log.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ── Site Sections Header ─────────────────────────── */}
                <div className="mt-4 flex items-center justify-between border-b pb-2">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Layout className="h-5 w-5 text-primary" /> Site Content Snapshots
                    </h2>
                    <Badge variant="secondary">Global Management</Badge>
                </div>

                {/* ── Site Data Tables Grid ────────────────────────── */}
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                    {/* Banners */}
                    <Card className="overflow-hidden border-sidebar-border/50">
                        <CardHeader className="bg-muted/10 py-3 px-4 border-b">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Image className="h-3.5 w-3.5" /> Banners
                                </CardTitle>
                                <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-bold uppercase", site.banners.length > 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground")}>
                                    {site.banners.length > 0 ? 'Live' : 'Empty'}
                                </span>
                            </div>
                        </CardHeader>
                        <Table>
                            <TableBody>
                                {site.banners.map(b => (
                                    <TableRow key={b.id} className="hover:bg-transparent">
                                        <TableCell className="font-semibold">{b.title}</TableCell>
                                        <TableCell className="text-right"><ChevronRight className="h-4 w-4 ml-auto opacity-30" /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>

                    {/* News */}
                    <Card className="overflow-hidden border-sidebar-border/50">
                        <CardHeader className="bg-muted/10 py-3 px-4 border-b">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <FileText className="h-3.5 w-3.5" /> Recent News
                                </CardTitle>
                                <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-bold uppercase", site.news.length > 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground")}>
                                    {site.news.length > 0 ? 'Active' : 'Offline'}
                                </span>
                            </div>
                        </CardHeader>
                        <Table>
                            <TableBody>
                                {site.news.map(n => (
                                    <TableRow key={n.id} className="hover:bg-transparent">
                                        <TableCell className="font-semibold line-clamp-1">{n.title}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground text-right">{formatDate(n.created_at)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>

                    {/* Reviews */}
                    <Card className="overflow-hidden border-sidebar-border/50">
                        <CardHeader className="bg-muted/10 py-3 px-4 border-b">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Star className="h-3.5 w-3.5" /> Top Reviews
                                </CardTitle>
                                <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-bold uppercase", site.reviews.length > 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground")}>
                                    {site.reviews.length > 0 ? 'Social Proof' : 'None'}
                                </span>
                            </div>
                        </CardHeader>
                        <Table>
                            <TableBody>
                                {site.reviews.map(r => (
                                    <TableRow key={r.id} className="hover:bg-transparent">
                                        <TableCell className="font-semibold">{r.name}</TableCell>
                                        <TableCell className="text-amber-500 font-bold text-right text-xs">★ {r.rating}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>

                    {/* Partners */}
                    <Card className="overflow-hidden border-sidebar-border/50">
                        <CardHeader className="bg-muted/10 py-3 px-4 border-b">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Users className="h-3.5 w-3.5" /> Partners
                                </CardTitle>
                                <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-bold uppercase", site.partners.length > 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground")}>
                                    {site.partners.length > 0 ? 'Network' : 'Add'}
                                </span>
                            </div>
                        </CardHeader>
                        <Table>
                            <TableBody>
                                {site.partners.map(p => (
                                    <TableRow key={p.id} className="hover:bg-transparent">
                                        <TableCell className="font-semibold">{p.name}</TableCell>
                                        <TableCell className="text-right text-xs text-muted-foreground capitalize">{p.type || 'Affiliate'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>

                    {/* Services */}
                    <Card className="overflow-hidden border-sidebar-border/50">
                        <CardHeader className="bg-muted/10 py-3 px-4 border-b">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Briefcase className="h-3.5 w-3.5" /> Services
                                </CardTitle>
                                <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-bold uppercase", site.services.length > 0 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                                    {site.services.length > 0 ? 'Offerings' : 'Setup'}
                                </span>
                            </div>
                        </CardHeader>
                        <Table>
                            <TableBody>
                                {site.services.map(s => (
                                    <TableRow key={s.id} className="hover:bg-transparent">
                                        <TableCell className="font-semibold">{s.title}</TableCell>
                                        <TableCell className="text-right"><ChevronRight className="h-4 w-4 ml-auto opacity-30" /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>

                    {/* FAQs */}
                    <Card className="overflow-hidden border-sidebar-border/50">
                        <CardHeader className="bg-muted/10 py-3 px-4 border-b">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <MessageSquare className="h-3.5 w-3.5" /> FAQs
                                </CardTitle>
                                <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-bold uppercase", site.faqs.length > 0 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                                    Help Center
                                </span>
                            </div>
                        </CardHeader>
                        <Table>
                            <TableBody>
                                {site.faqs.map(f => (
                                    <TableRow key={f.id} className="hover:bg-transparent">
                                        <TableCell className="font-semibold line-clamp-1">{f.question}</TableCell>
                                        <TableCell className="text-right"><ChevronRight className="h-4 w-4 ml-auto opacity-30" /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>

                    {/* Hero & Founder (One Row with Two Small Tables) */}
                    <Card className="overflow-hidden border-sidebar-border/50 md:col-span-2">
                        <div className="grid grid-cols-1 sm:grid-cols-3 divide-x divide-sidebar-border">
                            <div className="p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Hero Section</CardTitle>
                                    {site.hero ? <Badge variant="outline" className="bg-emerald-500/5 text-emerald-500 text-[9px] h-4">ENABLED</Badge> : <Badge variant="outline" className="text-muted-foreground text-[9px] h-4">OFF</Badge>}
                                </div>
                                {site.hero ? (
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold">{site.hero.title}</p>
                                        <p className="text-xs text-muted-foreground line-clamp-2">{site.hero.subtitle}</p>
                                    </div>
                                ) : <p className="text-xs text-muted-foreground italic">No hero section defined</p>}
                            </div>
                            <div className="p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Founder Info</CardTitle>
                                    {site.founder ? <Badge variant="outline" className="bg-emerald-500/5 text-emerald-500 text-[9px] h-4">ENABLED</Badge> : <Badge variant="outline" className="text-muted-foreground text-[9px] h-4">OFF</Badge>}
                                </div>
                                {site.founder ? (
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold">{site.founder.name}</p>
                                        <p className="text-xs text-muted-foreground">{site.founder.title}</p>
                                    </div>
                                ) : <p className="text-xs text-muted-foreground italic">No founder info defined</p>}
                            </div>
                            <div className="p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Contact Config</CardTitle>
                                    <Badge variant="outline" className="bg-primary/5 text-primary text-[9px] h-4">{site.contacts.length} POINTS</Badge>
                                </div>
                                <div className="space-y-2">
                                    {site.contacts.map(c => (
                                        <div key={c.id} className="text-xs flex items-center justify-between">
                                            <span className="font-medium text-muted-foreground">{c.type}:</span>
                                            <span className="font-bold">{c.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
