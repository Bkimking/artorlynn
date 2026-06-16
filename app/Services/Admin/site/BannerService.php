<?php

namespace App\Services\Admin\Site;

use App\Models\Banner;
use App\Http\Resources\BannerResource;
use Illuminate\Support\Facades\DB;

class BannerService
{
    public function getAll()
    {
        $banners = Banner::orderBy('id')->get();
        return BannerResource::collection($banners);
    }

    public function getById($id)
    {
        return new BannerResource(Banner::findOrFail($id));
    }

    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            $banner = Banner::create($data);
            return new BannerResource($banner);
        });
    }

    public function update($id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $banner = Banner::findOrFail($id);
            $banner->update($data);
            return new BannerResource($banner);
        });
    }

    public function delete($id)
    {
        return DB::transaction(function () use ($id) {
            $banner = Banner::findOrFail($id);
            $banner->delete();
            return true;
        });
    }
}