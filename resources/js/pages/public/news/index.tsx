import { Head } from '@inertiajs/react';
import NewsDetailsLayout from '@/layouts/public/news-details-layout';

export default function NewsIndex() {
    return (
        <>
            <Head title="News — Art of Lynn" />
            <NewsDetailsLayout />
        </>
    );
}
