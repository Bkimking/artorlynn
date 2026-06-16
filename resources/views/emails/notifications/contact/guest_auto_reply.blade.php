@extends('emails.layout')

@section('content')
    <h2>Message Received</h2>
    <p>Hi {{ $data['name'] ?? 'there' }},</p>
    <p>Thank you for reaching out to Art of Lynn. We've received your inquiry and will review it as soon as possible.</p>
    
    <div class="meta">
        <p style="margin:0; font-size: 13px;"><strong>Reference ID:</strong> {{ $data['msg_id'] ?? '—' }}</p>
    </div>

    <p>In the meantime, feel free to explore my latest works on the gallery.</p>

    <p>Warmly,<br/>Lynn</p>
@endsection
