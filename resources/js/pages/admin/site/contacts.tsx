import { Head, usePage, useForm, router } from "@inertiajs/react";
import { useEffect } from "react";
import TextEditor from "@/components/ui/text-editor";
import { SiteLayout } from "@/layouts/site/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, MapPin, Globe, Eye, Instagram, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";
import site from "@/routes/admin/site";

interface ContactsData {
    email_1: string;
    email_2: string;
    email_3: string;
    phone_1: string;
    phone_2: string;
    phone_3: string;
    country: string;
    county: string;
    city: string;
    street_address: string;
    map_embed_url: string;
    about_location: string;
    instagram: string;
    tiktok: string;
    facebook: string;
    twitter: string;
    linkedin: string;
    youtube: string;
    telegram: string;
    whatsapp: string;
}

const SOCIALS = [
    { key: "instagram", label: "Instagram", placeholder: "@handle", icon: <Instagram className="size-4" /> },
    { key: "tiktok", label: "TikTok", placeholder: "@handle", icon: <span className="text-xs font-bold">TK</span> },
    { key: "facebook", label: "Facebook", placeholder: "page name or URL", icon: <span className="text-xs font-bold">f</span> },
    { key: "twitter", label: "Twitter / X", placeholder: "@handle", icon: <span className="text-xs font-bold">𝕏</span> },
    { key: "linkedin", label: "LinkedIn", placeholder: "company slug", icon: <span className="text-xs font-bold">in</span> },
    { key: "youtube", label: "YouTube", placeholder: "@channel", icon: <Youtube className="size-4" /> },
    { key: "telegram", label: "Telegram", placeholder: "@username", icon: <span className="text-xs font-bold">TG</span> },
    { key: "whatsapp", label: "WhatsApp", placeholder: "+ 254 743 208 307", icon: <Phone className="size-3.5" /> },
] as const;

function SectionLabel({ children }: { children: React.ReactNode }) {
    return <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3 mt-5 first:mt-0">{children}</p>;
}
function FieldRow({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn("grid gap-3", className)}>{children}</div>;
}
function Field({ label, optional, children }: { label: string; optional?: boolean; children: React.ReactNode }) {
    return <div className="space-y-1.5"><Label className="text-xs">{label}{optional && <span className="text-muted-foreground font-normal ml-1">(optional)</span>}</Label>{children}</div>;
}

