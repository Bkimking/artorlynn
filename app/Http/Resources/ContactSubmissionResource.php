<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactSubmissionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'msg_id'     => $this->msg_id,
            'name'       => $this->name,
            'email'      => $this->email,
            'service'    => $this->service,
            'message'    => $this->message,
            'status'     => $this->status,
            'read_at'    => $this->read_at?->toDateTimeString(),
            'replied_at' => $this->replied_at?->toDateTimeString(),
            'reply_note' => $this->reply_note,
            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}
