<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'event_date' => $this->event_date,
            'location_name' => $this->location_name,
            'google_maps_url' => $this->google_maps_url,
            'ticket_price' => $this->ticket_price,
            'max_capacity' => $this->max_capacity,
            'tickets_sold' => $this->tickets_sold,
            'images' => $this->images
                ? collect($this->images)->map(fn($img) => asset('storage/' . $img))->values()
                : [],
            'status' => $this->status,
            'registration_open' => $this->registration_open,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
