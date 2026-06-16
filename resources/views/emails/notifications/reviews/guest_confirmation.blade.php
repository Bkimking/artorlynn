@extends('emails.layout')

@section('content')
    <h2>Thank You for Your Review</h2>
    <p>Hi {{ $data['name'] ?? 'there' }},</p>
    <p>Thank you so much for sharing your experience with Art of Lynn. Your feedback is deeply appreciated and helps us grow.</p>
    
    <div class="meta">
        <span class="meta-item"><strong>Your Rating:</strong> {{ $data['rating'] ?? '—' }} / 5 Stars</span>
    </div>

    <p>Your review has been submitted for moderation and will be visible on the site once approved.</p>

    <p>With gratitude,<br/>Art of Lynn</p>
@endsection
