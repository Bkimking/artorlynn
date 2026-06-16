import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { 
    Search, Settings2, Eye, RotateCcw, Calendar, User as UserIcon, Tag, Clock, 
    Download, Activity, Layers, CheckSquare, Square, FilterX, RefreshCw
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnalyticsLayout } from '@/components/logs-analytics-layout';

interface LogItem {
    id: number;
    log_name: string;
    description: string;
    subject_type: string | null;
    subject_full_type: string | null;
    subject_id: string | number | null;
    subject_name: string;
    event: string;
    causer: {
        id: number;
        name: string;
        avatar: string;
    } | null;
    properties: any;
    old_values: any;
    new_values: any;
    created_at: string;
}

interface LogsPageProps {
    logs: {
        data: LogItem[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
    users: { id: number; name: string }[];
    logNames: string[];
    subjectTypes: { full: string; short: string }[];
    metrics: any;
    filters: {
        search: string | null;
        event_type: string[] | null;
        causer_id: string | null;
        subject_type: string | null;
        log_name: string | null;
        date_range: string | null;
        start_date: string | null;
        end_date: string | null;
    };
}

export default function LogsIndex({ logs, users, logNames, subjectTypes, metrics, filters }: LogsPageProps) {
    const [selectedLog, setSelectedLog] = useState<LogItem | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);

    // Active Tab (Table, Timeline, Analytics)
    const [activeTab, setActiveTab] = useState<'table' | 'timeline' | 'analytics'>('table');

    // Filter states
    const [search, setSearch] = useState(filters.search || '');
    const [eventTypes, setEventTypes] = useState<string[]>(filters.event_type || []);
    const [causerId, setCauserId] = useState(filters.causer_id || '');
    const [subjectType, setSubjectType] = useState(filters.subject_type || '');
    const [logName, setLogName] = useState(filters.log_name || '');
    const [dateRange, setDateRange] = useState(filters.date_range || 'all');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');

    const toggleEventType = (type: string) => {
        if (eventTypes.includes(type)) {
            setEventTypes(eventTypes.filter(t => t !== type));
        } else {
            setEventTypes([...eventTypes, type]);
        }
    };

    const handleApplyFilters = () => {
        setSheetOpen(false);
        router.get(
            '/logs',
            {
                search,
                event_type: eventTypes,
                causer_id: causerId,
                subject_type: subjectType,
                log_name: logName,
                date_range: dateRange,
                start_date: startDate,
                end_date: endDate,
            },
            {
                preserveState: true,
                replace: true,
                onBefore: () => {
                    // Force the active tab if we are going to a filtered result
                    // but we usually want to stay on the current tab
                }
            }
        );
    };

    const handleResetFilters = () => {
        setSearch('');
        setEventTypes([]);
        setCauserId('');
        setSubjectType('');
        setLogName('');
        setDateRange('all');
        setStartDate('');
        setEndDate('');
        setSheetOpen(false);

        router.get('/logs', {}, { replace: true });
    };

    const handleExport = () => {
        const csvContent = "data:text/csv;charset=utf-8," 
            + ["ID,Event,Description,Subject,User,Date"].join(",") + "\n"
            + logs.data.map(log => [
                log.id,
                log.event,
                `"${log.description.replace(/"/g, '""')}"`,
                log.subject_type ? `${log.subject_type} #${log.subject_id}` : 'N/A',
                log.causer ? log.causer.name : 'System',
                log.created_at
            ].join(",")).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `portal_activity_logs_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getEventBadge = (event: string) => {
        switch (event.toLowerCase()) {
            case 'created':
                return <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900 font-medium capitalize">created</Badge>;
            case 'updated':
                return <Badge className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900 font-medium capitalize">updated</Badge>;
            case 'deleted':
                return <Badge className="bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-50 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900 font-medium capitalize">deleted</Badge>;
            case 'login':
                return <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-50 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900 font-medium capitalize">login</Badge>;
            case 'logout':
                return <Badge className="bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 font-medium capitalize">logout</Badge>;
            case 'failed_login':
                return <Badge className="bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-50 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900 font-medium capitalize">failed login</Badge>;
            default:
                return <Badge className="bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-50 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900 font-medium capitalize">{event.replace('_', ' ')}</Badge>;
        }
    };

    return (
        <>
            <Head title="Activity Logs" />

            <div className="flex flex-col gap-6 p-6 md:p-8 bg-background min-h-screen">
                {/* Upper Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Activity Log</h1>
                        <p className="text-muted-foreground text-sm">Monitor and analyze all system activities with enterprise metrics</p>
                    </div>

                    {/* Actions and Views Toggles */}
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" onClick={handleExport} className="flex items-center gap-2 h-9 px-3">
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Export CSV</span>
                        </Button>

                        {/* View Mode Tabs */}
                        <div className="flex bg-muted p-1 rounded-lg border border-border h-9">
                            <button 
                                onClick={() => setActiveTab('table')}
                                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${activeTab === 'table' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Table
                            </button>
                            <button 
                                onClick={() => setActiveTab('timeline')}
                                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${activeTab === 'timeline' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Timeline
                            </button>
                            <button 
                                onClick={() => setActiveTab('analytics')}
                                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${activeTab === 'analytics' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Analytics
                            </button>
                        </div>

                        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9 gap-2 shadow-sm border-muted-foreground/20 hover:bg-muted/50 transition-all">
                                    <Settings2 className="w-4 h-4" />
                                    <span>Filter Results</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="w-full sm:max-w-md flex flex-col p-0 gap-0 border-l border-border/50">
                                <div className="p-6 pb-4 border-b bg-muted/20">
                                    <SheetHeader className="gap-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <Settings2 className="w-4 h-4 text-primary" />
                                            </div>
                                            <SheetTitle className="text-xl font-bold tracking-tight">Advanced Discovery</SheetTitle>
                                        </div>
                                        <SheetDescription className="text-xs font-medium">
                                            Refine log transactions through precise parameters
                                        </SheetDescription>
                                    </SheetHeader>
                                </div>

                                <ScrollArea className="flex-1">
                                    <div className="p-6 space-y-8 pb-32">
                                        {/* Search Segment */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-1.5 h-4 bg-primary rounded-full" />
                                                <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Global Search</h4>
                                            </div>
                                            <div className="relative group">
                                                <Input 
                                                    placeholder="Keywords, IDs, or descriptions..." 
                                                    value={search} 
                                                    onChange={(e) => setSearch(e.target.value)}
                                                    className="pl-10 h-11 border-border/60 bg-muted/30 focus:bg-background transition-all"
                                                />
                                                <Search className="w-4.5 h-4.5 text-muted-foreground/60 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                                            </div>
                                        </div>

                                        {/* Temporal Boundings Segment */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-1.5 h-4 bg-indigo-500 rounded-full" />
                                                <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Temporal Bounds</h4>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {[
                                                    { label: 'All Time', value: 'all' },
                                                    { label: 'Today', value: 'today' },
                                                    { label: 'Yesterday', value: 'yesterday' },
                                                    { label: 'Last 7 Days', value: 'last_7_days' },
                                                    { label: 'Last 30 Days', value: 'last_30_days' },
                                                    { label: 'This Month', value: 'this_month' },
                                                    { label: 'Last Month', value: 'last_month' },
                                                    { label: 'Custom', value: 'custom' },
                                                ].map((opt) => (
                                                    <button
                                                        key={opt.value}
                                                        type="button"
                                                        onClick={() => setDateRange(opt.value)}
                                                        className={`px-3 py-1.5 text-[11px] font-bold rounded-md border transition-all duration-200 ${dateRange === opt.value ? 'bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20 scale-105' : 'bg-background hover:bg-muted text-muted-foreground border-border hover:border-border-foreground/20'}`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>

                                            {dateRange === 'custom' && (
                                                <div className="grid grid-cols-2 gap-3 pt-2 animate-in slide-in-from-top-2 fade-in duration-300">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-muted-foreground/80 lowercase px-1 italic">start epoch</label>
                                                        <div className="relative">
                                                            <Input 
                                                                type="date" 
                                                                value={startDate} 
                                                                onChange={(e) => setStartDate(e.target.value)} 
                                                                className="pl-9 h-10 border-border/60 bg-muted/20"
                                                            />
                                                            <Calendar className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-muted-foreground/80 lowercase px-1 italic">end epoch</label>
                                                        <div className="relative">
                                                            <Input 
                                                                type="date" 
                                                                value={endDate} 
                                                                onChange={(e) => setEndDate(e.target.value)} 
                                                                className="pl-9 h-10 border-border/60 bg-muted/20"
                                                            />
                                                            <Calendar className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Taxonomy Segment */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                                                <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Action Taxonomy</h4>
                                            </div>
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-3 p-4 rounded-xl border border-border/40 bg-muted/5">
                                                {[
                                                    { label: 'Created', value: 'created', color: 'text-emerald-500' },
                                                    { label: 'Updated', value: 'updated', color: 'text-blue-500' },
                                                    { label: 'Deleted', value: 'deleted', color: 'text-rose-500' },
                                                    { label: 'Login', value: 'login', color: 'text-indigo-500' },
                                                    { label: 'Logout', value: 'logout', color: 'text-slate-500' },
                                                    { label: 'Failed Login', value: 'failed_login', color: 'text-orange-500' },
                                                ].map((et) => (
                                                    <button
                                                        key={et.value}
                                                        type="button"
                                                        onClick={() => toggleEventType(et.value)}
                                                        className="group flex items-center justify-between text-[13px] font-medium transition-colors hover:text-foreground"
                                                    >
                                                        <div className="flex items-center gap-2.5">
                                                            <div className={`w-2 h-2 rounded-full ${et.color.replace('text-', 'bg-')} opacity-60`} />
                                                            <span className={eventTypes.includes(et.value) ? 'text-foreground font-bold' : 'text-muted-foreground font-medium'}>
                                                                {et.label}
                                                            </span>
                                                        </div>
                                                        {eventTypes.includes(et.value) ? (
                                                            <div className="w-5 h-5 rounded flex items-center justify-center bg-primary text-primary-foreground">
                                                                <CheckSquare className="w-3.5 h-3.5" />
                                                            </div>
                                                        ) : (
                                                            <div className="w-5 h-5 rounded border border-border/60 bg-background" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Entities Segment */}
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-1.5 h-4 bg-cyan-500 rounded-full" />
                                                    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Log Group</h4>
                                                </div>
                                                <select
                                                    value={logName}
                                                    onChange={(e) => setLogName(e.target.value)}
                                                    className="w-full flex h-11 rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm font-medium transition-all focus:bg-background focus-visible:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                                                >
                                                    <option value="">All Log Groups</option>
                                                    {logNames.map((name) => (
                                                        <option key={name} value={name}>{name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-1.5 h-4 bg-amber-500 rounded-full" />
                                                    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Subject Origin</h4>
                                                </div>
                                                <select
                                                    value={causerId}
                                                    onChange={(e) => setCauserId(e.target.value)}
                                                    className="w-full flex h-11 rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm font-medium transition-all focus:bg-background focus-visible:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                                                >
                                                    <option value="">Full System Audience</option>
                                                    {users.map((u) => (
                                                        <option key={u.id} value={u.id}>{u.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-1.5 h-4 bg-purple-500 rounded-full" />
                                                    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Resource Target</h4>
                                                </div>
                                                <select
                                                    value={subjectType}
                                                    onChange={(e) => setSubjectType(e.target.value)}
                                                    className="w-full flex h-11 rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm font-medium transition-all focus:bg-background focus-visible:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                                                >
                                                    <option value="">Universal Module Types</option>
                                                    {subjectTypes.map((st) => (
                                                        <option key={st.full} value={st.full}>{st.short}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </ScrollArea>

                                <div className="p-6 border-t bg-muted/10 shrink-0">
                                    <div className="flex gap-3">
                                        <Button 
                                            variant="ghost" 
                                            className="flex-1 font-bold text-xs h-11 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20" 
                                            onClick={handleResetFilters}
                                        >
                                            <RotateCcw className="w-3.5 h-3.5 mr-2" />
                                            Purge Filters
                                        </Button>
                                        <Button 
                                            className="flex-1 px-8 font-extrabold text-xs h-11 shadow-lg shadow-primary/25" 
                                            onClick={handleApplyFilters}
                                        >
                                            Execute Discovery
                                        </Button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                {/* Main Views Container */}
                <Card className="shadow-sm border-border bg-background">
                    <CardContent className="p-0">
                        {activeTab === 'table' && (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                                            <TableHead className="w-[120px] pl-6 py-4 text-xs font-bold uppercase tracking-wider">Event</TableHead>
                                            <TableHead className="py-4 text-xs font-bold uppercase tracking-wider">Description</TableHead>
                                            <TableHead className="py-4 text-xs font-bold uppercase tracking-wider">Subject</TableHead>
                                            <TableHead className="py-4 text-xs font-bold uppercase tracking-wider">User</TableHead>
                                            <TableHead className="py-4 text-xs font-bold uppercase tracking-wider">Date</TableHead>
                                            <TableHead className="w-[120px] pr-6 text-right py-4 text-xs font-bold uppercase tracking-wider">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {logs.data.length > 0 ? (
                                            logs.data.map((log) => (
                                                <TableRow key={log.id} className="hover:bg-muted/30">
                                                    <TableCell className="pl-6 py-4 align-middle">
                                                        <div className="flex flex-col gap-2">
                                                            {getEventBadge(log.event)}
                                                            <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground font-semibold">
                                                                {log.log_name ?? 'default'}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4 align-middle text-sm font-medium text-foreground/90 max-w-[400px] break-words whitespace-normal leading-relaxed">
                                                        {log.description}
                                                    </TableCell>
                                                    <TableCell className="py-4 align-middle">
                                                        {log.subject_type ? (
                                                            <div className="flex flex-col text-xs">
                                                                <span className="font-semibold text-foreground/80 flex items-center gap-1">
                                                                    <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                                                                    {log.subject_type}
                                                                </span>
                                                                <span className="text-muted-foreground/80 mt-0.5">ID: {log.subject_id}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground italic">N/A</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="py-4 align-middle">
                                                        {log.causer ? (
                                                            <div className="flex items-center gap-2.5">
                                                                <img 
                                                                    src={log.causer.avatar} 
                                                                    alt={log.causer.name} 
                                                                    className="w-7 h-7 rounded-full border border-border bg-muted object-cover"
                                                                />
                                                                <span className="text-xs font-semibold text-foreground/90">{log.causer.name}</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2.5">
                                                                <div className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center">
                                                                    <Activity className="w-3.5 h-3.5 text-muted-foreground" />
                                                                </div>
                                                                <span className="text-xs font-medium text-muted-foreground italic">System</span>
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="py-4 align-middle">
                                                        <div className="flex flex-col text-xs">
                                                            <span className="text-foreground/80 font-medium flex items-center gap-1">
                                                                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                                                {log.created_at.split(' ')[0]} {log.created_at.split(' ')[1]} {log.created_at.split(' ')[2]}
                                                            </span>
                                                            <span className="text-muted-foreground/80 mt-0.5 flex items-center gap-1">
                                                                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                                                {log.created_at.split(' ')[3]}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="pr-6 py-4 text-right align-middle">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            onClick={() => {
                                                                setSelectedLog(log);
                                                                setDetailModalOpen(true);
                                                            }}
                                                            className="text-primary hover:text-primary hover:bg-primary/5 font-semibold text-xs transition-colors"
                                                        >
                                                            <Eye className="w-3.5 h-3.5 mr-1" />
                                                            View Details
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                                                    <Layers className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                                    <p className="font-semibold text-lg text-foreground/85">No activities found</p>
                                                    <p className="text-sm mt-1">Try resetting the filters or broadening your search keywords.</p>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>

                                {/* Pagination Controls */}
                                {logs.links && logs.links.length > 3 && (
                                    <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/10">
                                        <span className="text-xs text-muted-foreground">
                                            Showing {logs.from || 0} to {logs.to || 0} of {logs.total} activities
                                        </span>
                                        <Pagination className="w-auto m-0 justify-end">
                                            <PaginationContent className="flex gap-1.5">
                                                {logs.links.map((link, idx) => (
                                                    <PaginationItem key={idx}>
                                                        <PaginationLink
                                                            href={link.url || '#'}
                                                            isActive={link.active}
                                                            className={`h-8 min-w-8 px-2 text-xs select-none ${!link.url ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                                                            onClick={(e) => {
                                                                if (!link.url) e.preventDefault();
                                                                else {
                                                                    e.preventDefault();
                                                                    router.get(link.url, {}, { preserveState: true });
                                                                }
                                                            }}
                                                        >
                                                            {link.label.includes('Previous') ? '‹ Prev' : link.label.includes('Next') ? 'Next ›' : link.label}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                ))}
                                            </PaginationContent>
                                        </Pagination>
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === 'timeline' && (
                            <div className="p-8">
                                <div className="max-w-xl mx-auto space-y-8 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                                    {logs.data.length > 0 ? (
                                        logs.data.map((log) => (
                                            <div key={log.id} className="relative pl-10 flex gap-4 animate-in slide-in-from-left-4 duration-300">
                                                <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full border-2 border-primary bg-background z-10" />
                                                <div className="flex-1 bg-muted/30 p-4 rounded-lg border border-border">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            {getEventBadge(log.event)}
                                                            <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                                                                <Clock className="w-3.5 h-3.5" />
                                                                {log.created_at}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs font-medium text-foreground/80 flex items-center gap-1">
                                                            <UserIcon className="w-3.5 h-3.5 text-muted-foreground" />
                                                            {log.causer?.name || 'System'}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-semibold text-foreground/95">{log.description}</p>
                                                    {log.subject_type && (
                                                        <div className="mt-3 text-xs bg-background px-3 py-2 rounded-md border border-border inline-flex items-center gap-1.5">
                                                            <Tag className="w-3.5 h-3.5 text-primary" />
                                                            <span className="font-semibold">{log.subject_type}</span>
                                                            <span className="text-muted-foreground">#{log.subject_id}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-12 text-center text-muted-foreground">
                                            <Layers className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                            <p className="font-semibold text-lg text-foreground/85">No activities found</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'analytics' && (
                            <div className="p-6">
                                <AnalyticsLayout metrics={metrics} />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Log Details Modal */}
            <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
                <DialogContent className="w-full max-w-full sm:max-w-3xl mx-4 sm:mx-0 flex flex-col max-h-[90vh] p-0 gap-0">
                    <DialogHeader className="p-6 pb-4 border-b shrink-0 sticky top-0 z-20 bg-background">
                        <div className="flex items-center gap-3">
                            {selectedLog && getEventBadge(selectedLog.event)}
                            <DialogTitle className="text-xl font-extrabold">Activity Log Details</DialogTitle>
                        </div>
                        <DialogDescription className="mt-1.5 text-xs text-muted-foreground">
                            Deep analysis of the recorded event, properties, and values changed.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedLog && (
                        <>
                            <ScrollArea className="flex-1 p-6 overflow-auto">
                                <div className="space-y-6">
                                    {/* Overview Metadata */}
                                    <div className="grid grid-cols-2 gap-6 bg-muted/40 p-4 rounded-lg border border-border">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Action / Description</span>
                                            <p className="text-sm font-semibold text-foreground/90">{selectedLog.description}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Event Timestamp</span>
                                            <p className="text-sm font-semibold text-foreground/90 flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                {selectedLog.created_at}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Causer / Author</span>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                {selectedLog.causer ? (
                                                    <>
                                                        <img src={selectedLog.causer.avatar} alt="" className="w-6 h-6 rounded-full border" />
                                                        <span className="text-sm font-semibold">{selectedLog.causer.name}</span>
                                                    </>
                                                ) : (
                                                    <span className="text-sm font-medium text-muted-foreground italic">System</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Subject / Target Object</span>
                                            {selectedLog.subject_type ? (
                                                <p className="text-sm font-semibold text-foreground/90 flex items-center gap-1.5">
                                                    <Tag className="w-4 h-4 text-muted-foreground" />
                                                    {selectedLog.subject_type} #{selectedLog.subject_id}
                                                </p>
                                            ) : (
                                                <p className="text-sm font-medium text-muted-foreground italic">N/A</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Data Change Diff Panel (If old/new values are present) */}
                                    {(selectedLog.old_values || selectedLog.new_values) ? (
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Attribute Value Changes</h4>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Old Values */}
                                                <div className="border border-rose-100 dark:border-rose-950/30 rounded-lg overflow-hidden bg-rose-50/10 dark:bg-rose-950/5">
                                                    <div className="bg-rose-50 dark:bg-rose-950/20 px-4 py-2 border-b border-rose-100 dark:border-rose-950/30 flex items-center justify-between">
                                                        <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">Before Change</span>
                                                        <Badge variant="outline" className="text-[10px] bg-background text-rose-700 border-rose-200">Old</Badge>
                                                    </div>
                                                    <div className="p-4 overflow-x-auto">
                                                        {selectedLog.old_values ? (
                                                            <pre className="text-xs font-mono text-foreground/80 leading-relaxed max-w-full whitespace-pre-wrap">
                                                                {JSON.stringify(selectedLog.old_values, null, 2)}
                                                            </pre>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground italic">No values previously existed.</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* New Values */}
                                                <div className="border border-emerald-100 dark:border-emerald-950/30 rounded-lg overflow-hidden bg-emerald-50/10 dark:bg-emerald-950/5">
                                                    <div className="bg-emerald-50 dark:bg-emerald-950/20 px-4 py-2 border-b border-emerald-100 dark:border-emerald-950/30 flex items-center justify-between">
                                                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">After Change</span>
                                                        <Badge variant="outline" className="text-[10px] bg-background text-emerald-700 border-emerald-200">New</Badge>
                                                    </div>
                                                    <div className="p-4 overflow-x-auto">
                                                        {selectedLog.new_values ? (
                                                            <pre className="text-xs font-mono text-foreground/80 leading-relaxed max-w-full whitespace-pre-wrap">
                                                                {JSON.stringify(selectedLog.new_values, null, 2)}
                                                            </pre>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground italic">No properties set.</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        /* General Custom Properties JSON display if no explicit old/new */
                                        selectedLog.properties && Object.keys(selectedLog.properties).length > 0 && (
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Properties Metadata</h4>
                                                <div className="bg-muted/40 p-4 rounded-lg border border-border overflow-x-auto">
                                                    <pre className="text-xs font-mono text-foreground/85 leading-relaxed whitespace-pre-wrap">
                                                        {JSON.stringify(selectedLog.properties, null, 2)}
                                                    </pre>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </ScrollArea>
                            <DialogFooter className="p-6 border-t bg-muted/20 shrink-0 sticky bottom-0 z-20">
                                <Button onClick={() => setDetailModalOpen(false)}>Close Window</Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

LogsIndex.layout = {
    breadcrumbs: [{ title: 'Activity Logs', href: '/logs' }],
};