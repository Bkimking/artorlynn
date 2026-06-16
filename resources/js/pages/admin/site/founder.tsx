import { Head, usePage, router, useForm } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import TextEditor from "@/components/ui/text-editor";
import { SiteLayout } from "@/layouts/site/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, User, Camera, Instagram, Youtube, Globe, Twitter, Linkedin, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import site from "@/routes/admin/site";

interface SocialLink { key: string; label: string; placeholder: string; icon: React.ReactNode; prefix?: string; }
const SOCIAL_LINKS: SocialLink[] = [
    { key: "instagram", label: "Instagram", placeholder: "@handle", icon: <Instagram className="size-3.5" />, prefix: "instagram.com/" },
    { key: "twitter", label: "Twitter / X", placeholder: "@handle", icon: <Twitter className="size-3.5" />, prefix: "x.com/" },
    { key: "youtube", label: "YouTube", placeholder: "@channel", icon: <Youtube className="size-3.5" />, prefix: "youtube.com/" },
    { key: "linkedin", label: "LinkedIn", placeholder: "profile slug", icon: <Linkedin className="size-3.5" />, prefix: "linkedin.com/in/" },
    { key: "website", label: "Website", placeholder: "https://...", icon: <Globe className="size-3.5" /> },
];

interface FounderData {
    name: string;
    position: string;
    content: string;
    avatar: string | File | null;
    instagram: string;
    twitter: string;
    youtube: string;
    linkedin: string;
    website: string;
}

function getInitials(name: string): string { return name.split(" ").filter(Boolean).slice(0, 2).map(n => n[0].toUpperCase()).join(""); }
const AVATAR_COLORS = ["from-violet-500 to-indigo-500", "from-rose-500 to-pink-500", "from-amber-500 to-orange-500", "from-emerald-500 to-teal-500", "from-sky-500 to-blue-500"];
function getAvatarColor(name: string): string { return AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length]; }

