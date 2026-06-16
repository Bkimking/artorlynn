import { ReactNode } from 'react';
import { router } from '@inertiajs/react';

interface InputFormLayoutProps {
    children: ReactNode;
    /** Section heading, e.g. "Blog Content" */
    title?: string;
    /** Section subheading, e.g. "Main details about the blog." */
    description?: string;
    /** Buttons rendered in the top-right corner (Draft, Publish, Save, etc.) */
    actions?: ReactNode;
    /** Back navigation — href to go to on click */
    backHref?: string;
    backLabel?: string;
}

/**
 * InputFormLayout
 *
 * The LEFT panel of the AppInputPage split.
 * Scrollable, contains the form title, description, action buttons and
 * all form fields passed as children.
 *
 * Usage:
 *   <InputFormLayout
 *     title="Event Content"
 *     description="Main details about the event."
 *     backHref="/admin/events"
 *     backLabel="Back"
 *     actions={<><DraftBtn /><PublishBtn /></>}
 *   >
 *     <YourFormFields />
 *   </InputFormLayout>
 */
export function InputFormLayout({
    children,
    title,
    description,
    actions,
    backHref,
    backLabel = 'Back',
}: InputFormLayoutProps) {
    return (
        <div className="flex flex-col flex-1 min-w-0 h-full overflow-y-auto border-r border-sidebar-border bg-background">
            {/* Top bar */}
            <div className="sticky top-0 z-10 flex flex-col items-start justify-between gap-4 px-6 py-4 border-b border-sidebar-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3 min-w-0">
                    {backHref && (
                        <button
                            type="button"
                            onClick={() => router.visit(backHref)}
                            className="shrink-0 flex items-center justify-center w-7 h-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                            aria-label={backLabel}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                        </button>
                    )}
                    <div className="min-w-0">
                        {title && (
                            <h2 className="text-sm font-semibold text-foreground truncate leading-tight">
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p className="text-xs text-muted-foreground truncate leading-tight mt-0.5">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                {actions && (
                    <div className="flex items-center gap-2 shrink-0">
                        {actions}
                    </div>
                )}
            </div>

            {/* Scrollable form body */}
            <div className="flex-1 px-6 py-6 space-y-6">
                {children}
            </div>
        </div>
    );
}