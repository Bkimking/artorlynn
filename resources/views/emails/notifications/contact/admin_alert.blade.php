@extends('emails.layout')

@section('content')
    <h2>New Message Received</h2>
    <p>Flynn, you have a new inquiry from your website contact form.</p>
    
    <div class="meta">
        <span class="meta-item"><strong>From:</strong> {{ $data['name'] ?? '—' }}</span>
        <span class="meta-item"><strong>Email:</strong> {{ $data['email'] ?? '—' }}</span>
        @isset($data['service'])
            <span class="meta-item"><strong>Interest:</strong> {{ $data['service'] }}</span>
        @endisset
        <span class="meta-item"><strong>Reference:</strong> {{ $data['msg_id'] ?? '—' }}</span>
    </div>

    <p>Log in to your dashboard to view the full message and respond.</p>
    
    <div class="button-wrap">
        <a href="{{ url('/admin/contacts') }}" class="button">View Message</a>
    </div>
@endsection
