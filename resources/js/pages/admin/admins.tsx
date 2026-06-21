import { Head, useForm, usePage } from "@inertiajs/react";
import { useState, useMemo } from "react";
import { SiteLayout } from "@/layouts/site/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
    User, 
    Plus, 
    Search, 
    Mail, 
    Calendar, 
    Shield, 
    Trash2, 
    MoreVertical,
    UserCircle,
    CheckCircle2,
    X
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AdminUser {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
}

export default function Admins() {
    const { admins } = usePage<{ admins: AdminUser[] }>().props;
    const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(admins[0] || null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data, setData, post, processing, reset, errors, delete: destroy } = useForm({
        name: '',
        email: '',
    });

    const filteredAdmins = useMemo(() => {
        return admins.filter(admin => 
            admin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            admin.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [admins, searchQuery]);

    const handleCreateAdmin = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/admins', {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            }
        });
    };

    const handleDeleteAdmin = (id: number) => {
        if (confirm('Are you sure you want to remove this administrator? They will lose all access immediately.')) {
            destroy(`/admin/admins/${id}`, {
                onSuccess: () => {
                    if (selectedAdmin?.id === id) {
                        setSelectedAdmin(admins.find(a => a.id !== id) || null);
                    }
                }
            });
        }
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const list = (
        <>
            {/* ── Header ───────────────────────────────────── */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between border-b border-sidebar-border px-4 py-3">
                <h1 className="text-sm font-semibold text-foreground">Administrators</h1>
                <Button 
                    size="sm" 
                    className="h-8 gap-1 text-xs" 
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    <Plus className="size-3.5" />
                    Create Admin
                </Button>
            </div>

            {/* ── Search ───────────────────────────────────── */}
            <div className="border-b border-sidebar-border px-4 py-2">
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground size-3.5" />
                    <input
                        type="text"
                        placeholder="Search admins..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-md border border-input bg-transparent py-1.5 pl-8 pr-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                </div>
            </div>

            {/* ── List ─────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto">
                {filteredAdmins.length > 0 ? (
                    <div className="divide-y divide-sidebar-border">
                        {filteredAdmins.map((admin) => (
                            <button
                                key={admin.id}
                                onClick={() => setSelectedAdmin(admin)}
                                className={cn(
                                    "w-full text-left p-4 hover:bg-accent/50 transition-colors flex items-center gap-3",
                                    selectedAdmin?.id === admin.id && "bg-accent"
                                )}
                            >
                                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase shrink-0 border border-primary/20">
                                    {getInitials(admin.name)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-2">
                                        <span className="text-sm font-medium truncate">{admin.name}</span>
                                        {admin.email_verified_at && (
                                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-emerald-50 text-emerald-700 border-emerald-200">Verified</Badge>
                                        )}
                                    </div>
                                    <div className="text-[11px] text-muted-foreground truncate">{admin.email}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-muted-foreground">
                        <UserCircle className="size-10 opacity-20" />
                        <p className="text-sm">No administrators found</p>
                    </div>
                )}
            </div>
        </>
    );

    const detail = (
        <div className="flex-1 p-6 lg:p-8">
            {selectedAdmin ? (
                <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {/* ── Profile Header ─────────────────────────── */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                        <div className="size-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl shadow-inner border border-primary/20">
                            {getInitials(selectedAdmin.name)}
                        </div>
                        <div className="space-y-1 py-2 flex-1">
                            <h2 className="text-2xl font-bold tracking-tight">{selectedAdmin.name}</h2>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <Mail className="size-3.5" />
                                    {selectedAdmin.email}
                                </div>
                                <span className="text-muted-foreground/30">•</span>
                                <Badge variant="secondary" className="gap-1 px-2">
                                    <Shield className="size-3" />
                                    Administrator
                                </Badge>
                            </div>
                        </div>
                        <div className="pt-2">
                            <Button 
                                variant="outline" 
                                size="icon" 
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive transition-all"
                                onClick={() => handleDeleteAdmin(selectedAdmin.id)}
                            >
                                <Trash2 className="size-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="h-px bg-sidebar-border" />

                    {/* ── Info Cards ─────────────────────────────── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-sidebar-border bg-sidebar/50 space-y-3">
                            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase opacity-70">
                                <Calendar className="size-3" />
                                Join Date
                            </div>
                            <div className="text-sm font-medium">{formatDate(selectedAdmin.created_at)}</div>
                        </div>
                        <div className="p-4 rounded-xl border border-sidebar-border bg-sidebar/50 space-y-3">
                            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase opacity-70">
                                <CheckCircle2 className="size-3" />
                                Status
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="size-2 rounded-full bg-emerald-500 shadow-sm" />
                                <span className="text-sm font-medium">Active Member</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-sidebar-border bg-primary/5 space-y-4">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                            <Shield className="size-4 text-primary" />
                            Access Level
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Full administrative access. This user can manage all aspects of the Art of Lynn ecosystem including event attendees, site content, products, and other administrator accounts.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center space-y-4">
                        <div className="size-16 rounded-full bg-muted/50 mx-auto flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
                            <User className="size-8 opacity-20" />
                        </div>
                        <p className="text-sm font-medium">Select an administrator to see their full profile</p>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <>
            <Head title="Admins" />
            <SiteLayout list={list} detail={detail} />

            {/* ── Create Admin Modal ────────────────────────── */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Invite New Administrator</DialogTitle>
                        <DialogDescription>
                            Enter their details below. We'll generate a secure password and email it to them immediately.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateAdmin}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-xs uppercase font-bold text-muted-foreground/70">Full Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="e.g. Lynn Otieno"
                                    className="h-10"
                                    required
                                />
                                {errors.name && <p className="text-[11px] text-destructive font-medium">{errors.name}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-xs uppercase font-bold text-muted-foreground/70">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="e.g. lynn@artoflynn.com"
                                    className="h-10"
                                    required
                                />
                                {errors.email && <p className="text-[11px] text-destructive font-medium">{errors.email}</p>}
                            </div>
                        </div>
                        <DialogFooter className="sm:justify-end gap-2">
                            <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing} className="px-6">
                                {processing ? "Creating..." : "Create & Send Invitation"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

Admins.layout = {
    breadcrumbs: [
        { title: "Dashboard", href: "/admin/dashboard" },
        { title: "Admins", href: "/admin/admins" },
    ],
};
