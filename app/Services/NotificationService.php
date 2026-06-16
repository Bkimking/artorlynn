<?php

namespace App\Services;

use App\Notifications\NotificationType;
use App\Notifications\Channels\DatabaseChannel;
use App\Notifications\Channels\MailChannel;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Single entry point for all notifications.
     *
     * @param string       $type        NotificationType constant
     * @param mixed        $recipient   User model (admin/auth) OR ['email'=>'...','name'=>'...'] for guests
     * @param array        $data        Payload passed to the notification
     * @param array|null   $overrideChannels  Force specific channels (bypasses preferences)
     */
    public static function send(
        string $type,
        mixed  $recipient,
        array  $data = [],
        ?array $overrideChannels = null,
    ): void {
        try {
            $channels = $overrideChannels ?? self::resolveChannels($type, $recipient);

            foreach ($channels as $channel) {
                match ($channel) {
                    'database' => self::sendDatabase($type, $recipient, $data),
                    'mail'     => self::sendMail($type, $recipient, $data),
                    default    => null,
                };
            }
        } catch (\Throwable $e) {
            // Never let a notification failure break the main request
            Log::error('[NotificationService] Failed', [
                'type'  => $type,
                'error' => $e->getMessage(),
            ]);
        }
    }

    // ── Channel resolution ───────────────────────────────────────────────────

    private static function resolveChannels(string $type, mixed $recipient): array
    {
        // Guests → only mail (no DB, no preferences lookup)
        if (is_array($recipient)) {
            return array_intersect(NotificationType::channels($type), ['mail']);
        }

        // Authenticated user → check their preferences, fall back to defaults
        if ($recipient instanceof User) {
            return self::userChannels($type, $recipient);
        }

        return NotificationType::channels($type);
    }

    private static function userChannels(string $type, User $user): array
    {
        $pref = \App\Models\NotificationPreference::where('user_id', $user->id)
            ->where('notification_type', $type)
            ->first();

        return $pref ? $pref->channels : NotificationType::channels($type);
    }

    // ── Dispatch helpers ────────────────────────────────────────────────────

    private static function sendDatabase(string $type, mixed $recipient, array $data): void
    {
        // Database channel only works for authenticated users
        if ($recipient instanceof User) {
            DatabaseChannel::send($recipient, $type, $data);
        }
    }

    private static function sendMail(string $type, mixed $recipient, array $data): void
    {
        // Accepts User model or ['email'=>..., 'name'=>...]
        $email = $recipient instanceof User ? $recipient->email : ($recipient['email'] ?? null);
        if ($email) {
            MailChannel::send($email, $type, $data);
        }
    }
}
