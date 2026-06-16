<?php

namespace App\Notifications\Channels;

use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Notification as NotificationFacade;
use App\Notifications\AppNotification;

class DatabaseChannel
{
    /**
     * Deliver a notification to authenticated user(s) via the database.
     *
     * @param \Illuminate\Database\Eloquent\Model $notifiable
     * @param string $type      NotificationType constant
     * @param array  $data      Payload for the notification
     */
    public static function send($notifiable, string $type, array $data): void
    {
        $notifiable->notify(new AppNotification($type, $data));
    }
}
