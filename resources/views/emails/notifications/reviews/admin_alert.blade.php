@extends('emails.layout')

@section('content')
    <h2>New Review Submitted</h2>
    <p>A new public testimonial has been submitted on your website and is awaiting your review.</p>
    
    <div class="meta">
        <span class="meta-item"><strong>Name:</strong> {{ $data['name'] ?? '—' }}</span>
        <span class="meta-item"><strong>Rating:</strong> {{ $data['rating'] ?? '—' }} / 5</span>
        @isset($data['content'])
            <p style="margin-top: 15px; font-style: italic; color: #555;">"{{ strip_tags($data['content']) }}"</p>
        @endisset
    </div>

    <div class="button-wrap">
        <a href="{{ url('/admin/site/reviews') }}" class="button">Manage Reviews</a>
    </div>
@endsection
