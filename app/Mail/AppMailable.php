<?php

namespace App\Mail;

use App\Notifications\NotificationType;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppMailable extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly string $type,
        public readonly array $data = [],
    ) {}

    public function envelope(): Envelope
    {
        $subject = match ($this->type) {
            NotificationType::CONTACT_MESSAGE => 'New Contact Message — Art of Lynn',
            NotificationType::CONTACT_AUTO_REPLY => 'We received your message — Art of Lynn [MSG-'.($this->data['msg_id'] ?? '').']',
            NotificationType::NEWS_SUBSCRIBED => 'You\'re subscribed! — Art of Lynn',
            NotificationType::NEW_REVIEW => 'New Review Submitted — Art of Flynn',
            NotificationType::CONTACT_REPLY => 'Flynn replied to your message — Art of Lynn [MSG-' . ($this->data['msg_id'] ?? '') . ']',
            default => 'Notification — Art of Lynn',
        };

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(
            view: NotificationType::view($this->type),
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
