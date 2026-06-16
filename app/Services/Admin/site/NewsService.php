<?php

namespace App\Services\Admin\Site;

use App\Models\News;
use App\Http\Resources\NewsResource;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class NewsService
{
    public function getAll()
    {
        $news = News::orderBy('published_date', 'desc')->get();
        return NewsResource::collection($news);
    }

    public function create(array $data, $imageFile = null)
    {
        return DB::transaction(function () use ($data, $imageFile) {
            if ($imageFile) {
                $path = $imageFile->store('news', 'public');
                $data['image'] = $path;
            }
            $post = News::create($data);
            return new NewsResource($post);
        });
    }

    public function update($id, array $data, $imageFile = null)
    {
        return DB::transaction(function () use ($id, $data, $imageFile) {
            $post = News::findOrFail($id);
            if ($imageFile) {
                if ($post->image) {
                    Storage::disk('public')->delete($post->image);
                }
                $path = $imageFile->store('news', 'public');
                $data['image'] = $path;
            }
            $post->update($data);
            return new NewsResource($post);
        });
    }

    public function delete($id)
    {
        return DB::transaction(function () use ($id) {
            $post = News::findOrFail($id);
            if ($post->image) {
                Storage::disk('public')->delete($post->image);
            }
            $post->delete();
            return true;
        });
    }
}