@extends('emails.layout')

@section('content')
    <h2>Flynn replied to your message</h2>
    <p>Hi {{ $data['name'] ?? 'there' }},</p>
    <p>You have a new reply regarding your inquiry:</p>

    <div class="meta">
        <span class="meta-item">{{ $data['reply_body'] ?? '' }}</span>
    </div>

    <p>You can reply directly to this email to continue the conversation.</p>

    <p>Warmly,<br/>Lynn</p>
@endsection