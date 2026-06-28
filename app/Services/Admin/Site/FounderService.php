<?php

namespace App\Services\Admin\Site;

use App\Models\Founder;
use App\Http\Resources\FounderResource;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class FounderService
{
    public function get()
    {
        $founder = Founder::first();
        if (!$founder) {
            $founder = Founder::create([
                'name' => '',
                'position' => '',
                'content' => '',
            ]);
        }
        return new FounderResource($founder);
    }

    public function update(array $data, $avatarFile = null)
    {
        return DB::transaction(function () use ($data, $avatarFile) {
            $founder = Founder::first();
            if (!$founder) {
                $founder = new Founder();
            }

            if ($avatarFile) {
                // Delete old avatar if exists
                if ($founder->avatar) {
                    Storage::disk('public')->delete($founder->avatar);
                }
                $path = $avatarFile->store('founders', 'public');
                $data['avatar'] = $path;
            }

            $founder->fill($data);
            $founder->save();

            return new FounderResource($founder);
        });
    }
}