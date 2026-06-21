import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Plus, Bell, Settings, Home, Search, Moon, Sun, Mail, LifeBuoy, MessageCircle, MessageCircleHeart, MessageCircleIcon, MessageCircleMore } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import * as React from 'react';
import { usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { useNotificationPanel } from '@/components/app-sidebar-notification';
import { cn } from '@/lib/utils';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage().props;
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isDarkMode, setIsDarkMode] = React.useState(false);

    const { toggle, isOpen, activeTab, unreadNotifications, unreadMails } = useNotificationPanel();

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <div className="flex-1" />

            <div className="flex items-center gap-2">
                {/* Search Bar */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="w-64 pl-9 h-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Plus Icon with dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <Plus className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>                        
                        <DropdownMenuItem>
                            <Link href="#">Admin</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href="/admin/products/create">Create Product</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href="/admin/events/create">Create Event</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Home Icon */}
                <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                    <Link href={"/"} prefetch>
                        <Home className="h-5 w-5" />
                    </Link>
                </Button>

                {/* Bell Icon */}
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        'h-9 w-9 relative',
                        isOpen && activeTab === 'notifications' && 'bg-accent text-accent-foreground',
                    )}
                    onClick={() => toggle('notifications')}
                    aria-label="Toggle notifications"
                    aria-expanded={isOpen && activeTab === 'notifications'}
                >
                    <Bell className="h-5 w-5" />
                    {unreadNotifications > 0 && (
                        <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                        </span>
                    )}
                </Button>

                {/* Messages Icon */}
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        'h-9 w-9 relative',
                        isOpen && activeTab === 'mail' && 'bg-accent text-accent-foreground',
                    )}
                    onClick={() => toggle('mail')}
                    aria-label="Toggle messages"
                    aria-expanded={isOpen && activeTab === 'mail'}
                >
                    <Mail className="h-5 w-5" />
                    {unreadMails > 0 && (
                        <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
                        </span>
                    )}
                </Button>

                {/* Theme Toggle */}
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleTheme}>
                    {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>

                {/* Support Icon */}
                <Button variant="ghost" size="icon" className="h-9 w-9">
                    <MessageCircleMore className="h-5 w-5" />
                </Button>

                {/* Avatar with Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={auth.user?.avatar_url as string | undefined} alt={auth.user?.name as string | undefined} />
                                <AvatarFallback>{auth.user?.name?.toString().charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{auth.user?.name?.toString()}</p>
                                <p className="text-xs leading-none text-muted-foreground">{auth.user?.email?.toString()}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/settings/profile" prefetch>Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/settings/security" prefetch>Security</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>                            
                            <Link href="#" prefetch>Notification</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/logout" method="post" as="button" prefetch>Log out</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}