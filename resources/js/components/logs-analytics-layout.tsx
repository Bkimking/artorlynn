import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Activity, ArrowUpRight, TrendingUp, Users, Calendar, ShieldAlert, CheckCircle, 
    Layers, User as UserIcon 
} from 'lucide-react';

interface MetricsProps {
    total: number;
    event_counts: Record<string, number>;
    volume_over_time: Array<{ date: string; display: string; count: number }>;
    top_users: Array<{ name: string; avatar: string; total: number }>;
    subject_distribution: Array<{ name: string; total: number }>;
}

export const AnalyticsLayout = ({ metrics }: { metrics: MetricsProps }) => {
    const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

    // Safeguard empty metrics
    const data = metrics || {
        total: 0,
        event_counts: {},
        volume_over_time: [],
        top_users: [],
        subject_distribution: []
    };

    const createdCount = data.event_counts['created'] || 0;
    const updatedCount = data.event_counts['updated'] || 0;
    const deletedCount = data.event_counts['deleted'] || 0;
    const failedLogins = data.event_counts['failed_login'] || 0;
    const loginsCount = data.event_counts['login'] || 0;

    // SVG Area Chart configuration
    const chartHeight = 220;
    const chartWidth = 560;
    const padding = 35;
    
    const maxVal = Math.max(...data.volume_over_time.map(d => d.count), 5); // default min height

    // Map points to SVG coordinates
    const points = data.volume_over_time.map((d, index) => {
        const x = padding + (index * (chartWidth - padding * 2)) / (data.volume_over_time.length - 1 || 1);
        const y = chartHeight - padding - (d.count * (chartHeight - padding * 2)) / maxVal;
        return { x, y, display: d.display, count: d.count };
    });

    // Create SVG path for area fill and outline
    const linePath = points.reduce((path, p, i) => {
        return i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
    }, "");

    const areaPath = points.length > 0 
        ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z` 
        : "";

    // Circular Ring Chart calculations for Event ratios
    const ringRadius = 50;
    const ringCircumference = 2 * Math.PI * ringRadius;
    const ringEvents = [
        { label: 'Created', count: createdCount, color: 'stroke-emerald-500 text-emerald-500 fill-emerald-500' },
        { label: 'Updated', count: updatedCount, color: 'stroke-blue-500 text-blue-500 fill-blue-500' },
        { label: 'Deleted', count: deletedCount, color: 'stroke-rose-500 text-rose-500 fill-rose-500' },
        { label: 'Logins', count: loginsCount, color: 'stroke-indigo-500 text-indigo-500 fill-indigo-500' },
        { label: 'Other', count: data.total - (createdCount + updatedCount + deletedCount + loginsCount), color: 'stroke-amber-500 text-amber-500 fill-amber-500' },
    ].filter(e => e.count > 0);

    const totalRingEvents = ringEvents.reduce((acc, curr) => acc + curr.count, 0) || 1;
    let accumulatedOffset = 0;

    return (
        <div className="space-y-6">
            {/* Top KPI Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Metric Card 1: Total Activity */}
                <Card className="border border-border/80 bg-background shadow-sm transition-all hover:shadow-md">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Actions</p>
                                <h3 className="text-3xl font-extrabold mt-1 tracking-tight">{data.total}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Activity className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 mt-4 text-xs text-muted-foreground font-semibold">
                            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 p-0 px-1.5 py-0.5 text-[10px] dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900">
                                <TrendingUp className="w-3 h-3 mr-0.5 inline" />
                                Active
                            </Badge>
                            <span>System is healthy</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Metric Card 2: Created Resources */}
                <Card className="border border-border/80 bg-background shadow-sm transition-all hover:shadow-md">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Created Volume</p>
                                <h3 className="text-3xl font-extrabold mt-1 tracking-tight">{createdCount}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 dark:text-emerald-400">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 mt-4 text-xs text-muted-foreground font-semibold">
                            <span className="text-emerald-500 font-bold flex items-center">
                                {data.total > 0 ? ((createdCount / data.total) * 100).toFixed(0) : 0}%
                            </span>
                            <span>of total system metrics</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Metric Card 3: Updated Resources */}
                <Card className="border border-border/80 bg-background shadow-sm transition-all hover:shadow-md">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Updates Done</p>
                                <h3 className="text-3xl font-extrabold mt-1 tracking-tight">{updatedCount}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 dark:text-blue-400">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 mt-4 text-xs text-muted-foreground font-semibold">
                            <span className="text-blue-500 font-bold flex items-center">
                                {data.total > 0 ? ((updatedCount / data.total) * 100).toFixed(0) : 0}%
                            </span>
                            <span>of total modifications</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Metric Card 4: Security Alerts */}
                <Card className="border border-border/80 bg-background shadow-sm transition-all hover:shadow-md">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Failed Logins</p>
                                <h3 className="text-3xl font-extrabold mt-1 tracking-tight">{failedLogins}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 dark:text-rose-400">
                                <ShieldAlert className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 mt-4 text-xs text-muted-foreground font-semibold">
                            {failedLogins > 0 ? (
                                <Badge className="bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-50 p-0 px-1.5 py-0.5 text-[10px] dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900">
                                    Needs Review
                                </Badge>
                            ) : (
                                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 p-0 px-1.5 py-0.5 text-[10px] dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900">
                                    Secure
                                </Badge>
                            )}
                            <span>Failed auth attempts</span>
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* Main Graphs Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Chart 1: Activity Volume Trend (SVG Curve) */}
                <Card className="lg:col-span-2 border border-border/85 bg-background shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Activity Volume Trend
                        </CardTitle>
                        <CardDescription>Daily system event transactions over the past 7 days</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        {data.volume_over_time.length > 0 ? (
                            <div className="relative w-full overflow-hidden flex flex-col items-center">
                                <svg 
                                    viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                                    className="w-full h-auto overflow-visible select-none max-w-[620px]"
                                >
                                    <defs>
                                        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
                                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.0" />
                                        </linearGradient>
                                    </defs>

                                    {/* Grid Lines */}
                                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                                        const y = padding + ratio * (chartHeight - padding * 2);
                                        const gridVal = Math.round(maxVal - ratio * maxVal);
                                        return (
                                            <g key={i} className="opacity-40">
                                                <line 
                                                    x1={padding} 
                                                    y1={y} 
                                                    x2={chartWidth - padding} 
                                                    y2={y} 
                                                    className="stroke-muted border-dashed" 
                                                    strokeWidth={1}
                                                    strokeDasharray="4 4"
                                                />
                                                <text 
                                                    x={padding - 10} 
                                                    y={y + 4} 
                                                    className="fill-muted-foreground text-[10px] font-semibold text-right"
                                                    textAnchor="end"
                                                >
                                                    {gridVal}
                                                </text>
                                            </g>
                                        );
                                    })}

                                    {/* Area Fill */}
                                    {areaPath && (
                                        <path d={areaPath} fill="url(#grad)" className="animate-in fade-in duration-500" />
                                    )}

                                    {/* Line Outline */}
                                    {linePath && (
                                        <path 
                                            d={linePath} 
                                            fill="none" 
                                            className="stroke-primary" 
                                            strokeWidth={3} 
                                        />
                                    )}

                                    {/* Intersecting Points / Hover Targets */}
                                    {points.map((p, idx) => (
                                        <g key={idx}>
                                            <circle 
                                                cx={p.x} 
                                                cy={p.y} 
                                                r={hoveredPoint === idx ? 7 : 4} 
                                                className={`fill-primary stroke-white dark:stroke-zinc-900 transition-all ${hoveredPoint === idx ? 'r-7 stroke-2' : ''}`}
                                                strokeWidth={2}
                                            />
                                            {/* Invisible Hover Rect */}
                                            <rect 
                                                x={p.x - 20} 
                                                y={padding} 
                                                width={40} 
                                                height={chartHeight - padding * 2} 
                                                fill="transparent"
                                                className="cursor-pointer"
                                                onMouseEnter={() => setHoveredPoint(idx)}
                                                onMouseLeave={() => setHoveredPoint(null)}
                                            />
                                            {/* Date Label */}
                                            <text 
                                                x={p.x} 
                                                y={chartHeight - padding + 18} 
                                                className="fill-muted-foreground text-[9px] font-bold text-center"
                                                textAnchor="middle"
                                            >
                                                {p.display.split(',')[0]}
                                            </text>
                                        </g>
                                    ))}
                                </svg>

                                {/* Popover Tooltip */}
                                {hoveredPoint !== null && points[hoveredPoint] && (
                                    <div className="absolute top-4 bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 p-2.5 rounded-lg border border-border shadow-lg text-xs leading-relaxed animate-in zoom-in-95 duration-150">
                                        <div className="font-bold flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {points[hoveredPoint].display}
                                        </div>
                                        <div className="mt-1 flex items-center gap-1 font-medium">
                                            <span className="w-2 h-2 rounded-full bg-primary" />
                                            {points[hoveredPoint].count} Transactions Recorded
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                <Layers className="w-12 h-12 mb-3 opacity-30" />
                                <p className="font-semibold">No charts data available</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Chart 2: Event Type Distribution (SVG Donut) */}
                <Card className="border border-border/85 bg-background shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Layers className="w-5 h-5 text-indigo-500" />
                            Events Distribution
                        </CardTitle>
                        <CardDescription>Ratios of active system actions</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 flex flex-col items-center justify-center">
                        {ringEvents.length > 0 ? (
                            <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-8">
                                <svg width="140" height="140" viewBox="0 0 140 140" className="flex-shrink-0">
                                    {ringEvents.map((evt, idx) => {
                                        const percent = evt.count / totalRingEvents;
                                        const dasharray = percent * ringCircumference;
                                        const dashoffset = ringCircumference - dasharray + accumulatedOffset;
                                        accumulatedOffset -= dasharray;

                                        return (
                                            <circle
                                                key={idx}
                                                cx="70"
                                                cy="70"
                                                r={ringRadius}
                                                fill="transparent"
                                                className={`stroke-[14] ${evt.color.split(' ')[0]} transition-all duration-500`}
                                                strokeDasharray={ringCircumference}
                                                strokeDashoffset={dashoffset}
                                                strokeLinecap="round"
                                                transform="rotate(-90 70 70)"
                                            />
                                        );
                                    })}
                                    <circle cx="70" cy="70" r="38" className="fill-white dark:fill-zinc-900" />
                                    <text x="70" y="74" textAnchor="middle" className="fill-foreground text-center font-extrabold text-sm">{data.total}</text>
                                    <text x="70" y="86" textAnchor="middle" className="fill-muted-foreground text-center font-bold text-[8px] uppercase tracking-wider">events</text>
                                </svg>

                                <div className="space-y-3.5 flex-1 min-w-[120px]">
                                    {ringEvents.map((evt, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-3 h-3 rounded-full ${evt.color.split(' ')[1]}`} />
                                                <span className="font-semibold text-foreground/80">{evt.label}</span>
                                            </div>
                                            <span className="font-bold">{evt.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="py-12 text-muted-foreground flex flex-col items-center">
                                <Layers className="w-12 h-12 mb-3 opacity-30" />
                                <p className="font-semibold">No logs distributed yet</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

            </div>

            {/* Bottom Metrics: Top Teammates & Target Tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Card 3: Top Teammates Rankings */}
                <Card className="border border-border/85 bg-background shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Users className="w-5 h-5 text-emerald-500" />
                            Top Teammate Contributions
                        </CardTitle>
                        <CardDescription>Most active administrators triggering logs</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        {data.top_users.length > 0 ? (
                            <div className="space-y-5">
                                {data.top_users.map((user, idx) => {
                                    const maxContrib = Math.max(...data.top_users.map(u => u.total), 1);
                                    const fillPercent = (user.total / maxContrib) * 100;
                                    
                                    return (
                                        <div key={idx} className="space-y-1.5">
                                            <div className="flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-2">
                                                    <img 
                                                        src={user.avatar} 
                                                        alt={user.name} 
                                                        className="w-6 h-6 rounded-full object-cover border border-border bg-muted/50"
                                                    />
                                                    <span className="font-semibold text-foreground/90">{user.name}</span>
                                                </div>
                                                <span className="font-bold flex items-center text-muted-foreground">
                                                    {user.total} Actions
                                                </span>
                                            </div>
                                            {/* Custom Bar Fill */}
                                            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                                                <div 
                                                    className="bg-emerald-500 dark:bg-emerald-400 h-full rounded-full transition-all duration-500"
                                                    style={{ width: `${fillPercent}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-12 text-muted-foreground flex flex-col items-center">
                                <Users className="w-12 h-12 mb-3 opacity-30" />
                                <p className="font-semibold">No active contributors</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Card 4: Most Logged Models (Table Target Frequencies) */}
                <Card className="border border-border/85 bg-background shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Layers className="w-5 h-5 text-blue-500" />
                            Most Modified Modules
                        </CardTitle>
                        <CardDescription>Eloquent subject models receiving updates</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        {data.subject_distribution.length > 0 ? (
                            <div className="space-y-5">
                                {data.subject_distribution.map((sub, idx) => {
                                    const maxSub = Math.max(...data.subject_distribution.map(s => s.total), 1);
                                    const fillPercent = (sub.total / maxSub) * 100;

                                    return (
                                        <div key={idx} className="space-y-1.5">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-semibold text-foreground/90 flex items-center gap-1">
                                                    <Badge variant="secondary" className="px-2 py-0.5 font-bold text-[10px]">{sub.name}</Badge>
                                                </span>
                                                <span className="font-bold text-muted-foreground">
                                                    {sub.total} Logs
                                                </span>
                                            </div>
                                            {/* Custom Bar Fill */}
                                            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                                                <div 
                                                    className="bg-blue-500 dark:bg-blue-400 h-full rounded-full transition-all duration-500"
                                                    style={{ width: `${fillPercent}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-12 text-muted-foreground flex flex-col items-center">
                                <Layers className="w-12 h-12 mb-3 opacity-30" />
                                <p className="font-semibold">No subject objects targeted</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

            </div>

        </div>
    );
};
