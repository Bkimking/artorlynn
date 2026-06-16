import { ReactNode } from 'react';

interface InputPreviewLayoutProps {
    children: ReactNode;
    /** Label shown in the top bar, defaults to "LIVE PREVIEW" */
    label?: string;
    /** Optional right-side action in the preview bar, e.g. "Public View" button */
    action?: ReactNode;
}

/**
 * InputPreviewLayout
 *
 * The RIGHT panel of the AppInputPage split.
 * Sticky, scrollable, shows a live preview of what the user is filling in.
 * Has its own header bar with a label and optional action slot.
 *
 * Usage:
 *   <InputPreviewLayout
 *     label="LIVE PREVIEW"
 *     action={<PublicViewButton />}
 *   >
 *     <YourPreviewComponent />
 *   </InputPreviewLayout>
 */
export function InputPreviewLayout({
    children,
    label = 'LIVE PREVIEW',
    action,
}: InputPreviewLayoutProps) {
    return (
        <div className="flex flex-col w-full lg:w-[45%] shrink-0 h-full bg-sidebar overflow-hidden">
            {/* Preview top bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-sidebar-border shrink-0">
                <div className="flex items-center gap-2">
                    {/* Traffic-light dots  */}
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    <span className="ml-2 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                        {label}
                    </span>
                </div>

                {action && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {action}
                    </div>
                )}
            </div>

            {/* Scrollable preview body */}
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>
        </div>
    );
}