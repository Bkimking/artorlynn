<?php

namespace App\Notifications\Channels;

use Illuminate\Support\Facades\Mail;
use App\Mail\AppMailable;

class MailChannel
{
    /**
     * Send a mail notification.
     *
     * @param string|object $recipient  Email string (guest) or User model
     * @param string  $type             NotificationType constant
     * @param array   $data             Payload
     */
    public static function send($recipient, string $type, array $data): void
    {
        $email = is_string($recipient) ? $recipient : $recipient->email;

        if (!$email) return;

        Mail::to($email)->queue(new AppMailable($type, $data));
    }
}
