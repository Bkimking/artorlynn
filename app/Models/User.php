<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Activitylog\Support\LogOptions;
use Spatie\Activitylog\Models\Concerns\LogsActivity;




#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, LogsActivity;


    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Configure the activity logging options.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty()
            ->useLogName('accounts')
            ->setDescriptionForEvent(fn(string $eventName) => match ($eventName) {
                'created' => "User '{$this->email}' created their account",
                'updated' => "User '{$this->email}' updated their account",
                'deleted' => "User '{$this->email}' deleted their account",
                default => "User '{$this->email}' {$eventName} their account",
            });
    }

    /**
     * Tap into the activity before it is saved.
     */
    public function tapActivity(\Spatie\Activitylog\Models\Activity $activity, string $eventName)
    {
        $activity->properties = $activity->properties
            ->put('ip', request()->ip())
            ->put('user_agent', request()->userAgent());
        
        // Ensure a causer is set for creation if not logged in (e.g. registration)
        if ($eventName === 'created' && !$activity->causer_id) {
            $activity->causer()->associate($this);
        }
    }
}

