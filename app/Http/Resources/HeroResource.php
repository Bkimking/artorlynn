<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HeroResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $images = collect($this->image ?? [])->map(fn ($img) => [
            'url' => isset($img['url']) ? asset('storage/'.$img['url']) : null,
            'alt' => $img['alt'] ?? '',
        ])->toArray();

        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'image' => $images,
        ];
    }
}
