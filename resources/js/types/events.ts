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

export interface Attendee {
    id: number;
    event_id: number;
    ticket_id: string;
    name: string;
    email: string;
    phone: string | null;
    amount_paid: string | number;
    qr_code_url: string | null;
    checked_in: boolean;
    checked_in_at: string | null;
    status: 'confirmed' | 'cancelled' | 'refunded';
    notes: string | null;
    created_at: string;
    event?: AppEvent;
}