export default function Founder() {
    const { props } = usePage<{ founder: FounderData; toast?: any }>();
    const { data, setData, post, processing } = useForm<FounderData>(
        props.founder || { name: "", position: "", content: "", avatar: null, instagram: "", twitter: "", youtube: "", linkedin: "", website: "" }
    );
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (props.founder) {
            Object.keys(props.founder).forEach(key => {
                setData(key as keyof FounderData, props.founder[key as keyof FounderData]);
            });
        }
    }, [props.founder]);

    const handleSubmit = () => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, val]) => {
            if (key === "avatar" && val instanceof File) formData.append("avatar", val);
            else if (key !== "avatar" && val !== null && val !== undefined) formData.append(key, val.toString());
        });
        formData.append("_method", "PUT");
        router.post(site.founder.update().url, formData, {
            preserveScroll: true,
            onSuccess: () => router.reload({ only: ["founder"] }),
        });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setData("avatar", file);
        e.target.value = "";
    };

    const setSocial = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => setData(key as keyof FounderData, e.target.value);
    const initials = getInitials(data.name);
    const avatarColor = getAvatarColor(data.name);
    const activeSocials = SOCIAL_LINKS.filter(s => data[s.key as keyof FounderData]);

    const list = (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border"><div><h2 className="text-sm font-medium">Founder</h2><p className="text-xs text-muted-foreground mt-0.5">Profile, bio & social links</p></div><User className="size-4 text-muted-foreground" /></div>
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
                <div className="space-y-2"><Label className="text-xs">Profile Photo</Label><div className="flex items-center gap-4"><div className="relative group shrink-0">{data.avatar ? <img src={typeof data.avatar === "string" ? data.avatar : URL.createObjectURL(data.avatar)} alt={data.name} className="size-16 rounded-2xl object-cover border-2 border-sidebar-border" /> : <div className={cn("size-16 rounded-2xl flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br", avatarColor)}>{initials || <User className="size-6" />}</div>}<button onClick={() => fileRef.current?.click()} className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Camera className="size-5 text-white" /></button></div><div className="flex-1"><input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} /><Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 w-full" onClick={() => fileRef.current?.click()}><Camera className="size-3.5" />{data.avatar ? "Change Photo" : "Upload Photo"}</Button>{data.avatar && <button onClick={() => setData("avatar", null)} className="mt-1.5 text-[11px] text-muted-foreground hover:text-destructive transition-colors w-full text-center">Remove photo</button>}{!data.avatar && <p className="text-[11px] text-muted-foreground mt-1.5">Initials auto-generated from name</p>}</div></div></div>
                <div className="space-y-1.5"><Label className="text-xs">Full Name</Label><Input value={data.name} onChange={e => setData("name", e.target.value)} placeholder="Founder's full name" className="h-8 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Title / Role</Label><Input value={data.position} onChange={e => setData("position", e.target.value)} placeholder="e.g. Artist & Creative Director" className="h-8 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Bio</Label><TextEditor value={data.content} onChange={val => setData("content", val)} /></div>
                <div className="space-y-3"><p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Social Links</p>{SOCIAL_LINKS.map(s => (<div key={s.key} className="space-y-1.5"><Label className="text-xs">{s.label} <span className="text-muted-foreground font-normal">(optional)</span></Label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground flex items-center justify-center size-4">{s.icon}</span><Input value={(data[s.key as keyof FounderData] as string) ?? ""} onChange={setSocial(s.key)} placeholder={s.placeholder} className="pl-8 h-8 text-sm" /></div></div>))}</div>
            </div>
            <div className="p-4 border-t border-sidebar-border"><Button className="w-full h-8 text-sm" disabled={!data.name.trim() || processing} onClick={handleSubmit}>Save Founder</Button></div>
        </div>
    );

    const detail = (
        <div className="flex flex-col h-full">
            <div className="px-5 py-3 border-b border-sidebar-border flex items-center gap-2"><Eye className="size-4 text-muted-foreground" /><span className="text-sm font-medium">Live Preview</span></div>
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
                <div className="rounded-xl border border-sidebar-border bg-background overflow-hidden"><div className={cn("h-20 bg-gradient-to-r", avatarColor, "opacity-20")} /><div className="px-6 pb-6"><div className="-mt-10 mb-4">{data.avatar ? <img src={typeof data.avatar === "string" ? data.avatar : URL.createObjectURL(data.avatar)} alt={data.name} className="size-20 rounded-2xl object-cover border-4 border-background shadow-md" /> : <div className={cn("size-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl bg-gradient-to-br border-4 border-background shadow-md", avatarColor)}>{initials || <User className="size-8" />}</div>}</div><h2 className="text-lg font-bold leading-tight">{data.name || <span className="text-muted-foreground italic">Founder Name</span>}</h2><p className="text-sm text-muted-foreground mt-0.5">{data.position || <span className="italic">Role / Title</span>}</p>{data.content ? <div className="mt-4 text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: data.content }} /> : <p className="mt-4 text-sm text-muted-foreground italic">Bio will appear here…</p>}{activeSocials.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{activeSocials.map(s => (<div key={s.key} className="flex items-center gap-1.5 rounded-full border border-sidebar-border bg-sidebar/40 px-3 py-1.5 text-xs hover:bg-sidebar transition-colors cursor-pointer"><span className="text-muted-foreground">{s.icon}</span><span className="font-medium">{data[s.key as keyof FounderData] as string}</span><ExternalLink className="size-2.5 text-muted-foreground/50" /></div>))}</div>}</div></div>
                {!data.avatar && data.name && <div className="rounded-xl border border-sidebar-border bg-sidebar/30 px-4 py-3 flex items-start gap-3"><div className={cn("size-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold bg-gradient-to-br shrink-0", avatarColor)}>{initials}</div><p className="text-[11px] text-muted-foreground leading-relaxed">Avatar showing auto-generated initials from <strong className="text-foreground">{data.name}</strong>. Upload a photo to replace it.</p></div>}
            </div>
        </div>
    );

    return (
        <>
            <Head title="Founder" />
            <SiteLayout list={list} detail={detail} />
        </>
    );
}

Founder.layout = {
    breadcrumbs: [
        { title: "Dashboard", href: "/admin/dashboard" },
        { title: "Site", href: "#" },
        { title: "Founder", href: "/admin/site/founder" },
    ],
};