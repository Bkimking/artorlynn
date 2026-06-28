<?php

namespace App\Services\Admin\Site;

use App\Models\Partner;
use App\Http\Resources\PartnerResource;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PartnerService
{
    public function getAll()
    {
        $partners = Partner::orderBy('partnership_tier')->orderBy('name')->get();
        return PartnerResource::collection($partners);
    }

    public function create(array $data, $logoFile = null)
    {
        return DB::transaction(function () use ($data, $logoFile) {
            if ($logoFile) {
                $path = $logoFile->store('partners', 'public');
                $data['logo'] = $path;
            }
            $partner = Partner::create($data);
            return new PartnerResource($partner);
        });
    }

    public function update($id, array $data, $logoFile = null)
    {
        return DB::transaction(function () use ($id, $data, $logoFile) {
            $partner = Partner::findOrFail($id);
            if ($logoFile) {
                if ($partner->logo) {
                    Storage::disk('public')->delete($partner->logo);
                }
                $path = $logoFile->store('partners', 'public');
                $data['logo'] = $path;
            }
            $partner->update($data);
            return new PartnerResource($partner);
        });
    }

    public function delete($id)
    {
        return DB::transaction(function () use ($id) {
            $partner = Partner::findOrFail($id);
            if ($partner->logo) {
                Storage::disk('public')->delete($partner->logo);
            }
            $partner->delete();
            return true;
        });
    }
}