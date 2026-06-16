export interface AppEvent {
    id: number;
    title: string;
    slug: string;
    description: string;
    event_date: string;
    location_name: string;
    google_maps_url: string | null;
    ticket_price: string | number;
    max_capacity: number | null;
    tickets_sold: number;
    images: string[] | null;
    status: 'draft' | 'upcoming' | 'past' | 'cancelled';
    registration_open: boolean;
    created_at: string;
    updated_at: string;
}