export default function Contacts() {
    const { props } = usePage<{ contact: ContactsData; toast?: any }>();
    const { data, setData, transform, post, processing } = useForm<ContactsData>(
        props.contact || {
            email_1: "", email_2: "", email_3: "",
            phone_1: "", phone_2: "", phone_3: "",
            country: "", county: "", city: "", street_address: "",
            map_embed_url: "", about_location: "",
            instagram: "", tiktok: "", facebook: "", twitter: "",
            linkedin: "", youtube: "", telegram: "", whatsapp: "",
        }
    );

    useEffect(() => {
        if (props.contact) {
            Object.keys(props.contact).forEach(key => {
                setData(key as keyof ContactsData, props.contact[key as keyof ContactsData]);
            });
        }
    }, [props.contact]);

    const handleSubmit = () => {
        transform((data) => ({
            ...data,
            _method: "PUT",
        }));
        post(site.contacts.update().url, {
            preserveScroll: true,
            onSuccess: () => router.reload({ only: ["contact"] }),
        });
    };

    const set = (key: keyof ContactsData) => (e: React.ChangeEvent<HTMLInputElement>) => setData(key, e.target.value);
    const activeSocials = SOCIALS.filter(s => data[s.key as keyof ContactsData]);

    const list = (
        <div className="flex flex-col h-full">
            <div className="px-4 py-3 border-b border-sidebar-border"><h2 className="text-sm font-medium">Contacts</h2><p className="text-xs text-muted-foreground mt-0.5">Manage your contact information</p></div>
            <div className="flex-1 overflow-y-auto">
                <Tabs defaultValue="info" className="flex flex-col h-full">
                    <TabsList className="mx-4 mt-3 mb-0 grid grid-cols-3 h-8">
                        <TabsTrigger value="info" className="text-xs">Info</TabsTrigger>
                        <TabsTrigger value="location" className="text-xs">Location</TabsTrigger>
                        <TabsTrigger value="social" className="text-xs">Social</TabsTrigger>
                    </TabsList>
                    {/* INFO TAB */}
                    <TabsContent value="info" className="flex-1 overflow-y-auto p-4 space-y-0 mt-3">
                        <SectionLabel>Email Addresses</SectionLabel>
                        <div className="space-y-3">
                            <Field label="Email 1 (primary)"><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" /><Input value={data.email_1} onChange={set("email_1")} placeholder="hello@example.com" className="pl-8 h-8 text-sm" /></div></Field>
                            <Field label="Email 2" optional><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" /><Input value={data.email_2} onChange={set("email_2")} placeholder="support@example.com" className="pl-8 h-8 text-sm" /></div></Field>
                            <Field label="Email 3" optional><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" /><Input value={data.email_3} onChange={set("email_3")} placeholder="billing@example.com" className="pl-8 h-8 text-sm" /></div></Field>
                        </div>
                        <SectionLabel>Phone Numbers</SectionLabel>
                        <div className="space-y-3">
                            <Field label="Phone 1 (primary)"><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" /><Input value={data.phone_1} onChange={set("phone_1")} placeholder="+254 743 208 307" className="pl-8 h-8 text-sm" /></div></Field>
                            <FieldRow className="grid-cols-2"><Field label="Phone 2" optional><Input value={data.phone_2} onChange={set("phone_2")} placeholder="+254 743 208 307" className="h-8 text-sm" /></Field><Field label="Phone 3" optional><Input value={data.phone_3} onChange={set("phone_3")} placeholder="+254 743 208 307" className="h-8 text-sm" /></Field></FieldRow>
                        </div>
                    </TabsContent>
                    {/* LOCATION TAB */}
                    <TabsContent value="location" className="flex-1 overflow-y-auto p-4 space-y-0 mt-3">
                        <SectionLabel>Address</SectionLabel>
                        <div className="space-y-3">
                            <FieldRow className="grid-cols-2"><Field label="Country"><Input value={data.country} onChange={set("country")} placeholder="Kenya" className="h-8 text-sm" /></Field><Field label="State / County"><Input value={data.county} onChange={set("county")} placeholder="Ngong" className="h-8 text-sm" /></Field></FieldRow>
                            <Field label="City"><Input value={data.city} onChange={set("city")} placeholder="Nairobi" className="h-8 text-sm" /></Field>
                            <Field label="Street Address"><div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" /><Input value={data.street_address} onChange={set("street_address")} placeholder="123 Main St, Suite 400" className="pl-8 h-8 text-sm" /></div></Field>
                        </div>
                        <SectionLabel>Map</SectionLabel>
                        <Field label="Google Maps Embed Link" optional><div className="relative"><Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" /><Input value={data.map_embed_url} onChange={set("map_embed_url")} placeholder="https://maps.google.com/..." className="pl-8 h-8 text-sm" /></div><p className="text-[11px] text-muted-foreground mt-1">Go to Google Maps → Share → Embed a map → Copy the src URL</p></Field>
                        <SectionLabel>About Location</SectionLabel>
                        <Field label="Additional notes" optional><TextEditor value={data.about_location} onChange={(val) => setData("about_location", val)} /></Field>
                    </TabsContent>
                    {/* SOCIAL TAB */}
                    <TabsContent value="social" className="flex-1 overflow-y-auto p-4 space-y-3 mt-3">
                        <div className="rounded-xl border border-sidebar-border bg-sidebar/40 px-3 py-2.5 text-xs text-muted-foreground">Fill in any social handles you want shown on the site. Leave blank to hide.</div>
                        {SOCIALS.map(s => (
                            <Field key={s.key} label={s.label} optional><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center size-4 text-muted-foreground">{s.icon}</span><Input value={data[s.key as keyof ContactsData]} onChange={set(s.key as keyof ContactsData)} placeholder={s.placeholder} className="pl-8 h-8 text-sm" /></div></Field>
                        ))}
                    </TabsContent>
                </Tabs>
            </div>
            <div className="p-4 border-t border-sidebar-border"><Button className="w-full h-8 text-sm" onClick={handleSubmit} disabled={processing}>Save Contacts</Button></div>
        </div>
    );

    const detail = (
        <div className="flex flex-col h-full">
            <div className="px-5 py-3 border-b border-sidebar-border flex items-center gap-2"><Eye className="size-4 text-muted-foreground" /><span className="text-sm font-medium">Live Preview</span></div>
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
                <div><h3 className="text-lg font-semibold mb-1">Get in Touch</h3><p className="text-sm text-muted-foreground">Reach out through any of the channels below.</p></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(data.email_1 || data.email_2 || data.email_3) && (
                        <div className="rounded-xl border border-sidebar-border bg-background p-4"><div className="flex items-center gap-2 mb-3"><div className="size-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center"><Mail className="size-4 text-blue-600 dark:text-blue-400" /></div><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</span></div><div className="space-y-1.5">{[data.email_1, data.email_2, data.email_3].filter(Boolean).map((e, i) => <p key={i} className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">{e}</p>)}</div></div>
                    )}
                    {(data.phone_1 || data.phone_2 || data.phone_3) && (
                        <div className="rounded-xl border border-sidebar-border bg-background p-4"><div className="flex items-center gap-2 mb-3"><div className="size-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center"><Phone className="size-4 text-emerald-600 dark:text-emerald-400" /></div><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone</span></div><div className="space-y-1.5">{[data.phone_1, data.phone_2, data.phone_3].filter(Boolean).map((p, i) => <p key={i} className="text-sm">{p}</p>)}</div></div>
                    )}
                    {(data.street_address || data.city || data.country) && (
                        <div className="rounded-xl border border-sidebar-border bg-background p-4"><div className="flex items-center gap-2 mb-3"><div className="size-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center"><MapPin className="size-4 text-amber-600 dark:text-amber-400" /></div><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location</span></div><p className="text-sm leading-relaxed">{[data.street_address, data.city, data.county, data.country].filter(Boolean).join(", ")}</p></div>
                    )}
                    {data.map_embed_url && (
                        <div className="rounded-xl border border-sidebar-border bg-background p-4"><div className="flex items-center gap-2 mb-3"><div className="size-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center"><Globe className="size-4 text-purple-600 dark:text-purple-400" /></div><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Map</span></div><div className="rounded-lg bg-muted h-20 flex items-center justify-center text-xs text-muted-foreground">Map embed ready</div></div>
                    )}
                </div>
                {activeSocials.length > 0 && (
                    <div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Follow Us</p><div className="flex flex-wrap gap-3">{activeSocials.map(s => (<div key={s.key} className="flex items-center gap-2 rounded-xl border border-sidebar-border bg-background px-3 py-2 text-sm"><span className="text-muted-foreground flex items-center justify-center size-4">{s.icon}</span><span className="text-xs font-medium">{data[s.key as keyof ContactsData]}</span></div>))}</div></div>
                )}
                {!data.email_1 && !data.phone_1 && !data.street_address && <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2"><Mail className="size-8 opacity-30" /><p className="text-sm">Fill in contact details to see the preview</p></div>}
            </div>
        </div>
    );

    return (
        <>
            <Head title="Contacts" />
            <SiteLayout list={list} detail={detail} />
        </>
    );
}

Contacts.layout = {
    breadcrumbs: [
        { title: "Dashboard", href: "/admin/dashboard" },
        { title: "Site", href: "#" },
        { title: "Contacts", href: "/admin/site/contacts" },
    ],
};
