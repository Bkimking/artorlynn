import { Head, useForm } from "@inertiajs/react";
import { dashboard } from '@/routes';
import { Mail, Bell, ShieldCheck, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import notifications from "@/routes/notifications";
import NotificationLayout from "@/layouts/notifications/layouts";

interface Setting {
    type: string;
    label: string;
    channels: string[];
}

const breadcrumbs = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Notifications', href: '/admin/notifications' },
    { title: 'Preferences', href: '#' },
];

export default function NotificationSettings({ settings }: { settings: Setting[] }) {
    const { data, setData, post, processing } = useForm({ settings });

    const toggleChannel = (type: string, channel: string) => {
        const updatedSettings = data.settings.map(s => {
            if (s.type !== type) return s;
            const channels = s.channels.includes(channel)
                ? s.channels.filter(c => c !== channel)
                : [...s.channels, channel];
            return { ...s, channels };
        });
        setData('settings', updatedSettings);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(notifications.settings.update().url);
    };

    return (
        <>
            <Head title="Notification Preferences" />

            <div className="p-6 max-w-3xl mx-auto w-full">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold tracking-tight">Preferences</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Control how you receive alerts for specific site activities.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-3">
                    {data.settings.map((setting) => (
                        <Card key={setting.type} className="border-border shadow-none">
                            <CardHeader className="py-3.5 px-5 flex flex-row items-center justify-between space-y-0">
                                <div className="flex flex-col gap-0.5">
                                    <CardTitle className="text-sm font-semibold">
                                        {setting.label}
                                    </CardTitle>
                                    <CardDescription className="text-[11px] font-mono tracking-tight uppercase">
                                        {setting.type}
                                    </CardDescription>
                                </div>

                                <div className="flex items-center gap-5">
                                    <div className="flex items-center gap-2">
                                        <Bell className="size-3.5 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">Alerts</span>
                                        <Switch
                                            checked={setting.channels.includes('database')}
                                            onCheckedChange={() => toggleChannel(setting.type, 'database')}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="size-3.5 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">Email</span>
                                        <Switch
                                            checked={setting.channels.includes('mail')}
                                            onCheckedChange={() => toggleChannel(setting.type, 'mail')}
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}

                    <div className="flex items-center justify-end pt-2">
                        <Button disabled={processing} type="submit" size="sm" className="h-9 px-6 gap-2">
                            {processing ? 'Saving...' : <><Save className="size-3.5" /> Save Changes</>}
                        </Button>
                    </div>
                </form>

                {/* Security notice */}
                <div className="mt-10 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 flex gap-3 items-start">
                    <ShieldCheck className="size-4 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-300">Security & Priority Alerts</h4>
                        <p className="text-xs text-amber-800/80 dark:text-amber-400/80 leading-relaxed mt-0.5">
                            Critical system and security notifications are always delivered regardless of your preferences here.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

NotificationSettings.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Notifications', href: '/admin/notifications' },
        { title: 'Preferences', href: '#' },
    ],
};