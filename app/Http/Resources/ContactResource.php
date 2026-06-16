<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactResource extends JsonResource
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
            'email_1' => $this->email_1,
            'email_2' => $this->email_2,
            'email_3' => $this->email_3,
            'phone_1' => $this->phone_1,
            'phone_2' => $this->phone_2,
            'phone_3' => $this->phone_3,
            'country' => $this->country,
            'county' => $this->county,
            'city' => $this->city,
            'street_address' => $this->street_address,
            'map_embed_url' => $this->map_embed_url,
            'about_location' => $this->about_location,
            'facebook' => $this->facebook,
            'twitter' => $this->twitter,
            'instagram' => $this->instagram,
            'linkedin' => $this->linkedin,
            'youtube' => $this->youtube,
            'tiktok' => $this->tiktok,
            'telegram' => $this->telegram,
            'whatsapp' => $this->whatsapp,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
