import { ReactNode } from "react";
 
interface AppIndexLayoutProps {
    list: ReactNode;
    detail: ReactNode;
}

export function SiteLayout({ list, detail }: AppIndexLayoutProps) {
    return (
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* ── LEFT: List panel ─────────────────────────────── */}
            <div className="flex w-full md:w-[420px] shrink-0 flex-col border-b border-sidebar-border md:border-b-0 md:border-r overflow-hidden">
                {list}
            </div>
 
            {/* ── RIGHT: Detail panel ──────────────────────────── */}
            <div className="flex flex-1 flex-col overflow-y-auto">
                {detail}
            </div>
        </div>
    );
}