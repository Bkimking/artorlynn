<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([ 'msg_id', 'name', 'email', 'service', 'message', 'status', 'read_at', 'replied_at', 'reply_note' ])]
#[Hidden([ 'created_at', 'updated_at' ])]
class ContactSubmission extends Model
{
    protected $casts = [
        'read_at'      => 'datetime',
        'replied_at'   => 'datetime',
    ];
 
    /**
     * Auto-generate a unique msg_id before creation.
     * Format: msg_<8 random hex chars>  e.g. msg_3f9a1b2c
     * This will be used later for email piping (Reply-To / Message-ID header matching).
     */
    protected static function booted(): void
    {
        static::creating(function (self $model) {
            if (empty($model->msg_id)) {
                $model->msg_id = 'msg_' . strtolower(Str::random(12));
            }
        });
    }
 
    /** Mark as read */
    public function markRead(): void
    {
        $this->update(['status' => 'read', 'read_at' => now()]);
    }
 
    /** Mark as replied */
    public function markReplied(?string $note = null): void
    {
        $this->update([
            'status'      => 'replied',
            'replied_at'  => now(),
            'reply_note'  => $note,
        ]);
    }

    public function replies(): HasMany
    {
        return $this->hasMany(ContactSubmissionReply::class);
    }
}
