<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NewsSubscriptionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'email'            => $this->email,
            'name'             => $this->name,
            'status'           => $this->status,
            'subscribed_at'    => $this->subscribed_at?->toDateTimeString(),
            'unsubscribed_at'  => $this->unsubscribed_at?->toDateTimeString(),
            // unsubscribe_token intentionally omitted from public resource
        ];
    }
}
