<?php

namespace App\Services\Admin\Site;

use App\Models\Testimonials;
use App\Http\Resources\TestimonialResource;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class TestimonialService
{
    public function getAll()
    {
        $testimonials = Testimonials::orderBy('is_featured', 'desc')->orderBy('date', 'desc')->get();
        return TestimonialResource::collection($testimonials);
    }
    
    public function create(array $data, $avatarFile = null)
    {
        return DB::transaction(function () use ($data, $avatarFile) {
            if ($avatarFile) {
                $path = $avatarFile->store('testimonials', 'public');
                $data['avatar'] = $path;
            }
            $review = Testimonials::create($data);
            return new TestimonialResource($review);
        });
    }

    public function update($id, array $data, $avatarFile = null)
    {
        return DB::transaction(function () use ($id, $data, $avatarFile) {
            $review = Testimonials::findOrFail($id);
            if ($avatarFile) {
                if ($review->avatar) {
                    Storage::disk('public')->delete($review->avatar);
                }
                $path = $avatarFile->store('testimonials', 'public');
                $data['avatar'] = $path;
            }
            $review->update($data);
            return new TestimonialResource($review);
        });
    }

    public function delete($id)
    {
        return DB::transaction(function () use ($id) {
            $review = Testimonials::findOrFail($id);
            if ($review->avatar) {
                Storage::disk('public')->delete($review->avatar);
            }
            $review->delete();
            return true;
        });
    }
}