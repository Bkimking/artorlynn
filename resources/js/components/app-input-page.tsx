import { ReactNode } from 'react';

interface AppInputPageProps {
    children: ReactNode;
    /** Optional back navigation button */
    backHref?: string;
    backLabel?: string;
    /** Optional action buttons rendered top-right of the form panel (e.g. Draft / Publish) */
    actions?: ReactNode;
    /** Page title shown in the top bar above the form panel */
    title?: string;
    subtitle?: string;
}

/**
 * AppInputPage
 *
 * The root shell for any create/edit page.
 * Renders a two-panel split layout:
 *   - Left  (~55%): scrollable form panel
 *   - Right (~45%): sticky live-preview panel
 *
 * Usage:
 *   <AppInputPage title="Blog Content" subtitle="Main details about the blog."
 *                 actions={<><DraftButton /><PublishButton /></>}>
 *     <InputFormLayout>...</InputFormLayout>
 *     <InputPreviewLayout>...</InputPreviewLayout>
 *   </AppInputPage>
 */
export function AppInputPage({
    children,
    actions,
    title,
    subtitle,
}: AppInputPageProps) {
    return (
        <div className="flex flex-col lg:flex-row h-full w-full overflow-hidden">
            {children}
        </div>
    );
}