<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Support\Str;

#[Fillable(['email', 'name', 'status', 'unsubscribe_token', 'subscribed_at', 'unsubscribed_at'])]
#[Hidden(['created_at', 'updated_at'])]
class NewsSubscription extends Model
{
     protected $casts = [
        'subscribed_at'   => 'datetime',
        'unsubscribed_at' => 'datetime',
    ];
 
    /** Auto-generate unsubscribe_token on creation */
    protected static function booted(): void
    {
        static::creating(function (self $model) {
            if (empty($model->unsubscribe_token)) {
                $model->unsubscribe_token = Str::random(32);
            }
        });
    }
 
    public function isActive(): bool
    {
        return $this->status === 'active';
    }
 
    public function unsubscribe(): void
    {
        $this->update([
            'status'           => 'unsubscribed',
            'unsubscribed_at'  => now(),
        ]);
    }
}
