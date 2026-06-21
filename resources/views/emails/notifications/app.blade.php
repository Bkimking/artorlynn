<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <style>
        body { font-family: Georgia, serif; background: #f7f7f7; margin: 0; padding: 0; }
        .wrap { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 8px; overflow: hidden; border: 1px solid #e0d6cc; }
        .header { background: #281b10; padding: 28px 32px; }
        .header h1 { color: #e8cbb5; margin: 0; font-size: 18px; font-weight: normal; letter-spacing: 0.1em; }
        .body { padding: 32px; color: #281b10; line-height: 1.7; }
        .body p { margin: 0 0 14px; font-size: 14px; }
        .meta { background: #f7f0e8; border-left: 3px solid #e8cbb5; padding: 14px 18px; border-radius: 4px; margin: 20px 0; }
        .meta p { margin: 4px 0; font-size: 13px; color: #5a3e2b; }
        .footer { padding: 20px 32px; border-top: 1px solid #e0d6cc; font-size: 11px; color: #999; }
    </style>
</head>
<body>
<div class="wrap">
    <div class="header">
        <h1>Art of Lynn</h1>
    </div>
    <div class="body">

        @switch($type)

            @case(\App\Notifications\NotificationType::CONTACT_MESSAGE)
                <p>You have received a new contact message.</p>
                <div class="meta">
                    <p><strong>From:</strong> {{ $data['name'] ?? '—' }}</p>
                    <p><strong>Email:</strong> {{ $data['email'] ?? '—' }}</p>
                    @isset($data['service'])<p><strong>Service:</strong> {{ $data['service'] }}</p>@endisset
                    <p><strong>Ref:</strong> {{ $data['msg_id'] ?? '—' }}</p>
                </div>
                <p>Log in to your admin panel to read and reply.</p>
            @break

            @case(\App\Notifications\NotificationType::CONTACT_AUTO_REPLY)
                <p>Hi {{ $data['name'] ?? 'there' }},</p>
                <p>Thank you for reaching out! We've received your message and will get back to you shortly.</p>
                <div class="meta">
                    <p><strong>Reference:</strong> {{ $data['msg_id'] ?? '—' }}</p>
                </div>
                <p>— Lynn</p>
            @break

            @case(\App\Notifications\NotificationType::NEWS_SUBSCRIBED)
                <p>A new newsletter subscription has been received.</p>
                <div class="meta">
                    <p><strong>Email:</strong> {{ $data['email'] ?? '—' }}</p>
                    @isset($data['name'])<p><strong>Name:</strong> {{ $data['name'] }}</p>@endisset
                    <p><strong>Action:</strong> {{ $data['action'] ?? 'new' }}</p>
                </div>
            @break

            @case(\App\Notifications\NotificationType::NEW_REVIEW)
                <p>A new public review has been submitted.</p>
                <div class="meta">
                    <p><strong>From:</strong> {{ $data['name'] ?? '—' }}</p>
                    <p><strong>Rating:</strong> {{ $data['rating'] ?? '—' }} / 5</p>
                    @isset($data['content'])<p><strong>Review:</strong> {{ strip_tags($data['content']) }}</p>@endisset
                </div>
                <p>Visit your admin panel to approve or feature this review.</p>
            @break

            @default
                <p>You have a new notification.</p>
        @endswitch

    </div>
    <div class="footer">
        © {{ date('Y') }} Art of Lynn · Color. Feel. Express.
    </div>
</div>
</body>
</html>
