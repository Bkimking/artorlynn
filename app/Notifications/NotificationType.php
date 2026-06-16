<?php

namespace App\Notifications;

/**
 * Central registry of all notification types.
 * Each type defines:
 *  - channels: default delivery channels
 *  - label:    human-readable name for preferences UI
 */
class NotificationType
{
    // ── Guest-triggered, admin receives ─────────────────────────────────────
    const CONTACT_MESSAGE     = 'CONTACT_MESSAGE';
    const NEW_REVIEW          = 'NEW_REVIEW';
    const NEWS_SUBSCRIBED     = 'NEWS_SUBSCRIBED';

    // ── Guest receives (auto-reply/welcome) ──────────────────────────────────
    const CONTACT_AUTO_REPLY  = 'CONTACT_AUTO_REPLY';
    const REVIEW_CONFIRMATION = 'REVIEW_CONFIRMATION';
    const NEWS_WELCOME        = 'NEWS_WELCOME';

    // admin reply to guest
    const CONTACT_REPLY = 'CONTACT_REPLY';

    /**
     * Default channels per type.
     */
    const DEFAULTS = [
        self::CONTACT_MESSAGE     => ['database', 'mail'],
        self::NEW_REVIEW          => ['database', 'mail'],
        self::NEWS_SUBSCRIBED     => ['database', 'mail'],
        
        self::CONTACT_AUTO_REPLY  => ['mail'],
        self::REVIEW_CONFIRMATION => ['mail'],
        self::NEWS_WELCOME        => ['mail'],

        self::CONTACT_REPLY => ['mail'],
    ];

    /**
     * Human-readable labels for the preferences UI.
     */
    const LABELS = [
        self::CONTACT_MESSAGE     => 'New Contact Inquiries',
        self::NEW_REVIEW          => 'New Website Reviews',
        self::NEWS_SUBSCRIBED     => 'New Newsletter Signups',
        self::CONTACT_AUTO_REPLY  => 'Contact Auto-Reply (Guest)',
        self::REVIEW_CONFIRMATION => 'Review Confirmation (Guest)',
        self::NEWS_WELCOME        => 'Newsletter Welcome (Guest)',
        self::CONTACT_REPLY => 'emails.notifications.contact.contact_reply',
    ];

    public static function channels(string $type): array
    {
        return self::DEFAULTS[$type] ?? ['database'];
    }

    public static function label(string $type): string
    {
        return self::LABELS[$type] ?? $type;
    }

    public static function all(): array
    {
        return array_keys(self::DEFAULTS);
    }

    /**
     * Maps types to their specific modular blade views.
     */
    public static function view(string $type): string
    {
        return match ($type) {
            self::CONTACT_MESSAGE     => 'emails.notifications.contact.admin_alert',
            self::CONTACT_AUTO_REPLY  => 'emails.notifications.contact.guest_auto_reply',
            self::NEW_REVIEW          => 'emails.notifications.reviews.admin_alert',
            self::REVIEW_CONFIRMATION => 'emails.notifications.reviews.guest_confirmation',
            self::NEWS_WELCOME        => 'emails.notifications.newsletter.subscribed',
            self::CONTACT_REPLY       => 'emails.notifications.contact.contact_reply',
            default                   => 'emails.notifications.app',
        };
    }
}
