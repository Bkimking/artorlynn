<?php

namespace App\Services\Admin\Site;

use App\Models\Gallery;
use App\Http\Resources\GalleryResource;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class GalleryService
{
    public function getAll()
    {
        $items = Gallery::orderBy('id', 'desc')->get();
        return GalleryResource::collection($items);
    }

    public function getById($id)
    {
        return new GalleryResource(Gallery::findOrFail($id));
    }

    public function create(array $data, $imageFile = null, $videoFile = null)
{
    return DB::transaction(function () use ($data, $imageFile, $videoFile) {
        if ($videoFile) {
            $data['video'] = $videoFile->store('gallerys/videos', 'public');
            $data['type'] = 'video';
            // optionally store a poster image too
            if ($imageFile) {
                $data['image'] = $imageFile->store('gallerys', 'public');
            }
        } elseif ($imageFile) {
            $path = $imageFile->store('gallerys', 'public');
            $data['image'] = $path;
            $data['type'] = $imageFile->getMimeType() === 'image/gif' ? 'gif' : 'image';
            $data['is_gif'] = $data['type'] === 'gif';
        }
        return new GalleryResource(Gallery::create($data));
    });
}

    public function update($id, array $data, $imageFile = null, $videoFile = null)
    {
        return DB::transaction(function () use ($id, $data, $imageFile, $videoFile) {
            $item = Gallery::findOrFail($id);
            if ($videoFile) {
                if ($item->video) {
                    Storage::disk('public')->delete($item->video);
                }
                $data['video'] = $videoFile->store('gallerys/videos', 'public');
                $data['type'] = 'video';
                // optionally store a poster image too
                if ($imageFile) {
                    $data['image'] = $imageFile->store('gallerys', 'public');
                }
            } elseif ($imageFile) {
                if ($item->image) {
                    Storage::disk('public')->delete($item->image);
                }
                $path = $imageFile->store('gallerys', 'public');
                $data['image'] = $path;
            }
            $item->update($data);
            return new GalleryResource($item);
        });
    }

    public function delete($id)
    {
        return DB::transaction(function () use ($id) {
            $item = Gallery::findOrFail($id);
            if ($item->image) {
                Storage::disk('public')->delete($item->image);
            }
            if ($item->video) {
                Storage::disk('public')->delete($item->video);
            }
            $item->delete();
            return true;
        });
    }
}