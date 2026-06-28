<?php

namespace App\Services\Admin\Site;

use App\Http\Resources\HeroResource;
use App\Models\Hero;
use Illuminate\Support\Facades\DB;

class HeroService
{
    public function get()
    {
        $hero = Hero::first();
        if (! $hero) {
            $hero = Hero::create([
                'title' => '',
                'description' => '',
                'image' => [],
            ]);
        }

        return new HeroResource($hero);
    }

    public function update(array $data, $imageFiles = null)
    {
        return DB::transaction(function () use ($data, $imageFiles) {
            $hero = Hero::first() ?? new Hero;

            // Decode existing images from frontend
            $existing = [];
            if (isset($data['existing_images'])) {
                $decoded = json_decode($data['existing_images'], true) ?: [];
                foreach ($decoded as $img) {
                    // Strip full URL back to relative storage path
                    $url = $img['url'] ?? '';
                    $relative = preg_replace('#^.*/storage/#', '', $url);
                    $existing[] = ['url' => $relative, 'alt' => $img['alt'] ?? ''];
                }
            }

            // Store new uploaded images
            $new = [];
            if ($imageFiles && is_array($imageFiles)) {
                $alts = $data['alts'] ?? [];
                foreach ($imageFiles as $index => $file) {
                    $path = $file->store('hero', 'public');
                    $new[] = ['url' => $path, 'alt' => $alts[$index] ?? ''];
                }
            }

            $hero->title = $data['title'] ?? $hero->title;
            $hero->description = $data['description'] ?? $hero->description;
            $hero->image = array_merge($existing, $new);
            $hero->save();

            return new HeroResource($hero);
        });
    }
}
