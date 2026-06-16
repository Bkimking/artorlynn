<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GalleryResource extends JsonResource
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
            'image' => $this->image ? asset('storage/' . $this->image) : null,
            'name' => $this->name,
            'description' => $this->description,
            'is_featured' => (bool) $this->is_featured,
            'type'  => $this->type ?? ($this->is_gif ? 'gif' : 'image'),
            'video' => $this->video ? asset('storage/' . $this->video) : null,
            'is_gif' => (bool) $this->is_gif,
            'is_visible' => (bool) $this->is_visible,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
