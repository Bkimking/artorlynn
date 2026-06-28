<?php

namespace App\Services\Admin\Site;

use App\Http\Resources\ServiceResource;
use App\Models\Service;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ServicesService
{
    public function getAll()
    {
        $services = Service::orderBy('id')->get();

        return ServiceResource::collection($services);
    }

    public function create(array $data, $imageFile = null)
    {
        return DB::transaction(function () use ($data, $imageFile) {
            if ($imageFile) {
                $path = $imageFile->store('services', 'public');
                $data['image'] = $path;
            }
            $service = Service::create($data);

            return new ServiceResource($service);
        });
    }

    public function update($id, array $data, $imageFile = null)
    {
        return DB::transaction(function () use ($id, $data, $imageFile) {
            $service = Service::findOrFail($id);
            if ($imageFile) {
                if ($service->image) {
                    Storage::disk('public')->delete($service->image);
                }
                $data['image'] = $imageFile->store('services', 'public');
            } else {
                unset($data['image']);
            }
            $service->update($data);

            return new ServiceResource($service);
        });
    }

    public function delete($id)
    {
        return DB::transaction(function () use ($id) {
            $service = Service::findOrFail($id);
            if ($service->image) {
                Storage::disk('public')->delete($service->image);
            }
            $service->delete();

            return true;
        });
    }
}
