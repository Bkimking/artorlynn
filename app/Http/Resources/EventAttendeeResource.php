<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class EventAttendeeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'event_id' => $this->event_id,
            'ticket_id' => $this->ticket_id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'amount_paid' => $this->amount_paid,
            'qr_code_url' => $this->qr_code_path ? Storage::disk('public')->url($this->qr_code_path) : null,
            'checked_in' => $this->checked_in,
            'checked_in_at' => $this->checked_in_at?->toIso8601String(),
            'status' => $this->status,
            'notes' => $this->notes,
            'created_at' => $this->created_at->toIso8601String(),
            'event' => $this->whenLoaded('event'),
        ];
    }
}
