<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;

#[Fillable(['contact_submission_id', 'msg_id', 'direction', 'body', 'sender_email', 'replied_at',])]
#[Hidden(['msg_id', 'created_at', 'updated_at'])]
class ContactSubmissionReply extends Model
{
    protected $casts = [
        'replied_at' => 'datetime',
    ];

    public function submission(): BelongsTo
    {
        return $this->belongsTo(ContactSubmission::class, 'contact_submission_id');
    }
}
