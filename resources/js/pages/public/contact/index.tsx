import { Head } from "@inertiajs/react";
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern";

export default function Contacts() {
    return (
        <>
            <Head title="Contacts" />
            <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
            </div>
        </>
    );
}