<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'log_name' => $this->log_name,
            'description' => $this->description,
            'subject_type' => $this->subject_type,
            'subject_id' => $this->subject_id,
            'subject' => $this->subject ? [
                'id' => $this->subject->getKey(),
                'name' => $this->subject->name ?? $this->subject->email ?? $this->subject->getKey(),
            ] : null,
            'causer_type' => $this->causer_type,
            'causer_id' => $this->causer_id,
            'causer' => $this->causer ? [
                'id' => $this->causer->getKey(),
                'name' => $this->causer->name ?? $this->causer->email ?? $this->causer->getKey(),
            ] : null,
            'properties' => $this->properties,
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}