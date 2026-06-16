import { Head } from '@inertiajs/react';
import WelcomeLayout from '@/layouts/public/welcome-layout';

export default function Welcome() {
    return (
        <>
            <Head title="Art of Lynn — Visual Artistry Studio">
                <meta name="description" content="Visual storytelling rooted in African identity. Portraits, fashion, brand photography, and fine art by Art of Lynn studio." />
                <meta property="og:title" content="Art of Lynn — Visual Artistry Studio" />
                <meta property="og:description" content="Visual storytelling rooted in African identity. Portraits, fashion, brand photography, and fine art by Art of Lynn." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://artoflynn.co.ke" />
                <meta property="og:image" content="https://artoflynn.co.ke/og-image.jpg" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Art of Lynn — Visual Artistry Studio" />
                <meta name="twitter:description" content="Visual storytelling rooted in African identity. Portraits, fashion, brand photography, and fine art by Art of Lynn." />
            </Head>
            <WelcomeLayout />
        </>
    );
}