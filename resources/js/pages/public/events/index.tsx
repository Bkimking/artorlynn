import { Head } from '@inertiajs/react';
import EventsLayout from '@/layouts/public/events-layout';

export default function EventsIndex({ events }: { events: any[] }) {
    return (
        <EventsLayout>
            <Head title="Events — Art of Lynn" />
        </EventsLayout>
    );
}