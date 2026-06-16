<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['user_id', 'notification_type', 'channels'])]
class NotificationPreference extends Model
{
    protected $casts = [
        'channels' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
